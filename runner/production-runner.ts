/**
 * Production Runner - 병렬 브라우저 풀 기반 작업 실행
 *
 * 실행: npx tsx runner/production-runner.ts
 *
 * 워크플로우:
 * 1. N개 브라우저를 병렬로 실행
 * 2. 각 브라우저가 traffic_navershopping에서 작업 1개씩 가져가서 실행
 * 3. 완료 후 삭제하고 다음 작업 가져감
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
import type { Product, Profile, RunContext } from "./types";

// ============ 설정 ============
const PARALLEL_BROWSERS = 5;    // 동시 실행 브라우저 수
const BATCH_REST = 60 * 1000;   // 배치 간 휴식 (60초)
const EMPTY_WAIT = 10 * 1000;   // 작업 없을 때 대기 (10초)
const BROWSER_RESTART_EVERY = 10; // N회마다 브라우저 재시작

const SUPABASE_URL = process.env.SUPABASE_PRODUCTION_URL!;
const SUPABASE_KEY = process.env.SUPABASE_PRODUCTION_KEY!;

console.log(`[DEBUG] SUPABASE_URL: ${SUPABASE_URL}`);
console.log(`[DEBUG] SUPABASE_KEY: ${SUPABASE_KEY?.substring(0, 50)}...`);

// ============ Supabase 클라이언트 ============
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ============ 타입 정의 ============
interface WorkItem {
  taskId: number;
  slotId: number;
  keyword: string;
  productName: string;
  mid: string;
  linkUrl: string;
}

// ============ 전역 통계 ============
let totalRuns = 0;
let totalSuccess = 0;
let totalCaptcha = 0;
let totalFailed = 0;
let sessionStartTime = Date.now();

// ============ 작업 큐 락 (동시 접근 방지) ============
let isClaimingTask = false;

// ============ 프로필 로드 ============
function loadProfile(profileName: string): Profile {
  const profilePath = path.join(__dirname, '..', 'profiles', `${profileName}.json`);
  const content = fs.readFileSync(profilePath, 'utf-8');
  return JSON.parse(content);
}

// ============ 작업 1개 가져오기 (직접 쿼리 + 즉시 삭제) ============
async function claimWorkItem(): Promise<WorkItem | null> {
  // 동시 접근 방지 (한 번에 하나씩만)
  while (isClaimingTask) {
    await new Promise(r => setTimeout(r, 100));
  }
  isClaimingTask = true;

  try {
    // 1. 작업 여러개 가져오기
    const { data: tasks, error: taskError } = await supabase
      .from("traffic_navershopping")
      .select("id, slot_id, keyword, link_url")
      .eq("slot_type", "네이버쇼핑")
      .order("id", { ascending: true })
      .limit(10);

    if (taskError) {
      console.error('[FETCH ERROR]', taskError.message);
      return null;
    }

    if (!tasks || tasks.length === 0) {
      return null;
    }

    // 2. mid, product_name 있는 작업 찾기
    for (const task of tasks) {
      const { data: slot } = await supabase
        .from("slot_naver")
        .select("mid, product_name")
        .eq("id", task.slot_id)
        .single();

      if (!slot || !slot.mid || !slot.product_name) {
        // mid/product_name 없으면 삭제하고 다음으로
        await supabase.from("traffic_navershopping").delete().eq("id", task.id);
        continue;
      }

      // 3. 유효한 작업 찾음 - 즉시 삭제
      const { error: deleteError } = await supabase
        .from("traffic_navershopping")
        .delete()
        .eq("id", task.id);

      if (deleteError) {
        console.error('[DELETE ERROR]', deleteError.message);
        return null;
      }

      return {
        taskId: task.id,
        slotId: task.slot_id,
        keyword: task.keyword,
        productName: slot.product_name,
        mid: slot.mid,
        linkUrl: task.link_url
      };
    }

    return null;
  } catch (e: any) {
    console.error('[CLAIM ERROR]', e.message);
    return null;
  } finally {
    isClaimingTask = false;
  }
}

// ============ slot_naver 통계 업데이트 ============
async function updateSlotStats(slotId: number, success: boolean): Promise<void> {
  const column = success ? "success_count" : "fail_count";
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

// ============ 브라우저 워커 ============
async function browserWorker(workerId: number, profile: Profile): Promise<void> {
  let taskCount = 0;
  let browser: Browser | null = null;
  let page: Page | null = null;

  const log = (msg: string) => {
    const time = new Date().toISOString().substring(11, 19);
    console.log(`[${time}] [Worker ${workerId}] ${msg}`);
  };

  while (true) {
    try {
      // 브라우저 시작/재시작
      if (!browser || taskCount >= BROWSER_RESTART_EVERY) {
        if (browser) {
          await browser.close().catch(() => {});
          log(`브라우저 재시작 (${taskCount}회 완료)`);
        }

        const response = await connect({
          headless: profile.prb_options?.headless ?? false,
          turnstile: profile.prb_options?.turnstile ?? true,
        });

        browser = response.browser as Browser;
        page = response.page as Page;
        page.setDefaultTimeout(30000);
        page.setDefaultNavigationTimeout(30000);
        taskCount = 0;

        log("브라우저 시작됨");
      }

      // 작업 가져오기 (원자적 - 가져오면서 삭제됨)
      const work = await claimWorkItem();

      if (!work) {
        log("대기 중인 작업 없음...");
        await new Promise(r => setTimeout(r, EMPTY_WAIT));
        continue;
      }

      totalRuns++;
      taskCount++;
      const startTime = Date.now();

      log(`작업 시작: ${work.productName.substring(0, 30)}... (mid=${work.mid})`);

      // Context 생성
      const ctx: RunContext = {
        log: (event: string) => log(`  ${event}`),
        profile,
        login: false
      };

      // Product 객체
      const product: Product = {
        id: work.slotId,
        keyword: work.keyword,
        product_name: work.productName,
        mid: work.mid
      };

      // V7 엔진 실행
      const result = await runV7Engine(page!, browser!, product, ctx);
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      // 결과 처리 (작업은 이미 RPC에서 삭제됨)
      if (result.productPageEntered) {
        totalSuccess++;
        log(`SUCCESS | ${duration}s`);
        await updateSlotStats(work.slotId, true);
      } else if (result.captchaDetected) {
        totalCaptcha++;
        log(`CAPTCHA | ${duration}s`);
        await updateSlotStats(work.slotId, false);
      } else {
        totalFailed++;
        log(`FAILED: ${result.error} | ${duration}s`);
        await updateSlotStats(work.slotId, false);
      }

    } catch (e: any) {
      log(`ERROR: ${e.message}`);
      // 브라우저 에러 시 재시작
      if (browser) {
        await browser.close().catch(() => {});
        browser = null;
        page = null;
      }
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

// ============ 통계 출력 ============
function printStats(): void {
  const elapsed = (Date.now() - sessionStartTime) / 1000 / 60;
  const successRate = totalRuns > 0 ? (totalSuccess / totalRuns * 100).toFixed(1) : '0';
  const captchaRate = totalRuns > 0 ? (totalCaptcha / totalRuns * 100).toFixed(1) : '0';

  console.log(`\n${"=".repeat(60)}`);
  console.log(`  통계 (${elapsed.toFixed(1)}분 경과)`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  총 실행: ${totalRuns}회 | 성공: ${totalSuccess} (${successRate}%)`);
  console.log(`  CAPTCHA: ${totalCaptcha} (${captchaRate}%) | 실패: ${totalFailed}`);
  console.log(`  속도: ${elapsed > 0 ? (totalRuns / elapsed).toFixed(1) : '0'}회/분`);
  console.log(`${"=".repeat(60)}\n`);
}

// ============ 메인 ============
async function main() {
  console.log(`${"=".repeat(60)}`);
  console.log(`  Production Runner (병렬 브라우저 풀)`);
  console.log(`${"=".repeat(60)}`);
  console.log(`  동시 브라우저: ${PARALLEL_BROWSERS}개`);
  console.log(`  브라우저 재시작: ${BROWSER_RESTART_EVERY}회마다`);
  console.log(`  필터: slot_type='네이버쇼핑'`);
  console.log(`${"=".repeat(60)}`);

  const profile = loadProfile("pc_v7");
  console.log(`\n[Profile] ${profile.name}\n`);

  // 통계 출력 인터벌
  setInterval(printStats, 60000);

  // 병렬 워커 시작
  const workers = [];
  for (let i = 1; i <= PARALLEL_BROWSERS; i++) {
    workers.push(browserWorker(i, profile));
  }

  // 모든 워커 실행 (무한 루프)
  await Promise.all(workers);
}

// 종료 시그널
process.on('SIGINT', () => {
  console.log('\n\n[STOP] 종료 요청됨');
  printStats();
  process.exit(0);
});

main().catch(console.error);
