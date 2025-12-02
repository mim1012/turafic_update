/**
 * Auto-Updater 설정 모듈
 * 원격 PC에서 환경변수 또는 config.json으로 설정 로드
 */

import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

export type NodeType = 'experiment' | 'worker';

export interface UpdaterConfig {
  // 노드 정보
  nodeType: NodeType;
  nodeId: string;

  // 데이터베이스
  databaseUrl: string;

  // 서버 (optional - tRPC 사용 시)
  serverUrl?: string;

  // 업데이트 설정
  githubRawBase: string;
  checkIntervalMs: number;
  localDir: string;

  // 파일 목록
  files: string[];
}

const DEFAULT_CONFIG: Partial<UpdaterConfig> = {
  githubRawBase: 'https://raw.githubusercontent.com/mim1012/turafic_update/main',
  checkIntervalMs: 3 * 60 * 1000, // 3분
  localDir: 'C:\\turafic-runner',
  files: ['experiment-runner.js', 'worker-runner.js', 'version.json'],
};

/**
 * 설정 로드 (환경변수 우선, config.json 폴백)
 */
export function loadConfig(): UpdaterConfig {
  // config.json 파일이 있으면 읽기
  const configPath = path.join(process.cwd(), 'config.json');
  let fileConfig: Partial<UpdaterConfig> = {};

  if (fs.existsSync(configPath)) {
    try {
      fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      console.log('[Config] config.json 로드됨');
    } catch (e) {
      console.warn('[Config] config.json 파싱 실패, 환경변수 사용');
    }
  }

  // 환경변수가 우선
  const nodeType = (process.env.NODE_TYPE || fileConfig.nodeType || 'worker') as NodeType;
  const hostname = os.hostname().toLowerCase().replace(/[^a-z0-9]/g, '-');

  const config: UpdaterConfig = {
    nodeType,
    nodeId: process.env.NODE_ID || fileConfig.nodeId || `${nodeType}-${hostname}`,
    databaseUrl: process.env.DATABASE_URL || fileConfig.databaseUrl || '',
    serverUrl: process.env.SERVER_URL || fileConfig.serverUrl,
    githubRawBase: process.env.GITHUB_RAW_BASE || fileConfig.githubRawBase || DEFAULT_CONFIG.githubRawBase!,
    checkIntervalMs: parseInt(process.env.CHECK_INTERVAL_MS || '') || fileConfig.checkIntervalMs || DEFAULT_CONFIG.checkIntervalMs!,
    localDir: process.env.LOCAL_DIR || fileConfig.localDir || DEFAULT_CONFIG.localDir!,
    files: fileConfig.files || DEFAULT_CONFIG.files!,
  };

  // 필수값 검증
  if (!config.databaseUrl) {
    console.error('[Config] DATABASE_URL이 설정되지 않았습니다!');
    console.error('환경변수 또는 config.json에 DATABASE_URL을 설정해주세요.');
  }

  return config;
}

/**
 * 샘플 config.json 생성 (첫 실행 시)
 */
export function createSampleConfig(targetDir: string): void {
  const sampleConfig = {
    nodeType: 'worker',
    nodeId: 'worker-pc-001',
    databaseUrl: 'postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres',
    serverUrl: 'http://admin-pc:5000',
    githubRawBase: DEFAULT_CONFIG.githubRawBase,
    checkIntervalMs: DEFAULT_CONFIG.checkIntervalMs,
    localDir: DEFAULT_CONFIG.localDir,
    files: DEFAULT_CONFIG.files,
  };

  const configPath = path.join(targetDir, 'config.sample.json');
  fs.writeFileSync(configPath, JSON.stringify(sampleConfig, null, 2), 'utf-8');
  console.log(`[Config] 샘플 설정 파일 생성됨: ${configPath}`);
}

/**
 * 설정 출력 (디버깅용)
 */
export function printConfig(config: UpdaterConfig): void {
  console.log('\n========================================');
  console.log('  TURAFIC Auto-Updater 설정');
  console.log('========================================');
  console.log(`  Node Type: ${config.nodeType}`);
  console.log(`  Node ID: ${config.nodeId}`);
  console.log(`  Database: ${config.databaseUrl ? '설정됨' : '❌ 미설정'}`);
  console.log(`  Server: ${config.serverUrl || '미설정 (직접 DB 연결)'}`);
  console.log(`  Update URL: ${config.githubRawBase}`);
  console.log(`  Check Interval: ${config.checkIntervalMs / 1000}초`);
  console.log(`  Local Dir: ${config.localDir}`);
  console.log('========================================\n');
}
