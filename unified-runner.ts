/**
 * Unified Traffic Runner
 *
 * 주의: pkg 빌드 호환성을 위해 shebang(#!/usr/bin/env npx tsx) 제거됨
 * 로컬 실행: npx tsx unified-runner.ts
 *
 * 4개 모드 지원:
 * - 통검 로그인 (tonggum_login)
 * - 통검 비로그인 (tonggum_nologin)
 * - 쇼검 로그인 (shogum_login)
 * - 쇼검 비로그인 (shogum_nologin)
 *
 * 데이터 소스:
 * - navertrafictest: traffic_mode_settings, workerNodes
 * - adpang_production: traffic_navershopping, slot_type_settings
 *
 * 환경변수:
 *   - NODE_ID: 워커 식별자 (필수)
 *   - SUPABASE_CONTROL_URL: navertrafictest URL
 *   - SUPABASE_CONTROL_KEY: navertrafictest KEY
 *   - SUPABASE_PRODUCTION_URL: adpang_production URL
 *   - SUPABASE_PRODUCTION_KEY: adpang_production KEY
 *   - ANTHROPIC_API_KEY: CAPTCHA 해결용
 */

import * as dotenv from "dotenv";
dotenv.config();

import os from "os";
import * as fs from "fs";
import * as path from "path";
import { chromium, Page, BrowserContext, Browser } from "playwright";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import { getConfigWithEnvOverride, printSystemInfo, printOptimalConfig } from "./auto-optimizer";
import { ReceiptCaptchaSolver } from "./ReceiptCaptchaSolver";

// ============ 자동 최적화 설정 ============
const autoConfig = getConfigWithEnvOverride();

const NODE_ID = process.env.NODE_ID || `worker-${os.hostname()}`;
const HEARTBEAT_INTERVAL = 30 * 1000;  // 30초
const BATCH_SIZE = autoConfig.batchSize;
const BATCH_REST = autoConfig.batchRestSec * 1000;  // 배치 간 휴식 (자동 계산)
const TASK_REST = autoConfig.taskRestSec * 1000;    // 작업 간 휴식 (자동 계산)
const PARALLEL_COUNT = autoConfig.parallelCount;    // 병렬 브라우저 수 (자동 계산)
const ACCOUNTS_DIR = path.join(process.cwd(), "accounts");
const VERSION = "1.1.0";  // 자동 최적화 버전

// ============ Supabase 클라이언트 (2개) ============
let supabaseControl: SupabaseClient;  // navertrafictest (모드 설정, 워커 등록)
let supabaseProduction: SupabaseClient;  // adpang_production (상품 목록)

function initSupabase(): void {
  // Control DB (navertrafictest)
  const controlUrl = process.env.SUPABASE_CONTROL_URL;
  const controlKey = process.env.SUPABASE_CONTROL_KEY;

  if (!controlUrl || !controlKey) {
    console.error("[ERROR] SUPABASE_CONTROL_URL and SUPABASE_CONTROL_KEY required");
    process.exit(1);
  }
  supabaseControl = createClient(controlUrl, controlKey);

  // Production DB (adpang_production)
  const prodUrl = process.env.SUPABASE_PRODUCTION_URL;
  const prodKey = process.env.SUPABASE_PRODUCTION_KEY;

  if (!prodUrl || !prodKey) {
    console.error("[ERROR] SUPABASE_PRODUCTION_URL and SUPABASE_PRODUCTION_KEY required");
    process.exit(1);
  }
  supabaseProduction = createClient(prodUrl, prodKey);

  console.log("[Supabase] Control DB (navertrafictest) 연결됨");
  console.log("[Supabase] Production DB (adpang_production) 연결됨");
}

// ============ 타입 ============
interface TrafficMode {
  mode_type: string;  // 'tonggum_login', 'tonggum_nologin', 'shogum_login', 'shogum_nologin'
  enabled: boolean;
  updated_at: string;
}

interface Product {
  id: number;
  keyword: string;
  link_url: string;
  mid: string;
  product_name: string;
}

interface Account {
  name: string;
  path: string;
}

// ============ 통계 ============
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  captcha: 0,
  startTime: new Date(),
};

let isRunning = true;
let heartbeatTimer: NodeJS.Timeout | null = null;

// ============ 유틸 ============
function log(msg: string, level: "info" | "warn" | "error" = "info") {
  const time = new Date().toISOString();
  const prefix = { info: "[INFO]", warn: "[WARN]", error: "[ERROR]" }[level];
  console.log(`[${time}] ${prefix} ${msg}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

// ============ 워커 등록/하트비트 ============
async function registerWorker(): Promise<void> {
  const { error } = await supabaseControl
    .from("workerNodes")
    .upsert({
      node_id: NODE_ID,
      name: NODE_ID,
      status: "online",
      last_heartbeat: new Date().toISOString(),
      current_version: VERSION,
      registered_at: new Date().toISOString(),
    }, { onConflict: "node_id" });

  if (error) {
    log(`Worker registration failed: ${error.message}`, "error");
  } else {
    log(`Worker registered: ${NODE_ID}`);
  }
}

async function updateHeartbeat(): Promise<void> {
  const { error } = await supabaseControl
    .from("workerNodes")
    .update({
      status: "online",
      last_heartbeat: new Date().toISOString(),
    })
    .eq("node_id", NODE_ID);

  if (error) {
    log(`Heartbeat failed: ${error.message}`, "warn");
  }
}

function startHeartbeat(): void {
  heartbeatTimer = setInterval(async () => {
    await updateHeartbeat();
  }, HEARTBEAT_INTERVAL);
  log("Heartbeat started (30s interval)");
}

function stopHeartbeat(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

async function setWorkerOffline(): Promise<void> {
  await supabaseControl
    .from("workerNodes")
    .update({ status: "offline" })
    .eq("node_id", NODE_ID);
  log("Worker set to offline");
}

// ============ 모드 설정 가져오기 ============
async function fetchEnabledModes(): Promise<TrafficMode[]> {
  const { data, error } = await supabaseControl
    .from("traffic_mode_settings")
    .select("*")
    .eq("enabled", true);

  if (error) {
    log(`Failed to fetch modes: ${error.message}`, "error");
    return [];
  }

  return data || [];
}

// ============ 상품 목록 가져오기 ============
async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabaseProduction
    .from("traffic_navershopping")
    .select("id, keyword, link_url, mid, product_name")
    .not("mid", "is", null)
    .limit(100);

  if (error) {
    log(`Failed to fetch products: ${error.message}`, "error");
    return [];
  }

  return data || [];
}

// ============ 로컬 계정 관리 ============
function loadLocalAccounts(): Account[] {
  if (!fs.existsSync(ACCOUNTS_DIR)) {
    fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });
    log(`Created accounts directory: ${ACCOUNTS_DIR}`);
    return [];
  }

  const files = fs.readdirSync(ACCOUNTS_DIR).filter(f => f.endsWith(".json"));
  return files.map(f => ({
    name: f.replace(".json", ""),
    path: path.join(ACCOUNTS_DIR, f),
  }));
}

// ============ 트래픽 실행 ============
async function executeTraffic(
  product: Product,
  searchMode: "통검" | "쇼검",
  account?: Account
): Promise<boolean> {
  let browser: Browser | null = null;
  let context: BrowserContext | null = null;

  try {
    // 브라우저 설정
    const launchOptions = {
      headless: false,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
      ],
    };

    browser = await chromium.launch(launchOptions);

    // 로그인 모드면 계정의 storageState 사용
    if (account && fs.existsSync(account.path)) {
      context = await browser.newContext({
        storageState: account.path,
        viewport: { width: 1280, height: 720 },
      });
      log(`Using account: ${account.name}`);
    } else {
      context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
      });
    }

    const page = await context.newPage();

    // 1. 네이버 메인 → 검색
    await page.goto("https://www.naver.com/", { waitUntil: "domcontentloaded" });
    await sleep(1500 + Math.random() * 1000);

    // 검색어: 쇼검은 keyword, 통검은 productName
    const searchQuery = searchMode === "쇼검"
      ? product.keyword
      : product.product_name.substring(0, 50);

    await page.fill('input[name="query"]', searchQuery);
    await page.press('input[name="query"]', "Enter");
    await page.waitForLoadState("domcontentloaded");
    await sleep(2000 + Math.random() * 1000);

    // 2. 쇼검이면 쇼핑 탭 클릭
    if (searchMode === "쇼검") {
      log(`[${searchMode}] Looking for shopping tab...`);

      // 쇼핑 탭 찾기
      const shoppingTab = await page.$('a:has-text("쇼핑")') ||
                         await page.$('a[href*="shopping.naver.com"]');

      if (shoppingTab) {
        await shoppingTab.click();
        await sleep(2500 + Math.random() * 1000);
        log(`[${searchMode}] Shopping tab clicked`);
      } else {
        // Fallback: 직접 쇼핑 검색
        await page.goto(`https://search.shopping.naver.com/search/all?query=${encodeURIComponent(searchQuery)}`);
        await sleep(2000);
      }
    }

    // 3. 스크롤
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 400));
      await sleep(500);
    }

    // 4. MID 찾아서 클릭
    const mid = product.mid;
    log(`[${searchMode}] Searching for MID: ${mid}`);

    // 직접 smartstore 링크 클릭 시도 (통검)
    if (searchMode === "통검") {
      const clicked = await page.evaluate((targetMid: string) => {
        const links = Array.from(document.querySelectorAll("a"));
        for (const link of links) {
          const href = link.href || "";
          if (href.includes("smartstore.naver.com") && href.includes("/products/") && href.includes(targetMid)) {
            (link as HTMLElement).click();
            return true;
          }
          if (href.includes("brand.naver.com") && href.includes("/products/") && href.includes(targetMid)) {
            (link as HTMLElement).click();
            return true;
          }
        }
        return false;
      }, mid);

      if (clicked) {
        log(`[${searchMode}] Direct click success for MID: ${mid}`);
        await sleep(3000);
        stats.success++;
        return true;
      }
    }

    // Fallback: catalog URL로 이동
    const catalogUrl = `https://search.shopping.naver.com/catalog/${mid}`;
    await page.evaluate((url: string) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_self";
      document.body.appendChild(link);
      link.click();
    }, catalogUrl);

    await sleep(4000);

    // ========== 캡챠 감지 및 해결 ==========
    const hasCaptcha = await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      return bodyText.includes("보안 확인") ||
             bodyText.includes("영수증") ||
             bodyText.includes("무엇입니까") ||
             bodyText.includes("일시적으로 제한") ||
             bodyText.includes("[?]");
    });

    if (hasCaptcha) {
      log(`[${searchMode}] 🔐 CAPTCHA 감지! 자동 해결 시도...`);
      stats.captcha++;

      try {
        const solver = new ReceiptCaptchaSolver();
        const solved = await solver.solve(page);

        if (solved) {
          log(`[${searchMode}] ✅ CAPTCHA 해결 성공!`);
          await sleep(2000);
        } else {
          log(`[${searchMode}] ❌ CAPTCHA 해결 실패`, "warn");
          stats.failed++;
          return false;
        }
      } catch (captchaError: any) {
        log(`[${searchMode}] ❌ CAPTCHA 해결 에러: ${captchaError.message}`, "error");
        stats.failed++;
        return false;
      }
    }

    const finalUrl = page.url();
    const isProduct = finalUrl.includes("/catalog/") ||
                     finalUrl.includes("/products/") ||
                     finalUrl.includes("smartstore.naver.com");

    if (!isProduct) {
      log(`[${searchMode}] ❌ Not a product page: ${finalUrl.substring(0, 60)}`, "warn");
      stats.failed++;
      return false;
    }

    // MID 검증 (정확한 MID만 성공)
    const midMatched = finalUrl.includes(mid) || await page.evaluate((targetMid: string) => {
      const elements = document.querySelectorAll('[data-nv-mid], [data-nvmid], [data-product-id]');
      for (const el of Array.from(elements)) {
        const dataMid = el.getAttribute('data-nv-mid') ||
                       el.getAttribute('data-nvmid') ||
                       el.getAttribute('data-product-id');
        if (dataMid === targetMid) return true;
      }
      return false;
    }, mid);

    if (!midMatched) {
      log(`[${searchMode}] ❌ MID mismatch: expected ${mid}, got ${finalUrl.substring(0, 60)}`, "warn");
      stats.failed++;
      return false;
    }

    log(`[${searchMode}] ✅ Success (MID verified): ${finalUrl.substring(0, 60)}`);
    stats.success++;
    return true;

  } catch (error: any) {
    log(`[${searchMode}] Error: ${error.message}`, "error");
    stats.failed++;
    return false;
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

// ============ 메인 루프 ============
async function main() {
  // 시스템 정보 및 자동 최적화 설정 출력
  console.log("");
  printSystemInfo(autoConfig.systemInfo);
  console.log("");
  printOptimalConfig(autoConfig);

  log("=".repeat(50));
  log("  TURAFIC Unified Runner (Auto-Optimized)");
  log(`  Node ID: ${NODE_ID}`);
  log(`  Version: ${VERSION}`);
  log(`  Parallel: ${PARALLEL_COUNT} browsers`);
  log(`  Batch: ${BATCH_SIZE} tasks, ${BATCH_REST / 1000}s rest`);
  log("=".repeat(50));

  // Supabase 초기화
  initSupabase();

  // 워커 등록
  await registerWorker();

  // 하트비트 시작
  startHeartbeat();

  // 로컬 계정 로드
  const accounts = loadLocalAccounts();
  log(`Loaded ${accounts.length} local accounts`);

  // Graceful shutdown
  process.on("SIGINT", async () => {
    log("Shutting down...");
    isRunning = false;
    stopHeartbeat();
    await setWorkerOffline();
    process.exit(0);
  });

  // 메인 루프
  let accountIndex = 0;

  while (isRunning) {
    try {
      // 1. 활성화된 모드 가져오기
      const enabledModes = await fetchEnabledModes();

      if (enabledModes.length === 0) {
        log("No enabled modes, waiting...");
        await sleep(30000);
        continue;
      }

      log(`Enabled modes: ${enabledModes.map(m => m.mode_type).join(", ")}`);

      // 2. 상품 목록 가져오기
      const products = await fetchProducts();

      if (products.length === 0) {
        log("No products available, waiting...");
        await sleep(30000);
        continue;
      }

      log(`Fetched ${products.length} products`);

      // 3. 활성화된 모드별로 실행
      for (const mode of enabledModes) {
        const searchMode = mode.mode_type.startsWith("tonggum") ? "통검" : "쇼검";
        const isLogin = mode.mode_type.includes("login") && !mode.mode_type.includes("nologin");

        log(`\n--- Mode: ${mode.mode_type} (${searchMode}, login=${isLogin}) ---`);

        // 배치 실행
        const batch = products.slice(0, BATCH_SIZE);

        for (const product of batch) {
          if (!isRunning) break;

          stats.total++;

          // 로그인 모드: 계정 순환 사용
          let account: Account | undefined;
          if (isLogin && accounts.length > 0) {
            account = accounts[accountIndex % accounts.length];
            accountIndex++;
          }

          log(`[${stats.total}] ${product.product_name.substring(0, 30)}... (MID: ${product.mid})`);

          await executeTraffic(product, searchMode, account);

          // 작업 간 휴식
          await sleep(TASK_REST);
        }

        log(`Mode ${mode.mode_type} batch complete`);
      }

      // 4. 통계 출력
      const elapsed = (Date.now() - stats.startTime.getTime()) / 1000 / 60;
      log(`\n--- Stats (${elapsed.toFixed(1)} min) ---`);
      log(`Total: ${stats.total}, Success: ${stats.success}, Failed: ${stats.failed}`);
      log(`Success rate: ${((stats.success / stats.total) * 100).toFixed(1)}%`);

      // 5. 배치 간 휴식
      log(`\nResting for ${BATCH_REST / 1000} seconds...`);
      await sleep(BATCH_REST);

    } catch (error: any) {
      log(`Main loop error: ${error.message}`, "error");
      await sleep(10000);
    }
  }
}

// 실행
main().catch(console.error);
