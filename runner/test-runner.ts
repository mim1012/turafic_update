/**
 * Test Runner - 구조화된 V7 엔진 테스트
 *
 * 실행: npx tsx runner/test-runner.ts
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
const TEST_COUNT = 5;
const SUPABASE_URL = process.env.SUPABASE_PRODUCTION_URL!;
const SUPABASE_KEY = process.env.SUPABASE_PRODUCTION_KEY!;

// ============ 로그 시스템 ============
const logs: { time: string; event: string; data?: any }[] = [];

function createLogger(): (event: string, data?: any) => void {
  return (event: string, data?: any) => {
    const time = new Date().toISOString().substring(11, 19);
    logs.push({ time, event, data });

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

// ============ 상품 가져오기 ============
async function fetchProducts(): Promise<Product[]> {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase
    .from("slot_naver")
    .select("id, keyword, product_name, mid")
    .not("mid", "is", null)
    .not("product_name", "is", null)
    .limit(TEST_COUNT);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    return [];
  }
  return data || [];
}

// ============ 단일 테스트 실행 ============
async function runSingleTest(product: Product, index: number, profile: Profile): Promise<TestResult> {
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
      // fingerprint: profile.fingerprint  // V7 핵심: false
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

    ctx.log("profile:applied", {
      name: profile.name,
      fingerprint: profile.fingerprint
    });

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

// ============ 메인 ============
async function main() {
  console.log("=".repeat(50));
  console.log("  V7 Engine Test Runner (Structured)");
  console.log("=".repeat(50));

  // 프로필 로드
  const profile = loadProfile("pc_v7");
  console.log(`\n[Profile] ${profile.name}: ${profile.description}`);
  console.log(`  - fingerprint: ${profile.fingerprint}`);
  console.log(`  - browser: ${profile.browser}`);

  // 상품 로드
  const products = await fetchProducts();
  if (products.length < TEST_COUNT) {
    console.error(`상품 부족: ${products.length}개`);
    return;
  }

  console.log(`\n[Products] ${products.length}개 로드됨`);
  console.log("\n[Test] V7 Engine 테스트 시작...\n");

  const results: TestResult[] = [];

  for (let i = 0; i < TEST_COUNT; i++) {
    console.log(`테스트 ${i + 1}/${TEST_COUNT}: ${products[i].product_name.substring(0, 35)}...`);

    // 로그 초기화
    logs.length = 0;

    const result = await runSingleTest(products[i], i + 1, profile);
    results.push(result);

    const status = result.productPageEntered ? "Success" :
                   result.captchaDetected ? "CAPTCHA" :
                   `Failed: ${result.error}`;
    console.log(`  => ${status} | ${(result.duration / 1000).toFixed(1)}s\n`);

    // 테스트 간 휴식
    await new Promise(r => setTimeout(r, 2000));
  }

  // 결과 요약
  console.log("\n" + "=".repeat(50));
  console.log("  V7 Engine Test Results");
  console.log("=".repeat(50));

  let captchaCount = 0;
  let successCount = 0;

  for (const r of results) {
    if (r.captchaDetected) captchaCount++;
    if (r.productPageEntered) successCount++;
  }

  console.log(`\n총 테스트: ${TEST_COUNT}회`);
  console.log(`CAPTCHA 발생: ${captchaCount}회 (${(captchaCount / TEST_COUNT * 100).toFixed(0)}%)`);
  console.log(`상품페이지 성공: ${successCount}회 (${(successCount / TEST_COUNT * 100).toFixed(0)}%)`);
  console.log(`평균 시간: ${(results.reduce((a, r) => a + r.duration, 0) / TEST_COUNT / 1000).toFixed(1)}초`);

  if (captchaCount === 0) {
    console.log("\n[Result] V7 Engine 성공! CAPTCHA 0%");
  } else if (captchaCount <= 2) {
    console.log("\n[Result] V7 Engine 효과적! CAPTCHA 최소화");
  } else {
    console.log("\n[Result] 추가 최적화 필요");
  }
}

main().catch(console.error);
