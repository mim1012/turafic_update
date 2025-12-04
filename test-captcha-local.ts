#!/usr/bin/env npx tsx
/**
 * 캡챠 감지/해결 로컬 테스트
 *
 * 네이버 검색 → 상품 클릭 → 캡챠 감지 → Claude Vision 해결
 */

import * as dotenv from "dotenv";
dotenv.config();

import { chromium } from "playwright";
import { ReceiptCaptchaSolver } from "./ReceiptCaptchaSolver";

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("========================================");
  console.log("  CAPTCHA 감지/해결 로컬 테스트");
  console.log("========================================");

  // API 키 확인
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌ ANTHROPIC_API_KEY 환경변수 필요!");
    process.exit(1);
  }
  console.log("✅ ANTHROPIC_API_KEY 설정됨");

  // 테스트 상품 (하드코딩)
  const testProduct = {
    name: "삼성전자 갤럭시 버즈3 프로",
    mid: "88888888888", // 실제 MID로 교체 필요
    keyword: "갤럭시 버즈3 프로"
  };

  console.log(`\n🎯 테스트 상품: ${testProduct.name}`);

  // 브라우저 실행
  console.log("\n[1] 브라우저 실행...");
  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    // 네이버 검색
    console.log("[2] 네이버 검색...");
    await page.goto("https://www.naver.com/");
    await sleep(1500);

    await page.fill('input[name="query"]', testProduct.name.substring(0, 50));
    await page.press('input[name="query"]', "Enter");
    await sleep(3000);

    // 스크롤
    console.log("[3] 스크롤...");
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 400));
      await sleep(500);
    }

    // Bridge URL 찾아서 직접 이동 (캡챠 트리거 확률 높음)
    console.log("[4] Bridge URL 찾기...");
    const bridgeUrl = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      for (const link of links) {
        const href = link.href || '';
        if (href.includes('cr.shopping.naver.com') ||
            href.includes('cr2.shopping.naver.com') ||
            href.includes('cr3.shopping.naver.com') ||
            href.includes('/bridge')) {
          return href;
        }
      }
      // Bridge 없으면 smartstore 링크
      for (const link of links) {
        const href = link.href || '';
        if (href.includes('smartstore.naver.com') && href.includes('/products/')) {
          return href;
        }
      }
      return null;
    });

    if (!bridgeUrl) {
      console.log("❌ Bridge/상품 URL 없음");
      await browser.close();
      return;
    }

    console.log(`✅ URL 발견: ${bridgeUrl.substring(0, 80)}...`);
    console.log("[5] 페이지 이동...");
    await page.goto(bridgeUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await sleep(5000);

    // 캡챠 감지
    console.log("\n[5] 캡챠 감지 중...");
    const currentUrl = page.url();
    console.log(`   현재 URL: ${currentUrl.substring(0, 80)}`);

    const pageAnalysis = await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      return {
        hasSecurityCheck: bodyText.includes("보안 확인"),
        hasReceipt: bodyText.includes("영수증"),
        hasQuestion: bodyText.includes("무엇입니까") || bodyText.includes("[?]"),
        hasRestricted: bodyText.includes("일시적으로 제한"),
        preview: bodyText.substring(0, 500)
      };
    });

    console.log("\n📋 페이지 분석:");
    console.log(`   보안 확인: ${pageAnalysis.hasSecurityCheck}`);
    console.log(`   영수증: ${pageAnalysis.hasReceipt}`);
    console.log(`   질문: ${pageAnalysis.hasQuestion}`);
    console.log(`   접근 제한: ${pageAnalysis.hasRestricted}`);

    const hasCaptcha = pageAnalysis.hasSecurityCheck ||
                       pageAnalysis.hasReceipt ||
                       pageAnalysis.hasQuestion;

    if (!hasCaptcha) {
      console.log("\n✅ 캡챠 없음 - 정상 페이지");
      console.log(`   미리보기: ${pageAnalysis.preview.substring(0, 200)}`);
    } else {
      console.log("\n🔐 캡챠 감지됨! 자동 해결 시도...");

      // 스크린샷 저장
      await page.screenshot({ path: 'captcha_test_screenshot.png', fullPage: true });
      console.log("   스크린샷 저장: captcha_test_screenshot.png");

      // Claude Vision으로 해결 시도
      const solver = new ReceiptCaptchaSolver();
      const startTime = Date.now();
      const solved = await solver.solve(page);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      if (solved) {
        console.log(`\n🎉 캡챠 해결 성공! (${elapsed}초)`);
      } else {
        console.log(`\n❌ 캡챠 해결 실패 (${elapsed}초)`);
      }
    }

    // 최종 상태
    console.log("\n[6] 최종 상태:");
    const finalUrl = page.url();
    console.log(`   URL: ${finalUrl.substring(0, 80)}`);

    // 10초 대기 (결과 확인용)
    console.log("\n   10초 후 브라우저 종료...");
    await sleep(10000);

  } catch (error: any) {
    console.error("❌ 에러:", error.message);
  } finally {
    await browser.close();
    console.log("\n✅ 테스트 완료");
  }
}

main().catch(console.error);
