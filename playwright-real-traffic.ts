#!/usr/bin/env npx tsx
/**
 * Playwright 기반 네이버 실제 트래픽 스크립트 (사람처럼 버전)
 *
 * - Supabase slot_naver에서 상품 정보 조회
 * - 로그인 세션 재사용 (login.json)
 * - MID 정확 클릭
 * - 사람처럼 랜덤 딜레이 + 스크롤
 * - 목표: 1클릭당 12~15초 (CAPTCHA 없을 때)
 *
 * 사용법:
 *   1. 먼저 로그인 세션 저장: npx tsx scripts/playwright-save-login.ts
 *   2. 트래픽 실행: npx tsx scripts/playwright-real-traffic.ts
 */

import * as dotenv from "dotenv";
dotenv.config();

import { chromium, Page, BrowserContext } from "playwright";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

// ============ 설정 (사람처럼) ============
const LOGIN_STATE_PATH = path.join(process.cwd(), "login.json");
const DWELL_TIME_MIN = 3000;  // 최소 체류 3초
const DWELL_TIME_MAX = 5000;  // 최대 체류 5초

// ============ Supabase 초기화 ============
function initSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_PRODUCTION_URL;
  const key = process.env.SUPABASE_PRODUCTION_KEY;

  if (!url || !key) {
    console.error("[ERROR] SUPABASE_PRODUCTION_URL and SUPABASE_PRODUCTION_KEY required");
    process.exit(1);
  }

  return createClient(url, key);
}

// ============ 유틸 ============
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function log(msg: string, level: "info" | "warn" | "error" = "info") {
  const time = new Date().toISOString().slice(11, 19);
  const prefix = { info: "ℹ️", warn: "⚠️", error: "❌" }[level];
  console.log(`[${time}] ${prefix} ${msg}`);
}

// ============ 상품 정보 조회 ============
interface ProductInfo {
  id: number;
  keyword: string;
  productName: string;
  mid: string;
}

async function getNextProduct(supabase: SupabaseClient): Promise<ProductInfo | null> {
  const { data, error } = await supabase
    .from("slot_naver")
    .select("id, keyword, product_name, mid")
    .not("mid", "is", null)
    .not("product_name", "is", null)
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  const slot = data[0];
  return {
    id: slot.id,
    keyword: slot.keyword || slot.product_name?.substring(0, 30) || "",
    productName: slot.product_name || "",
    mid: slot.mid || "",
  };
}

// ============ CAPTCHA 감지 및 해결 (Playwright용) ============
async function detectAndSolveCaptcha(page: Page): Promise<boolean> {
  // CAPTCHA 감지
  const captchaInfo = await page.evaluate(() => {
    const bodyText = document.body.innerText || "";

    const hasReceiptImage = bodyText.includes("영수증") || bodyText.includes("가상으로 제작");
    const hasQuestion = bodyText.includes("무엇입니까") ||
                       bodyText.includes("빈 칸을 채워주세요") ||
                       bodyText.includes("[?]") ||
                       bodyText.includes("번째 숫자");
    const hasSecurityCheck = bodyText.includes("보안 확인");

    const isCaptcha = hasReceiptImage && (hasQuestion || hasSecurityCheck);

    if (!isCaptcha) {
      return { detected: false, question: "" };
    }

    // 질문 추출
    let question = "";
    const questionMatch = bodyText.match(/.+무엇입니까\??/);
    if (questionMatch) {
      question = questionMatch[0].trim();
    }

    if (!question) {
      const patterns = [
        /.+번째\s*숫자는\s*무엇입니까/,
        /.+번째\s*글자는\s*무엇입니까/,
        /가게\s*위치는\s*.+?\s*\[?\?\]?\s*입니다/,
        /전화번호는\s*.+?\s*\[?\?\]?\s*입니다/,
      ];
      for (const pattern of patterns) {
        const m = bodyText.match(pattern);
        if (m) {
          question = m[0];
          break;
        }
      }
    }

    return { detected: true, question: question || bodyText.substring(0, 300) };
  });

  if (!captchaInfo.detected) {
    return false; // CAPTCHA 아님
  }

  log("CAPTCHA 감지됨!", "warn");
  log(`질문: ${captchaInfo.question}`);

  if (!process.env.ANTHROPIC_API_KEY) {
    log("ANTHROPIC_API_KEY 없음 - CAPTCHA 해결 불가", "error");
    return false;
  }

  // 사람처럼 잠시 대기 (CAPTCHA 보고 읽는 시간)
  await sleep(randomInt(1000, 2000));

  // 영수증 이미지 캡처 (영역 찾기)
  let imageBase64 = "";

  const imageSelectors = [
    'img[src*="captcha"]',
    'img[src*="receipt"]',
    'img[src*="security"]',
    '.captcha_image img',
    '.receipt_image img',
    '[class*="captcha"] img',
    '[class*="receipt"] img',
    '[class*="security"] img',
    'img[alt*="영수증"]',
    'img[alt*="보안"]',
  ];

  for (const selector of imageSelectors) {
    try {
      const imgElement = page.locator(selector).first();
      if (await imgElement.isVisible({ timeout: 1000 })) {
        const imgBuffer = await imgElement.screenshot({ type: "png" });
        imageBase64 = imgBuffer.toString("base64");
        log(`영수증 이미지 캡처: ${selector}`);
        fs.writeFileSync("docs/captcha_receipt_image.png", imgBuffer);
        break;
      }
    } catch {}
  }

  if (!imageBase64) {
    log("영수증 이미지 못 찾음 - 전체 페이지 캡처", "warn");
    const fullBuffer = await page.screenshot({ type: "png" });
    imageBase64 = fullBuffer.toString("base64");
  }

  // Claude Vision으로 답 추출
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const prompt = `이 영수증 CAPTCHA 이미지를 보고 다음 질문에 답하세요.

질문: ${captchaInfo.question}

영수증에서 해당 정보를 찾아 답만 정확히 알려주세요.
- 숫자 관련 질문이면: 해당 숫자만 답하세요 (예: "7", "3")
- 주소 관련 질문이면: 해당 번지수만 답하세요 (예: "794")
- 전화번호 관련 질문이면: 해당 숫자만 답하세요

다른 설명 없이 답만 출력하세요.`;

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 50,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: "image/png", data: imageBase64 } },
          { type: "text", text: prompt },
        ],
      }],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      log("Claude 응답 오류", "error");
      return false;
    }

    let answer = content.text.trim();
    answer = answer.replace(/입니다\.?$/, "").trim();
    answer = answer.replace(/^답\s*:\s*/i, "").trim();

    log(`Claude 응답: "${answer}"`);

    // 사람처럼 입력창으로 이동
    const input = page.locator('input[type="text"]').first();

    // 입력창 클릭 전 잠시 대기
    await sleep(randomInt(500, 1000));
    await input.click();
    await sleep(randomInt(400, 800));

    // 기존 값 지우기
    await input.fill("");
    await sleep(randomInt(300, 500));

    // 한 글자씩 타이핑 (사람처럼 천천히)
    for (const char of answer) {
      await input.type(char);
      await sleep(randomInt(120, 280)); // 더 느린 타이핑
    }

    log(`답 입력 완료: "${answer}"`);

    // 입력 후 확인하는 시간
    await sleep(randomInt(800, 1500));

    // 확인 버튼 찾기
    const buttonSelectors = [
      'button:has-text("확인")',
      'button:has-text("제출")',
      'input[type="submit"]',
      'button[type="submit"]',
    ];

    let buttonClicked = false;
    for (const selector of buttonSelectors) {
      try {
        const btn = page.locator(selector).first();
        if (await btn.isVisible({ timeout: 1000 })) {
          await sleep(randomInt(300, 600)); // 버튼 보고 클릭 전 대기
          await btn.hover();
          await sleep(randomInt(200, 400));
          await btn.click();
          log(`버튼 클릭: ${selector}`);
          buttonClicked = true;
          break;
        }
      } catch {}
    }

    if (!buttonClicked) {
      await sleep(randomInt(400, 700));
      await page.keyboard.press("Enter");
      log("Enter 키로 제출");
    }

    // 제출 후 페이지 이동 대기
    try {
      await page.waitForLoadState("domcontentloaded", { timeout: 10000 });
    } catch {}
    await sleep(randomInt(2000, 3000));

    // 해결 여부 확인
    const pageStatus = await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      const url = window.location.href;
      return {
        stillCaptcha: bodyText.includes("영수증") && (bodyText.includes("무엇입니까") || bodyText.includes("[?]")),
        isProductPage: url.includes("smartstore.naver.com") && url.includes("/products/"),
        isNotFound: bodyText.includes("상품이 존재하지 않습니다") || bodyText.includes("페이지를 찾을 수 없습니다"),
        currentUrl: url,
      };
    });

    log(`현재 URL: ${pageStatus.currentUrl.substring(0, 60)}...`);

    if (pageStatus.isNotFound) {
      log("상품이 삭제되었거나 존재하지 않음", "error");
      return false;
    }

    if (pageStatus.isProductPage) {
      log("CAPTCHA 해결 → 상품 페이지 진입 성공!");
      return true;
    }

    if (!pageStatus.stillCaptcha) {
      log("CAPTCHA 해결 성공!");
      return true;
    } else {
      log("CAPTCHA 해결 실패 - 재시도 필요", "error");
      return false;
    }

  } catch (error: any) {
    log(`CAPTCHA 해결 에러: ${error.message}`, "error");
    return false;
  }
}

// ============ MID 클릭 (사람처럼) ============
async function clickProductByMid(page: Page, context: BrowserContext, mid: string): Promise<Page | null> {
  log(`MID ${mid} 탐색 중...`);

  // 최대 5번 스크롤하며 찾기
  for (let scroll = 0; scroll < 5; scroll++) {
    const targetLink = page.locator(`a[href*="${mid}"]`).first();

    try {
      const visible = await targetLink.isVisible({ timeout: 2000 });
      if (visible) {
        // 사람처럼 스크롤해서 보이게
        await targetLink.scrollIntoViewIfNeeded();
        await sleep(randomInt(500, 1000)); // 스크롤 후 대기

        log(`MID ${mid} 발견! 클릭...`);

        // 클릭 전 잠시 대기 (사람이 확인하는 시간)
        await sleep(randomInt(300, 700));

        const [newPage] = await Promise.all([
          context.waitForEvent("page", { timeout: 10000 }).catch(() => null),
          targetLink.click({ timeout: 10000 }),
        ]);

        if (newPage) {
          await newPage.waitForLoadState("domcontentloaded");
          return newPage;
        }
        return page;
      }
    } catch (e) {
      // 못 찾으면 스크롤
    }

    // 사람처럼 스크롤 (랜덤 거리)
    await page.mouse.wheel(0, randomInt(400, 700));
    await sleep(randomInt(600, 1000));
  }

  log(`MID ${mid} 못 찾음`, "warn");
  return null;
}

// ============ 사람처럼 행동 ============
async function actLikeHuman(page: Page): Promise<void> {
  const dwellTime = randomInt(DWELL_TIME_MIN, DWELL_TIME_MAX);
  log(`체류 중... ${(dwellTime / 1000).toFixed(1)}초`);

  const startTime = Date.now();

  // 스크롤 1~2번
  const scrollCount = randomInt(1, 2);
  for (let i = 0; i < scrollCount; i++) {
    await page.mouse.wheel(0, randomInt(300, 600));
    await sleep(randomInt(800, 1500));
  }

  // 남은 시간 대기
  const elapsed = Date.now() - startTime;
  const remaining = dwellTime - elapsed;
  if (remaining > 0) {
    await sleep(remaining);
  }
}

// ============ 메인 ============
async function main() {
  console.log("=".repeat(50));
  console.log("  Playwright 네이버 트래픽 (사람처럼)");
  console.log("=".repeat(50));

  // 로그인 세션 확인
  if (!fs.existsSync(LOGIN_STATE_PATH)) {
    console.error(`❌ ${LOGIN_STATE_PATH} 파일이 없습니다!`);
    console.log("먼저 로그인 세션을 저장하세요:");
    console.log("  npx tsx scripts/playwright-save-login.ts");
    process.exit(1);
  }
  log("로그인 세션 확인됨");

  // Supabase 연결
  const supabase = initSupabase();
  log("Supabase 연결됨");

  // 상품 정보 조회
  const product = await getNextProduct(supabase);
  if (!product) {
    log("처리할 상품이 없습니다", "warn");
    process.exit(0);
  }

  log(`상품: ${product.productName.substring(0, 40)}...`);
  log(`MID: ${product.mid}`);

  // 브라우저 실행
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"],
  });

  const context = await browser.newContext({
    storageState: LOGIN_STATE_PATH,
    viewport: null,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
  });

  const page = await context.newPage();
  const startTime = Date.now();

  try {
    // 1. 네이버 메인 진입
    log("네이버 메인 진입...");
    await page.goto("https://www.naver.com");
    await page.waitForLoadState("domcontentloaded");
    await sleep(randomInt(1500, 2500)); // 사람처럼 페이지 보는 시간

    // 2. 검색어 입력 (사람처럼 타이핑)
    const searchQuery = product.productName.substring(0, 50);
    log(`검색: ${searchQuery.substring(0, 30)}...`);

    const searchInput = page.locator("#query");
    await searchInput.click();
    await sleep(randomInt(300, 600));

    // 한 글자씩 빠르게 타이핑 (검색어는 좀 빠르게)
    for (const char of searchQuery) {
      await searchInput.type(char);
      await sleep(randomInt(30, 80));
    }

    await sleep(randomInt(500, 1000)); // 타이핑 후 대기
    await page.keyboard.press("Enter");
    await page.waitForLoadState("domcontentloaded");
    await sleep(randomInt(1500, 2500)); // 검색 결과 보는 시간

    // 3. MID로 정확한 상품 클릭
    const productPage = await clickProductByMid(page, context, product.mid);

    if (productPage) {
      await productPage.waitForLoadState("domcontentloaded");
      await sleep(randomInt(1500, 2500)); // 페이지 로딩 후 보는 시간

      const currentUrl = productPage.url();
      log(`도착: ${currentUrl.substring(0, 60)}...`);

      // 4. CAPTCHA 체크 및 해결
      const hasCaptcha = await detectAndSolveCaptcha(productPage);
      if (hasCaptcha) {
        await productPage.waitForLoadState("domcontentloaded");
        await sleep(randomInt(1000, 1500));
      }

      // 최종 확인
      const finalUrl = productPage.url();
      const isProductPageNow = finalUrl.includes("smartstore.naver.com") ||
                               finalUrl.includes("/products/") ||
                               finalUrl.includes(product.mid);

      if (isProductPageNow) {
        log("✅ 상품 페이지 진입 성공!");

        // 5. 사람처럼 행동 (체류)
        await actLikeHuman(productPage);

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        log(`✅ 완료! 소요: ${elapsed}초`);
      } else {
        log(`⚠️ 예상과 다른 페이지`, "warn");
      }
    } else {
      log(`MID ${product.mid} 찾지 못함`, "error");
    }

  } catch (error: any) {
    log(`에러: ${error.message}`, "error");
  } finally {
    await browser.close();
    log("브라우저 종료");
  }
}

main().catch(console.error);
