/**
 * Production Runner - traffic_navershopping 기반 작업 실행
 *
 * 실행: npx tsx runner/production-runner.ts
 *
 * 워크플로우:
 * 1. traffic_navershopping에서 작업 가져오기 (slot_type='네이버쇼핑', customer_id!='master')
 * 2. slot_id로 slot_naver 매칭하여 mid, product_name 획득
 * 3. V7 엔진으로 트래픽 실행
 * 4. 완료된 작업 traffic_navershopping에서 삭제
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// .env 로드
const envPaths = [
  path.join(process.cwd(), '.env'),
  path.join(__dirname, '..', '.env'),
];
for (const envPath of envPaths) {
  const result = dotenv.config({ path: envPath });
  if (!result.error) {
    console.log(`[ENV] Loaded from: ${envPath}`);
    break;
  }
}

import { connect } from "puppeteer-real-browser";
import type { Page, Browser } from "puppeteer-core";
import { createClient } from "@supabase/supabase-js";
import { runV7Engine } from "../engines/v7_engine";
import type { Product, Profile, RunContext, TestResult } from "./types";

// ============ 설정 ============
const BATCH_SIZE = 10;          // 배치당 작업 수
const BATCH_REST = 60 * 1000;   // 배치 간 휴식 (60초)
const TASK_REST = 5 * 1000;     // 작업 간 휴식 (5초)
const EMPTY_WAIT = 30 * 1000;   // 작업 없을 때 대기 (30초)

const SUPABASE_URL = process.env.SUPABASE_PRODUCTION_URL!;
const SUPABASE_KEY = process.env.SUPABASE_PRODUCTION_KEY!;

// ============ Supabase 클라이언트 ============
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============ 타입 정의 ============
interface TrafficTask {
  id: number;
  slot_type: string;
  keyword: string;
  link_url: string;
  slot_count: number;
  slot_sequence: number;
  customer_id: string;
  slot_id: number;
}

interface WorkItem {
  taskId: number;           // traffic_navershopping.id (삭제용)
  slotId: number;           // slot_naver.id
  keyword: string;
  productName: string;
  mid: string;
  linkUrl: string;
}

// ============ 통계 ============
let totalRuns = 0;
let totalSuccess = 0;
let totalCaptcha = 0;
let totalFailed = 0;
let totalDeleted = 0;
let sessionStartTime = Date.now();

// ============ 로그 시스템 ============
function createLogger(): (event: string, data?: any) => void {
  return (event: string, data?: any) => {
    const time = new Date().toISOString().substring(11, 19);
    const dataStr = data ? ` ${JSON.stringify(data)}` : '';
    console.log(`  [${time}] ${event}${dataStr}`);
  };
}

// ============ 프로필 로드 ============
function loadProfile(profileName: string): Profile {
  const profilePath = path.join(__dirname, '..', 'profiles', `${profileName}.json`);
  const content = fs.readFileSync(profilePath, 'utf-8');
  return JSON.parse(content);
}

// ============ 작업 가져오기 (traffic_navershopping → slot_naver 매칭) ============
async function fetchWorkItems(count: number): Promise<WorkItem[]> {
  // 1. traffic_navershopping에서 작업 가져오기
  // - slot_type = '네이버쇼핑'
  // - customer_id != 'master' (일반 회원만)
  const { data: tasks, error: taskError } = await supabase
    .from("traffic_navershopping")
    .select("id, slot_type, keyword, link_url, slot_count, slot_sequence, customer_id, slot_id")
    .eq("slot_type", "네이버쇼핑")
    .neq("customer_id", "master")
    .limit(count);

  if (taskError) {
    console.error("[ERROR] Failed to fetch tasks:", taskError.message);
    return [];
  }

  if (!tasks || tasks.length === 0) {
    return [];
  }

  console.log(`[FETCH] ${tasks.length}개 작업 조회됨`);

  // 2. 각 작업에 대해 slot_naver에서 mid, product_name 매칭
  const workItems: WorkItem[] = [];

  for (const task of tasks as TrafficTask[]) {
    const { data: slot, error: slotError } = await supabase
      .from("slot_naver")
      .select("id, mid, product_name")
      .eq("id", task.slot_id)
      .single();

    if (slotError || !slot) {
      console.log(`[WARN] slot_id ${task.slot_id} 매칭 실패, 건너뜀`);
      continue;
    }

    if (!slot.mid || !slot.product_name) {
      console.log(`[WARN] slot_id ${task.slot_id} mid/product_name 없음, 건너뜀`);
      continue;
    }

    workItems.push({
      taskId: task.id,
      slotId: task.slot_id,
      keyword: task.keyword,
      productName: slot.product_name,
      mid: slot.mid,
      linkUrl: task.link_url
    });
  }

  return workItems;
}

// ============ 작업 삭제 (완료 후) ============
async function deleteTask(taskId: number): Promise<boolean> {
  const { error } = await supabase
    .from("traffic_navershopping")
    .delete()
    .eq("id", taskId);

  if (error) {
    console.error(`[ERROR] 작업 삭제 실패 (id=${taskId}):`, error.message);
    return false;
  }

  totalDeleted++;
  return true;
}

// ============ slot_naver 성공/실패 카운트 업데이트 ============
async function updateSlotStats(slotId: number, success: boolean): Promise<void> {
  const column = success ? "success_count" : "fail_count";

  // RPC 호출 대신 직접 업데이트 (increment)
  const { data: current } = await supabase
    .from("slot_naver")
    .select(column)
    .eq("id", slotId)
    .single();

  if (current) {
    const newValue = ((current as any)[column] || 0) + 1;
    await supabase
      .from("slot_naver")
      .update({ [column]: newValue })
      .eq("id", slotId);
  }
}

// ============ 단일 작업 실행 ============
async function runSingleTask(
  work: WorkItem,
  index: number,
  profile: Profile
): Promise<TestResult & { taskId: number }> {
  let browser: Browser | null = null;

  const result: TestResult & { taskId: number } = {
    taskId: work.taskId,
    index,
    product: work.productName.substring(0, 30),
    mid: work.mid,
    success: false,
    captchaDetected: false,
    midMatched: false,
    productPageEntered: false,
    duration: 0
  };

  try {
    // PRB 브라우저 시작
    const response = await connect({
      headless: profile.prb_options?.headless ?? false,
      turnstile: profile.prb_options?.turnstile ?? true,
    });

    browser = response.browser as Browser;
    const page = response.page as Page;

    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    // Context 생성
    const ctx: RunContext = {
      log: createLogger(),
      profile,
      login: false
    };

    // Product 객체 생성
    const product: Product = {
      id: work.slotId,
      keyword: work.keyword,
      product_name: work.productName,
      mid: work.mid
    };

    // V7 엔진 실행
    const engineResult = await runV7Engine(page, browser, product, ctx);

    // 결과 복사
    result.success = engineResult.success;
    result.captchaDetected = engineResult.captchaDetected;
    result.midMatched = engineResult.midMatched;
    result.productPageEntered = engineResult.productPageEntered;
    result.duration = engineResult.duration;
    result.error = engineResult.error;

  } catch (e: any) {
    result.error = e.message;
  } finally {
    if (browser) await browser.close().catch(() => {});
  }

  return result;
}

// ============ 배치 실행 ============
async function runBatch(batchNum: number, profile: Profile): Promise<void> {
  console.log(`\n${"=".repeat(50)}`);
  console.log(`  배치 #${batchNum} 시작`);
  console.log(`${"=".repeat(50)}`);

  const workItems = await fetchWorkItems(BATCH_SIZE);

  if (workItems.length === 0) {
    console.log(`[INFO] 대기 중인 작업 없음. ${EMPTY_WAIT / 1000}초 후 재시도...`);
    await new Promise(r => setTimeout(r, EMPTY_WAIT));
    return;
  }

  console.log(`[INFO] ${workItems.length}개 작업 로드됨\n`);

  let batchSuccess = 0;
  let batchCaptcha = 0;
  let batchDeleted = 0;

  for (let i = 0; i < workItems.length; i++) {
    const work = workItems[i];
    totalRuns++;

    console.log(`[${totalRuns}] ${work.productName.substring(0, 40)}... (task=${work.taskId})`);

    const result = await runSingleTask(work, i + 1, profile);

    // 결과 처리
    if (result.productPageEntered) {
      totalSuccess++;
      batchSuccess++;
      console.log(`  => SUCCESS | ${(result.duration / 1000).toFixed(1)}s`);
      await updateSlotStats(work.slotId, true);
    } else if (result.captchaDetected) {
      totalCaptcha++;
      batchCaptcha++;
      console.log(`  => CAPTCHA | ${(result.duration / 1000).toFixed(1)}s`);
      await updateSlotStats(work.slotId, false);
    } else {
      totalFailed++;
      console.log(`  => FAILED: ${result.error} | ${(result.duration / 1000).toFixed(1)}s`);
      await updateSlotStats(work.slotId, false);
    }

    // 작업 완료 후 무조건 삭제
    const deleted = await deleteTask(work.taskId);
    if (deleted) {
      batchDeleted++;
      console.log(`  => DELETED task ${work.taskId}`);
    }

    // 작업 간 휴식
    if (i < workItems.length - 1) {
      await new Promise(r => setTimeout(r, TASK_REST));
    }
  }

  // 배치 통계
  const successRate = (batchSuccess / workItems.length * 100).toFixed(0);
  const captchaRate = (batchCaptcha / workItems.length * 100).toFixed(0);

  console.log(`\n[배치 #${batchNum} 완료]`);
  console.log(`  성공: ${batchSuccess}/${workItems.length} (${successRate}%)`);
  console.log(`  CAPTCHA: ${batchCaptcha} (${captchaRate}%)`);
  console.log(`  삭제: ${batchDeleted}개`);
}

// ============ 전체 통계 출력 ============
function printStats(): void {
  const elapsed = (Date.now() - sessionStartTime) / 1000 / 60; // 분
  const successRate = totalRuns > 0 ? (totalSuccess / totalRuns * 100).toFixed(1) : '0';
  const captchaRate = totalRuns > 0 ? (totalCaptcha / totalRuns * 100).toFixed(1) : '0';

  console.log(`\n${"=".repeat(50)}`);
  console.log(`  전체 통계 (${elapsed.toFixed(1)}분 경과)`);
  console.log(`${"=".repeat(50)}`);
  console.log(`  총 실행: ${totalRuns}회`);
  console.log(`  성공: ${totalSuccess}회 (${successRate}%)`);
  console.log(`  CAPTCHA: ${totalCaptcha}회 (${captchaRate}%)`);
  console.log(`  실패: ${totalFailed}회`);
  console.log(`  삭제된 작업: ${totalDeleted}개`);
  console.log(`  처리 속도: ${(totalRuns / elapsed).toFixed(1)}회/분`);
  console.log(`${"=".repeat(50)}\n`);
}

// ============ 메인 루프 ============
async function main() {
  console.log(`${"=".repeat(50)}`);
  console.log(`  Production Runner (traffic_navershopping 기반)`);
  console.log(`${"=".repeat(50)}`);
  console.log(`  배치 크기: ${BATCH_SIZE}`);
  console.log(`  배치 휴식: ${BATCH_REST / 1000}초`);
  console.log(`  작업 휴식: ${TASK_REST / 1000}초`);
  console.log(`  필터: slot_type='네이버쇼핑', customer_id!='master'`);
  console.log(`${"=".repeat(50)}`);

  // 프로필 로드
  const profile = loadProfile("pc_v7");
  console.log(`\n[Profile] ${profile.name}`);

  let batchNum = 0;

  // 무한 루프
  while (true) {
    batchNum++;

    try {
      await runBatch(batchNum, profile);
    } catch (e: any) {
      console.error(`[ERROR] 배치 실행 오류: ${e.message}`);
    }

    // 10배치마다 전체 통계 출력
    if (batchNum % 10 === 0) {
      printStats();
    }

    // 배치 간 휴식
    console.log(`\n[REST] ${BATCH_REST / 1000}초 휴식...`);
    await new Promise(r => setTimeout(r, BATCH_REST));
  }
}

// 종료 시그널 처리
process.on('SIGINT', () => {
  console.log('\n\n[STOP] 종료 요청됨');
  printStats();
  process.exit(0);
});

main().catch(console.error);
