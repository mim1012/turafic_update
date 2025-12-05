/**
 * V7 Engine - CAPTCHA 최소화 전략 (인간화 버전)
 *
 * 핵심 전략:
 * 1. fingerprint: false (PC 모드)
 * 2. 인간화 타이핑 (keydown 딜레이, 오타+백스페이스)
 * 3. 인간화 마우스 (move steps, down/up 분리)
 * 4. 최소 스크롤 (3번)
 * 5. Bridge URL 스킵, smartstore 직접 클릭만
 */

import type { Page, Browser } from "puppeteer-core";
import type { RunContext, EngineResult, Product } from "../runner/types";

// ============ 유틸리티 함수 ============

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// 30~60ms 랜덤 딜레이 (빠른 타이핑)
function randomKeyDelay(): number {
  return 30 + Math.random() * 30;
}

// 랜덤 범위
function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

// 상품명 단어 셔플
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

// ============ 인간화 함수들 ============

/**
 * 1) 빠른 타이핑 (30~60ms)
 * - 오타 시뮬레이션 제거
 * - focus() 후 250~600ms 기다리기
 */
async function humanizedType(page: Page, selector: string, text: string, ctx: RunContext): Promise<void> {
  ctx.log("human:type", { length: text.length });

  // focus 후 대기
  await page.click(selector);
  await sleep(randomBetween(250, 600));

  // 빠른 타이핑 (오타 없이)
  for (const char of text) {
    await page.keyboard.type(char, { delay: randomKeyDelay() });
  }
}

/**
 * 2) 마우스 클릭 (단순화)
 * - mouse.click() 사용 (down/up 분리 제거)
 */
async function humanizedClick(page: Page, selector: string, ctx: RunContext): Promise<void> {
  ctx.log("human:click", { selector: selector.substring(0, 30) });

  const element = await page.$(selector);
  if (!element) {
    throw new Error(`Element not found: ${selector}`);
  }

  const box = await element.boundingBox();
  if (!box) {
    throw new Error(`No bounding box: ${selector}`);
  }

  // 요소 중앙 + 약간의 랜덤 오프셋
  const targetX = box.x + box.width / 2 + randomBetween(-5, 5);
  const targetY = box.y + box.height / 2 + randomBetween(-3, 3);

  // 마우스 이동 후 클릭 (단순화)
  await page.mouse.move(targetX, targetY, { steps: Math.floor(randomBetween(8, 12)) });
  await sleep(randomBetween(30, 80));

  // mouse.click() 사용 (down/up 분리 제거)
  await page.mouse.click(targetX, targetY, { delay: randomBetween(30, 60) });
}

/**
 * 3) 요소 클릭 (단순화)
 * - 요소를 먼저 뷰포트에 스크롤
 * - mouse.click() 사용
 */
async function humanizedClickElement(page: Page, element: any, ctx: RunContext): Promise<void> {
  // 1. 먼저 요소를 뷰포트로 스크롤
  await element.scrollIntoViewIfNeeded();
  await sleep(randomBetween(200, 400));

  const box = await element.boundingBox();
  if (!box) {
    // fallback: DOM 클릭
    ctx.log("human:click:fallback", { reason: "no bounding box" });
    await element.click();
    return;
  }

  // 2. 뷰포트 확인 (화면 밖이면 fallback)
  const viewport = page.viewport();
  if (viewport && (box.y < 0 || box.y > viewport.height)) {
    ctx.log("human:click:fallback", { reason: "element outside viewport" });
    await element.click();
    return;
  }

  const targetX = box.x + box.width / 2 + randomBetween(-5, 5);
  const targetY = box.y + box.height / 2 + randomBetween(-3, 3);

  ctx.log("human:click:coords", { x: Math.round(targetX), y: Math.round(targetY) });

  // 3. 마우스 이동 후 클릭 (단순화)
  await page.mouse.move(targetX, targetY, { steps: Math.floor(randomBetween(8, 12)) });
  await sleep(randomBetween(50, 100));

  // mouse.click() 사용 (down/up 분리 제거)
  await page.mouse.click(targetX, targetY, { delay: randomBetween(30, 60) });
}

// ============ 메인 엔진 ============

export async function runV7Engine(
  page: Page,
  browser: Browser,
  product: Product,
  ctx: RunContext
): Promise<EngineResult> {
  const result: EngineResult = {
    success: false,
    captchaDetected: false,
    midMatched: false,
    productPageEntered: false,
    duration: 0,
    error: undefined
  };

  const startTime = Date.now();

  try {
    // 1. 네이버 메인
    ctx.log("engine:navigate", { url: "https://www.naver.com" });
    await page.goto("https://www.naver.com/", { waitUntil: "domcontentloaded" });

    // 4) 이미지 로딩 대기 (100~300ms)
    await sleep(randomBetween(100, 300));
    await sleep(1500 + Math.random() * 1000);

    // 2. 인간화 검색 입력
    const searchQuery = shuffleWords(product.product_name).substring(0, 50);
    ctx.log("engine:search", { query: searchQuery.substring(0, 30) });

    // 인간화 타이핑으로 검색어 입력
    await humanizedType(page, 'input[name="query"]', searchQuery, ctx);

    // 3) 제출 전 랜덤 지연 (300~900ms)
    await sleep(randomBetween(300, 900));

    // 엔터키로 검색 (form.submit 대신)
    await page.keyboard.press('Enter');

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
      ctx.log("engine:captcha", { stage: "search" });
      result.captchaDetected = true;
      result.error = "Search CAPTCHA";
      return result;
    }

    // 4. 스크롤 (3번) - 일반 scrollBy 사용
    ctx.log("behavior:scroll", { times: 3, amount: 400 });
    for (let s = 0; s < 3; s++) {
      const scrollAmount = 300 + Math.random() * 200;
      await page.evaluate((amt) => window.scrollBy(0, amt), scrollAmount);
      await sleep(randomBetween(400, 700));
    }

    // 5. 새 탭 핸들링 Promise 설정 (타임아웃 시 null 반환)
    let productPage: Page | null = null;
    const newTabPromise = new Promise<Page | null>((resolve) => {
      const timeout = setTimeout(() => {
        ctx.log("engine:newtab_timeout");
        resolve(null);  // 타임아웃 시 null 반환 (에러 대신)
      }, 15000);

      browser.once('targetcreated', async (target: any) => {
        clearTimeout(timeout);
        if (target.type() === 'page') {
          const newPage = await target.page();
          resolve(newPage as Page || null);
        } else {
          resolve(null);
        }
      });
    });

    // 6. 인간화 클릭 (smartstore 링크 찾기)
    ctx.log("engine:click", { method: "humanized", target: "smartstore" });

    // 링크 찾기
    const linkInfo = await page.evaluate((targetMid: string) => {
      const links = Array.from(document.querySelectorAll('a'));

      // 1차: MID 포함된 smartstore 직접 링크
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.href || '';
        if (href.includes('/bridge') || href.includes('cr.shopping') ||
            href.includes('cr2.shopping') || href.includes('cr3.shopping')) {
          continue;
        }
        if ((href.includes('smartstore.naver.com') || href.includes('brand.naver.com')) &&
            href.includes('/products/')) {
          if (href.includes(targetMid)) {
            return { found: true, index: i, href, method: 'direct-mid' };
          }
        }
      }

      // 2차: 아무 smartstore 링크
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.href || '';
        if (href.includes('/bridge') || href.includes('cr.shopping')) continue;
        if ((href.includes('smartstore.naver.com') || href.includes('brand.naver.com')) &&
            href.includes('/products/')) {
          return { found: true, index: i, href, method: 'any-smartstore' };
        }
      }

      // 3차: Bridge URL도 허용
      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const href = link.href || '';
        if (href.includes(targetMid)) {
          return { found: true, index: i, href, method: 'bridge-with-mid' };
        }
      }

      return { found: false };
    }, product.mid);

    if (!linkInfo.found) {
      result.error = "No product link found";
      ctx.log("engine:error", { error: result.error });
      return result;
    }

    // 인간화 클릭 실행
    const links = await page.$$('a');
    if (links[linkInfo.index!]) {
      await humanizedClickElement(page, links[linkInfo.index!], ctx);
    }

    ctx.log("engine:clicked", { method: linkInfo.method, href: linkInfo.href?.substring(0, 60) });

    // 7. 새 탭 대기 (타임아웃 시 현재 페이지 사용)
    productPage = await newTabPromise;

    if (productPage) {
      ctx.log("engine:newtab", { opened: true });
      try {
        await productPage.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 });
      } catch {}
      await sleep(2000);
    } else {
      ctx.log("engine:newtab", { opened: false, fallback: "current page" });
      productPage = page;
      try {
        await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15000 });
      } catch {}
      await sleep(3000);
    }

    // 8. Bridge URL 리다이렉트 대기
    const targetPage = productPage || page;
    let finalUrl = targetPage.url();
    const isBridgeUrl = (url: string) =>
      url.includes('/bridge') || url.includes('cr.shopping') ||
      url.includes('cr2.shopping') || url.includes('cr3.shopping');

    if (isBridgeUrl(finalUrl)) {
      ctx.log("engine:bridge", { waiting: true });
      for (let i = 0; i < 10; i++) {
        await sleep(1000);
        finalUrl = targetPage.url();
        if (!isBridgeUrl(finalUrl)) {
          ctx.log("engine:bridge", { redirected: true, url: finalUrl.substring(0, 60) });
          break;
        }
      }
    }

    // 9. 상품 페이지 검증
    const pageCheck = await targetPage.evaluate((targetMid: string) => {
      const bodyText = document.body.innerText || '';
      const url = window.location.href;

      const isSmartStoreProduct = url.includes('smartstore.naver.com') && url.includes('/products/');

      // 캡챠 키워드 감지 (더 강화)
      const hasCaptchaKeywords = (
        bodyText.includes('보안 확인') ||
        bodyText.includes('자동입력방지') ||
        bodyText.includes('영수증 번호') ||
        bodyText.includes('문자를 순서대로') ||
        bodyText.includes('자동 입력 방지') ||
        bodyText.includes('가게 전화번호') ||
        bodyText.includes('정답을 입력') ||
        bodyText.includes('캡차이미지') ||
        (bodyText.includes('영수증') && bodyText.includes('4자리'))
      );

      // 캡챠 이미지/입력 요소 존재 체크
      const hasCaptchaElements = !!(
        document.querySelector('img[src*="captcha"]') ||
        document.querySelector('input[name*="captcha"]') ||
        document.querySelector('.captcha') ||
        document.querySelector('#captcha') ||
        document.querySelector('#rcpt_form') ||
        document.querySelector('.captcha_wrap')
      );

      const isProductPage = bodyText.includes('구매하기') ||
                           bodyText.includes('장바구니') ||
                           bodyText.includes('찜하기');

      // 캡챠 감지: 키워드나 요소가 있으면 캡챠 (상품페이지 여부 무관)
      const isCaptchaPage = hasCaptchaKeywords || hasCaptchaElements;

      return {
        hasCaptcha: isCaptchaPage,
        hasBlock: bodyText.includes('비정상적인 접근') ||
                 bodyText.includes('일시적으로 제한'),
        hasError: bodyText.includes('시스템오류') ||
                 document.title.includes('에러'),
        // 캡챠가 없을때만 상품페이지로 인정
        isProductPage: !isCaptchaPage && (isProductPage || isSmartStoreProduct),
        midInUrl: url.includes(targetMid),
        url: url.substring(0, 80),
        title: document.title.substring(0, 50)
      };
    }, product.mid);

    ctx.log("verify:page", {
      url: pageCheck.url,
      isProduct: pageCheck.isProductPage,
      captcha: pageCheck.hasCaptcha
    });

    if (pageCheck.hasCaptcha) {
      ctx.log("verify:captcha", { detected: true });
      result.captchaDetected = true;
    } else if (pageCheck.hasBlock) {
      result.error = "Blocked";
      ctx.log("verify:blocked", { blocked: true });
    } else if (pageCheck.hasError) {
      result.error = "Error page";
      ctx.log("verify:error", { error: true });
    } else if (pageCheck.isProductPage) {
      ctx.log("verify:success", { productPage: true });
      result.productPageEntered = true;
      result.success = true;
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
    ctx.log("engine:exception", { error: e.message });
  } finally {
    result.duration = Date.now() - startTime;
  }

  return result;
}
