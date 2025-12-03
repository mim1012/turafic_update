/**
 * TURAFIC Auto-Updater
 *
 * 1000대 PC에 한 번만 배포하면, 이후 자동으로 최신 Runner를 다운로드하고 실행합니다.
 *
 * 사용법:
 * 1. exe로 빌드: npx pkg updater/auto-updater.ts -t node18-win-x64 -o turafic-updater.exe
 * 2. 원격 PC에 배포: turafic-updater.exe + .env 파일
 * 3. 실행하면 자동으로 GitHub에서 최신 Runner 다운로드 후 실행
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { loadConfig, printConfig, createSampleConfig, UpdaterConfig } from './config';

// dotenv 로드 (있으면)
try {
  require('dotenv').config();
} catch (e) {
  // dotenv가 없어도 OK - 환경변수 직접 사용
}

interface VersionInfo {
  version: string;
  timestamp: number;
  hash?: string;
  files?: Record<string, string>;
}

class AutoUpdater {
  private config: UpdaterConfig;
  private runnerProcess: ChildProcess | null = null;
  private localVersion: VersionInfo | null = null;
  private isUpdating = false;

  constructor() {
    this.config = loadConfig();
  }

  /**
   * 메인 실행
   */
  async run(): Promise<void> {
    console.log('\n🚀 TURAFIC Auto-Updater 시작\n');
    printConfig(this.config);

    // 로컬 디렉토리 생성
    this.ensureLocalDir();

    // 첫 샘플 config 생성 (없으면)
    if (!fs.existsSync(path.join(this.config.localDir, 'config.json'))) {
      createSampleConfig(this.config.localDir);
    }

    // 시작 시 즉시 업데이트 체크
    console.log('[Updater] 초기 업데이트 체크...');
    await this.checkAndUpdate();

    // Runner 실행
    await this.startRunner();

    // 주기적 업데이트 체크 (Runner 실행 중에도)
    console.log(`[Updater] ${this.config.checkIntervalMs / 1000}초마다 업데이트 체크 시작`);
    setInterval(async () => {
      await this.checkAndUpdate();
    }, this.config.checkIntervalMs);

    // 프로세스 종료 핸들링
    this.setupGracefulShutdown();
  }

  /**
   * 로컬 디렉토리 생성
   */
  private ensureLocalDir(): void {
    if (!fs.existsSync(this.config.localDir)) {
      fs.mkdirSync(this.config.localDir, { recursive: true });
      console.log(`[Updater] 로컬 디렉토리 생성: ${this.config.localDir}`);
    }
  }

  /**
   * 원격 version.json과 비교 후 업데이트
   */
  async checkAndUpdate(): Promise<boolean> {
    if (this.isUpdating) {
      console.log('[Updater] 이미 업데이트 중...');
      return false;
    }

    this.isUpdating = true;

    try {
      // 1. 원격 version.json 가져오기
      const remoteVersionUrl = `${this.config.githubRawBase}/version.json`;
      const remoteVersion = await this.fetchJson<VersionInfo>(remoteVersionUrl);

      if (!remoteVersion) {
        console.log('[Updater] 원격 버전 정보 없음, 스킵');
        return false;
      }

      // 2. 로컬 version.json 읽기
      const localVersionPath = path.join(this.config.localDir, 'version.json');
      if (fs.existsSync(localVersionPath)) {
        try {
          this.localVersion = JSON.parse(fs.readFileSync(localVersionPath, 'utf-8'));
        } catch (e) {
          this.localVersion = null;
        }
      }

      // 3. 버전 비교
      if (this.localVersion && this.localVersion.timestamp >= remoteVersion.timestamp) {
        console.log(`[Updater] 최신 버전 (${this.localVersion.version})`);
        return false;
      }

      // 4. 업데이트 필요!
      console.log(`\n[Updater] 🔄 새 버전 발견!`);
      console.log(`  현재: ${this.localVersion?.version || '없음'}`);
      console.log(`  최신: ${remoteVersion.version}\n`);

      // 5. 모든 파일 다운로드
      for (const file of this.config.files) {
        const fileUrl = `${this.config.githubRawBase}/${file}`;
        const localPath = path.join(this.config.localDir, file);

        console.log(`[Updater] 다운로드: ${file}`);
        await this.downloadFile(fileUrl, localPath);
      }

      // 6. 로컬 버전 정보 저장
      fs.writeFileSync(localVersionPath, JSON.stringify(remoteVersion, null, 2));
      this.localVersion = remoteVersion;

      console.log('[Updater] ✅ 업데이트 완료!\n');

      // 7. Runner 재시작 (실행 중이면)
      if (this.runnerProcess) {
        console.log('[Updater] Runner 재시작 중...');
        await this.restartRunner();
      }

      return true;
    } catch (error) {
      console.error('[Updater] 업데이트 체크 실패:', error);
      return false;
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Runner 시작
   */
  private async startRunner(): Promise<void> {
    let runnerFile: string;
    let useNpxTsx = false;

    // nodeType에 따라 실행할 파일 결정
    if (this.config.nodeType === 'playwright') {
      runnerFile = 'parallel-ip-rotation-playwright.ts';
      useNpxTsx = true;  // TypeScript 파일은 npx tsx로 실행
    } else if (this.config.nodeType === 'experiment') {
      runnerFile = 'experiment-runner.js';
    } else {
      runnerFile = 'worker-runner.js';
    }

    const runnerPath = path.join(this.config.localDir, runnerFile);

    if (!fs.existsSync(runnerPath)) {
      console.error(`[Updater] Runner 파일 없음: ${runnerPath}`);
      console.log('[Updater] 업데이트 후 다시 시도합니다...');
      await this.checkAndUpdate();

      if (!fs.existsSync(runnerPath)) {
        console.error('[Updater] ❌ Runner 다운로드 실패. GitHub 레포를 확인하세요.');
        return;
      }
    }

    console.log(`\n[Updater] 🏃 Runner 시작: ${runnerFile}`);
    console.log(`  Node Type: ${this.config.nodeType}`);
    console.log(`  Node ID: ${this.config.nodeId}`);
    console.log(`  Executor: ${useNpxTsx ? 'npx tsx' : 'node'}\n`);

    // 환경변수 전달
    const env = {
      ...process.env,
      NODE_TYPE: this.config.nodeType,
      NODE_ID: this.config.nodeId,
      DATABASE_URL: this.config.databaseUrl,
      SERVER_URL: this.config.serverUrl || '',
    };

    // Playwright (TypeScript)는 npx tsx로 실행, 나머지는 node로 실행
    if (useNpxTsx) {
      this.runnerProcess = spawn('npx', ['tsx', runnerPath], {
        cwd: this.config.localDir,
        env,
        stdio: 'inherit',
        shell: true,
      });
    } else {
      this.runnerProcess = spawn('node', [runnerPath], {
        cwd: this.config.localDir,
        env,
        stdio: 'inherit',
      });
    }

    this.runnerProcess.on('exit', (code) => {
      console.log(`[Updater] Runner 종료 (code: ${code})`);
      this.runnerProcess = null;

      // 비정상 종료 시 재시작
      if (code !== 0) {
        console.log('[Updater] 5초 후 재시작...');
        setTimeout(() => this.startRunner(), 5000);
      }
    });

    this.runnerProcess.on('error', (error) => {
      console.error('[Updater] Runner 실행 오류:', error);
    });
  }

  /**
   * Runner 재시작
   */
  private async restartRunner(): Promise<void> {
    if (this.runnerProcess) {
      console.log('[Updater] 기존 Runner 종료 중...');

      return new Promise((resolve) => {
        this.runnerProcess!.once('exit', () => {
          console.log('[Updater] Runner 종료됨');
          setTimeout(async () => {
            await this.startRunner();
            resolve();
          }, 1000);
        });

        // SIGTERM 전송
        this.runnerProcess!.kill('SIGTERM');

        // 5초 후 강제 종료
        setTimeout(() => {
          if (this.runnerProcess) {
            this.runnerProcess.kill('SIGKILL');
          }
        }, 5000);
      });
    } else {
      await this.startRunner();
    }
  }

  /**
   * HTTP(S) JSON 가져오기
   */
  private fetchJson<T>(url: string): Promise<T | null> {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;

      // 캐시 방지용 타임스탬프 추가
      const urlWithCache = `${url}?t=${Date.now()}`;

      client.get(urlWithCache, (res) => {
        if (res.statusCode !== 200) {
          resolve(null);
          return;
        }

        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(null);
          }
        });
      }).on('error', () => resolve(null));
    });
  }

  /**
   * 파일 다운로드
   */
  private downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const urlWithCache = `${url}?t=${Date.now()}`;

      // 임시 파일로 다운로드
      const tmpPath = `${dest}.tmp`;
      const dir = path.dirname(dest);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const file = fs.createWriteStream(tmpPath);

      client.get(urlWithCache, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(tmpPath);
          reject(new Error(`HTTP ${res.statusCode}`));
          return;
        }

        res.pipe(file);
        file.on('finish', () => {
          file.close();
          // 기존 파일 백업 후 교체
          if (fs.existsSync(dest)) {
            const backupPath = `${dest}.bak`;
            fs.copyFileSync(dest, backupPath);
          }
          fs.renameSync(tmpPath, dest);
          resolve();
        });
      }).on('error', (err) => {
        file.close();
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
        reject(err);
      });
    });
  }

  /**
   * 정상 종료 처리
   */
  private setupGracefulShutdown(): void {
    const shutdown = () => {
      console.log('\n[Updater] 종료 중...');
      if (this.runnerProcess) {
        this.runnerProcess.kill('SIGTERM');
      }
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}

// 메인 실행
const updater = new AutoUpdater();
updater.run().catch((error) => {
  console.error('[Updater] 치명적 오류:', error);
  process.exit(1);
});
