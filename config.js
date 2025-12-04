"use strict";
/**
 * Auto-Updater 설정 모듈
 * 원격 PC에서 환경변수 또는 config.json으로 설정 로드
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
exports.createSampleConfig = createSampleConfig;
exports.printConfig = printConfig;
var os = __importStar(require("os"));
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var DEFAULT_CONFIG = {
    githubRawBase: 'https://raw.githubusercontent.com/mim1012/turafic_update/main',
    checkIntervalMs: 3 * 60 * 1000, // 3분
    localDir: 'C:\\turafic',
    files: ['experiment-runner.js', 'worker-runner.js', 'parallel-ip-rotation-playwright.ts', 'playwright-save-login.ts', 'playwright-real-traffic.ts', 'version.json'],
};
/**
 * 설정 로드 (환경변수 우선, config.json 폴백)
 */
function loadConfig() {
    // config.json 파일이 있으면 읽기
    var configPath = path.join(process.cwd(), 'config.json');
    var fileConfig = {};
    if (fs.existsSync(configPath)) {
        try {
            fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
            console.log('[Config] config.json 로드됨');
        }
        catch (e) {
            console.warn('[Config] config.json 파싱 실패, 환경변수 사용');
        }
    }
    // 환경변수가 우선
    var nodeType = (process.env.NODE_TYPE || fileConfig.nodeType || 'worker');
    var hostname = os.hostname().toLowerCase().replace(/[^a-z0-9]/g, '-');
    var config = {
        nodeType: nodeType,
        nodeId: process.env.NODE_ID || fileConfig.nodeId || "".concat(nodeType, "-").concat(hostname),
        databaseUrl: process.env.DATABASE_URL || fileConfig.databaseUrl || '',
        serverUrl: process.env.SERVER_URL || fileConfig.serverUrl,
        githubRawBase: process.env.GITHUB_RAW_BASE || fileConfig.githubRawBase || DEFAULT_CONFIG.githubRawBase,
        checkIntervalMs: parseInt(process.env.CHECK_INTERVAL_MS || '') || fileConfig.checkIntervalMs || DEFAULT_CONFIG.checkIntervalMs,
        localDir: process.env.LOCAL_DIR || fileConfig.localDir || DEFAULT_CONFIG.localDir,
        files: fileConfig.files || DEFAULT_CONFIG.files,
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
function createSampleConfig(targetDir) {
    var sampleConfig = {
        nodeType: 'playwright', // 'worker' | 'experiment' | 'playwright'
        nodeId: 'worker-pc-001',
        databaseUrl: 'postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres',
        serverUrl: 'http://admin-pc:5000',
        githubRawBase: DEFAULT_CONFIG.githubRawBase,
        checkIntervalMs: DEFAULT_CONFIG.checkIntervalMs,
        localDir: 'C:\\turafic',
        files: DEFAULT_CONFIG.files,
    };
    var configPath = path.join(targetDir, 'config.sample.json');
    fs.writeFileSync(configPath, JSON.stringify(sampleConfig, null, 2), 'utf-8');
    console.log("[Config] \uC0D8\uD50C \uC124\uC815 \uD30C\uC77C \uC0DD\uC131\uB428: ".concat(configPath));
}
/**
 * 설정 출력 (디버깅용)
 */
function printConfig(config) {
    console.log('\n========================================');
    console.log('  TURAFIC Auto-Updater 설정');
    console.log('========================================');
    console.log("  Node Type: ".concat(config.nodeType));
    console.log("  Node ID: ".concat(config.nodeId));
    console.log("  Database: ".concat(config.databaseUrl ? '설정됨' : '❌ 미설정'));
    console.log("  Server: ".concat(config.serverUrl || '미설정 (직접 DB 연결)'));
    console.log("  Update URL: ".concat(config.githubRawBase));
    console.log("  Check Interval: ".concat(config.checkIntervalMs / 1000, "\uCD08"));
    console.log("  Local Dir: ".concat(config.localDir));
    console.log('========================================\n');
}
