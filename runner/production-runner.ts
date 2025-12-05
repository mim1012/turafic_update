/**
 * Production Runner - V7 엔진 무한 반복 실행
 *
 * 실행: npx tsx runner/production-runner.ts
 *
 * 설정:
 * - BATCH_SIZE: 배치당 상품 수 (기본 10)
 * - BATCH_REST: 배치 간 휴식 (기본 60초)
 * - TASK_REST: 작업 간 휴식 (기본 5초)
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
const BATCH_SIZE = 10;          // 배치당 상품 수
const BATCH_REST = 60 * 1000;   // 배치 간 휴식 (60초)
const TASK_REST = 5 * 1000;     // 작업 간 휴식 (5초)
const BROWSER_RESTART_EVERY = 10; // N회마다 브라우저 재시작

const SUPABASE_URL = process.env.SUPABASE_PRODUCTION_URL!;
const SUPABASE_KEY = process.env.SUPABASE_PRODUCTION_KEY!;

// ============ 통계 ============
let totalRuns = 0;
let totalSuccess = 0;
let totalCaptcha = 0;
let totalFailed = 0;
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

// ============ 상품 가져오기 (랜덤) ============
async function fetchRandomProducts(count: number): Promise<Product[]> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 전체 상품 중 랜덤으로 선택
  const { data, error } = await supabase
    .from("slot_naver")
    .select("id, keyword, product_name, mid")
    .not("mid", "is", null)
    .not("product_name", "is", null)
    .limit(500);  // 충분히 많이 가져와서

  if (error) {
    console.error("[ERROR] Failed to fetch products:", error.message);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  // 랜덤 셔플 후 필요한 수만큼 반환
  const shuffled = data.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ============ 단일 작업 실행 ============
async function runSingleTask(
  product: Product,
  index: number,
  profile: Profile
): Promise<TestResult> {
  let browser: Browser | null = null;

  const result: TestResult = {
    index,
    product: product.product_name.substring(0, 30),
    mid: product.mid,
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

  const products = await fetchRandomProducts(BATCH_SIZE);

  if (products.length === 0) {
    console.log("[WARN] 상품이 없습니다. 60초 후 재시도...");
    await new Promise(r => setTimeout(r, 60000));
    return;
  }

  console.log(`[INFO] ${products.length}개 상품 로드됨\n`);

  let batchSuccess = 0;
  let batchCaptcha = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    totalRuns++;

    console.log(`[${totalRuns}] ${product.product_name.substring(0, 40)}...`);

    const result = await runSingleTask(product, i + 1, profile);

    // 결과 처리
    if (result.productPageEntered) {
      totalSuccess++;
      batchSuccess++;
      console.log(`  => SUCCESS | ${(result.duration / 1000).toFixed(1)}s`);
    } else if (result.captchaDetected) {
      totalCaptcha++;
      batchCaptcha++;
      console.log(`  => CAPTCHA | ${(result.duration / 1000).toFixed(1)}s`);
    } else {
      totalFailed++;
      console.log(`  => FAILED: ${result.error} | ${(result.duration / 1000).toFixed(1)}s`);
    }

    // 작업 간 휴식
    if (i < products.length - 1) {
      await new Promise(r => setTimeout(r, TASK_REST));
    }
  }

  // 배치 통계
  const successRate = (batchSuccess / products.length * 100).toFixed(0);
  const captchaRate = (batchCaptcha / products.length * 100).toFixed(0);

  console.log(`\n[배치 #${batchNum} 완료] 성공: ${batchSuccess}/${products.length} (${successRate}%) | CAPTCHA: ${batchCaptcha} (${captchaRate}%)`);
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
  console.log(`  처리 속도: ${(totalRuns / elapsed).toFixed(1)}회/분`);
  console.log(`${"=".repeat(50)}\n`);
}

// ============ 메인 루프 ============
async function main() {
  console.log(`${"=".repeat(50)}`);
  console.log(`  V7 Engine Production Runner`);
  console.log(`${"=".repeat(50)}`);
  console.log(`  배치 크기: ${BATCH_SIZE}`);
  console.log(`  배치 휴식: ${BATCH_REST / 1000}초`);
  console.log(`  작업 휴식: ${TASK_REST / 1000}초`);
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
