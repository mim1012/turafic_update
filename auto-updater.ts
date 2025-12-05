/**
 * TURAFIC Auto-Updater
 *
 * 1000?€ PC????ë²ˆë§Œ ë°°í¬?˜ë©´, ?´í›„ ?ë™?¼ë¡œ ìµœì‹  Runnerë¥??¤ìš´ë¡œë“œ?˜ê³  ?¤í–‰?©ë‹ˆ??
 *
 * ?¬ìš©ë²?
 * 1. exeë¡?ë¹Œë“œ: npx pkg updater/auto-updater.ts -t node18-win-x64 -o turafic-updater.exe
 * 2. ?ê²© PC??ë°°í¬: turafic-updater.exe + .env ?Œì¼
 * 3. ?¤í–‰?˜ë©´ ?ë™?¼ë¡œ GitHub?ì„œ ìµœì‹  Runner ?¤ìš´ë¡œë“œ ???¤í–‰
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { loadConfig, printConfig, createSampleConfig, UpdaterConfig } from './config';

// dotenv ë¡œë“œ (?ˆìœ¼ë©?
try {
  require('dotenv').config();
} catch (e) {
  // dotenvê°€ ?†ì–´??OK - ?˜ê²½ë³€??ì§ì ‘ ?¬ìš©
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
   * ë©”ì¸ ?¤í–‰
   */
  async run(): Promise<void> {
    console.log('\n?? TURAFIC Auto-Updater ?œì‘\n');
    printConfig(this.config);

    // ë¡œì»¬ ?”ë ‰? ë¦¬ ?ì„±
    this.ensureLocalDir();

    // ì²??˜í”Œ config ?ì„± (?†ìœ¼ë©?
    if (!fs.existsSync(path.join(this.config.localDir, 'config.json'))) {
      createSampleConfig(this.config.localDir);
    }

    // ?œì‘ ??ì¦‰ì‹œ ?…ë°?´íŠ¸ ì²´í¬
    console.log('[Updater] ì´ˆê¸° ?…ë°?´íŠ¸ ì²´í¬...');
    await this.checkAndUpdate();

    // Runner ?¤í–‰
    await this.startRunner();

    // ì£¼ê¸°???…ë°?´íŠ¸ ì²´í¬ (Runner ?¤í–‰ ì¤‘ì—??
    console.log(`[Updater] ${this.config.checkIntervalMs / 1000}ì´ˆë§ˆ???…ë°?´íŠ¸ ì²´í¬ ?œì‘`);
    setInterval(async () => {
      await this.checkAndUpdate();
    }, this.config.checkIntervalMs);

    // ?„ë¡œ?¸ìŠ¤ ì¢…ë£Œ ?¸ë“¤ë§?    this.setupGracefulShutdown();
  }

  /**
   * ë¡œì»¬ ?”ë ‰? ë¦¬ ?ì„±
   */
  private ensureLocalDir(): void {
    if (!fs.existsSync(this.config.localDir)) {
      fs.mkdirSync(this.config.localDir, { recursive: true });
      console.log(`[Updater] ë¡œì»¬ ?”ë ‰? ë¦¬ ?ì„±: ${this.config.localDir}`);
    }
  }

  /**
   * ?ê²© version.jsonê³?ë¹„êµ ???…ë°?´íŠ¸
   */
  async checkAndUpdate(): Promise<boolean> {
    if (this.isUpdating) {
      console.log('[Updater] ?´ë? ?…ë°?´íŠ¸ ì¤?..');
      return false;
    }

    this.isUpdating = true;

    try {
      // 1. ?ê²© version.json ê°€?¸ì˜¤ê¸?      const remoteVersionUrl = `${this.config.githubRawBase}/version.json`;
      const remoteVersion = await this.fetchJson<VersionInfo>(remoteVersionUrl);

      if (!remoteVersion) {
        console.log('[Updater] ?ê²© ë²„ì „ ?•ë³´ ?†ìŒ, ?¤í‚µ');
        return false;
      }

      // 2. ë¡œì»¬ version.json ?½ê¸°
      const localVersionPath = path.join(this.config.localDir, 'version.json');
      if (fs.existsSync(localVersionPath)) {
        try {
          this.localVersion = JSON.parse(fs.readFileSync(localVersionPath, 'utf-8'));
        } catch (e) {
          this.localVersion = null;
        }
      }

      // 3. ë²„ì „ ë¹„êµ
      if (this.localVersion && this.localVersion.timestamp >= remoteVersion.timestamp) {
        console.log(`[Updater] ìµœì‹  ë²„ì „ (${this.localVersion.version})`);
        return false;
      }

      // 4. ?…ë°?´íŠ¸ ?„ìš”!
      console.log(`\n[Updater] ?”„ ??ë²„ì „ ë°œê²¬!`);
      console.log(`  ?„ì¬: ${this.localVersion?.version || '?†ìŒ'}`);
      console.log(`  ìµœì‹ : ${remoteVersion.version}\n`);

      // 5. ëª¨ë“  ?Œì¼ ?¤ìš´ë¡œë“œ
      for (const file of this.config.files) {
        const fileUrl = `${this.config.githubRawBase}/${file}`;
        const localPath = path.join(this.config.localDir, file);

        console.log(`[Updater] ?¤ìš´ë¡œë“œ: ${file}`);
        await this.downloadFile(fileUrl, localPath);
      }

      // 6. ë¡œì»¬ ë²„ì „ ?•ë³´ ?€??      fs.writeFileSync(localVersionPath, JSON.stringify(remoteVersion, null, 2));
      this.localVersion = remoteVersion;

      console.log('[Updater] ???…ë°?´íŠ¸ ?„ë£Œ!\n');

      // 7. Runner ?¬ì‹œ??(?¤í–‰ ì¤‘ì´ë©?
      if (this.runnerProcess) {
        console.log('[Updater] Runner ?¬ì‹œ??ì¤?..');
        await this.restartRunner();
      }

      return true;
    } catch (error) {
      console.error('[Updater] ?…ë°?´íŠ¸ ì²´í¬ ?¤íŒ¨:', error);
      return false;
    } finally {
      this.isUpdating = false;
    }
  }

  /**
   * Runner ?œì‘
   */
  private async startRunner(): Promise<void> {
    let runnerFile: string;
    let useNpxTsx = false;

    // nodeType???°ë¼ ?¤í–‰???Œì¼ ê²°ì •
    if (this.config.nodeType === 'prb') {
      runnerFile = 'unified-runner.ts';
      useNpxTsx = true;  // PRB (puppeteer-real-browser)
    } else if (this.config.nodeType === 'playwright') {
      runnerFile = 'parallel-ip-rotation-playwright.ts';
      useNpxTsx = true;  // TypeScript ?Œì¼?€ npx tsxë¡??¤í–‰
    } else if (this.config.nodeType === 'experiment') {
      runnerFile = 'experiment-runner.js';
    } else {
      runnerFile = 'worker-runner.js';
    }

    const runnerPath = path.join(this.config.localDir, runnerFile);

    if (!fs.existsSync(runnerPath)) {
      console.error(`[Updater] Runner ?Œì¼ ?†ìŒ: ${runnerPath}`);
      console.log('[Updater] ?…ë°?´íŠ¸ ???¤ì‹œ ?œë„?©ë‹ˆ??..');
      await this.checkAndUpdate();

      if (!fs.existsSync(runnerPath)) {
        console.error('[Updater] ??Runner ?¤ìš´ë¡œë“œ ?¤íŒ¨. GitHub ?ˆí¬ë¥??•ì¸?˜ì„¸??');
        return;
      }
    }

    console.log(`\n[Updater] ?ƒ Runner ?œì‘: ${runnerFile}`);
    console.log(`  Node Type: ${this.config.nodeType}`);
    console.log(`  Node ID: ${this.config.nodeId}`);
    console.log(`  Executor: ${useNpxTsx ? 'npx tsx' : 'node'}\n`);

    // ?˜ê²½ë³€???„ë‹¬
    const env = {
      ...process.env,
      NODE_TYPE: this.config.nodeType,
      NODE_ID: this.config.nodeId,
      DATABASE_URL: this.config.databaseUrl,
      SERVER_URL: this.config.serverUrl || '',
    };

    // Playwright (TypeScript)??npx tsxë¡??¤í–‰, ?˜ë¨¸ì§€??nodeë¡??¤í–‰
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
      console.log(`[Updater] Runner ì¢…ë£Œ (code: ${code})`);
      this.runnerProcess = null;

      // ë¹„ì •??ì¢…ë£Œ ???¬ì‹œ??      if (code !== 0) {
        console.log('[Updater] 5ì´????¬ì‹œ??..');
        setTimeout(() => this.startRunner(), 5000);
      }
    });

    this.runnerProcess.on('error', (error) => {
      console.error('[Updater] Runner ?¤í–‰ ?¤ë¥˜:', error);
    });
  }

  /**
   * Runner ?¬ì‹œ??   */
  private async restartRunner(): Promise<void> {
    if (this.runnerProcess) {
      console.log('[Updater] ê¸°ì¡´ Runner ì¢…ë£Œ ì¤?..');

      return new Promise((resolve) => {
        this.runnerProcess!.once('exit', () => {
          console.log('[Updater] Runner ì¢…ë£Œ??);
          setTimeout(async () => {
            await this.startRunner();
            resolve();
          }, 1000);
        });

        // SIGTERM ?„ì†¡
        this.runnerProcess!.kill('SIGTERM');

        // 5ì´???ê°•ì œ ì¢…ë£Œ
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
   * HTTP(S) JSON ê°€?¸ì˜¤ê¸?   */
  private fetchJson<T>(url: string): Promise<T | null> {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;

      // ìºì‹œ ë°©ì????€?„ìŠ¤?¬í”„ ì¶”ê?
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
   * ?Œì¼ ?¤ìš´ë¡œë“œ
   */
  private downloadFile(url: string, dest: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const client = url.startsWith('https') ? https : http;
      const urlWithCache = `${url}?t=${Date.now()}`;

      // ?„ì‹œ ?Œì¼ë¡??¤ìš´ë¡œë“œ
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
          // ê¸°ì¡´ ?Œì¼ ë°±ì—… ??êµì²´
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
   * ?•ìƒ ì¢…ë£Œ ì²˜ë¦¬
   */
  private setupGracefulShutdown(): void {
    const shutdown = () => {
      console.log('\n[Updater] ì¢…ë£Œ ì¤?..');
      if (this.runnerProcess) {
        this.runnerProcess.kill('SIGTERM');
      }
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }
}

// ë©”ì¸ ?¤í–‰
const updater = new AutoUpdater();
updater.run().catch((error) => {
  console.error('[Updater] ì¹˜ëª…???¤ë¥˜:', error);
  process.exit(1);
});

