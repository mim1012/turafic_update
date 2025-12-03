#!/usr/bin/env npx tsx
/**
 * 네이버 로그인 세션 저장 스크립트
 *
 * 수동으로 네이버 로그인 후 세션을 login.json에 저장
 * 이후 playwright-real-traffic.ts에서 재사용
 *
 * 사용법: npx tsx scripts/playwright-save-login.ts
 */

import { chromium } from "playwright";
import * as path from "path";
import * as readline from "readline";

const LOGIN_STATE_PATH = path.join(process.cwd(), "login.json");

function askQuestion(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log("=".repeat(50));
  console.log("  네이버 로그인 세션 저장");
  console.log("=".repeat(50));
  console.log("");
  console.log("브라우저가 열리면:");
  console.log("  1. 네이버에 수동으로 로그인하세요");
  console.log("  2. 로그인 완료 후 이 터미널로 돌아와서 Enter 누르세요");
  console.log("");

  // 브라우저 실행
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"],
  });

  const context = await browser.newContext({
    viewport: null,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    locale: "ko-KR",
    timezoneId: "Asia/Seoul",
  });

  const page = await context.newPage();

  // 네이버 로그인 페이지로 이동
  await page.goto("https://nid.naver.com/nidlogin.login");

  console.log("브라우저에서 네이버 로그인을 완료하세요...");
  console.log("");

  // 사용자가 로그인할 때까지 대기
  await askQuestion("로그인 완료 후 Enter를 누르세요: ");

  // 로그인 상태 확인
  const currentUrl = page.url();
  console.log(`현재 URL: ${currentUrl}`);

  // 세션 저장
  await context.storageState({ path: LOGIN_STATE_PATH });
  console.log("");
  console.log(`✅ 로그인 세션 저장됨: ${LOGIN_STATE_PATH}`);
  console.log("");
  console.log("이제 트래픽 스크립트를 실행할 수 있습니다:");
  console.log("  npx tsx scripts/playwright-real-traffic.ts");

  await browser.close();
}

main().catch(console.error);
