#!/usr/bin/env npx tsx
/**
 * 네이버 계정 로그인 세션 저장
 *
 * 사용법:
 *   npx tsx save-account.ts --name account1
 *   npx tsx save-account.ts --name myshop
 *
 * 브라우저가 열리면:
 *   1. 네이버 로그인 진행
 *   2. 로그인 완료 후 콘솔에서 Enter 키
 *   3. accounts/{name}.json 으로 세션 저장됨
 */

import * as fs from "fs";
import * as path from "path";
import { chromium } from "playwright";

const ACCOUNTS_DIR = path.join(process.cwd(), "accounts");

// 명령행 인자 파싱
function parseArgs(): { name: string } {
  const args = process.argv.slice(2);
  let name = "account1";

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--name" && args[i + 1]) {
      name = args[i + 1];
    }
  }

  return { name };
}

async function main() {
  const { name } = parseArgs();

  console.log("=".repeat(50));
  console.log("  네이버 계정 로그인 세션 저장");
  console.log("=".repeat(50));
  console.log(`계정 이름: ${name}`);
  console.log("");

  // accounts 폴더 생성
  if (!fs.existsSync(ACCOUNTS_DIR)) {
    fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });
    console.log(`[INFO] Created accounts directory: ${ACCOUNTS_DIR}`);
  }

  const outputPath = path.join(ACCOUNTS_DIR, `${name}.json`);

  // 기존 파일 확인
  if (fs.existsSync(outputPath)) {
    console.log(`[WARN] ${outputPath} already exists. Will be overwritten.`);
  }

  // 브라우저 실행
  console.log("\n[INFO] 브라우저를 시작합니다...");

  const browser = await chromium.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    locale: "ko-KR",
  });

  const page = await context.newPage();

  // 네이버 로그인 페이지
  await page.goto("https://nid.naver.com/nidlogin.login");

  console.log("\n" + "=".repeat(50));
  console.log("  브라우저에서 네이버 로그인을 진행하세요!");
  console.log("  로그인 완료 후 이 창에서 Enter 키를 누르세요.");
  console.log("=".repeat(50));

  // Enter 키 대기
  await waitForEnter();

  // 현재 URL 확인
  const currentUrl = page.url();
  console.log(`\n[INFO] Current URL: ${currentUrl}`);

  // 로그인 상태 확인
  const isLoggedIn = await page.evaluate(() => {
    // 네이버 메인에서 로그인 상태 확인
    const loginBtn = document.querySelector('.MyView-module__btn_logout___bsTOJ');
    const myMenu = document.querySelector('[class*="MyView"]');
    return !!loginBtn || !!myMenu || document.cookie.includes("NID_AUT");
  });

  if (!isLoggedIn && !currentUrl.includes("naver.com")) {
    console.log("[WARN] 로그인 상태를 확인할 수 없습니다.");
    console.log("[WARN] 계속 저장하시겠습니까? (Enter)");
    await waitForEnter();
  }

  // storageState 저장
  console.log("\n[INFO] 세션 저장 중...");
  await context.storageState({ path: outputPath });

  console.log(`\n[SUCCESS] 세션이 저장되었습니다!`);
  console.log(`파일 경로: ${outputPath}`);

  // 쿠키 정보 출력
  const cookies = await context.cookies();
  const naverCookies = cookies.filter(c => c.domain.includes("naver.com"));
  console.log(`\n[INFO] 저장된 네이버 쿠키: ${naverCookies.length}개`);

  // 브라우저 종료
  await context.close();
  await browser.close();

  console.log("\n[INFO] 완료!");
  console.log(`\n사용 예시:`);
  console.log(`  unified-runner.ts에서 자동으로 accounts/*.json 을 로드합니다.`);
}

function waitForEnter(): Promise<void> {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setRawMode?.(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (key: string) => {
      if (key === "\r" || key === "\n" || key === "\u0003") {
        stdin.removeListener("data", onData);
        stdin.setRawMode?.(false);
        resolve();
      }
    };

    stdin.on("data", onData);
  });
}

main().catch(console.error);
