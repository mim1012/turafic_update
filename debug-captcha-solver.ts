#!/usr/bin/env npx tsx
/**
 * CAPTCHA 솔버 디버깅 스크립트
 *
 * 네이버 메인 → 검색 → MID 클릭 → Bridge 통과
 * 10초 이내 완료 목표
 *
 * 사용법: npx tsx scripts/debug-captcha-solver.ts
 */

import * as dotenv from "dotenv";
dotenv.config();

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { connect } from "puppeteer-real-browser";
import { ReceiptCaptchaSolver } from "../server/services/traffic/shared/captcha/ReceiptCaptchaSolver";

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

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const startTime = Date.now();
  console.log("=".repeat(60));
  console.log("CAPTCHA 솔버 디버깅 - 10초 목표");
  console.log("=".repeat(60));

  // API 키 확인
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY가 설정되지 않음!");
    process.exit(1);
  }
  console.log("✅ ANTHROPIC_API_KEY 설정됨");

  // Supabase 연결
  const supabase = initSupabase();
  console.log("✅ Supabase 연결됨");

  // slot_naver에서 상품 정보 가져오기
  console.log("\n[Step 1] slot_naver에서 상품 정보 조회...");
  const { data: slots, error } = await supabase
    .from("slot_naver")
    .select("id, product_name, mid, keyword")
    .not("mid", "is", null)
    .not("product_name", "is", null)
    .limit(1);

  if (error || !slots || slots.length === 0) {
    console.error("❌ slot_naver에서 상품을 찾을 수 없음:", error);
    process.exit(1);
  }

  const testProduct = slots[0];
  const searchQuery = (testProduct.product_name || "").substring(0, 50);
  console.log(`🎯 상품: ${testProduct.product_name?.substring(0, 40)}...`);
  console.log(`   MID: ${testProduct.mid}`);

  // 브라우저 실행
  console.log("\n[Step 2] 브라우저 실행...");
  const { browser, page } = await connect({
    headless: false,
    turnstile: true,
    fingerprint: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  await page.setViewport({ width: 1280, height: 800 });

  try {
    // ========================================
    // Step 3: 네이버 메인 → 검색 → 클릭 (최적화)
    // ========================================
    console.log("\n[Step 3] 네이버 메인 진입...");
    await page.goto("https://www.naver.com/", {
      waitUntil: "domcontentloaded",
      timeout: 10000,
    });
    await sleep(500); // 최소화

    // 검색창 타이핑 (delay 30ms로 줄임)
    console.log("[Step 4] 검색...");
    await page.type('#query', searchQuery, { delay: 30 });
    await page.keyboard.press("Enter");
    await sleep(1500); // 검색 결과 대기

    // 차단 확인
    const isBlocked = await page.evaluate(() => {
      const text = document.body.innerText || "";
      return text.includes("접속이 일시적으로 제한");
    });

    if (isBlocked) {
      console.log("⛔ 차단됨!");
      await browser.close();
      return;
    }

    // MID 클릭 (빠르게)
    console.log("[Step 5] MID 클릭...");
    const targetMid = testProduct.mid || "";
    let clicked = false;

    for (let scroll = 0; scroll < 5 && !clicked; scroll++) {
      const links = await page.$$("a");
      for (const link of links) {
        try {
          const href = await link.evaluate(el => el.getAttribute("href") || "");
          if (href.includes(targetMid)) {
            const isVisible = await link.evaluate(el => {
              const rect = el.getBoundingClientRect();
              return rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight;
            });
            if (isVisible) {
              // target="_blank" 제거하고 현재 탭에서 열기
              await link.evaluate(el => {
                el.removeAttribute('target');
                el.scrollIntoView({ block: "center" });
              });
              await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => null),
                link.click(),
              ]);
              clicked = true;
              break;
            }
          }
        } catch (e) {}
      }
      if (!clicked) {
        await page.evaluate(() => window.scrollBy(0, 400));
        await sleep(300);
      }
    }

    await sleep(1000); // 페이지 로딩

    // ========================================
    // Step 6: 분석 + CAPTCHA 처리
    // ========================================
    console.log("\n[Step 6] 분석...");
    const finalUrl = page.url();
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`  URL: ${finalUrl.substring(0, 60)}...`);
    console.log(`  경과: ${elapsed}초`);

    const analysis = await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      return {
        hasReceipt: bodyText.includes("영수증"),
        hasSecurity: bodyText.includes("보안 확인"),
        hasQuestion: bodyText.includes("무엇입니까"),
        hasRestricted: bodyText.includes("접속이 일시적으로 제한"),
        isSmartstore: window.location.href.includes("smartstore.naver.com"),
        isProductPage: window.location.href.includes("/products/"),
        isBridge: window.location.href.includes("/bridge"),
      };
    });

    const isCaptcha = analysis.hasReceipt || analysis.hasSecurity || analysis.hasQuestion;

    if (analysis.hasRestricted) {
      console.log("⛔ 접속 제한됨!");
    } else if (isCaptcha) {
      console.log("🎯 CAPTCHA 감지! 솔버 테스트...");
      const solver = new ReceiptCaptchaSolver();
      const solved = await solver.solve(page);
      console.log(solved ? "🎉 CAPTCHA 해결!" : "❌ CAPTCHA 실패");
    } else if (analysis.isSmartstore || analysis.isProductPage) {
      console.log("✅ 상품 페이지 도착!");
      // 2~3초 랜덤 체류
      const dwellTime = 2000 + Math.random() * 1000;
      console.log(`   체류: ${(dwellTime / 1000).toFixed(1)}초...`);
      await sleep(dwellTime);
    } else if (analysis.isBridge) {
      console.log("⏳ Bridge 대기...");
      await sleep(2000);
    } else {
      console.log("⚠️ 알 수 없는 상태");
    }

    const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`\n⏱️ 총 소요: ${totalElapsed}초`);

  } catch (error) {
    console.error("❌ 에러:", error);
  } finally {
    await browser.close();
    console.log("브라우저 종료");
  }
}

main().catch(console.error);
