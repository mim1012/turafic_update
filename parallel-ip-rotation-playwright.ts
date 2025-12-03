#!/usr/bin/env npx tsx
/**
 * Parallel IP Rotation Traffic Worker (Playwright 버전)
 *
 * 병렬 3개 브라우저 + IP 로테이션 + CAPTCHA 해결
 * - Playwright 기반 (봇 탐지 우회)
 * - Claude Vision CAPTCHA 솔버
 * - 사람처럼 랜덤 딜레이
 *
 * 환경변수:
 *   - SUPABASE_PRODUCTION_URL (필수)
 *   - SUPABASE_PRODUCTION_KEY (필수)
 *   - ANTHROPIC_API_KEY (CAPTCHA 해결용)
 *   - TETHERING_ADAPTER: 테더링 어댑터 이름 (자동 감지)
 *   - PARALLEL_COUNT: 병렬 실행 수 (기본: 3)
 */

import * as dotenv from "dotenv";
dotenv.config();

import os from "os";
import * as fs from "fs";
import * as path from "path";
import { chromium, Page, BrowserContext, Browser } from "playwright";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import {
  getCurrentIP,
  getTetheringAdapter,
  rotateIP,
} from "./ipRotation";

// ============ 설정 ============
const NODE_ID = process.env.NODE_ID || `parallel-${os.hostname()}`;
const PARALLEL_COUNT = parseInt(process.env.PARALLEL_COUNT || "3");
const TETHERING_ADAPTER = process.env.TETHERING_ADAPTER || undefined;
const POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || "10") * 1000;
const TASK_TIMEOUT = 60 * 1000;
const LOGIN_STATE_PATH = path.join(process.cwd(), "login.json");

// ============ Supabase 클라이언트 ============
let supabase: SupabaseClient;

function initSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_PRODUCTION_URL;
  const key = process.env.SUPABASE_PRODUCTION_KEY;

  if (!url || !key) {
    console.error("[ERROR] SUPABASE_PRODUCTION_URL and SUPABASE_PRODUCTION_KEY required");
    process.exit(1);
  }

  return createClient(url, key);
}

// ============ 타입 ============
interface TrafficTask {
  id: number;
  keyword: string;
  link_url: string;
  slot_id: number;
  slot_sequence: number;
  product_id?: string;
  product_name?: string;
}

interface TaskResult {
  taskId: number;
  success: boolean;
  captcha: boolean;
  error?: string;
  productName: string;
  nvMid: string;
}

// ============ 통계 ============
const stats = {
  total: 0,
  success: 0,
  failed: 0,
  captcha: 0,
  captchaSolved: 0,
  ipRotations: 0,
  startTime: new Date(),
};

let isRunning = true;
let currentAdapter: string | null = null;

// ============ 유틸 ============
function log(msg: string, level: "info" | "warn" | "error" = "info") {
  const time = new Date().toISOString();
  const prefix = { info: "[INFO]", warn: "[WARN]", error: "[ERROR]" }[level];
  console.log(`[${time}] ${prefix} ${msg}`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function printStats() {
  const elapsed = Math.floor((Date.now() - stats.startTime.getTime()) / 1000 / 60);
  const rate = stats.total > 0 ? ((stats.success / stats.total) * 100).toFixed(1) : "0";
  log(`Stats: Total=${stats.total} Success=${stats.success}(${rate}%) Failed=${stats.failed} Captcha=${stats.captcha}(Solved:${stats.captchaSolved}) IPRotations=${stats.ipRotations} Time=${elapsed}min`);
}

// ============ DB 함수 ============

// 네이버쇼핑 슬롯의 일일 클릭 목표 가져오기
async function getClicksPerDay(): Promise<number> {
  const { data } = await supabase
    .from("traffic_clicks_per_day")
    .select("click_per_day")
    .eq("slot_type", "네이버쇼핑")
    .single();

  return data?.click_per_day || 100; // 기본값 100
}

// 슬롯이 완료되었는지 확인 (success_count + fail_count >= click_per_day)
async function isSlotCompleted(slotId: number, clicksPerDay: number): Promise<boolean> {
  const { data } = await supabase
    .from("slot_naver")
    .select("success_count, fail_count")
    .eq("id", slotId)
    .single();

  if (!data) return false;

  const totalCount = (data.success_count || 0) + (data.fail_count || 0);
  return totalCount >= clicksPerDay;
}

async function getNextTasks(count: number): Promise<TrafficTask[]> {
  const validTasks: TrafficTask[] = [];

  // 일일 클릭 목표 가져오기
  const clicksPerDay = await getClicksPerDay();
  log(`Daily click target: ${clicksPerDay}`);

  const { data: tasks, error } = await supabase
    .from("traffic_navershopping")
    .select("*")
    .order("id", { ascending: true })
    .limit(count * 3); // 완료된 슬롯 스킵 고려해서 더 많이 가져옴

  if (error || !tasks) return [];

  for (const task of tasks) {
    if (validTasks.length >= count) break;

    if (!task.slot_id) {
      await deleteProcessedTraffic(task.id);
      continue;
    }

    // 슬롯이 이미 완료되었는지 확인
    const completed = await isSlotCompleted(task.slot_id, clicksPerDay);
    if (completed) {
      log(`Slot #${task.slot_id} completed (>= ${clicksPerDay} clicks). Removing task.`);
      await deleteProcessedTraffic(task.id);
      continue;
    }

    const slotInfo = await getSlotProductInfo(task.slot_id);
    if (slotInfo.productName && slotInfo.mid) {
      (task as any).product_name = slotInfo.productName;
      (task as any).product_id = slotInfo.mid;
      validTasks.push(task as TrafficTask);
    } else {
      log(`Skipping task #${task.id}: missing product_name or mid`, "warn");
      await deleteProcessedTraffic(task.id);
    }
  }

  return validTasks;
}

async function getSlotProductInfo(slotId: number): Promise<{ productName: string | null; mid: string | null }> {
  const { data } = await supabase
    .from("slot_naver")
    .select("product_name, mid")
    .eq("id", slotId)
    .single();

  return {
    productName: data?.product_name || null,
    mid: data?.mid || null,
  };
}

async function updateSlotResult(slotId: number, success: boolean): Promise<void> {
  const column = success ? "success_count" : "fail_count";

  const { data: current } = await supabase
    .from("slot_naver")
    .select(column)
    .eq("id", slotId)
    .single();

  const currentValue = (current as any)?.[column] || 0;

  await supabase
    .from("slot_naver")
    .update({ [column]: currentValue + 1 })
    .eq("id", slotId);
}

async function deleteProcessedTraffic(taskId: number): Promise<void> {
  await supabase
    .from("traffic_navershopping")
    .delete()
    .eq("id", taskId);
}

async function getPendingCount(): Promise<number> {
  const { count } = await supabase
    .from("traffic_navershopping")
    .select("*", { count: "exact", head: true });
  return count || 0;
}

// ============ CAPTCHA 해결 ============
async function solveCaptcha(page: Page): Promise<boolean> {
  const captchaInfo = await page.evaluate(() => {
    const bodyText = document.body.innerText || "";
    const hasReceiptImage = bodyText.includes("영수증") || bodyText.includes("가상으로 제작");
    const hasQuestion = bodyText.includes("무엇입니까") || bodyText.includes("[?]") || bodyText.includes("번째 숫자");
    const isCaptcha = hasReceiptImage && hasQuestion;

    if (!isCaptcha) return { detected: false, question: "" };

    let question = "";
    const match = bodyText.match(/.+무엇입니까\??/);
    if (match) question = match[0].trim();

    return { detected: true, question: question || bodyText.substring(0, 300) };
  });

  if (!captchaInfo.detected) return false;

  log(`CAPTCHA detected: ${captchaInfo.question.substring(0, 50)}...`);
  stats.captcha++;

  if (!process.env.ANTHROPIC_API_KEY) {
    log("ANTHROPIC_API_KEY not set - cannot solve CAPTCHA", "warn");
    return false;
  }

  await sleep(randomInt(1000, 2000));

  // 이미지 캡처
  let imageBase64 = "";
  const selectors = ['[class*="captcha"] img', 'img[src*="captcha"]', 'img[src*="receipt"]'];

  for (const sel of selectors) {
    try {
      const img = page.locator(sel).first();
      if (await img.isVisible({ timeout: 1000 })) {
        const buf = await img.screenshot({ type: "png" });
        imageBase64 = buf.toString("base64");
        break;
      }
    } catch {}
  }

  if (!imageBase64) {
    const buf = await page.screenshot({ type: "png" });
    imageBase64 = buf.toString("base64");
  }

  // Claude Vision
  try {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 50,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/png", data: imageBase64 } },
          { type: "text", text: `영수증 CAPTCHA 질문: ${captchaInfo.question}\n\n답만 출력하세요.` },
        ],
      }],
    });

    const content = response.content[0];
    if (content.type !== "text") return false;

    let answer = content.text.trim().replace(/입니다\.?$/, "").replace(/^답\s*:\s*/i, "").trim();
    log(`CAPTCHA answer: "${answer}"`);

    // 입력
    const input = page.locator('input[type="text"]').first();
    await input.click();
    await sleep(randomInt(400, 800));

    for (const char of answer) {
      await input.type(char);
      await sleep(randomInt(120, 280));
    }

    await sleep(randomInt(800, 1500));

    // 제출
    const btn = page.locator('button:has-text("확인")').first();
    if (await btn.isVisible({ timeout: 1000 })) {
      await btn.click();
    } else {
      await page.keyboard.press("Enter");
    }

    await sleep(randomInt(2000, 3000));

    // 확인
    const stillCaptcha = await page.evaluate(() => {
      const text = document.body.innerText || "";
      return text.includes("영수증") && (text.includes("무엇입니까") || text.includes("[?]"));
    });

    if (!stillCaptcha) {
      log("CAPTCHA solved!");
      stats.captchaSolved++;
      return true;
    }
  } catch (e: any) {
    log(`CAPTCHA solve error: ${e.message}`, "error");
  }

  return false;
}

// ============ 트래픽 실행 ============
async function executeTraffic(task: TrafficTask, context: BrowserContext): Promise<TaskResult> {
  const productName = task.product_name || task.keyword;
  const nvMid = task.product_id || "";

  const page = await context.newPage();

  try {
    // 1. 네이버 메인
    await page.goto("https://www.naver.com");
    await page.waitForLoadState("domcontentloaded");
    await sleep(randomInt(1500, 2500));

    // 2. 검색
    const searchQuery = productName.substring(0, 50);
    const searchInput = page.locator("#query");
    await searchInput.click();
    await sleep(randomInt(300, 600));

    for (const char of searchQuery) {
      await searchInput.type(char);
      await sleep(randomInt(30, 80));
    }

    await sleep(randomInt(500, 1000));
    await page.keyboard.press("Enter");
    await page.waitForLoadState("domcontentloaded");
    await sleep(randomInt(1500, 2500));

    // 3. MID 클릭
    let clicked = false;
    for (let scroll = 0; scroll < 5; scroll++) {
      const link = page.locator(`a[href*="${nvMid}"]`).first();
      try {
        if (await link.isVisible({ timeout: 2000 })) {
          await link.scrollIntoViewIfNeeded();
          await sleep(randomInt(500, 1000));

          const [newPage] = await Promise.all([
            context.waitForEvent("page", { timeout: 10000 }).catch(() => null),
            link.click(),
          ]);

          if (newPage) {
            await newPage.waitForLoadState("domcontentloaded");
            await sleep(randomInt(1500, 2500));

            // CAPTCHA 체크
            const hasCaptcha = await solveCaptcha(newPage);

            // 체류
            await newPage.mouse.wheel(0, randomInt(300, 600));
            await sleep(randomInt(3000, 5000));

            await newPage.close();
          }
          clicked = true;
          break;
        }
      } catch {}

      await page.mouse.wheel(0, randomInt(400, 700));
      await sleep(randomInt(600, 1000));
    }

    await page.close();

    return {
      taskId: task.id,
      success: clicked,
      captcha: false,
      productName,
      nvMid,
    };

  } catch (error: any) {
    try { await page.close(); } catch {}
    return {
      taskId: task.id,
      success: false,
      captcha: false,
      error: error.message,
      productName,
      nvMid,
    };
  }
}

// ============ 메인 ============
async function main() {
  log("========================================");
  log("  TURAFIC Parallel Worker (Playwright)");
  log("========================================");
  log(`  Node ID: ${NODE_ID}`);
  log(`  Parallel: ${PARALLEL_COUNT} browsers`);
  log(`  CAPTCHA: ${process.env.ANTHROPIC_API_KEY ? "Enabled" : "Disabled"}`);
  log("========================================");

  // 로그인 세션 체크
  if (!fs.existsSync(LOGIN_STATE_PATH)) {
    log(`login.json not found. Run: npx tsx playwright-save-login.ts`, "error");
    process.exit(1);
  }

  supabase = initSupabase();

  const count = await getPendingCount();
  log(`Connected! Pending tasks: ${count}`);

  // 테더링 어댑터
  currentAdapter = TETHERING_ADAPTER || await getTetheringAdapter();
  if (currentAdapter) {
    log(`Tethering adapter: ${currentAdapter}`);
  } else {
    log("No tethering adapter. IP rotation disabled.", "warn");
  }

  const ip = await getCurrentIP().catch(() => "unknown");
  log(`Current IP: ${ip}`);

  process.on("SIGINT", () => {
    log("Shutdown...");
    isRunning = false;
    printStats();
  });

  // 브라우저 실행 (공유)
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"],
  });

  while (isRunning) {
    const tasks = await getNextTasks(PARALLEL_COUNT);

    if (tasks.length === 0) {
      const pending = await getPendingCount();
      if (pending === 0) log("No tasks. Waiting...");
      await sleep(POLL_INTERVAL);
      continue;
    }

    log(`========================================`);
    log(`Starting batch: ${tasks.length} tasks`);
    log(`========================================`);

    // 각 태스크마다 새 context (분리된 세션)
    const startTime = Date.now();
    const results = await Promise.all(
      tasks.map(async (task) => {
        const context = await browser.newContext({
          storageState: LOGIN_STATE_PATH,
          viewport: null,
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
          locale: "ko-KR",
          timezoneId: "Asia/Seoul",
        });

        const result = await executeTraffic(task, context);
        await context.close();
        return result;
      })
    );

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    // 결과 처리
    let batchSuccess = 0;
    for (const result of results) {
      stats.total++;
      if (result.success) {
        stats.success++;
        batchSuccess++;
      } else {
        stats.failed++;
      }

      const task = tasks.find(t => t.id === result.taskId);
      if (task?.slot_id) {
        await updateSlotResult(task.slot_id, result.success).catch(() => {});
      }
      await deleteProcessedTraffic(result.taskId).catch(() => {});

      const status = result.success ? "OK" : "FAIL";
      log(`[${result.taskId}] ${status} - ${result.productName.substring(0, 30)}...`);
    }

    log(`Batch done in ${elapsed}s: ${batchSuccess}/${tasks.length} success`);

    // IP 로테이션
    if (currentAdapter && isRunning) {
      const rotation = await rotateIP(currentAdapter);
      if (rotation.success) {
        stats.ipRotations++;
        log(`IP: ${rotation.oldIP} -> ${rotation.newIP}`);
      } else {
        log(`IP rotation failed: ${rotation.error}`, "warn");
      }
    }

    printStats();
  }

  await browser.close();
  log("Worker stopped");
}

main().catch((e) => {
  log(`Fatal: ${e.message}`, "error");
  process.exit(1);
});
