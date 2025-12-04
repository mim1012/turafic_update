#!/usr/bin/env npx tsx
/**
 * 캡챠 페이지 디버그 - 페이지 내용 전체 덤프
 *
 * 캡챠가 뜨면 이 스크립트 실행해서 페이지 내용 확인
 */

import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import { chromium } from "playwright";

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("========================================");
  console.log("  캡챠 페이지 디버그");
  console.log("========================================\n");

  const browser = await chromium.launch({
    headless: false,
    args: ["--disable-blink-features=AutomationControlled"]
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();

  try {
    // 네이버 검색 (캡챠 트리거 높은 검색어)
    console.log("[1] 네이버 검색...");
    await page.goto("https://www.naver.com/");
    await sleep(1000);

    // 검색어 입력
    await page.fill('input[name="query"]', "삼성 갤럭시 워치7");
    await page.press('input[name="query"]', "Enter");
    await sleep(3000);

    // Bridge URL 찾기
    console.log("[2] Bridge URL 찾기...");
    const bridgeUrl = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      for (const link of links) {
        const href = link.href || '';
        if (href.includes('cr.shopping') || href.includes('cr2.shopping') ||
            href.includes('cr3.shopping') || href.includes('/bridge')) {
          return href;
        }
      }
      return null;
    });

    if (bridgeUrl) {
      console.log(`   Bridge URL: ${bridgeUrl.substring(0, 80)}...`);
      console.log("[3] Bridge URL로 이동...");
      await page.goto(bridgeUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } else {
      console.log("   Bridge URL 없음 - 직접 쇼핑 검색으로 이동");
      await page.goto("https://search.shopping.naver.com/search/all?query=삼성%20갤럭시%20워치7");
    }

    await sleep(5000);

    // 페이지 분석 및 덤프
    console.log("\n[4] 페이지 분석...");
    const currentUrl = page.url();
    console.log(`   URL: ${currentUrl}`);

    // 스크린샷 저장
    await page.screenshot({ path: 'debug_captcha_screenshot.png', fullPage: true });
    console.log("   스크린샷: debug_captcha_screenshot.png");

    // HTML 저장
    const html = await page.content();
    fs.writeFileSync('debug_captcha_page.html', html);
    console.log("   HTML: debug_captcha_page.html");

    // 텍스트 내용 저장
    const bodyText = await page.evaluate(() => document.body.innerText);
    fs.writeFileSync('debug_captcha_text.txt', bodyText);
    console.log("   텍스트: debug_captcha_text.txt");

    // 캡챠 관련 키워드 체크
    console.log("\n[5] 캡챠 키워드 체크:");
    const keywords = [
      "보안 확인",
      "보안 확인을 완료해 주세요",
      "영수증",
      "무엇입니까",
      "[?]",
      "일시적으로 제한",
      "비정상적인 접근",
      "자동입력 방지",
      "captcha",
      "CAPTCHA",
      "가게 전화번호",
      "가게 위치",
      "번째 숫자",
      "번째 글자"
    ];

    for (const keyword of keywords) {
      const found = bodyText.includes(keyword);
      console.log(`   ${found ? '✅' : '❌'} "${keyword}"`);
    }

    // iframe 체크
    const iframes = await page.$$('iframe');
    console.log(`\n[6] iframe 개수: ${iframes.length}`);

    for (let i = 0; i < iframes.length; i++) {
      try {
        const frame = await iframes[i].contentFrame();
        if (frame) {
          const frameText = await frame.evaluate(() => document.body?.innerText || '');
          console.log(`   iframe[${i}] 텍스트 (처음 200자): ${frameText.substring(0, 200)}`);

          // iframe 내부에서 캡챠 키워드 체크
          for (const keyword of ["영수증", "무엇입니까", "보안 확인"]) {
            if (frameText.includes(keyword)) {
              console.log(`   ⚠️ iframe[${i}]에서 "${keyword}" 발견!`);
            }
          }
        }
      } catch (e) {
        console.log(`   iframe[${i}] 접근 불가`);
      }
    }

    // 30초 대기 (수동 확인용)
    console.log("\n[7] 30초 대기 (브라우저에서 직접 확인)...");
    console.log("   캡챠가 보이면 텍스트 내용을 알려주세요!");
    await sleep(30000);

  } catch (error: any) {
    console.error("❌ 에러:", error.message);
  } finally {
    await browser.close();
    console.log("\n✅ 완료");
  }
}

main().catch(console.error);
