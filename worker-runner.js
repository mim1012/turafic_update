#!/usr/bin/env npx tsx
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
    var path3 = require("path");
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
        possibleVaultPath = path3.resolve(process.cwd(), ".env.vault");
      }
      if (fs2.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path3.join(os3.homedir(), envPath.slice(1)) : envPath;
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
      const dotenvPath = path3.resolve(process.cwd(), ".env");
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
      for (const path4 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs2.readFileSync(path4, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path4} ${e.message}`);
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
            const relative = path3.relative(process.cwd(), filePath);
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
var path2 = __toESM(require("path"));
var import_playwright = require("playwright");
var import_supabase_js = require("@supabase/supabase-js");

// auto-optimizer.ts
var import_os = __toESM(require("os"));
var import_url = require("url");
var import_path = __toESM(require("path"));
var import_meta = {};
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
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var isMainModule = process.argv[1] && import_path.default.resolve(process.argv[1]) === import_path.default.resolve(__filename);
if (isMainModule) {
  console.log("");
  printSystemInfo();
  console.log("");
  printOptimalConfig();
  console.log("");
}

// unified-runner.ts
dotenv.config();
var autoConfig = getConfigWithEnvOverride();
var NODE_ID = process.env.NODE_ID || `worker-${import_os2.default.hostname()}`;
var HEARTBEAT_INTERVAL = 30 * 1e3;
var BATCH_SIZE = autoConfig.batchSize;
var BATCH_REST = autoConfig.batchRestSec * 1e3;
var TASK_REST = autoConfig.taskRestSec * 1e3;
var PARALLEL_COUNT = autoConfig.parallelCount;
var ACCOUNTS_DIR = path2.join(process.cwd(), "accounts");
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
    path: path2.join(ACCOUNTS_DIR, f)
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
    const finalUrl = page.url();
    const isProduct = finalUrl.includes("/catalog/") || finalUrl.includes("/products/") || finalUrl.includes("smartstore.naver.com");
    if (isProduct) {
      log(`[${searchMode}] \u2705 Success: ${finalUrl.substring(0, 60)}`);
      stats.success++;
      return true;
    } else {
      log(`[${searchMode}] \u274C Not a product page: ${finalUrl.substring(0, 60)}`, "warn");
      stats.failed++;
      return false;
    }
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
