/**
 * PRB V7 Style 테스트 (CAPTCHA 최소화)
 *
 * V7Simple 방식 적용:
 * 1. fingerprint: false (모바일 프로필 비활성화)
 * 2. JS 이벤트 기반 검색 (form.submit)
 * 3. DOM 클릭 (마우스 클릭 아님)
 * 4. 최소 스크롤 (3번)
 * 5. Bridge URL도 그냥 클릭 (리다이렉트 대기)
 */

import * as dotenv from "dotenv";
dotenv.config();

import { connect } from "puppeteer-real-browser";
import type { Page, Browser } from "puppeteer-core";
import { createClient } from "@supabase/supabase-js";

const TEST_COUNT = 10;
const SUPABASE_URL = process.env.SUPABASE_PRODUCTION_URL!;
const SUPABASE_KEY = process.env.SUPABASE_PRODUCTION_KEY!;

interface Product {
  id: number;
  keyword: string;
  product_name: string;
  mid: string;
}

interface TestResult {
  index: number;
  product: string;
  mid: string;
  captchaDetected: boolean;
  midMatched: boolean;
  productPageEntered: boolean;
  error?: string;
  duration: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

function shuffleWords(productName: string): string {
  const cleaned = productName
    .replace(/[\[\](){}]/g, ' ')
    .replace(/[^\w\sㄱ-ㅎㅏ-ㅣ가-힣]/g, ' ')
    .trim();
  const words = cleaned.split(/\s+/).filter(w => w.length > 0);
  if (words.length <= 1) return cleaned;
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.join(' ');
}

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

// ============ V7 Style PRB 테스트 ============
async function runV7StyleTest(product: Product, index: number): Promise<TestResult> {
  const startTime = Date.now();
  let browser: Browser | null = null;

  const result: TestResult = {
    index,
    product: product.product_name.substring(0, 30),
    mid: product.mid,
    captchaDetected: false,
    midMatched: false,
    productPageEntered: false,
    duration: 0
  };

  try {
    // V7 Style: fingerprint 비활성화 (PC 모드)
    const response = await connect({
      headless: false,
      turnstile: true,
      // fingerprint: true,  // 비활성화! V7Simple 핵심
    });

    browser = response.browser as Browser;
    const page = response.page as Page;

    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);

    console.log(`  [V7] PRB connected (PC mode, no fingerprint)`);

    // 1. 네이버 메인 (PC)
    await page.goto("https://www.naver.com/", { waitUntil: "domcontentloaded" });
    await sleep(1500 + Math.random() * 1000);

    // 2. JS 이벤트 기반 검색 (V7 핵심!)
    const searchQuery = shuffleWords(product.product_name).substring(0, 50);
    console.log(`  [V7] 검색어: ${searchQuery.substring(0, 30)}...`);

    const searchSubmitted = await page.evaluate((query: string) => {
      const input = document.querySelector('input[name="query"]') as HTMLInputElement;
      if (input) {
        input.value = query;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const form = input.closest('form');
        if (form) {
          form.submit();
          return true;
        }
      }
      return false;
    }, searchQuery);

    if (!searchSubmitted) {
      result.error = "Search form not found";
      return result;
    }

    // Navigation 대기
    try {
      await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 20000 });
    } catch {}
    await sleep(2500 + Math.random() * 1000);

    // 3. CAPTCHA 체크 (검색 결과에서)
    const searchCaptcha = await page.evaluate(() => {
      const bodyText = document.body.innerText || '';
      return bodyText.includes('보안 확인') ||
             bodyText.includes('자동입력방지') ||
             bodyText.includes('비정상적인 접근');
    });

    if (searchCaptcha) {
      console.log(`  [V7] ❌ 검색 CAPTCHA 감지`);
      result.captchaDetected = true;
      result.error = "Search CAPTCHA";
      return result;
    }

    // 4. 최소 스크롤 (V7: 3번만!)
    for (let s = 0; s < 3; s++) {
      await page.evaluate(() => window.scrollBy(0, 400));
      await sleep(500);
    }

    // 5. DOM 클릭 + 새 탭 핸들링 (V7 핵심!)
    console.log(`  [V7] smartstore 링크 DOM 클릭 시도...`);

    // 새 탭 핸들링 Promise 설정
    let productPage: Page | null = null;
    const newTabPromise = new Promise<Page>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('New tab timeout')), 10000);

      browser!.once('targetcreated', async (target: any) => {
        clearTimeout(timeout);
        if (target.type() === 'page') {
          const newPage = await target.page();
          if (newPage) resolve(newPage as Page);
          else reject(new Error('Failed to get new page'));
        }
      });
    });

    const clickResult = await page.evaluate((targetMid: string) => {
      const links = Array.from(document.querySelectorAll('a'));

      // 1차: MID 포함된 smartstore 직접 링크
      for (const link of links) {
        const href = link.href || '';
        // Bridge URL 스킵
        if (href.includes('/bridge') || href.includes('cr.shopping') ||
            href.includes('cr2.shopping') || href.includes('cr3.shopping')) {
          continue;
        }
        if ((href.includes('smartstore.naver.com') || href.includes('brand.naver.com')) &&
            href.includes('/products/')) {
          if (href.includes(targetMid)) {
            (link as HTMLElement).click();
            return { clicked: true, href, method: 'direct-mid' };
          }
        }
      }

      // 2차: 아무 smartstore 링크 (MID 없어도)
      for (const link of links) {
        const href = link.href || '';
        if (href.includes('/bridge') || href.includes('cr.shopping')) continue;
        if ((href.includes('smartstore.naver.com') || href.includes('brand.naver.com')) &&
            href.includes('/products/')) {
          (link as HTMLElement).click();
          return { clicked: true, href, method: 'any-smartstore' };
        }
      }

      // 3차: Bridge URL도 클릭 (V7: 리다이렉트 대기)
      for (const link of links) {
        const href = link.href || '';
        if (href.includes(targetMid)) {
          (link as HTMLElement).click();
          return { clicked: true, href, method: 'bridge-with-mid' };
        }
      }

      return { clicked: false };
    }, product.mid);

    if (!clickResult.clicked) {
      result.error = "No product link found";
      return result;
    }

    console.log(`  [V7] 클릭됨 (${clickResult.method}): ${clickResult.href?.substring(0, 60)}...`);

    // 6. 새 탭 대기 (target="_blank" 링크)
    try {
      productPage = await newTabPromise;
      console.log(`  [V7] 새 탭 열림!`);
      // 새 탭이 로드될 때까지 대기
      try {
        await productPage.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 });
      } catch {}
      await sleep(2000);  // 추가 로딩 대기
    } catch (e) {
      console.log(`  [V7] 새 탭 없음, 현재 페이지에서 진행`);
      productPage = page;
      try {
        await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 });
      } catch {}
      await sleep(3000);
    }

    // 7. Bridge URL 리다이렉트 대기 (V7 핵심!)
    const targetPage = productPage || page;
    let finalUrl = targetPage.url();
    const isBridgeUrl = (url: string) =>
      url.includes('/bridge') || url.includes('cr.shopping') ||
      url.includes('cr2.shopping') || url.includes('cr3.shopping');

    if (isBridgeUrl(finalUrl)) {
      console.log(`  [V7] Bridge URL 감지, 리다이렉트 대기...`);
      for (let i = 0; i < 10; i++) {
        await sleep(1000);
        finalUrl = targetPage.url();
        if (!isBridgeUrl(finalUrl)) {
          console.log(`  [V7] 리다이렉트 완료: ${finalUrl.substring(0, 60)}`);
          break;
        }
      }
    }

    // 8. 상품 페이지 검증
    const pageCheck = await targetPage.evaluate((targetMid: string) => {
      const bodyText = document.body.innerText || '';
      const url = window.location.href;

      // URL로 smartstore 상품 페이지인지 확인
      const isSmartStoreProduct = url.includes('smartstore.naver.com') && url.includes('/products/');

      // CAPTCHA 페이지 특징: 상품페이지가 아님 + 보안 관련 키워드
      // smartstore URL이면 일단 CAPTCHA가 아님으로 간주
      const hasCaptchaKeywords = (
        bodyText.includes('보안 확인') ||
        bodyText.includes('자동입력방지') ||
        bodyText.includes('영수증 번호') ||  // CAPTCHA 영수증 입력 폼
        (bodyText.includes('영수증') && bodyText.includes('4자리'))  // CAPTCHA 영수증 힌트
      );

      const isProductPage = bodyText.includes('구매하기') ||
                           bodyText.includes('장바구니') ||
                           bodyText.includes('찜하기');

      // smartstore 상품 URL이고 상품 페이지 요소가 있으면 CAPTCHA가 아님
      const isCaptchaPage = hasCaptchaKeywords && !isProductPage && !isSmartStoreProduct;

      return {
        hasCaptcha: isCaptchaPage,
        hasBlock: bodyText.includes('비정상적인 접근') ||
                 bodyText.includes('일시적으로 제한'),
        hasError: bodyText.includes('시스템오류') ||
                 document.title.includes('에러'),
        isProductPage: isProductPage || isSmartStoreProduct,  // URL 기반으로도 판정
        midInUrl: url.includes(targetMid),
        url: url.substring(0, 80),
        title: document.title.substring(0, 50)
      };
    }, product.mid);

    console.log(`  [V7] 최종 URL: ${pageCheck.url}`);
    console.log(`  [V7] 제목: ${pageCheck.title}`);

    if (pageCheck.hasCaptcha) {
      console.log(`  [V7] ⚠️ 상품페이지 CAPTCHA`);
      result.captchaDetected = true;
    } else if (pageCheck.hasBlock) {
      console.log(`  [V7] ❌ 차단됨`);
      result.error = "Blocked";
    } else if (pageCheck.hasError) {
      console.log(`  [V7] ❌ 에러 페이지`);
      result.error = "Error page";
    } else if (pageCheck.isProductPage) {
      console.log(`  [V7] ✅ 상품 페이지 진입 성공!`);
      result.productPageEntered = true;
    }

    result.midMatched = pageCheck.midInUrl;

    // 체류
    await sleep(2000);

    // 새 탭 닫기
    if (productPage && productPage !== page) {
      await productPage.close().catch(() => {});
    }

  } catch (e: any) {
    result.error = e.message;
  } finally {
    if (browser) await browser.close().catch(() => {});
    result.duration = Date.now() - startTime;
  }

  return result;
}

// ============ 메인 ============
async function main() {
  console.log("=".repeat(50));
  console.log("  PRB V7 Style 테스트 (CAPTCHA 최소화)");
  console.log("=".repeat(50));
  console.log("\n핵심 전략:");
  console.log("  - fingerprint: 비활성화 (PC 모드)");
  console.log("  - 검색: JS 이벤트 (form.submit)");
  console.log("  - 클릭: DOM 클릭 (마우스 아님)");
  console.log("  - 스크롤: 최소 3회");
  console.log("  - Bridge URL: 그냥 클릭 → 리다이렉트 대기");
  console.log("");

  const products = await fetchProducts();
  if (products.length < TEST_COUNT) {
    console.error(`상품 부족: ${products.length}개`);
    return;
  }

  console.log(`[1] ${products.length}개 상품 로드됨\n`);
  console.log("[2] V7 Style PRB 테스트 시작...\n");

  const results: TestResult[] = [];

  for (let i = 0; i < TEST_COUNT; i++) {
    console.log(`테스트 ${i + 1}/${TEST_COUNT}: ${products[i].product_name.substring(0, 35)}...`);
    const result = await runV7StyleTest(products[i], i + 1);
    results.push(result);

    const status = result.productPageEntered ? "✅" :
                   result.captchaDetected ? "⚠️ CAPTCHA" :
                   `❌ ${result.error}`;
    console.log(`  결과: ${status} | ${(result.duration / 1000).toFixed(1)}s\n`);

    await sleep(2000);
  }

  // 결과 요약
  console.log("\n" + "=".repeat(50));
  console.log("  V7 Style PRB 테스트 결과");
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
    console.log("\n🎉 V7 Style 성공! CAPTCHA 0%");
  } else if (captchaCount <= 2) {
    console.log("\n✅ V7 Style 효과적! CAPTCHA 최소화");
  } else {
    console.log("\n⚠️ 추가 최적화 필요");
  }
}

main().catch(console.error);
