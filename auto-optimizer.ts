/**
 * Auto Optimizer Module
 *
 * PC 스펙 자동 감지 → 최적 브라우저/배치 설정 계산
 * 원격 PC 배포 시 환경변수 없이도 자동 최적화
 *
 * 주의: puppeteer-real-browser는 headful 모드만 사용 (봇 탐지 우회)
 *
 * Usage:
 *   import { getOptimalConfig, printSystemInfo } from './auto-optimizer';
 *   const config = getOptimalConfig();
 */

import os from "os";
import { fileURLToPath } from "url";
import path from "path";

// ============ 타입 ============
export interface SystemInfo {
  hostname: string;
  platform: string;
  totalMemGB: number;
  freeMemGB: number;
  usedMemGB: number;
  cpuCores: number;
  cpuModel: string;
  cpuSpeed: number;
}

export interface OptimalConfig {
  parallelCount: number;      // 동시 브라우저 수
  batchSize: number;          // 배치당 작업 수
  batchRestSec: number;       // 배치 간 휴식 (초)
  taskRestSec: number;        // 작업 간 휴식 (초)
  browserMemoryMB: number;    // 브라우저당 메모리
  systemInfo: SystemInfo;
}

// ============ 상수 ============
const BROWSER_MEMORY_MB = 600;        // headful 브라우저 메모리 (넉넉하게)
const MIN_FREE_MEMORY_GB = 2;         // 최소 확보 메모리
const SAFETY_MARGIN = 0.6;            // 안전 마진 60%
const MAX_BROWSERS_PER_CORE = 1.5;    // 코어당 브라우저 (headful은 무거움)
const MIN_PARALLEL = 1;
const MAX_PARALLEL = 15;              // headful 최대 제한

// ============ 시스템 정보 ============
export function getSystemInfo(): SystemInfo {
  const cpus = os.cpus();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();

  return {
    hostname: os.hostname(),
    platform: os.platform(),
    totalMemGB: Math.round((totalMem / (1024 ** 3)) * 100) / 100,
    freeMemGB: Math.round((freeMem / (1024 ** 3)) * 100) / 100,
    usedMemGB: Math.round(((totalMem - freeMem) / (1024 ** 3)) * 100) / 100,
    cpuCores: cpus.length,
    cpuModel: cpus[0]?.model || "Unknown",
    cpuSpeed: cpus[0]?.speed || 0,
  };
}

// ============ 최적 설정 계산 ============
export function getOptimalConfig(): OptimalConfig {
  const sysInfo = getSystemInfo();

  const browserMemGB = BROWSER_MEMORY_MB / 1024;

  // 사용 가능한 메모리
  const availableMemGB = Math.max(0, sysInfo.freeMemGB - MIN_FREE_MEMORY_GB);

  // RAM 기반 최대 브라우저
  const maxByMemory = Math.floor(availableMemGB / browserMemGB);

  // CPU 기반 최대 브라우저
  const maxByCPU = Math.floor(sysInfo.cpuCores * MAX_BROWSERS_PER_CORE);

  // 둘 중 작은 값 + 안전 마진
  const maxBrowsers = Math.min(maxByMemory, maxByCPU);
  let parallelCount = Math.floor(maxBrowsers * SAFETY_MARGIN);

  // 범위 제한
  parallelCount = Math.max(MIN_PARALLEL, Math.min(MAX_PARALLEL, parallelCount));

  // 배치 사이즈
  const batchSize = Math.max(10, parallelCount * 3);

  // 휴식 시간
  let batchRestSec = 60;
  let taskRestSec = 5;

  if (parallelCount >= 8) {
    batchRestSec = 90;
    taskRestSec = 3;
  } else if (parallelCount >= 5) {
    batchRestSec = 70;
    taskRestSec = 4;
  }

  return {
    parallelCount,
    batchSize,
    batchRestSec,
    taskRestSec,
    browserMemoryMB: BROWSER_MEMORY_MB,
    systemInfo: sysInfo,
  };
}

// ============ 출력 함수 ============
export function printSystemInfo(sysInfo?: SystemInfo): void {
  const info = sysInfo || getSystemInfo();

  console.log("========================================");
  console.log("  System Information");
  console.log("========================================");
  console.log(`  Hostname : ${info.hostname}`);
  console.log(`  Platform : ${info.platform}`);
  console.log(`  CPU      : ${info.cpuCores} cores`);
  console.log(`  RAM Total: ${info.totalMemGB.toFixed(1)}GB`);
  console.log(`  RAM Free : ${info.freeMemGB.toFixed(1)}GB`);
}

export function printOptimalConfig(config?: OptimalConfig): void {
  const cfg = config || getOptimalConfig();

  console.log("========================================");
  console.log("  Auto-Optimized Configuration");
  console.log("========================================");
  console.log(`  Parallel Browsers : ${cfg.parallelCount}`);
  console.log(`  Batch Size        : ${cfg.batchSize}`);
  console.log(`  Batch Rest        : ${cfg.batchRestSec}s`);
  console.log(`  Task Rest         : ${cfg.taskRestSec}s`);
}

// ============ 환경변수 오버라이드 ============
export function getConfigWithEnvOverride(): OptimalConfig {
  const autoConfig = getOptimalConfig();

  return {
    ...autoConfig,
    parallelCount: process.env.PARALLEL_COUNT
      ? parseInt(process.env.PARALLEL_COUNT)
      : autoConfig.parallelCount,
    batchSize: process.env.BATCH_SIZE
      ? parseInt(process.env.BATCH_SIZE)
      : autoConfig.batchSize,
    batchRestSec: process.env.BATCH_REST
      ? parseInt(process.env.BATCH_REST)
      : autoConfig.batchRestSec,
    taskRestSec: process.env.TASK_REST
      ? parseInt(process.env.TASK_REST)
      : autoConfig.taskRestSec,
  };
}

// ============ CLI 실행 ============
// 직접 실행 시: npx tsx auto-optimizer.ts
// CJS 번들링 호환을 위해 import.meta.url 대신 다른 방식 사용
function isMainModule(): boolean {
  try {
    // ESM 환경
    if (typeof import.meta !== 'undefined' && import.meta.url) {
      const __filename = fileURLToPath(import.meta.url);
      return process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename);
    }
  } catch {}

  // CJS 환경 또는 번들된 환경에서는 CLI 감지 비활성화
  return false;
}

if (isMainModule()) {
  console.log("");
  printSystemInfo();
  console.log("");
  printOptimalConfig();
  console.log("");
}
