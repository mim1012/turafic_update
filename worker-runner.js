var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "16.6.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs2 = require("fs");
    var path2 = require("path");
    var os3 = require("os");
    var crypto = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.log(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _log(message) {
      console.log(`[dotenv@${version}] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs2.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os3.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (debug || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      const debug = Boolean(options && options.debug);
      const quiet = options && "quiet" in options ? options.quiet : true;
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs2.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsedAll, options);
      if (debug || !quiet) {
        const keysCount = Object.keys(parsedAll).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path2.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`Failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
        }
      }
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module2.exports.configDotenv = DotenvModule.configDotenv;
    module2.exports._configVault = DotenvModule._configVault;
    module2.exports._parseVault = DotenvModule._parseVault;
    module2.exports.config = DotenvModule.config;
    module2.exports.decrypt = DotenvModule.decrypt;
    module2.exports.parse = DotenvModule.parse;
    module2.exports.populate = DotenvModule.populate;
    module2.exports = DotenvModule;
  }
});

// unified-runner.ts
var dotenv = __toESM(require_main());
var import_os2 = __toESM(require("os"));
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var import_playwright = require("playwright");
var import_supabase_js = require("@supabase/supabase-js");

// auto-optimizer.ts
var import_os = __toESM(require("os"));
var BROWSER_MEMORY_MB = 600;
var MIN_FREE_MEMORY_GB = 2;
var SAFETY_MARGIN = 0.6;
var MAX_BROWSERS_PER_CORE = 1.5;
var MIN_PARALLEL = 1;
var MAX_PARALLEL = 15;
function getSystemInfo() {
  const cpus = import_os.default.cpus();
  const totalMem = import_os.default.totalmem();
  const freeMem = import_os.default.freemem();
  return {
    hostname: import_os.default.hostname(),
    platform: import_os.default.platform(),
    totalMemGB: Math.round(totalMem / 1024 ** 3 * 100) / 100,
    freeMemGB: Math.round(freeMem / 1024 ** 3 * 100) / 100,
    usedMemGB: Math.round((totalMem - freeMem) / 1024 ** 3 * 100) / 100,
    cpuCores: cpus.length,
    cpuModel: cpus[0]?.model || "Unknown",
    cpuSpeed: cpus[0]?.speed || 0
  };
}
function getOptimalConfig() {
  const sysInfo = getSystemInfo();
  const browserMemGB = BROWSER_MEMORY_MB / 1024;
  const availableMemGB = Math.max(0, sysInfo.freeMemGB - MIN_FREE_MEMORY_GB);
  const maxByMemory = Math.floor(availableMemGB / browserMemGB);
  const maxByCPU = Math.floor(sysInfo.cpuCores * MAX_BROWSERS_PER_CORE);
  const maxBrowsers = Math.min(maxByMemory, maxByCPU);
  let parallelCount = Math.floor(maxBrowsers * SAFETY_MARGIN);
  parallelCount = Math.max(MIN_PARALLEL, Math.min(MAX_PARALLEL, parallelCount));
  const batchSize = Math.max(10, parallelCount * 3);
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
    systemInfo: sysInfo
  };
}
function printSystemInfo(sysInfo) {
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
function printOptimalConfig(config2) {
  const cfg = config2 || getOptimalConfig();
  console.log("========================================");
  console.log("  Auto-Optimized Configuration");
  console.log("========================================");
  console.log(`  Parallel Browsers : ${cfg.parallelCount}`);
  console.log(`  Batch Size        : ${cfg.batchSize}`);
  console.log(`  Batch Rest        : ${cfg.batchRestSec}s`);
  console.log(`  Task Rest         : ${cfg.taskRestSec}s`);
}
function getConfigWithEnvOverride() {
  const autoConfig2 = getOptimalConfig();
  return {
    ...autoConfig2,
    parallelCount: process.env.PARALLEL_COUNT ? parseInt(process.env.PARALLEL_COUNT) : autoConfig2.parallelCount,
    batchSize: process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : autoConfig2.batchSize,
    batchRestSec: process.env.BATCH_REST ? parseInt(process.env.BATCH_REST) : autoConfig2.batchRestSec,
    taskRestSec: process.env.TASK_REST ? parseInt(process.env.TASK_REST) : autoConfig2.taskRestSec
  };
}

// ReceiptCaptchaSolver.ts
var import_sdk = __toESM(require("@anthropic-ai/sdk"));
var ReceiptCaptchaSolver = class {
  anthropic;
  maxRetries = 2;
  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.warn(
        "[CaptchaSolver] ANTHROPIC_API_KEY not set - CAPTCHA solving disabled"
      );
    }
    this.anthropic = new import_sdk.default({
      apiKey: apiKey || "dummy-key"
    });
  }
  /**
   * CAPTCHA 해결 시도
   * @returns true if solved, false if failed or no CAPTCHA
   */
  async solve(page) {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.log("[CaptchaSolver] API key not configured, skipping");
      return false;
    }
    const hasSecurityPage = await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      return bodyText.includes("\uBCF4\uC548 \uD655\uC778") || bodyText.includes("\uC601\uC218\uC99D");
    });
    if (hasSecurityPage) {
      console.log("[CaptchaSolver] \uBCF4\uC548 \uD655\uC778 \uD398\uC774\uC9C0 \uAC10\uC9C0\uB428 - CAPTCHA \uC9C8\uBB38 \uB300\uAE30 \uC911...");
      for (let i = 0; i < 10; i++) {
        const hasQuestion = await page.evaluate(() => {
          const bodyText = document.body.innerText || "";
          return bodyText.includes("\uBB34\uC5C7\uC785\uB2C8\uAE4C") || bodyText.includes("[?]") || bodyText.includes("\uBC88\uC9F8 \uC22B\uC790") || bodyText.includes("\uBC88\uC9F8 \uAE00\uC790") || bodyText.includes("\uBE48 \uCE78");
        });
        if (hasQuestion) {
          console.log("[CaptchaSolver] CAPTCHA \uC9C8\uBB38 \uAC10\uC9C0\uB428!");
          break;
        }
        await this.delay(1e3);
        console.log(`[CaptchaSolver] \uC9C8\uBB38 \uB300\uAE30 \uC911... (${i + 1}/10)`);
      }
    }
    const captchaInfo = await this.detectCaptcha(page);
    console.log("[CaptchaSolver] detectCaptcha result:", JSON.stringify(captchaInfo));
    if (!captchaInfo.detected) {
      console.log("[CaptchaSolver] \uC601\uC218\uC99D CAPTCHA \uC544\uB2D8 - \uB2E4\uB978 \uC720\uD615\uC758 \uBCF4\uC548 \uD398\uC774\uC9C0");
      return false;
    }
    console.log("[CaptchaSolver] \uC601\uC218\uC99D CAPTCHA \uAC10\uC9C0\uB428");
    console.log(`[CaptchaSolver] \uC9C8\uBB38: ${captchaInfo.question}`);
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        console.log(`[CaptchaSolver] \uD574\uACB0 \uC2DC\uB3C4 ${attempt}/${this.maxRetries}`);
        const receiptImage = await this.captureReceiptImage(page);
        const answer = await this.askClaudeVision(
          receiptImage,
          captchaInfo.question
        );
        console.log(`[CaptchaSolver] Claude \uC751\uB2F5: "${answer}"`);
        await this.submitAnswer(page, answer);
        const solved = await this.verifySolved(page);
        if (solved) {
          console.log("[CaptchaSolver] CAPTCHA \uD574\uACB0 \uC131\uACF5!");
          return true;
        }
        console.log(`[CaptchaSolver] \uC2DC\uB3C4 ${attempt} \uC2E4\uD328, \uC7AC\uC2DC\uB3C4...`);
        await this.delay(1e3);
      } catch (error) {
        console.error(`[CaptchaSolver] \uC2DC\uB3C4 ${attempt} \uC5D0\uB7EC:`, error);
      }
    }
    console.log("[CaptchaSolver] \uBAA8\uB4E0 \uC2DC\uB3C4 \uC2E4\uD328");
    return false;
  }
  /**
   * CAPTCHA 페이지 감지
   */
  async detectCaptcha(page) {
    try {
      await page.screenshot({ path: "docs/captcha_debug.png", fullPage: true });
      console.log("[CaptchaSolver] DEBUG: Screenshot saved to docs/captcha_debug.png");
    } catch (e) {
      console.log("[CaptchaSolver] DEBUG: Failed to save screenshot");
    }
    return await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      const hasReceiptImage = bodyText.includes("\uC601\uC218\uC99D") || bodyText.includes("\uAC00\uC0C1\uC73C\uB85C \uC81C\uC791");
      const hasQuestion = bodyText.includes("\uBB34\uC5C7\uC785\uB2C8\uAE4C") || bodyText.includes("\uBE48 \uCE78\uC744 \uCC44\uC6CC\uC8FC\uC138\uC694") || bodyText.includes("[?]") || bodyText.includes("\uBC88\uC9F8 \uC22B\uC790");
      const hasSecurityCheck = bodyText.includes("\uBCF4\uC548 \uD655\uC778");
      const isReceiptCaptcha = (hasReceiptImage || hasSecurityCheck) && hasQuestion;
      const hasRecaptcha = document.querySelector('[class*="recaptcha"], iframe[src*="recaptcha"]') !== null;
      const hasGeneralCaptcha = document.querySelector('[id*="captcha"], [class*="captcha"]') !== null;
      const isCaptcha = isReceiptCaptcha || hasSecurityCheck || hasReceiptImage;
      if (!isCaptcha) {
        return { detected: false, question: "", questionType: "unknown" };
      }
      let question = "";
      const questionMatch = bodyText.match(/.+무엇입니까\??/);
      if (questionMatch) {
        question = questionMatch[0].trim();
      }
      if (!question) {
        const redElements = document.querySelectorAll(
          '[style*="color: rgb(255, 68, 68)"], [style*="color:#ff4444"], [style*="color: red"], [style*="color:#"]'
        );
        for (const elem of redElements) {
          const text = elem.textContent?.trim();
          if (text && (text.includes("[?]") || text.includes("\uBB34\uC5C7\uC785\uB2C8\uAE4C") || text.includes("\uBC88\uC9F8"))) {
            question = text;
            break;
          }
        }
      }
      if (!question) {
        const match = bodyText.match(/영수증의\s+.+?\s+\[?\?\]?\s*입니다/);
        if (match) {
          question = match[0];
        }
      }
      if (!question) {
        const patterns = [
          /가게\s*위치는\s*.+?\s*\[?\?\]?\s*입니다/,
          /전화번호는\s*.+?\s*\[?\?\]?\s*입니다/,
          /상호명은\s*.+?\s*\[?\?\]?\s*입니다/,
          /.+번째\s*숫자는\s*무엇입니까/,
          /.+번째\s*글자는\s*무엇입니까/
        ];
        for (const pattern of patterns) {
          const m = bodyText.match(pattern);
          if (m) {
            question = m[0];
            break;
          }
        }
      }
      if (!question) {
        question = bodyText.substring(0, 300);
      }
      let questionType = "unknown";
      if (question.includes("\uC704\uCE58") || question.includes("\uC8FC\uC18C") || question.includes("\uAE38")) {
        questionType = "address";
      } else if (question.includes("\uC804\uD654") || question.includes("\uBC88\uD638")) {
        questionType = "phone";
      } else if (question.includes("\uC0C1\uD638") || question.includes("\uAC00\uAC8C \uC774\uB984")) {
        questionType = "store";
      }
      return { detected: true, question, questionType };
    });
  }
  /**
   * 영수증 이미지 캡처
   */
  async captureReceiptImage(page) {
    const selectors = [
      "#rcpt_img",
      // 네이버 영수증 CAPTCHA 이미지 ID (정확함)
      ".captcha_img",
      // 네이버 영수증 CAPTCHA 이미지 클래스
      ".captcha_img_cover img",
      // 부모 클래스로 찾기
      'img[alt="\uCEA1\uCC28\uC774\uBBF8\uC9C0"]',
      // alt 속성으로 찾기
      'img[src*="captcha"]',
      'img[src*="receipt"]',
      ".captcha_image img",
      ".receipt_image img",
      '[class*="captcha"] img',
      '[class*="receipt"] img',
      ".security_check img",
      "#captcha_image"
    ];
    for (const selector of selectors) {
      const imageElement = await page.$(selector);
      if (imageElement) {
        try {
          const buffer2 = await imageElement.screenshot();
          console.log(`[CaptchaSolver] \uC774\uBBF8\uC9C0 \uCEA1\uCC98 \uC131\uACF5: ${selector}`);
          return buffer2.toString("base64");
        } catch {
          continue;
        }
      }
    }
    const captchaAreaSelectors = [
      ".captcha_area",
      '[class*="captcha"]',
      '[class*="security"]',
      ".verify_area"
    ];
    for (const selector of captchaAreaSelectors) {
      const area = await page.$(selector);
      if (area) {
        try {
          const buffer2 = await area.screenshot();
          console.log(`[CaptchaSolver] \uC601\uC5ED \uCEA1\uCC98 \uC131\uACF5: ${selector}`);
          return buffer2.toString("base64");
        } catch {
          continue;
        }
      }
    }
    console.log("[CaptchaSolver] \uC804\uCCB4 \uD398\uC774\uC9C0 \uCEA1\uCC98");
    const buffer = await page.screenshot();
    return buffer.toString("base64");
  }
  /**
   * Claude Vision API로 답 추출
   */
  async askClaudeVision(imageBase64, question) {
    const hasValidQuestion = question.length > 0 && question.length < 200 && (question.includes("\uBB34\uC5C7\uC785\uB2C8\uAE4C") || question.includes("[?]") || question.includes("\uBC88\uC9F8") || question.includes("\uBE48 \uCE78"));
    const prompt = hasValidQuestion ? `\uC774 \uC601\uC218\uC99D CAPTCHA \uC774\uBBF8\uC9C0\uB97C \uBCF4\uACE0 \uB2E4\uC74C \uC9C8\uBB38\uC5D0 \uB2F5\uD558\uC138\uC694.

\uC9C8\uBB38: ${question}

\uC601\uC218\uC99D\uC5D0\uC11C \uD574\uB2F9 \uC815\uBCF4\uB97C \uCC3E\uC544 [?] \uC704\uCE58\uC5D0 \uB4E4\uC5B4\uAC08 \uB2F5\uB9CC \uC815\uD655\uD788 \uC54C\uB824\uC8FC\uC138\uC694.
- "\uBC88\uC9F8 \uC22B\uC790\uB294 \uBB34\uC5C7\uC785\uB2C8\uAE4C" \uD615\uC2DD\uC774\uBA74: \uC601\uC218\uC99D\uC5D0\uC11C \uD574\uB2F9 \uC22B\uC790\uB97C \uCC3E\uC544 \uB2F5\uD558\uC138\uC694
- \uC8FC\uC18C \uAD00\uB828\uC774\uBA74: \uBC88\uC9C0\uC218\uB098 \uB3C4\uB85C\uBA85 \uBC88\uD638\uB9CC (\uC608: "794")
- \uC804\uD654\uBC88\uD638 \uAD00\uB828\uC774\uBA74: \uD574\uB2F9 \uC22B\uC790\uB9CC (\uC608: "5678")
- \uC0C1\uD638\uBA85 \uAD00\uB828\uC774\uBA74: \uD574\uB2F9 \uD14D\uC2A4\uD2B8\uB9CC

\uB2E4\uB978 \uC124\uBA85 \uC5C6\uC774 \uB2F5\uB9CC \uCD9C\uB825\uD558\uC138\uC694. \uC22B\uC790\uB098 \uD14D\uC2A4\uD2B8\uB9CC \uB2F5\uD558\uC138\uC694.` : `\uC774 \uC774\uBBF8\uC9C0\uB294 \uB124\uC774\uBC84 \uBCF4\uC548 \uD655\uC778(CAPTCHA) \uD398\uC774\uC9C0\uC785\uB2C8\uB2E4.

\uC774\uBBF8\uC9C0\uC5D0\uC11C:
1. \uC9C8\uBB38\uC744 \uCC3E\uC73C\uC138\uC694 (\uC608: "\uAC00\uAC8C \uC804\uD654\uBC88\uD638\uC758 \uB4A4\uC5D0\uC11C 1\uBC88\uC9F8 \uC22B\uC790\uB294 \uBB34\uC5C7\uC785\uB2C8\uAE4C?")
2. \uC601\uC218\uC99D \uC774\uBBF8\uC9C0\uC5D0\uC11C \uD574\uB2F9 \uC815\uBCF4\uB97C \uCC3E\uC73C\uC138\uC694
3. \uC815\uB2F5\uB9CC \uCD9C\uB825\uD558\uC138\uC694

\uC77C\uBC18\uC801\uC778 \uC9C8\uBB38 \uD615\uC2DD:
- "\uC804\uD654\uBC88\uD638\uC758 \uB4A4\uC5D0\uC11C X\uBC88\uC9F8 \uC22B\uC790\uB294 \uBB34\uC5C7\uC785\uB2C8\uAE4C?"
- "\uAC00\uAC8C \uC704\uCE58\uB294 [\uB3C4\uB85C\uBA85] [?] \uC785\uB2C8\uB2E4"
- "[?]\uC5D0 \uB4E4\uC5B4\uAC08 \uC22B\uC790/\uD14D\uC2A4\uD2B8"

\uB2E4\uB978 \uC124\uBA85 \uC5C6\uC774 \uC815\uB2F5\uB9CC \uCD9C\uB825\uD558\uC138\uC694 (\uC22B\uC790 \uD558\uB098 \uB610\uB294 \uC9E7\uC740 \uD14D\uC2A4\uD2B8).`;
    const response = await this.anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 50,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/png",
                data: imageBase64
              }
            },
            {
              type: "text",
              text: prompt
            }
          ]
        }
      ]
    });
    const content = response.content[0];
    if (content.type === "text") {
      let answer = content.text.trim();
      answer = answer.replace(/입니다\.?$/, "").trim();
      answer = answer.replace(/^답\s*:\s*/i, "").trim();
      return answer;
    }
    throw new Error("Failed to get text response from Claude");
  }
  /**
   * 랜덤 딜레이 (사람처럼)
   */
  randomDelay(min, max) {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  /**
   * 사람처럼 타이핑 (개별 키 이벤트 + 랜덤 딜레이)
   */
  async humanType(page, selector, text) {
    const input = await page.$(selector);
    if (!input)
      throw new Error(`Input not found: ${selector}`);
    await input.click();
    await this.randomDelay(100, 300);
    for (const char of text) {
      await page.keyboard.type(char);
      await this.randomDelay(50, 180);
    }
    await this.randomDelay(200, 500);
  }
  /**
   * 답 입력 및 제출
   */
  async submitAnswer(page, answer) {
    const inputSelectors = [
      'input[type="text"]',
      'input[placeholder*="\uC785\uB825"]',
      'input[placeholder*="\uC815\uB2F5"]',
      'input[name*="answer"]',
      'input[id*="answer"]',
      ".captcha_input input",
      "#captcha_answer"
    ];
    let inputFound = false;
    for (const selector of inputSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2e3 });
        const input = await page.$(selector);
        if (input) {
          await input.click();
          await this.randomDelay(50, 150);
          await page.keyboard.press("Control+A");
          await this.randomDelay(30, 80);
          await page.keyboard.press("Backspace");
          await this.randomDelay(100, 200);
        }
        await this.humanType(page, selector, answer);
        inputFound = true;
        console.log(`[CaptchaSolver] \uB2F5 \uC785\uB825 \uC644\uB8CC: ${selector}`);
        break;
      } catch {
        continue;
      }
    }
    if (!inputFound) {
      throw new Error("CAPTCHA input field not found");
    }
    await this.randomDelay(300, 700);
    const buttonSelectors = [
      'button:has-text("\uD655\uC778")',
      'input[type="submit"]',
      'button[type="submit"]',
      ".confirm_btn",
      ".submit_btn",
      'button[class*="confirm"]',
      'button[class*="submit"]'
    ];
    for (const selector of buttonSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          await button.hover();
          await this.randomDelay(100, 300);
          await button.click();
          console.log(`[CaptchaSolver] \uD655\uC778 \uBC84\uD2BC \uD074\uB9AD: ${selector}`);
          break;
        }
      } catch {
        continue;
      }
    }
    await page.keyboard.press("Enter");
    await this.delay(2e3);
  }
  /**
   * CAPTCHA 해결 여부 확인
   */
  async verifySolved(page) {
    const stillCaptcha = await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      return bodyText.includes("\uBE48 \uCE78\uC744 \uCC44\uC6CC\uC8FC\uC138\uC694") || bodyText.includes("\uB2E4\uC2DC \uC785\uB825") || bodyText.includes("\uC624\uB958") || bodyText.includes("\uC601\uC218\uC99D") && bodyText.includes("[?]");
    });
    return !stillCaptcha;
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};

// unified-runner.ts
dotenv.config();
var autoConfig = getConfigWithEnvOverride();
var NODE_ID = process.env.NODE_ID || `worker-${import_os2.default.hostname()}`;
var HEARTBEAT_INTERVAL = 30 * 1e3;
var BATCH_SIZE = autoConfig.batchSize;
var BATCH_REST = autoConfig.batchRestSec * 1e3;
var TASK_REST = autoConfig.taskRestSec * 1e3;
var PARALLEL_COUNT = autoConfig.parallelCount;
var ACCOUNTS_DIR = path.join(process.cwd(), "accounts");
var VERSION = "1.1.0";
var supabaseControl;
var supabaseProduction;
function initSupabase() {
  const controlUrl = process.env.SUPABASE_CONTROL_URL;
  const controlKey = process.env.SUPABASE_CONTROL_KEY;
  if (!controlUrl || !controlKey) {
    console.error("[ERROR] SUPABASE_CONTROL_URL and SUPABASE_CONTROL_KEY required");
    process.exit(1);
  }
  supabaseControl = (0, import_supabase_js.createClient)(controlUrl, controlKey);
  const prodUrl = process.env.SUPABASE_PRODUCTION_URL;
  const prodKey = process.env.SUPABASE_PRODUCTION_KEY;
  if (!prodUrl || !prodKey) {
    console.error("[ERROR] SUPABASE_PRODUCTION_URL and SUPABASE_PRODUCTION_KEY required");
    process.exit(1);
  }
  supabaseProduction = (0, import_supabase_js.createClient)(prodUrl, prodKey);
  console.log("[Supabase] Control DB (navertrafictest) \uC5F0\uACB0\uB428");
  console.log("[Supabase] Production DB (adpang_production) \uC5F0\uACB0\uB428");
}
var stats = {
  total: 0,
  success: 0,
  failed: 0,
  captcha: 0,
  startTime: /* @__PURE__ */ new Date()
};
var isRunning = true;
var heartbeatTimer = null;
function log(msg, level = "info") {
  const time = (/* @__PURE__ */ new Date()).toISOString();
  const prefix = { info: "[INFO]", warn: "[WARN]", error: "[ERROR]" }[level];
  console.log(`[${time}] ${prefix} ${msg}`);
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
async function registerWorker() {
  const { error } = await supabaseControl.from("workerNodes").upsert({
    node_id: NODE_ID,
    name: NODE_ID,
    status: "online",
    last_heartbeat: (/* @__PURE__ */ new Date()).toISOString(),
    current_version: VERSION,
    registered_at: (/* @__PURE__ */ new Date()).toISOString()
  }, { onConflict: "node_id" });
  if (error) {
    log(`Worker registration failed: ${error.message}`, "error");
  } else {
    log(`Worker registered: ${NODE_ID}`);
  }
}
async function updateHeartbeat() {
  const { error } = await supabaseControl.from("workerNodes").update({
    status: "online",
    last_heartbeat: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("node_id", NODE_ID);
  if (error) {
    log(`Heartbeat failed: ${error.message}`, "warn");
  }
}
function startHeartbeat() {
  heartbeatTimer = setInterval(async () => {
    await updateHeartbeat();
  }, HEARTBEAT_INTERVAL);
  log("Heartbeat started (30s interval)");
}
function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}
async function setWorkerOffline() {
  await supabaseControl.from("workerNodes").update({ status: "offline" }).eq("node_id", NODE_ID);
  log("Worker set to offline");
}
async function fetchEnabledModes() {
  const { data, error } = await supabaseControl.from("traffic_mode_settings").select("*").eq("enabled", true);
  if (error) {
    log(`Failed to fetch modes: ${error.message}`, "error");
    return [];
  }
  return data || [];
}
async function fetchProducts() {
  const { data, error } = await supabaseProduction.from("traffic_navershopping").select("id, keyword, link_url, mid, product_name").not("mid", "is", null).limit(100);
  if (error) {
    log(`Failed to fetch products: ${error.message}`, "error");
    return [];
  }
  return data || [];
}
function loadLocalAccounts() {
  if (!fs.existsSync(ACCOUNTS_DIR)) {
    fs.mkdirSync(ACCOUNTS_DIR, { recursive: true });
    log(`Created accounts directory: ${ACCOUNTS_DIR}`);
    return [];
  }
  const files = fs.readdirSync(ACCOUNTS_DIR).filter((f) => f.endsWith(".json"));
  return files.map((f) => ({
    name: f.replace(".json", ""),
    path: path.join(ACCOUNTS_DIR, f)
  }));
}
async function executeTraffic(product, searchMode, account) {
  let browser = null;
  let context = null;
  try {
    const launchOptions = {
      headless: false,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox"
      ]
    };
    browser = await import_playwright.chromium.launch(launchOptions);
    if (account && fs.existsSync(account.path)) {
      context = await browser.newContext({
        storageState: account.path,
        viewport: { width: 1280, height: 720 }
      });
      log(`Using account: ${account.name}`);
    } else {
      context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
      });
    }
    const page = await context.newPage();
    await page.goto("https://www.naver.com/", { waitUntil: "domcontentloaded" });
    await sleep(1500 + Math.random() * 1e3);
    const searchQuery = searchMode === "\uC1FC\uAC80" ? product.keyword : product.product_name.substring(0, 50);
    await page.fill('input[name="query"]', searchQuery);
    await page.press('input[name="query"]', "Enter");
    await page.waitForLoadState("domcontentloaded");
    await sleep(2e3 + Math.random() * 1e3);
    if (searchMode === "\uC1FC\uAC80") {
      log(`[${searchMode}] Looking for shopping tab...`);
      const shoppingTab = await page.$('a:has-text("\uC1FC\uD551")') || await page.$('a[href*="shopping.naver.com"]');
      if (shoppingTab) {
        await shoppingTab.click();
        await sleep(2500 + Math.random() * 1e3);
        log(`[${searchMode}] Shopping tab clicked`);
      } else {
        await page.goto(`https://search.shopping.naver.com/search/all?query=${encodeURIComponent(searchQuery)}`);
        await sleep(2e3);
      }
    }
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 400));
      await sleep(500);
    }
    const mid = product.mid;
    log(`[${searchMode}] Searching for MID: ${mid}`);
    if (searchMode === "\uD1B5\uAC80") {
      const clicked = await page.evaluate((targetMid) => {
        const links = Array.from(document.querySelectorAll("a"));
        for (const link of links) {
          const href = link.href || "";
          if (href.includes("smartstore.naver.com") && href.includes("/products/") && href.includes(targetMid)) {
            link.click();
            return true;
          }
          if (href.includes("brand.naver.com") && href.includes("/products/") && href.includes(targetMid)) {
            link.click();
            return true;
          }
        }
        return false;
      }, mid);
      if (clicked) {
        log(`[${searchMode}] Direct click success for MID: ${mid}`);
        await sleep(3e3);
        stats.success++;
        return true;
      }
    }
    const catalogUrl = `https://search.shopping.naver.com/catalog/${mid}`;
    await page.evaluate((url) => {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_self";
      document.body.appendChild(link);
      link.click();
    }, catalogUrl);
    await sleep(4e3);
    const hasCaptcha = await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      return bodyText.includes("\uBCF4\uC548 \uD655\uC778") || bodyText.includes("\uC601\uC218\uC99D") || bodyText.includes("\uBB34\uC5C7\uC785\uB2C8\uAE4C") || bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C") || bodyText.includes("[?]");
    });
    if (hasCaptcha) {
      log(`[${searchMode}] \u{1F510} CAPTCHA \uAC10\uC9C0! \uC790\uB3D9 \uD574\uACB0 \uC2DC\uB3C4...`);
      stats.captcha++;
      try {
        const solver = new ReceiptCaptchaSolver();
        const solved = await solver.solve(page);
        if (solved) {
          log(`[${searchMode}] \u2705 CAPTCHA \uD574\uACB0 \uC131\uACF5!`);
          await sleep(2e3);
        } else {
          log(`[${searchMode}] \u274C CAPTCHA \uD574\uACB0 \uC2E4\uD328`, "warn");
          stats.failed++;
          return false;
        }
      } catch (captchaError) {
        log(`[${searchMode}] \u274C CAPTCHA \uD574\uACB0 \uC5D0\uB7EC: ${captchaError.message}`, "error");
        stats.failed++;
        return false;
      }
    }
    const finalUrl = page.url();
    const isProduct = finalUrl.includes("/catalog/") || finalUrl.includes("/products/") || finalUrl.includes("smartstore.naver.com");
    if (!isProduct) {
      log(`[${searchMode}] \u274C Not a product page: ${finalUrl.substring(0, 60)}`, "warn");
      stats.failed++;
      return false;
    }
    const midMatched = finalUrl.includes(mid) || await page.evaluate((targetMid) => {
      const elements = document.querySelectorAll("[data-nv-mid], [data-nvmid], [data-product-id]");
      for (const el of Array.from(elements)) {
        const dataMid = el.getAttribute("data-nv-mid") || el.getAttribute("data-nvmid") || el.getAttribute("data-product-id");
        if (dataMid === targetMid)
          return true;
      }
      return false;
    }, mid);
    if (!midMatched) {
      log(`[${searchMode}] \u274C MID mismatch: expected ${mid}, got ${finalUrl.substring(0, 60)}`, "warn");
      stats.failed++;
      return false;
    }
    log(`[${searchMode}] \u2705 Success (MID verified): ${finalUrl.substring(0, 60)}`);
    stats.success++;
    return true;
  } catch (error) {
    log(`[${searchMode}] Error: ${error.message}`, "error");
    stats.failed++;
    return false;
  } finally {
    if (context)
      await context.close().catch(() => {
      });
    if (browser)
      await browser.close().catch(() => {
      });
  }
}
async function main() {
  console.log("");
  printSystemInfo(autoConfig.systemInfo);
  console.log("");
  printOptimalConfig(autoConfig);
  log("=".repeat(50));
  log("  TURAFIC Unified Runner (Auto-Optimized)");
  log(`  Node ID: ${NODE_ID}`);
  log(`  Version: ${VERSION}`);
  log(`  Parallel: ${PARALLEL_COUNT} browsers`);
  log(`  Batch: ${BATCH_SIZE} tasks, ${BATCH_REST / 1e3}s rest`);
  log("=".repeat(50));
  initSupabase();
  await registerWorker();
  startHeartbeat();
  const accounts = loadLocalAccounts();
  log(`Loaded ${accounts.length} local accounts`);
  process.on("SIGINT", async () => {
    log("Shutting down...");
    isRunning = false;
    stopHeartbeat();
    await setWorkerOffline();
    process.exit(0);
  });
  let accountIndex = 0;
  while (isRunning) {
    try {
      const enabledModes = await fetchEnabledModes();
      if (enabledModes.length === 0) {
        log("No enabled modes, waiting...");
        await sleep(3e4);
        continue;
      }
      log(`Enabled modes: ${enabledModes.map((m) => m.mode_type).join(", ")}`);
      const products = await fetchProducts();
      if (products.length === 0) {
        log("No products available, waiting...");
        await sleep(3e4);
        continue;
      }
      log(`Fetched ${products.length} products`);
      for (const mode of enabledModes) {
        const searchMode = mode.mode_type.startsWith("tonggum") ? "\uD1B5\uAC80" : "\uC1FC\uAC80";
        const isLogin = mode.mode_type.includes("login") && !mode.mode_type.includes("nologin");
        log(`
--- Mode: ${mode.mode_type} (${searchMode}, login=${isLogin}) ---`);
        const batch = products.slice(0, BATCH_SIZE);
        for (const product of batch) {
          if (!isRunning)
            break;
          stats.total++;
          let account;
          if (isLogin && accounts.length > 0) {
            account = accounts[accountIndex % accounts.length];
            accountIndex++;
          }
          log(`[${stats.total}] ${product.product_name.substring(0, 30)}... (MID: ${product.mid})`);
          await executeTraffic(product, searchMode, account);
          await sleep(TASK_REST);
        }
        log(`Mode ${mode.mode_type} batch complete`);
      }
      const elapsed = (Date.now() - stats.startTime.getTime()) / 1e3 / 60;
      log(`
--- Stats (${elapsed.toFixed(1)} min) ---`);
      log(`Total: ${stats.total}, Success: ${stats.success}, Failed: ${stats.failed}`);
      log(`Success rate: ${(stats.success / stats.total * 100).toFixed(1)}%`);
      log(`
Resting for ${BATCH_REST / 1e3} seconds...`);
      await sleep(BATCH_REST);
    } catch (error) {
      log(`Main loop error: ${error.message}`, "error");
      await sleep(1e4);
    }
  }
}
main().catch(console.error);
