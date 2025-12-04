"use strict";
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var https = __importStar(require("https"));
var http = __importStar(require("http"));
var child_process_1 = require("child_process");
var config_1 = require("./config");
// dotenv 로드 (있으면)
try {
    require('dotenv').config();
}
catch (e) {
    // dotenv가 없어도 OK - 환경변수 직접 사용
}
var AutoUpdater = /** @class */ (function () {
    function AutoUpdater() {
        this.runnerProcess = null;
        this.localVersion = null;
        this.isUpdating = false;
        this.config = (0, config_1.loadConfig)();
    }
    /**
     * 메인 실행
     */
    AutoUpdater.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('\n🚀 TURAFIC Auto-Updater 시작\n');
                        (0, config_1.printConfig)(this.config);
                        // 로컬 디렉토리 생성
                        this.ensureLocalDir();
                        // 첫 샘플 config 생성 (없으면)
                        if (!fs.existsSync(path.join(this.config.localDir, 'config.json'))) {
                            (0, config_1.createSampleConfig)(this.config.localDir);
                        }
                        // 시작 시 즉시 업데이트 체크
                        console.log('[Updater] 초기 업데이트 체크...');
                        return [4 /*yield*/, this.checkAndUpdate()];
                    case 1:
                        _a.sent();
                        // Runner 실행
                        return [4 /*yield*/, this.startRunner()];
                    case 2:
                        // Runner 실행
                        _a.sent();
                        // 주기적 업데이트 체크 (Runner 실행 중에도)
                        console.log("[Updater] ".concat(this.config.checkIntervalMs / 1000, "\uCD08\uB9C8\uB2E4 \uC5C5\uB370\uC774\uD2B8 \uCCB4\uD06C \uC2DC\uC791"));
                        setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.checkAndUpdate()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); }, this.config.checkIntervalMs);
                        // 프로세스 종료 핸들링
                        this.setupGracefulShutdown();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 로컬 디렉토리 생성
     */
    AutoUpdater.prototype.ensureLocalDir = function () {
        if (!fs.existsSync(this.config.localDir)) {
            fs.mkdirSync(this.config.localDir, { recursive: true });
            console.log("[Updater] \uB85C\uCEEC \uB514\uB809\uD1A0\uB9AC \uC0DD\uC131: ".concat(this.config.localDir));
        }
    };
    /**
     * 원격 version.json과 비교 후 업데이트
     */
    AutoUpdater.prototype.checkAndUpdate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var remoteVersionUrl, remoteVersion, localVersionPath, _i, _a, file, fileUrl, localPath, error_1;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (this.isUpdating) {
                            console.log('[Updater] 이미 업데이트 중...');
                            return [2 /*return*/, false];
                        }
                        this.isUpdating = true;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 9, 10, 11]);
                        remoteVersionUrl = "".concat(this.config.githubRawBase, "/version.json");
                        return [4 /*yield*/, this.fetchJson(remoteVersionUrl)];
                    case 2:
                        remoteVersion = _c.sent();
                        if (!remoteVersion) {
                            console.log('[Updater] 원격 버전 정보 없음, 스킵');
                            return [2 /*return*/, false];
                        }
                        localVersionPath = path.join(this.config.localDir, 'version.json');
                        if (fs.existsSync(localVersionPath)) {
                            try {
                                this.localVersion = JSON.parse(fs.readFileSync(localVersionPath, 'utf-8'));
                            }
                            catch (e) {
                                this.localVersion = null;
                            }
                        }
                        // 3. 버전 비교
                        if (this.localVersion && this.localVersion.timestamp >= remoteVersion.timestamp) {
                            console.log("[Updater] \uCD5C\uC2E0 \uBC84\uC804 (".concat(this.localVersion.version, ")"));
                            return [2 /*return*/, false];
                        }
                        // 4. 업데이트 필요!
                        console.log("\n[Updater] \uD83D\uDD04 \uC0C8 \uBC84\uC804 \uBC1C\uACAC!");
                        console.log("  \uD604\uC7AC: ".concat(((_b = this.localVersion) === null || _b === void 0 ? void 0 : _b.version) || '없음'));
                        console.log("  \uCD5C\uC2E0: ".concat(remoteVersion.version, "\n"));
                        _i = 0, _a = this.config.files;
                        _c.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        file = _a[_i];
                        fileUrl = "".concat(this.config.githubRawBase, "/").concat(file);
                        localPath = path.join(this.config.localDir, file);
                        console.log("[Updater] \uB2E4\uC6B4\uB85C\uB4DC: ".concat(file));
                        return [4 /*yield*/, this.downloadFile(fileUrl, localPath)];
                    case 4:
                        _c.sent();
                        _c.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6:
                        // 6. 로컬 버전 정보 저장
                        fs.writeFileSync(localVersionPath, JSON.stringify(remoteVersion, null, 2));
                        this.localVersion = remoteVersion;
                        console.log('[Updater] ✅ 업데이트 완료!\n');
                        if (!this.runnerProcess) return [3 /*break*/, 8];
                        console.log('[Updater] Runner 재시작 중...');
                        return [4 /*yield*/, this.restartRunner()];
                    case 7:
                        _c.sent();
                        _c.label = 8;
                    case 8: return [2 /*return*/, true];
                    case 9:
                        error_1 = _c.sent();
                        console.error('[Updater] 업데이트 체크 실패:', error_1);
                        return [2 /*return*/, false];
                    case 10:
                        this.isUpdating = false;
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Runner 시작
     */
    AutoUpdater.prototype.startRunner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runnerFile, useNpxTsx, runnerPath, env;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        useNpxTsx = false;
                        // nodeType에 따라 실행할 파일 결정
                        if (this.config.nodeType === 'playwright') {
                            runnerFile = 'parallel-ip-rotation-playwright.ts';
                            useNpxTsx = true; // TypeScript 파일은 npx tsx로 실행
                        }
                        else if (this.config.nodeType === 'experiment') {
                            runnerFile = 'experiment-runner.js';
                        }
                        else {
                            runnerFile = 'worker-runner.js';
                        }
                        runnerPath = path.join(this.config.localDir, runnerFile);
                        if (!!fs.existsSync(runnerPath)) return [3 /*break*/, 2];
                        console.error("[Updater] Runner \uD30C\uC77C \uC5C6\uC74C: ".concat(runnerPath));
                        console.log('[Updater] 업데이트 후 다시 시도합니다...');
                        return [4 /*yield*/, this.checkAndUpdate()];
                    case 1:
                        _a.sent();
                        if (!fs.existsSync(runnerPath)) {
                            console.error('[Updater] ❌ Runner 다운로드 실패. GitHub 레포를 확인하세요.');
                            return [2 /*return*/];
                        }
                        _a.label = 2;
                    case 2:
                        console.log("\n[Updater] \uD83C\uDFC3 Runner \uC2DC\uC791: ".concat(runnerFile));
                        console.log("  Node Type: ".concat(this.config.nodeType));
                        console.log("  Node ID: ".concat(this.config.nodeId));
                        console.log("  Executor: ".concat(useNpxTsx ? 'npx tsx' : 'node', "\n"));
                        env = __assign(__assign({}, process.env), { NODE_TYPE: this.config.nodeType, NODE_ID: this.config.nodeId, DATABASE_URL: this.config.databaseUrl, SERVER_URL: this.config.serverUrl || '' });
                        // Playwright (TypeScript)는 npx tsx로 실행, 나머지는 node로 실행
                        if (useNpxTsx) {
                            this.runnerProcess = (0, child_process_1.spawn)('npx', ['tsx', runnerPath], {
                                cwd: this.config.localDir,
                                env: env,
                                stdio: 'inherit',
                                shell: true,
                            });
                        }
                        else {
                            this.runnerProcess = (0, child_process_1.spawn)('node', [runnerPath], {
                                cwd: this.config.localDir,
                                env: env,
                                stdio: 'inherit',
                            });
                        }
                        this.runnerProcess.on('exit', function (code) {
                            console.log("[Updater] Runner \uC885\uB8CC (code: ".concat(code, ")"));
                            _this.runnerProcess = null;
                            // 비정상 종료 시 재시작
                            if (code !== 0) {
                                console.log('[Updater] 5초 후 재시작...');
                                setTimeout(function () { return _this.startRunner(); }, 5000);
                            }
                        });
                        this.runnerProcess.on('error', function (error) {
                            console.error('[Updater] Runner 실행 오류:', error);
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Runner 재시작
     */
    AutoUpdater.prototype.restartRunner = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.runnerProcess) return [3 /*break*/, 1];
                        console.log('[Updater] 기존 Runner 종료 중...');
                        return [2 /*return*/, new Promise(function (resolve) {
                                _this.runnerProcess.once('exit', function () {
                                    console.log('[Updater] Runner 종료됨');
                                    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0: return [4 /*yield*/, this.startRunner()];
                                                case 1:
                                                    _a.sent();
                                                    resolve();
                                                    return [2 /*return*/];
                                            }
                                        });
                                    }); }, 1000);
                                });
                                // SIGTERM 전송
                                _this.runnerProcess.kill('SIGTERM');
                                // 5초 후 강제 종료
                                setTimeout(function () {
                                    if (_this.runnerProcess) {
                                        _this.runnerProcess.kill('SIGKILL');
                                    }
                                }, 5000);
                            })];
                    case 1: return [4 /*yield*/, this.startRunner()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * HTTP(S) JSON 가져오기
     */
    AutoUpdater.prototype.fetchJson = function (url) {
        return new Promise(function (resolve) {
            var client = url.startsWith('https') ? https : http;
            // 캐시 방지용 타임스탬프 추가
            var urlWithCache = "".concat(url, "?t=").concat(Date.now());
            client.get(urlWithCache, function (res) {
                if (res.statusCode !== 200) {
                    resolve(null);
                    return;
                }
                var data = '';
                res.on('data', function (chunk) { return (data += chunk); });
                res.on('end', function () {
                    try {
                        resolve(JSON.parse(data));
                    }
                    catch (e) {
                        resolve(null);
                    }
                });
            }).on('error', function () { return resolve(null); });
        });
    };
    /**
     * 파일 다운로드
     */
    AutoUpdater.prototype.downloadFile = function (url, dest) {
        return new Promise(function (resolve, reject) {
            var client = url.startsWith('https') ? https : http;
            var urlWithCache = "".concat(url, "?t=").concat(Date.now());
            // 임시 파일로 다운로드
            var tmpPath = "".concat(dest, ".tmp");
            var dir = path.dirname(dest);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            var file = fs.createWriteStream(tmpPath);
            client.get(urlWithCache, function (res) {
                if (res.statusCode !== 200) {
                    file.close();
                    fs.unlinkSync(tmpPath);
                    reject(new Error("HTTP ".concat(res.statusCode)));
                    return;
                }
                res.pipe(file);
                file.on('finish', function () {
                    file.close();
                    // 기존 파일 백업 후 교체
                    if (fs.existsSync(dest)) {
                        var backupPath = "".concat(dest, ".bak");
                        fs.copyFileSync(dest, backupPath);
                    }
                    fs.renameSync(tmpPath, dest);
                    resolve();
                });
            }).on('error', function (err) {
                file.close();
                if (fs.existsSync(tmpPath))
                    fs.unlinkSync(tmpPath);
                reject(err);
            });
        });
    };
    /**
     * 정상 종료 처리
     */
    AutoUpdater.prototype.setupGracefulShutdown = function () {
        var _this = this;
        var shutdown = function () {
            console.log('\n[Updater] 종료 중...');
            if (_this.runnerProcess) {
                _this.runnerProcess.kill('SIGTERM');
            }
            process.exit(0);
        };
        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    };
    return AutoUpdater;
}());
// 메인 실행
var updater = new AutoUpdater();
updater.run().catch(function (error) {
    console.error('[Updater] 치명적 오류:', error);
    process.exit(1);
});
