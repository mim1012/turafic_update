#!/usr/bin/env npx tsx
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/package.json"(exports2, module2) {
    module2.exports = {
      name: "dotenv",
      version: "17.2.3",
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
        test: "tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
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

// node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/.pnpm/dotenv@17.2.3/node_modules/dotenv/lib/main.js"(exports2, module2) {
    var fs3 = require("fs");
    var path3 = require("path");
    var os2 = require("os");
    var crypto2 = require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var TIPS = [
      "\u{1F510} encrypt with Dotenvx: https://dotenvx.com",
      "\u{1F510} prevent committing .env to code: https://dotenvx.com/precommit",
      "\u{1F510} prevent building .env in docker: https://dotenvx.com/prebuild",
      "\u{1F4E1} add observability to secrets: https://dotenvx.com/ops",
      "\u{1F465} sync secrets across teammates & machines: https://dotenvx.com/ops",
      "\u{1F5C2}\uFE0F backup and recover secrets: https://dotenvx.com/ops",
      "\u2705 audit secrets and track compliance: https://dotenvx.com/ops",
      "\u{1F504} add secrets lifecycle management: https://dotenvx.com/ops",
      "\u{1F511} add access controls to secrets: https://dotenvx.com/ops",
      "\u{1F6E0}\uFE0F  run anywhere with `dotenvx run -- yourcommand`",
      "\u2699\uFE0F  specify custom .env file path with { path: '/custom/path/.env' }",
      "\u2699\uFE0F  enable debug logging with { debug: true }",
      "\u2699\uFE0F  override existing env vars with { override: true }",
      "\u2699\uFE0F  suppress all logs with { quiet: true }",
      "\u2699\uFE0F  write to custom object with { processEnv: myObject }",
      "\u2699\uFE0F  load multiple .env files with { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
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
      console.error(`[dotenv@${version}][WARN] ${message}`);
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
            if (fs3.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path3.resolve(process.cwd(), ".env.vault");
      }
      if (fs3.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path3.join(os2.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
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
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
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
          const parsed = DotenvModule.parse(fs3.readFileSync(path4, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path4} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
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
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")} ${dim(`-- tip: ${_getRandomTip()}`)}`);
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
        const aesgcm = crypto2.createDecipheriv("aes-256-gcm", key, nonce);
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
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
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
          populated[key] = parsed[key];
        }
      }
      return populated;
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

// node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __addDisposableResource: () => __addDisposableResource,
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldIn: () => __classPrivateFieldIn,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __disposeResources: () => __disposeResources,
  __esDecorate: () => __esDecorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __propKey: () => __propKey,
  __read: () => __read,
  __rest: () => __rest,
  __rewriteRelativeImportExtension: () => __rewriteRelativeImportExtension,
  __runInitializers: () => __runInitializers,
  __setFunctionName: () => __setFunctionName,
  __spread: () => __spread,
  __spreadArray: () => __spreadArray,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values,
  default: () => tslib_es6_default
});
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
    t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access) context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done) throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0) continue;
      if (result === null || typeof result !== "object") throw new TypeError("Object expected");
      if (_ = accept(result.get)) descriptor.get = _;
      if (_ = accept(result.set)) descriptor.set = _;
      if (_ = accept(result.init)) initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field") initializers.unshift(_);
      else descriptor[key] = _;
    }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}
function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1) throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _) try {
      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
      if (y = 0, t) op = [op[0] & 2, t.value];
      switch (op[0]) {
        case 0:
        case 1:
          t = op;
          break;
        case 4:
          _.label++;
          return { value: op[1], done: false };
        case 5:
          _.label++;
          y = op[1];
          op = [0];
          continue;
        case 7:
          op = _.ops.pop();
          _.trys.pop();
          continue;
        default:
          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
            _ = 0;
            continue;
          }
          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
            _.label = op[1];
            break;
          }
          if (op[0] === 6 && _.label < t[1]) {
            _.label = t[1];
            t = op;
            break;
          }
          if (t && _.label < t[2]) {
            _.label = t[2];
            _.ops.push(op);
            break;
          }
          if (t[2]) _.ops.pop();
          _.trys.pop();
          continue;
      }
      op = body.call(thisArg, _);
    } catch (e) {
      op = [6, e];
      y = 0;
    } finally {
      f = t = 0;
    }
    if (op[0] & 5) throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function() {
      if (o && i >= o.length) o = void 0;
      return { value: o && o[i++], done: !o };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read(arguments[i]));
  return ar;
}
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function awaitReturn(f) {
    return function(v) {
      return Promise.resolve(v).then(f, reject);
    };
  }
  function verb(n, f) {
    if (g[n]) {
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
      if (f) i[n] = f(i[n]);
    }
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) {
    for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  }
  __setModuleDefault(result, mod);
  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function") throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() {
      try {
        inner.call(this);
      } catch (e) {
        return Promise.reject(e);
      }
    };
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}
function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) {
            fail(e);
            return next();
          });
        } else s |= 1;
      } catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}
function __rewriteRelativeImportExtension(path3, preserveJsx) {
  if (typeof path3 === "string" && /^\.\.?\//.test(path3)) {
    return path3.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function(m, tsx, d, ext, cm) {
      return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : d + ext + "." + cm.toLowerCase() + "js";
    });
  }
  return path3;
}
var extendStatics, __assign, __createBinding, __setModuleDefault, ownKeys, _SuppressedError, tslib_es6_default;
var init_tslib_es6 = __esm({
  "node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs"() {
    extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2) if (Object.prototype.hasOwnProperty.call(b2, p)) d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    __assign = function() {
      __assign = Object.assign || function __assign2(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    __createBinding = Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    });
    __setModuleDefault = Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    };
    ownKeys = function(o) {
      ownKeys = Object.getOwnPropertyNames || function(o2) {
        var ar = [];
        for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
        return ar;
      };
      return ownKeys(o);
    };
    _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    tslib_es6_default = {
      __extends,
      __assign,
      __rest,
      __decorate,
      __param,
      __esDecorate,
      __runInitializers,
      __propKey,
      __setFunctionName,
      __metadata,
      __awaiter,
      __generator,
      __createBinding,
      __exportStar,
      __values,
      __read,
      __spread,
      __spreadArrays,
      __spreadArray,
      __await,
      __asyncGenerator,
      __asyncDelegator,
      __asyncValues,
      __makeTemplateObject,
      __importStar,
      __importDefault,
      __classPrivateFieldGet,
      __classPrivateFieldSet,
      __classPrivateFieldIn,
      __addDisposableResource,
      __disposeResources,
      __rewriteRelativeImportExtension
    };
  }
});

// node_modules/.pnpm/@supabase+functions-js@2.86.0/node_modules/@supabase/functions-js/dist/main/helper.js
var require_helper = __commonJS({
  "node_modules/.pnpm/@supabase+functions-js@2.86.0/node_modules/@supabase/functions-js/dist/main/helper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resolveFetch = void 0;
    var resolveFetch = (customFetch) => {
      if (customFetch) {
        return (...args) => customFetch(...args);
      }
      return (...args) => fetch(...args);
    };
    exports2.resolveFetch = resolveFetch;
  }
});

// node_modules/.pnpm/@supabase+functions-js@2.86.0/node_modules/@supabase/functions-js/dist/main/types.js
var require_types = __commonJS({
  "node_modules/.pnpm/@supabase+functions-js@2.86.0/node_modules/@supabase/functions-js/dist/main/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FunctionRegion = exports2.FunctionsHttpError = exports2.FunctionsRelayError = exports2.FunctionsFetchError = exports2.FunctionsError = void 0;
    var FunctionsError = class extends Error {
      constructor(message, name = "FunctionsError", context) {
        super(message);
        this.name = name;
        this.context = context;
      }
    };
    exports2.FunctionsError = FunctionsError;
    var FunctionsFetchError = class extends FunctionsError {
      constructor(context) {
        super("Failed to send a request to the Edge Function", "FunctionsFetchError", context);
      }
    };
    exports2.FunctionsFetchError = FunctionsFetchError;
    var FunctionsRelayError = class extends FunctionsError {
      constructor(context) {
        super("Relay Error invoking the Edge Function", "FunctionsRelayError", context);
      }
    };
    exports2.FunctionsRelayError = FunctionsRelayError;
    var FunctionsHttpError = class extends FunctionsError {
      constructor(context) {
        super("Edge Function returned a non-2xx status code", "FunctionsHttpError", context);
      }
    };
    exports2.FunctionsHttpError = FunctionsHttpError;
    var FunctionRegion;
    (function(FunctionRegion2) {
      FunctionRegion2["Any"] = "any";
      FunctionRegion2["ApNortheast1"] = "ap-northeast-1";
      FunctionRegion2["ApNortheast2"] = "ap-northeast-2";
      FunctionRegion2["ApSouth1"] = "ap-south-1";
      FunctionRegion2["ApSoutheast1"] = "ap-southeast-1";
      FunctionRegion2["ApSoutheast2"] = "ap-southeast-2";
      FunctionRegion2["CaCentral1"] = "ca-central-1";
      FunctionRegion2["EuCentral1"] = "eu-central-1";
      FunctionRegion2["EuWest1"] = "eu-west-1";
      FunctionRegion2["EuWest2"] = "eu-west-2";
      FunctionRegion2["EuWest3"] = "eu-west-3";
      FunctionRegion2["SaEast1"] = "sa-east-1";
      FunctionRegion2["UsEast1"] = "us-east-1";
      FunctionRegion2["UsWest1"] = "us-west-1";
      FunctionRegion2["UsWest2"] = "us-west-2";
    })(FunctionRegion || (exports2.FunctionRegion = FunctionRegion = {}));
  }
});

// node_modules/.pnpm/@supabase+functions-js@2.86.0/node_modules/@supabase/functions-js/dist/main/FunctionsClient.js
var require_FunctionsClient = __commonJS({
  "node_modules/.pnpm/@supabase+functions-js@2.86.0/node_modules/@supabase/functions-js/dist/main/FunctionsClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FunctionsClient = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var helper_1 = require_helper();
    var types_1 = require_types();
    var FunctionsClient = class {
      /**
       * Creates a new Functions client bound to an Edge Functions URL.
       *
       * @example
       * ```ts
       * import { FunctionsClient, FunctionRegion } from '@supabase/functions-js'
       *
       * const functions = new FunctionsClient('https://xyzcompany.supabase.co/functions/v1', {
       *   headers: { apikey: 'public-anon-key' },
       *   region: FunctionRegion.UsEast1,
       * })
       * ```
       */
      constructor(url, { headers = {}, customFetch, region = types_1.FunctionRegion.Any } = {}) {
        this.url = url;
        this.headers = headers;
        this.region = region;
        this.fetch = (0, helper_1.resolveFetch)(customFetch);
      }
      /**
       * Updates the authorization header
       * @param token - the new jwt token sent in the authorisation header
       * @example
       * ```ts
       * functions.setAuth(session.access_token)
       * ```
       */
      setAuth(token) {
        this.headers.Authorization = `Bearer ${token}`;
      }
      /**
       * Invokes a function
       * @param functionName - The name of the Function to invoke.
       * @param options - Options for invoking the Function.
       * @example
       * ```ts
       * const { data, error } = await functions.invoke('hello-world', {
       *   body: { name: 'Ada' },
       * })
       * ```
       */
      invoke(functionName_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (functionName, options = {}) {
          var _a;
          let timeoutId;
          let timeoutController;
          try {
            const { headers, method, body: functionArgs, signal, timeout } = options;
            let _headers = {};
            let { region } = options;
            if (!region) {
              region = this.region;
            }
            const url = new URL(`${this.url}/${functionName}`);
            if (region && region !== "any") {
              _headers["x-region"] = region;
              url.searchParams.set("forceFunctionRegion", region);
            }
            let body;
            if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, "Content-Type") || !headers)) {
              if (typeof Blob !== "undefined" && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
                _headers["Content-Type"] = "application/octet-stream";
                body = functionArgs;
              } else if (typeof functionArgs === "string") {
                _headers["Content-Type"] = "text/plain";
                body = functionArgs;
              } else if (typeof FormData !== "undefined" && functionArgs instanceof FormData) {
                body = functionArgs;
              } else {
                _headers["Content-Type"] = "application/json";
                body = JSON.stringify(functionArgs);
              }
            } else {
              body = functionArgs;
            }
            let effectiveSignal = signal;
            if (timeout) {
              timeoutController = new AbortController();
              timeoutId = setTimeout(() => timeoutController.abort(), timeout);
              if (signal) {
                effectiveSignal = timeoutController.signal;
                signal.addEventListener("abort", () => timeoutController.abort());
              } else {
                effectiveSignal = timeoutController.signal;
              }
            }
            const response = yield this.fetch(url.toString(), {
              method: method || "POST",
              // headers priority is (high to low):
              // 1. invoke-level headers
              // 2. client-level headers
              // 3. default Content-Type header
              headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
              body,
              signal: effectiveSignal
            }).catch((fetchError) => {
              throw new types_1.FunctionsFetchError(fetchError);
            });
            const isRelayError = response.headers.get("x-relay-error");
            if (isRelayError && isRelayError === "true") {
              throw new types_1.FunctionsRelayError(response);
            }
            if (!response.ok) {
              throw new types_1.FunctionsHttpError(response);
            }
            let responseType = ((_a = response.headers.get("Content-Type")) !== null && _a !== void 0 ? _a : "text/plain").split(";")[0].trim();
            let data;
            if (responseType === "application/json") {
              data = yield response.json();
            } else if (responseType === "application/octet-stream" || responseType === "application/pdf") {
              data = yield response.blob();
            } else if (responseType === "text/event-stream") {
              data = response;
            } else if (responseType === "multipart/form-data") {
              data = yield response.formData();
            } else {
              data = yield response.text();
            }
            return { data, error: null, response };
          } catch (error) {
            return {
              data: null,
              error,
              response: error instanceof types_1.FunctionsHttpError || error instanceof types_1.FunctionsRelayError ? error.context : void 0
            };
          } finally {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
          }
        });
      }
    };
    exports2.FunctionsClient = FunctionsClient;
  }
});

// node_modules/.pnpm/@supabase+functions-js@2.86.0/node_modules/@supabase/functions-js/dist/main/index.js
var require_main2 = __commonJS({
  "node_modules/.pnpm/@supabase+functions-js@2.86.0/node_modules/@supabase/functions-js/dist/main/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.FunctionRegion = exports2.FunctionsRelayError = exports2.FunctionsHttpError = exports2.FunctionsFetchError = exports2.FunctionsError = exports2.FunctionsClient = void 0;
    var FunctionsClient_1 = require_FunctionsClient();
    Object.defineProperty(exports2, "FunctionsClient", { enumerable: true, get: function() {
      return FunctionsClient_1.FunctionsClient;
    } });
    var types_1 = require_types();
    Object.defineProperty(exports2, "FunctionsError", { enumerable: true, get: function() {
      return types_1.FunctionsError;
    } });
    Object.defineProperty(exports2, "FunctionsFetchError", { enumerable: true, get: function() {
      return types_1.FunctionsFetchError;
    } });
    Object.defineProperty(exports2, "FunctionsHttpError", { enumerable: true, get: function() {
      return types_1.FunctionsHttpError;
    } });
    Object.defineProperty(exports2, "FunctionsRelayError", { enumerable: true, get: function() {
      return types_1.FunctionsRelayError;
    } });
    Object.defineProperty(exports2, "FunctionRegion", { enumerable: true, get: function() {
      return types_1.FunctionRegion;
    } });
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js
var require_PostgrestError = __commonJS({
  "node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestError.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var PostgrestError = class extends Error {
      /**
       * @example
       * ```ts
       * import PostgrestError from '@supabase/postgrest-js'
       *
       * throw new PostgrestError({
       *   message: 'Row level security prevented the request',
       *   details: 'RLS denied the insert',
       *   hint: 'Check your policies',
       *   code: 'PGRST301',
       * })
       * ```
       */
      constructor(context) {
        super(context.message);
        this.name = "PostgrestError";
        this.details = context.details;
        this.hint = context.hint;
        this.code = context.code;
      }
    };
    exports2.default = PostgrestError;
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js
var require_PostgrestBuilder = __commonJS({
  "node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestBuilder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var PostgrestError_1 = tslib_1.__importDefault(require_PostgrestError());
    var PostgrestBuilder = class {
      /**
       * Creates a builder configured for a specific PostgREST request.
       *
       * @example
       * ```ts
       * import PostgrestQueryBuilder from '@supabase/postgrest-js'
       *
       * const builder = new PostgrestQueryBuilder(
       *   new URL('https://xyzcompany.supabase.co/rest/v1/users'),
       *   { headers: new Headers({ apikey: 'public-anon-key' }) }
       * )
       * ```
       */
      constructor(builder) {
        var _a, _b;
        this.shouldThrowOnError = false;
        this.method = builder.method;
        this.url = builder.url;
        this.headers = new Headers(builder.headers);
        this.schema = builder.schema;
        this.body = builder.body;
        this.shouldThrowOnError = (_a = builder.shouldThrowOnError) !== null && _a !== void 0 ? _a : false;
        this.signal = builder.signal;
        this.isMaybeSingle = (_b = builder.isMaybeSingle) !== null && _b !== void 0 ? _b : false;
        if (builder.fetch) {
          this.fetch = builder.fetch;
        } else {
          this.fetch = fetch;
        }
      }
      /**
       * If there's an error with the query, throwOnError will reject the promise by
       * throwing the error instead of returning it as part of a successful response.
       *
       * {@link https://github.com/supabase/supabase-js/issues/92}
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /**
       * Set an HTTP header for the request.
       */
      setHeader(name, value) {
        this.headers = new Headers(this.headers);
        this.headers.set(name, value);
        return this;
      }
      then(onfulfilled, onrejected) {
        if (this.schema === void 0) {
        } else if (["GET", "HEAD"].includes(this.method)) {
          this.headers.set("Accept-Profile", this.schema);
        } else {
          this.headers.set("Content-Profile", this.schema);
        }
        if (this.method !== "GET" && this.method !== "HEAD") {
          this.headers.set("Content-Type", "application/json");
        }
        const _fetch = this.fetch;
        let res = _fetch(this.url.toString(), {
          method: this.method,
          headers: this.headers,
          body: JSON.stringify(this.body),
          signal: this.signal
        }).then(async (res2) => {
          var _a, _b, _c, _d;
          let error = null;
          let data = null;
          let count = null;
          let status = res2.status;
          let statusText = res2.statusText;
          if (res2.ok) {
            if (this.method !== "HEAD") {
              const body = await res2.text();
              if (body === "") {
              } else if (this.headers.get("Accept") === "text/csv") {
                data = body;
              } else if (this.headers.get("Accept") && ((_a = this.headers.get("Accept")) === null || _a === void 0 ? void 0 : _a.includes("application/vnd.pgrst.plan+text"))) {
                data = body;
              } else {
                data = JSON.parse(body);
              }
            }
            const countHeader = (_b = this.headers.get("Prefer")) === null || _b === void 0 ? void 0 : _b.match(/count=(exact|planned|estimated)/);
            const contentRange = (_c = res2.headers.get("content-range")) === null || _c === void 0 ? void 0 : _c.split("/");
            if (countHeader && contentRange && contentRange.length > 1) {
              count = parseInt(contentRange[1]);
            }
            if (this.isMaybeSingle && this.method === "GET" && Array.isArray(data)) {
              if (data.length > 1) {
                error = {
                  // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
                  code: "PGRST116",
                  details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
                  hint: null,
                  message: "JSON object requested, multiple (or no) rows returned"
                };
                data = null;
                count = null;
                status = 406;
                statusText = "Not Acceptable";
              } else if (data.length === 1) {
                data = data[0];
              } else {
                data = null;
              }
            }
          } else {
            const body = await res2.text();
            try {
              error = JSON.parse(body);
              if (Array.isArray(error) && res2.status === 404) {
                data = [];
                error = null;
                status = 200;
                statusText = "OK";
              }
            } catch (_e) {
              if (res2.status === 404 && body === "") {
                status = 204;
                statusText = "No Content";
              } else {
                error = {
                  message: body
                };
              }
            }
            if (error && this.isMaybeSingle && ((_d = error === null || error === void 0 ? void 0 : error.details) === null || _d === void 0 ? void 0 : _d.includes("0 rows"))) {
              error = null;
              status = 200;
              statusText = "OK";
            }
            if (error && this.shouldThrowOnError) {
              throw new PostgrestError_1.default(error);
            }
          }
          const postgrestResponse = {
            error,
            data,
            count,
            status,
            statusText
          };
          return postgrestResponse;
        });
        if (!this.shouldThrowOnError) {
          res = res.catch((fetchError) => {
            var _a, _b, _c, _d, _e, _f;
            let errorDetails = "";
            const cause = fetchError === null || fetchError === void 0 ? void 0 : fetchError.cause;
            if (cause) {
              const causeMessage = (_a = cause === null || cause === void 0 ? void 0 : cause.message) !== null && _a !== void 0 ? _a : "";
              const causeCode = (_b = cause === null || cause === void 0 ? void 0 : cause.code) !== null && _b !== void 0 ? _b : "";
              errorDetails = `${(_c = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _c !== void 0 ? _c : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`;
              errorDetails += `

Caused by: ${(_d = cause === null || cause === void 0 ? void 0 : cause.name) !== null && _d !== void 0 ? _d : "Error"}: ${causeMessage}`;
              if (causeCode) {
                errorDetails += ` (${causeCode})`;
              }
              if (cause === null || cause === void 0 ? void 0 : cause.stack) {
                errorDetails += `
${cause.stack}`;
              }
            } else {
              errorDetails = (_e = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _e !== void 0 ? _e : "";
            }
            return {
              error: {
                message: `${(_f = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _f !== void 0 ? _f : "FetchError"}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
                details: errorDetails,
                hint: "",
                code: ""
              },
              data: null,
              count: null,
              status: 0,
              statusText: ""
            };
          });
        }
        return res.then(onfulfilled, onrejected);
      }
      /**
       * Override the type of the returned `data`.
       *
       * @typeParam NewResult - The new result type to override with
       * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
       */
      returns() {
        return this;
      }
      /**
       * Override the type of the returned `data` field in the response.
       *
       * @typeParam NewResult - The new type to cast the response data to
       * @typeParam Options - Optional type configuration (defaults to { merge: true })
       * @typeParam Options.merge - When true, merges the new type with existing return type. When false, replaces the existing types entirely (defaults to true)
       * @example
       * ```typescript
       * // Merge with existing types (default behavior)
       * const query = supabase
       *   .from('users')
       *   .select()
       *   .overrideTypes<{ custom_field: string }>()
       *
       * // Replace existing types completely
       * const replaceQuery = supabase
       *   .from('users')
       *   .select()
       *   .overrideTypes<{ id: number; name: string }, { merge: false }>()
       * ```
       * @returns A PostgrestBuilder instance with the new type
       */
      overrideTypes() {
        return this;
      }
    };
    exports2.default = PostgrestBuilder;
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js
var require_PostgrestTransformBuilder = __commonJS({
  "node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestTransformBuilder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var PostgrestBuilder_1 = tslib_1.__importDefault(require_PostgrestBuilder());
    var PostgrestTransformBuilder = class extends PostgrestBuilder_1.default {
      /**
       * Perform a SELECT on the query result.
       *
       * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
       * return modified rows. By calling this method, modified rows are returned in
       * `data`.
       *
       * @param columns - The columns to retrieve, separated by commas
       */
      select(columns) {
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        this.headers.append("Prefer", "return=representation");
        return this;
      }
      /**
       * Order the query result by `column`.
       *
       * You can call this method multiple times to order by multiple columns.
       *
       * You can order referenced tables, but it only affects the ordering of the
       * parent table if you use `!inner` in the query.
       *
       * @param column - The column to order by
       * @param options - Named parameters
       * @param options.ascending - If `true`, the result will be in ascending order
       * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
       * `null`s appear last.
       * @param options.referencedTable - Set this to order a referenced table by
       * its columns
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      order(column, { ascending = true, nullsFirst, foreignTable, referencedTable = foreignTable } = {}) {
        const key = referencedTable ? `${referencedTable}.order` : "order";
        const existingOrder = this.url.searchParams.get(key);
        this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}${nullsFirst === void 0 ? "" : nullsFirst ? ".nullsfirst" : ".nullslast"}`);
        return this;
      }
      /**
       * Limit the query result by `count`.
       *
       * @param count - The maximum number of rows to return
       * @param options - Named parameters
       * @param options.referencedTable - Set this to limit rows of referenced
       * tables instead of the parent table
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      limit(count, { foreignTable, referencedTable = foreignTable } = {}) {
        const key = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
        this.url.searchParams.set(key, `${count}`);
        return this;
      }
      /**
       * Limit the query result by starting at an offset `from` and ending at the offset `to`.
       * Only records within this range are returned.
       * This respects the query order and if there is no order clause the range could behave unexpectedly.
       * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
       * and fourth rows of the query.
       *
       * @param from - The starting index from which to limit the result
       * @param to - The last index to which to limit the result
       * @param options - Named parameters
       * @param options.referencedTable - Set this to limit rows of referenced
       * tables instead of the parent table
       * @param options.foreignTable - Deprecated, use `options.referencedTable`
       * instead
       */
      range(from, to, { foreignTable, referencedTable = foreignTable } = {}) {
        const keyOffset = typeof referencedTable === "undefined" ? "offset" : `${referencedTable}.offset`;
        const keyLimit = typeof referencedTable === "undefined" ? "limit" : `${referencedTable}.limit`;
        this.url.searchParams.set(keyOffset, `${from}`);
        this.url.searchParams.set(keyLimit, `${to - from + 1}`);
        return this;
      }
      /**
       * Set the AbortSignal for the fetch request.
       *
       * @param signal - The AbortSignal to use for the fetch request
       */
      abortSignal(signal) {
        this.signal = signal;
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be one row (e.g. using `.limit(1)`), otherwise this
       * returns an error.
       */
      single() {
        this.headers.set("Accept", "application/vnd.pgrst.object+json");
        return this;
      }
      /**
       * Return `data` as a single object instead of an array of objects.
       *
       * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
       * this returns an error.
       */
      maybeSingle() {
        if (this.method === "GET") {
          this.headers.set("Accept", "application/json");
        } else {
          this.headers.set("Accept", "application/vnd.pgrst.object+json");
        }
        this.isMaybeSingle = true;
        return this;
      }
      /**
       * Return `data` as a string in CSV format.
       */
      csv() {
        this.headers.set("Accept", "text/csv");
        return this;
      }
      /**
       * Return `data` as an object in [GeoJSON](https://geojson.org) format.
       */
      geojson() {
        this.headers.set("Accept", "application/geo+json");
        return this;
      }
      /**
       * Return `data` as the EXPLAIN plan for the query.
       *
       * You need to enable the
       * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
       * setting before using this method.
       *
       * @param options - Named parameters
       *
       * @param options.analyze - If `true`, the query will be executed and the
       * actual run time will be returned
       *
       * @param options.verbose - If `true`, the query identifier will be returned
       * and `data` will include the output columns of the query
       *
       * @param options.settings - If `true`, include information on configuration
       * parameters that affect query planning
       *
       * @param options.buffers - If `true`, include information on buffer usage
       *
       * @param options.wal - If `true`, include information on WAL record generation
       *
       * @param options.format - The format of the output, can be `"text"` (default)
       * or `"json"`
       */
      explain({ analyze = false, verbose = false, settings = false, buffers = false, wal = false, format = "text" } = {}) {
        var _a;
        const options = [
          analyze ? "analyze" : null,
          verbose ? "verbose" : null,
          settings ? "settings" : null,
          buffers ? "buffers" : null,
          wal ? "wal" : null
        ].filter(Boolean).join("|");
        const forMediatype = (_a = this.headers.get("Accept")) !== null && _a !== void 0 ? _a : "application/json";
        this.headers.set("Accept", `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`);
        if (format === "json") {
          return this;
        } else {
          return this;
        }
      }
      /**
       * Rollback the query.
       *
       * `data` will still be returned, but the query is not committed.
       */
      rollback() {
        this.headers.append("Prefer", "tx=rollback");
        return this;
      }
      /**
       * Override the type of the returned `data`.
       *
       * @typeParam NewResult - The new result type to override with
       * @deprecated Use overrideTypes<yourType, { merge: false }>() method at the end of your call chain instead
       */
      returns() {
        return this;
      }
      /**
       * Set the maximum number of rows that can be affected by the query.
       * Only available in PostgREST v13+ and only works with PATCH and DELETE methods.
       *
       * @param value - The maximum number of rows that can be affected
       */
      maxAffected(value) {
        this.headers.append("Prefer", "handling=strict");
        this.headers.append("Prefer", `max-affected=${value}`);
        return this;
      }
    };
    exports2.default = PostgrestTransformBuilder;
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js
var require_PostgrestFilterBuilder = __commonJS({
  "node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestFilterBuilder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var PostgrestTransformBuilder_1 = tslib_1.__importDefault(require_PostgrestTransformBuilder());
    var PostgrestReservedCharsRegexp = new RegExp("[,()]");
    var PostgrestFilterBuilder = class extends PostgrestTransformBuilder_1.default {
      /**
       * Match only rows where `column` is equal to `value`.
       *
       * To check if the value of `column` is NULL, you should use `.is()` instead.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      eq(column, value) {
        this.url.searchParams.append(column, `eq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is not equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      neq(column, value) {
        this.url.searchParams.append(column, `neq.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gt(column, value) {
        this.url.searchParams.append(column, `gt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is greater than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      gte(column, value) {
        this.url.searchParams.append(column, `gte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lt(column, value) {
        this.url.searchParams.append(column, `lt.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is less than or equal to `value`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      lte(column, value) {
        this.url.searchParams.append(column, `lte.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-sensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      like(column, pattern) {
        this.url.searchParams.append(column, `like.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAllOf(column, patterns) {
        this.url.searchParams.append(column, `like(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-sensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      likeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `like(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches `pattern` case-insensitively.
       *
       * @param column - The column to filter on
       * @param pattern - The pattern to match with
       */
      ilike(column, pattern) {
        this.url.searchParams.append(column, `ilike.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` matches all of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAllOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(all).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches any of `patterns` case-insensitively.
       *
       * @param column - The column to filter on
       * @param patterns - The patterns to match with
       */
      ilikeAnyOf(column, patterns) {
        this.url.searchParams.append(column, `ilike(any).{${patterns.join(",")}}`);
        return this;
      }
      /**
       * Match only rows where `column` matches the PostgreSQL regex `pattern`
       * case-sensitively (using the `~` operator).
       *
       * @param column - The column to filter on
       * @param pattern - The PostgreSQL regular expression pattern to match with
       */
      regexMatch(column, pattern) {
        this.url.searchParams.append(column, `match.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` matches the PostgreSQL regex `pattern`
       * case-insensitively (using the `~*` operator).
       *
       * @param column - The column to filter on
       * @param pattern - The PostgreSQL regular expression pattern to match with
       */
      regexIMatch(column, pattern) {
        this.url.searchParams.append(column, `imatch.${pattern}`);
        return this;
      }
      /**
       * Match only rows where `column` IS `value`.
       *
       * For non-boolean columns, this is only relevant for checking if the value of
       * `column` is NULL by setting `value` to `null`.
       *
       * For boolean columns, you can also set `value` to `true` or `false` and it
       * will behave the same way as `.eq()`.
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      is(column, value) {
        this.url.searchParams.append(column, `is.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` IS DISTINCT FROM `value`.
       *
       * Unlike `.neq()`, this treats `NULL` as a comparable value. Two `NULL` values
       * are considered equal (not distinct), and comparing `NULL` with any non-NULL
       * value returns true (distinct).
       *
       * @param column - The column to filter on
       * @param value - The value to filter with
       */
      isDistinct(column, value) {
        this.url.searchParams.append(column, `isdistinct.${value}`);
        return this;
      }
      /**
       * Match only rows where `column` is included in the `values` array.
       *
       * @param column - The column to filter on
       * @param values - The values array to filter with
       */
      in(column, values) {
        const cleanedValues = Array.from(new Set(values)).map((s) => {
          if (typeof s === "string" && PostgrestReservedCharsRegexp.test(s))
            return `"${s}"`;
          else
            return `${s}`;
        }).join(",");
        this.url.searchParams.append(column, `in.(${cleanedValues})`);
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * `column` contains every element appearing in `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      contains(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cs.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cs.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for jsonb, array, and range columns. Match only rows where
       * every element appearing in `column` is contained by `value`.
       *
       * @param column - The jsonb, array, or range column to filter on
       * @param value - The jsonb, array, or range value to filter with
       */
      containedBy(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `cd.${value}`);
        } else if (Array.isArray(value)) {
          this.url.searchParams.append(column, `cd.{${value.join(",")}}`);
        } else {
          this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
        }
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is greater than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGt(column, range) {
        this.url.searchParams.append(column, `sr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or greater than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeGte(column, range) {
        this.url.searchParams.append(column, `nxl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is less than any element in `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLt(column, range) {
        this.url.searchParams.append(column, `sl.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where every element in
       * `column` is either contained in `range` or less than any element in
       * `range`.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeLte(column, range) {
        this.url.searchParams.append(column, `nxr.${range}`);
        return this;
      }
      /**
       * Only relevant for range columns. Match only rows where `column` is
       * mutually exclusive to `range` and there can be no element between the two
       * ranges.
       *
       * @param column - The range column to filter on
       * @param range - The range to filter with
       */
      rangeAdjacent(column, range) {
        this.url.searchParams.append(column, `adj.${range}`);
        return this;
      }
      /**
       * Only relevant for array and range columns. Match only rows where
       * `column` and `value` have an element in common.
       *
       * @param column - The array or range column to filter on
       * @param value - The array or range value to filter with
       */
      overlaps(column, value) {
        if (typeof value === "string") {
          this.url.searchParams.append(column, `ov.${value}`);
        } else {
          this.url.searchParams.append(column, `ov.{${value.join(",")}}`);
        }
        return this;
      }
      /**
       * Only relevant for text and tsvector columns. Match only rows where
       * `column` matches the query string in `query`.
       *
       * @param column - The text or tsvector column to filter on
       * @param query - The query text to match with
       * @param options - Named parameters
       * @param options.config - The text search configuration to use
       * @param options.type - Change how the `query` text is interpreted
       */
      textSearch(column, query, { config: config2, type } = {}) {
        let typePart = "";
        if (type === "plain") {
          typePart = "pl";
        } else if (type === "phrase") {
          typePart = "ph";
        } else if (type === "websearch") {
          typePart = "w";
        }
        const configPart = config2 === void 0 ? "" : `(${config2})`;
        this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
        return this;
      }
      /**
       * Match only rows where each column in `query` keys is equal to its
       * associated value. Shorthand for multiple `.eq()`s.
       *
       * @param query - The object to filter with, with column names as keys mapped
       * to their filter values
       */
      match(query) {
        Object.entries(query).forEach(([column, value]) => {
          this.url.searchParams.append(column, `eq.${value}`);
        });
        return this;
      }
      /**
       * Match only rows which doesn't satisfy the filter.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to be negated to filter with, following
       * PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      not(column, operator, value) {
        this.url.searchParams.append(column, `not.${operator}.${value}`);
        return this;
      }
      /**
       * Match only rows which satisfy at least one of the filters.
       *
       * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure it's properly sanitized.
       *
       * It's currently not possible to do an `.or()` filter across multiple tables.
       *
       * @param filters - The filters to use, following PostgREST syntax
       * @param options - Named parameters
       * @param options.referencedTable - Set this to filter on referenced tables
       * instead of the parent table
       * @param options.foreignTable - Deprecated, use `referencedTable` instead
       */
      or(filters, { foreignTable, referencedTable = foreignTable } = {}) {
        const key = referencedTable ? `${referencedTable}.or` : "or";
        this.url.searchParams.append(key, `(${filters})`);
        return this;
      }
      /**
       * Match only rows which satisfy the filter. This is an escape hatch - you
       * should use the specific filter methods wherever possible.
       *
       * Unlike most filters, `opearator` and `value` are used as-is and need to
       * follow [PostgREST
       * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
       * to make sure they are properly sanitized.
       *
       * @param column - The column to filter on
       * @param operator - The operator to filter with, following PostgREST syntax
       * @param value - The value to filter with, following PostgREST syntax
       */
      filter(column, operator, value) {
        this.url.searchParams.append(column, `${operator}.${value}`);
        return this;
      }
    };
    exports2.default = PostgrestFilterBuilder;
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js
var require_PostgrestQueryBuilder = __commonJS({
  "node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestQueryBuilder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var PostgrestFilterBuilder_1 = tslib_1.__importDefault(require_PostgrestFilterBuilder());
    var PostgrestQueryBuilder = class {
      /**
       * Creates a query builder scoped to a Postgres table or view.
       *
       * @example
       * ```ts
       * import PostgrestQueryBuilder from '@supabase/postgrest-js'
       *
       * const query = new PostgrestQueryBuilder(
       *   new URL('https://xyzcompany.supabase.co/rest/v1/users'),
       *   { headers: { apikey: 'public-anon-key' } }
       * )
       * ```
       */
      constructor(url, { headers = {}, schema, fetch: fetch2 }) {
        this.url = url;
        this.headers = new Headers(headers);
        this.schema = schema;
        this.fetch = fetch2;
      }
      /**
       * Perform a SELECT query on the table or view.
       *
       * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
       *
       * @param options - Named parameters
       *
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       *
       * @param options.count - Count algorithm to use to count rows in the table or view.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      select(columns, options) {
        const { head = false, count } = options !== null && options !== void 0 ? options : {};
        const method = head ? "HEAD" : "GET";
        let quoted = false;
        const cleanedColumns = (columns !== null && columns !== void 0 ? columns : "*").split("").map((c) => {
          if (/\s/.test(c) && !quoted) {
            return "";
          }
          if (c === '"') {
            quoted = !quoted;
          }
          return c;
        }).join("");
        this.url.searchParams.set("select", cleanedColumns);
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: this.fetch
        });
      }
      /**
       * Perform an INSERT into the table or view.
       *
       * By default, inserted rows are not returned. To return it, chain the call
       * with `.select()`.
       *
       * @param values - The values to insert. Pass an object to insert a single row
       * or an array to insert multiple rows.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count inserted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       *
       * @param options.defaultToNull - Make missing fields default to `null`.
       * Otherwise, use the default value for the column. Only applies for bulk
       * inserts.
       */
      insert(values, { count, defaultToNull = true } = {}) {
        var _a;
        const method = "POST";
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        if (!defaultToNull) {
          this.headers.append("Prefer", `missing=default`);
        }
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
      /**
      * Perform an UPSERT on the table or view. Depending on the column(s) passed
      * to `onConflict`, `.upsert()` allows you to perform the equivalent of
      * `.insert()` if a row with the corresponding `onConflict` columns doesn't
      * exist, or if it does exist, perform an alternative action depending on
      * `ignoreDuplicates`.
      *
      * By default, upserted rows are not returned. To return it, chain the call
      * with `.select()`.
      *
      * @param values - The values to upsert with. Pass an object to upsert a
      * single row or an array to upsert multiple rows.
      *
      * @param options - Named parameters
      *
      * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
      * duplicate rows are determined. Two rows are duplicates if all the
      * `onConflict` columns are equal.
      *
      * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
      * `false`, duplicate rows are merged with existing rows.
      *
      * @param options.count - Count algorithm to use to count upserted rows.
      *
      * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
      * hood.
      *
      * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
      * statistics under the hood.
      *
      * `"estimated"`: Uses exact count for low numbers and planned count for high
      * numbers.
      *
      * @param options.defaultToNull - Make missing fields default to `null`.
      * Otherwise, use the default value for the column. This only applies when
      * inserting new rows, not when merging with existing rows under
      * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
      *
      * @example Upsert a single row using a unique key
      * ```ts
      * // Upserting a single row, overwriting based on the 'username' unique column
      * const { data, error } = await supabase
      *   .from('users')
      *   .upsert({ username: 'supabot' }, { onConflict: 'username' })
      *
      * // Example response:
      * // {
      * //   data: [
      * //     { id: 4, message: 'bar', username: 'supabot' }
      * //   ],
      * //   error: null
      * // }
      * ```
      *
      * @example Upsert with conflict resolution and exact row counting
      * ```ts
      * // Upserting and returning exact count
      * const { data, error, count } = await supabase
      *   .from('users')
      *   .upsert(
      *     {
      *       id: 3,
      *       message: 'foo',
      *       username: 'supabot'
      *     },
      *     {
      *       onConflict: 'username',
      *       count: 'exact'
      *     }
      *   )
      *
      * // Example response:
      * // {
      * //   data: [
      * //     {
      * //       id: 42,
      * //       handle: "saoirse",
      * //       display_name: "Saoirse"
      * //     }
      * //   ],
      * //   count: 1,
      * //   error: null
      * // }
      * ```
      */
      upsert(values, { onConflict, ignoreDuplicates = false, count, defaultToNull = true } = {}) {
        var _a;
        const method = "POST";
        this.headers.append("Prefer", `resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`);
        if (onConflict !== void 0)
          this.url.searchParams.set("on_conflict", onConflict);
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        if (!defaultToNull) {
          this.headers.append("Prefer", "missing=default");
        }
        if (Array.isArray(values)) {
          const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
          if (columns.length > 0) {
            const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
            this.url.searchParams.set("columns", uniqueColumns.join(","));
          }
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
      /**
       * Perform an UPDATE on the table or view.
       *
       * By default, updated rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param values - The values to update with
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count updated rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      update(values, { count } = {}) {
        var _a;
        const method = "PATCH";
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          body: values,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
      /**
       * Perform a DELETE on the table or view.
       *
       * By default, deleted rows are not returned. To return it, chain the call
       * with `.select()` after filters.
       *
       * @param options - Named parameters
       *
       * @param options.count - Count algorithm to use to count deleted rows.
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      delete({ count } = {}) {
        var _a;
        const method = "DELETE";
        if (count) {
          this.headers.append("Prefer", `count=${count}`);
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url: this.url,
          headers: this.headers,
          schema: this.schema,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
    };
    exports2.default = PostgrestQueryBuilder;
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js
var require_PostgrestClient = __commonJS({
  "node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/PostgrestClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var PostgrestQueryBuilder_1 = tslib_1.__importDefault(require_PostgrestQueryBuilder());
    var PostgrestFilterBuilder_1 = tslib_1.__importDefault(require_PostgrestFilterBuilder());
    var PostgrestClient = class _PostgrestClient {
      // TODO: Add back shouldThrowOnError once we figure out the typings
      /**
       * Creates a PostgREST client.
       *
       * @param url - URL of the PostgREST endpoint
       * @param options - Named parameters
       * @param options.headers - Custom headers
       * @param options.schema - Postgres schema to switch to
       * @param options.fetch - Custom fetch
       * @example
       * ```ts
       * import PostgrestClient from '@supabase/postgrest-js'
       *
       * const postgrest = new PostgrestClient('https://xyzcompany.supabase.co/rest/v1', {
       *   headers: { apikey: 'public-anon-key' },
       *   schema: 'public',
       * })
       * ```
       */
      constructor(url, { headers = {}, schema, fetch: fetch2 } = {}) {
        this.url = url;
        this.headers = new Headers(headers);
        this.schemaName = schema;
        this.fetch = fetch2;
      }
      /**
       * Perform a query on a table or a view.
       *
       * @param relation - The table or view name to query
       */
      from(relation) {
        if (!relation || typeof relation !== "string" || relation.trim() === "") {
          throw new Error("Invalid relation name: relation must be a non-empty string.");
        }
        const url = new URL(`${this.url}/${relation}`);
        return new PostgrestQueryBuilder_1.default(url, {
          headers: new Headers(this.headers),
          schema: this.schemaName,
          fetch: this.fetch
        });
      }
      /**
       * Select a schema to query or perform an function (rpc) call.
       *
       * The schema needs to be on the list of exposed schemas inside Supabase.
       *
       * @param schema - The schema to query
       */
      schema(schema) {
        return new _PostgrestClient(this.url, {
          headers: this.headers,
          schema,
          fetch: this.fetch
        });
      }
      /**
       * Perform a function call.
       *
       * @param fn - The function name to call
       * @param args - The arguments to pass to the function call
       * @param options - Named parameters
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       * @param options.get - When set to `true`, the function will be called with
       * read-only access mode.
       * @param options.count - Count algorithm to use to count rows returned by the
       * function. Only applicable for [set-returning
       * functions](https://www.postgresql.org/docs/current/functions-srf.html).
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      rpc(fn, args = {}, { head = false, get = false, count } = {}) {
        var _a;
        let method;
        const url = new URL(`${this.url}/rpc/${fn}`);
        let body;
        if (head || get) {
          method = head ? "HEAD" : "GET";
          Object.entries(args).filter(([_, value]) => value !== void 0).map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(",")}}` : `${value}`]).forEach(([name, value]) => {
            url.searchParams.append(name, value);
          });
        } else {
          method = "POST";
          body = args;
        }
        const headers = new Headers(this.headers);
        if (count) {
          headers.set("Prefer", `count=${count}`);
        }
        return new PostgrestFilterBuilder_1.default({
          method,
          url,
          headers,
          schema: this.schemaName,
          body,
          fetch: (_a = this.fetch) !== null && _a !== void 0 ? _a : fetch
        });
      }
    };
    exports2.default = PostgrestClient;
  }
});

// node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/index.js
var require_cjs = __commonJS({
  "node_modules/.pnpm/@supabase+postgrest-js@2.86.0/node_modules/@supabase/postgrest-js/dist/cjs/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.PostgrestError = exports2.PostgrestBuilder = exports2.PostgrestTransformBuilder = exports2.PostgrestFilterBuilder = exports2.PostgrestQueryBuilder = exports2.PostgrestClient = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var PostgrestClient_1 = tslib_1.__importDefault(require_PostgrestClient());
    exports2.PostgrestClient = PostgrestClient_1.default;
    var PostgrestQueryBuilder_1 = tslib_1.__importDefault(require_PostgrestQueryBuilder());
    exports2.PostgrestQueryBuilder = PostgrestQueryBuilder_1.default;
    var PostgrestFilterBuilder_1 = tslib_1.__importDefault(require_PostgrestFilterBuilder());
    exports2.PostgrestFilterBuilder = PostgrestFilterBuilder_1.default;
    var PostgrestTransformBuilder_1 = tslib_1.__importDefault(require_PostgrestTransformBuilder());
    exports2.PostgrestTransformBuilder = PostgrestTransformBuilder_1.default;
    var PostgrestBuilder_1 = tslib_1.__importDefault(require_PostgrestBuilder());
    exports2.PostgrestBuilder = PostgrestBuilder_1.default;
    var PostgrestError_1 = tslib_1.__importDefault(require_PostgrestError());
    exports2.PostgrestError = PostgrestError_1.default;
    exports2.default = {
      PostgrestClient: PostgrestClient_1.default,
      PostgrestQueryBuilder: PostgrestQueryBuilder_1.default,
      PostgrestFilterBuilder: PostgrestFilterBuilder_1.default,
      PostgrestTransformBuilder: PostgrestTransformBuilder_1.default,
      PostgrestBuilder: PostgrestBuilder_1.default,
      PostgrestError: PostgrestError_1.default
    };
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/websocket-factory.js
var require_websocket_factory = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/websocket-factory.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WebSocketFactory = void 0;
    var WebSocketFactory = class {
      /**
       * Static-only utility – prevent instantiation.
       */
      constructor() {
      }
      static detectEnvironment() {
        var _a;
        if (typeof WebSocket !== "undefined") {
          return { type: "native", constructor: WebSocket };
        }
        if (typeof globalThis !== "undefined" && typeof globalThis.WebSocket !== "undefined") {
          return { type: "native", constructor: globalThis.WebSocket };
        }
        if (typeof global !== "undefined" && typeof global.WebSocket !== "undefined") {
          return { type: "native", constructor: global.WebSocket };
        }
        if (typeof globalThis !== "undefined" && typeof globalThis.WebSocketPair !== "undefined" && typeof globalThis.WebSocket === "undefined") {
          return {
            type: "cloudflare",
            error: "Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",
            workaround: "Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."
          };
        }
        if (typeof globalThis !== "undefined" && globalThis.EdgeRuntime || typeof navigator !== "undefined" && ((_a = navigator.userAgent) === null || _a === void 0 ? void 0 : _a.includes("Vercel-Edge"))) {
          return {
            type: "unsupported",
            error: "Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",
            workaround: "Use serverless functions or a different deployment target for WebSocket functionality."
          };
        }
        if (typeof process !== "undefined") {
          const processVersions = process["versions"];
          if (processVersions && processVersions["node"]) {
            const versionString = processVersions["node"];
            const nodeVersion = parseInt(versionString.replace(/^v/, "").split(".")[0]);
            if (nodeVersion >= 22) {
              if (typeof globalThis.WebSocket !== "undefined") {
                return { type: "native", constructor: globalThis.WebSocket };
              }
              return {
                type: "unsupported",
                error: `Node.js ${nodeVersion} detected but native WebSocket not found.`,
                workaround: "Provide a WebSocket implementation via the transport option."
              };
            }
            return {
              type: "unsupported",
              error: `Node.js ${nodeVersion} detected without native WebSocket support.`,
              workaround: 'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })'
            };
          }
        }
        return {
          type: "unsupported",
          error: "Unknown JavaScript runtime without WebSocket support.",
          workaround: "Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."
        };
      }
      /**
       * Returns the best available WebSocket constructor for the current runtime.
       *
       * @example
       * ```ts
       * const WS = WebSocketFactory.getWebSocketConstructor()
       * const socket = new WS('wss://realtime.supabase.co/socket')
       * ```
       */
      static getWebSocketConstructor() {
        const env = this.detectEnvironment();
        if (env.constructor) {
          return env.constructor;
        }
        let errorMessage = env.error || "WebSocket not supported in this environment.";
        if (env.workaround) {
          errorMessage += `

Suggested solution: ${env.workaround}`;
        }
        throw new Error(errorMessage);
      }
      /**
       * Creates a WebSocket using the detected constructor.
       *
       * @example
       * ```ts
       * const socket = WebSocketFactory.createWebSocket('wss://realtime.supabase.co/socket')
       * ```
       */
      static createWebSocket(url, protocols) {
        const WS = this.getWebSocketConstructor();
        return new WS(url, protocols);
      }
      /**
       * Detects whether the runtime can establish WebSocket connections.
       *
       * @example
       * ```ts
       * if (!WebSocketFactory.isWebSocketSupported()) {
       *   console.warn('Falling back to long polling')
       * }
       * ```
       */
      static isWebSocketSupported() {
        try {
          const env = this.detectEnvironment();
          return env.type === "native" || env.type === "ws";
        } catch (_a) {
          return false;
        }
      }
    };
    exports2.WebSocketFactory = WebSocketFactory;
    exports2.default = WebSocketFactory;
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/version.js
var require_version = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.version = void 0;
    exports2.version = "2.86.0";
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/constants.js
var require_constants = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CONNECTION_STATE = exports2.TRANSPORTS = exports2.CHANNEL_EVENTS = exports2.CHANNEL_STATES = exports2.SOCKET_STATES = exports2.MAX_PUSH_BUFFER_SIZE = exports2.WS_CLOSE_NORMAL = exports2.DEFAULT_TIMEOUT = exports2.VERSION = exports2.DEFAULT_VSN = exports2.VSN_2_0_0 = exports2.VSN_1_0_0 = exports2.DEFAULT_VERSION = void 0;
    var version_1 = require_version();
    exports2.DEFAULT_VERSION = `realtime-js/${version_1.version}`;
    exports2.VSN_1_0_0 = "1.0.0";
    exports2.VSN_2_0_0 = "2.0.0";
    exports2.DEFAULT_VSN = exports2.VSN_1_0_0;
    exports2.VERSION = version_1.version;
    exports2.DEFAULT_TIMEOUT = 1e4;
    exports2.WS_CLOSE_NORMAL = 1e3;
    exports2.MAX_PUSH_BUFFER_SIZE = 100;
    var SOCKET_STATES;
    (function(SOCKET_STATES2) {
      SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
      SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
      SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
      SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
    })(SOCKET_STATES || (exports2.SOCKET_STATES = SOCKET_STATES = {}));
    var CHANNEL_STATES;
    (function(CHANNEL_STATES2) {
      CHANNEL_STATES2["closed"] = "closed";
      CHANNEL_STATES2["errored"] = "errored";
      CHANNEL_STATES2["joined"] = "joined";
      CHANNEL_STATES2["joining"] = "joining";
      CHANNEL_STATES2["leaving"] = "leaving";
    })(CHANNEL_STATES || (exports2.CHANNEL_STATES = CHANNEL_STATES = {}));
    var CHANNEL_EVENTS;
    (function(CHANNEL_EVENTS2) {
      CHANNEL_EVENTS2["close"] = "phx_close";
      CHANNEL_EVENTS2["error"] = "phx_error";
      CHANNEL_EVENTS2["join"] = "phx_join";
      CHANNEL_EVENTS2["reply"] = "phx_reply";
      CHANNEL_EVENTS2["leave"] = "phx_leave";
      CHANNEL_EVENTS2["access_token"] = "access_token";
    })(CHANNEL_EVENTS || (exports2.CHANNEL_EVENTS = CHANNEL_EVENTS = {}));
    var TRANSPORTS;
    (function(TRANSPORTS2) {
      TRANSPORTS2["websocket"] = "websocket";
    })(TRANSPORTS || (exports2.TRANSPORTS = TRANSPORTS = {}));
    var CONNECTION_STATE;
    (function(CONNECTION_STATE2) {
      CONNECTION_STATE2["Connecting"] = "connecting";
      CONNECTION_STATE2["Open"] = "open";
      CONNECTION_STATE2["Closing"] = "closing";
      CONNECTION_STATE2["Closed"] = "closed";
    })(CONNECTION_STATE || (exports2.CONNECTION_STATE = CONNECTION_STATE = {}));
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/serializer.js
var require_serializer = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/serializer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Serializer = class {
      constructor(allowedMetadataKeys) {
        this.HEADER_LENGTH = 1;
        this.USER_BROADCAST_PUSH_META_LENGTH = 6;
        this.KINDS = { userBroadcastPush: 3, userBroadcast: 4 };
        this.BINARY_ENCODING = 0;
        this.JSON_ENCODING = 1;
        this.BROADCAST_EVENT = "broadcast";
        this.allowedMetadataKeys = [];
        this.allowedMetadataKeys = allowedMetadataKeys !== null && allowedMetadataKeys !== void 0 ? allowedMetadataKeys : [];
      }
      encode(msg, callback) {
        if (msg.event === this.BROADCAST_EVENT && !(msg.payload instanceof ArrayBuffer) && typeof msg.payload.event === "string") {
          return callback(this._binaryEncodeUserBroadcastPush(msg));
        }
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
      _binaryEncodeUserBroadcastPush(message) {
        var _a;
        if (this._isArrayBuffer((_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload)) {
          return this._encodeBinaryUserBroadcastPush(message);
        } else {
          return this._encodeJsonUserBroadcastPush(message);
        }
      }
      _encodeBinaryUserBroadcastPush(message) {
        var _a, _b;
        const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : new ArrayBuffer(0);
        return this._encodeUserBroadcastPush(message, this.BINARY_ENCODING, userPayload);
      }
      _encodeJsonUserBroadcastPush(message) {
        var _a, _b;
        const userPayload = (_b = (_a = message.payload) === null || _a === void 0 ? void 0 : _a.payload) !== null && _b !== void 0 ? _b : {};
        const encoder = new TextEncoder();
        const encodedUserPayload = encoder.encode(JSON.stringify(userPayload)).buffer;
        return this._encodeUserBroadcastPush(message, this.JSON_ENCODING, encodedUserPayload);
      }
      _encodeUserBroadcastPush(message, encodingType, encodedPayload) {
        var _a, _b;
        const topic = message.topic;
        const ref = (_a = message.ref) !== null && _a !== void 0 ? _a : "";
        const joinRef = (_b = message.join_ref) !== null && _b !== void 0 ? _b : "";
        const userEvent = message.payload.event;
        const rest = this.allowedMetadataKeys ? this._pick(message.payload, this.allowedMetadataKeys) : {};
        const metadata = Object.keys(rest).length === 0 ? "" : JSON.stringify(rest);
        if (joinRef.length > 255) {
          throw new Error(`joinRef length ${joinRef.length} exceeds maximum of 255`);
        }
        if (ref.length > 255) {
          throw new Error(`ref length ${ref.length} exceeds maximum of 255`);
        }
        if (topic.length > 255) {
          throw new Error(`topic length ${topic.length} exceeds maximum of 255`);
        }
        if (userEvent.length > 255) {
          throw new Error(`userEvent length ${userEvent.length} exceeds maximum of 255`);
        }
        if (metadata.length > 255) {
          throw new Error(`metadata length ${metadata.length} exceeds maximum of 255`);
        }
        const metaLength = this.USER_BROADCAST_PUSH_META_LENGTH + joinRef.length + ref.length + topic.length + userEvent.length + metadata.length;
        const header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
        let view = new DataView(header);
        let offset = 0;
        view.setUint8(offset++, this.KINDS.userBroadcastPush);
        view.setUint8(offset++, joinRef.length);
        view.setUint8(offset++, ref.length);
        view.setUint8(offset++, topic.length);
        view.setUint8(offset++, userEvent.length);
        view.setUint8(offset++, metadata.length);
        view.setUint8(offset++, encodingType);
        Array.from(joinRef, (char) => view.setUint8(offset++, char.charCodeAt(0)));
        Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
        Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
        Array.from(userEvent, (char) => view.setUint8(offset++, char.charCodeAt(0)));
        Array.from(metadata, (char) => view.setUint8(offset++, char.charCodeAt(0)));
        var combined = new Uint8Array(header.byteLength + encodedPayload.byteLength);
        combined.set(new Uint8Array(header), 0);
        combined.set(new Uint8Array(encodedPayload), header.byteLength);
        return combined.buffer;
      }
      decode(rawPayload, callback) {
        if (this._isArrayBuffer(rawPayload)) {
          let result = this._binaryDecode(rawPayload);
          return callback(result);
        }
        if (typeof rawPayload === "string") {
          const jsonPayload = JSON.parse(rawPayload);
          const [join_ref, ref, topic, event, payload] = jsonPayload;
          return callback({ join_ref, ref, topic, event, payload });
        }
        return callback({});
      }
      _binaryDecode(buffer) {
        const view = new DataView(buffer);
        const kind = view.getUint8(0);
        const decoder = new TextDecoder();
        switch (kind) {
          case this.KINDS.userBroadcast:
            return this._decodeUserBroadcast(buffer, view, decoder);
        }
      }
      _decodeUserBroadcast(buffer, view, decoder) {
        const topicSize = view.getUint8(1);
        const userEventSize = view.getUint8(2);
        const metadataSize = view.getUint8(3);
        const payloadEncoding = view.getUint8(4);
        let offset = this.HEADER_LENGTH + 4;
        const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
        offset = offset + topicSize;
        const userEvent = decoder.decode(buffer.slice(offset, offset + userEventSize));
        offset = offset + userEventSize;
        const metadata = decoder.decode(buffer.slice(offset, offset + metadataSize));
        offset = offset + metadataSize;
        const payload = buffer.slice(offset, buffer.byteLength);
        const parsedPayload = payloadEncoding === this.JSON_ENCODING ? JSON.parse(decoder.decode(payload)) : payload;
        const data = {
          type: this.BROADCAST_EVENT,
          event: userEvent,
          payload: parsedPayload
        };
        if (metadataSize > 0) {
          data["meta"] = JSON.parse(metadata);
        }
        return { join_ref: null, ref: null, topic, event: this.BROADCAST_EVENT, payload: data };
      }
      _isArrayBuffer(buffer) {
        var _a;
        return buffer instanceof ArrayBuffer || ((_a = buffer === null || buffer === void 0 ? void 0 : buffer.constructor) === null || _a === void 0 ? void 0 : _a.name) === "ArrayBuffer";
      }
      _pick(obj, keys) {
        if (!obj || typeof obj !== "object") {
          return {};
        }
        return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key)));
      }
    };
    exports2.default = Serializer;
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/timer.js
var require_timer = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/timer.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Timer = class {
      constructor(callback, timerCalc) {
        this.callback = callback;
        this.timerCalc = timerCalc;
        this.timer = void 0;
        this.tries = 0;
        this.callback = callback;
        this.timerCalc = timerCalc;
      }
      reset() {
        this.tries = 0;
        clearTimeout(this.timer);
        this.timer = void 0;
      }
      // Cancels any previous scheduleTimeout and schedules callback
      scheduleTimeout() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.tries = this.tries + 1;
          this.callback();
        }, this.timerCalc(this.tries + 1));
      }
    };
    exports2.default = Timer;
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/transformers.js
var require_transformers = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/transformers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.httpEndpointURL = exports2.toTimestampString = exports2.toArray = exports2.toJson = exports2.toNumber = exports2.toBoolean = exports2.convertCell = exports2.convertColumn = exports2.convertChangeData = exports2.PostgresTypes = void 0;
    var PostgresTypes;
    (function(PostgresTypes2) {
      PostgresTypes2["abstime"] = "abstime";
      PostgresTypes2["bool"] = "bool";
      PostgresTypes2["date"] = "date";
      PostgresTypes2["daterange"] = "daterange";
      PostgresTypes2["float4"] = "float4";
      PostgresTypes2["float8"] = "float8";
      PostgresTypes2["int2"] = "int2";
      PostgresTypes2["int4"] = "int4";
      PostgresTypes2["int4range"] = "int4range";
      PostgresTypes2["int8"] = "int8";
      PostgresTypes2["int8range"] = "int8range";
      PostgresTypes2["json"] = "json";
      PostgresTypes2["jsonb"] = "jsonb";
      PostgresTypes2["money"] = "money";
      PostgresTypes2["numeric"] = "numeric";
      PostgresTypes2["oid"] = "oid";
      PostgresTypes2["reltime"] = "reltime";
      PostgresTypes2["text"] = "text";
      PostgresTypes2["time"] = "time";
      PostgresTypes2["timestamp"] = "timestamp";
      PostgresTypes2["timestamptz"] = "timestamptz";
      PostgresTypes2["timetz"] = "timetz";
      PostgresTypes2["tsrange"] = "tsrange";
      PostgresTypes2["tstzrange"] = "tstzrange";
    })(PostgresTypes || (exports2.PostgresTypes = PostgresTypes = {}));
    var convertChangeData = (columns, record, options = {}) => {
      var _a;
      const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
      if (!record) {
        return {};
      }
      return Object.keys(record).reduce((acc, rec_key) => {
        acc[rec_key] = (0, exports2.convertColumn)(rec_key, columns, record, skipTypes);
        return acc;
      }, {});
    };
    exports2.convertChangeData = convertChangeData;
    var convertColumn = (columnName, columns, record, skipTypes) => {
      const column = columns.find((x) => x.name === columnName);
      const colType = column === null || column === void 0 ? void 0 : column.type;
      const value = record[columnName];
      if (colType && !skipTypes.includes(colType)) {
        return (0, exports2.convertCell)(colType, value);
      }
      return noop(value);
    };
    exports2.convertColumn = convertColumn;
    var convertCell = (type, value) => {
      if (type.charAt(0) === "_") {
        const dataType = type.slice(1, type.length);
        return (0, exports2.toArray)(value, dataType);
      }
      switch (type) {
        case PostgresTypes.bool:
          return (0, exports2.toBoolean)(value);
        case PostgresTypes.float4:
        case PostgresTypes.float8:
        case PostgresTypes.int2:
        case PostgresTypes.int4:
        case PostgresTypes.int8:
        case PostgresTypes.numeric:
        case PostgresTypes.oid:
          return (0, exports2.toNumber)(value);
        case PostgresTypes.json:
        case PostgresTypes.jsonb:
          return (0, exports2.toJson)(value);
        case PostgresTypes.timestamp:
          return (0, exports2.toTimestampString)(value);
        // Format to be consistent with PostgREST
        case PostgresTypes.abstime:
        // To allow users to cast it based on Timezone
        case PostgresTypes.date:
        // To allow users to cast it based on Timezone
        case PostgresTypes.daterange:
        case PostgresTypes.int4range:
        case PostgresTypes.int8range:
        case PostgresTypes.money:
        case PostgresTypes.reltime:
        // To allow users to cast it based on Timezone
        case PostgresTypes.text:
        case PostgresTypes.time:
        // To allow users to cast it based on Timezone
        case PostgresTypes.timestamptz:
        // To allow users to cast it based on Timezone
        case PostgresTypes.timetz:
        // To allow users to cast it based on Timezone
        case PostgresTypes.tsrange:
        case PostgresTypes.tstzrange:
          return noop(value);
        default:
          return noop(value);
      }
    };
    exports2.convertCell = convertCell;
    var noop = (value) => {
      return value;
    };
    var toBoolean = (value) => {
      switch (value) {
        case "t":
          return true;
        case "f":
          return false;
        default:
          return value;
      }
    };
    exports2.toBoolean = toBoolean;
    var toNumber = (value) => {
      if (typeof value === "string") {
        const parsedValue = parseFloat(value);
        if (!Number.isNaN(parsedValue)) {
          return parsedValue;
        }
      }
      return value;
    };
    exports2.toNumber = toNumber;
    var toJson = (value) => {
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch (error) {
          console.log(`JSON parse error: ${error}`);
          return value;
        }
      }
      return value;
    };
    exports2.toJson = toJson;
    var toArray = (value, type) => {
      if (typeof value !== "string") {
        return value;
      }
      const lastIdx = value.length - 1;
      const closeBrace = value[lastIdx];
      const openBrace = value[0];
      if (openBrace === "{" && closeBrace === "}") {
        let arr;
        const valTrim = value.slice(1, lastIdx);
        try {
          arr = JSON.parse("[" + valTrim + "]");
        } catch (_) {
          arr = valTrim ? valTrim.split(",") : [];
        }
        return arr.map((val) => (0, exports2.convertCell)(type, val));
      }
      return value;
    };
    exports2.toArray = toArray;
    var toTimestampString = (value) => {
      if (typeof value === "string") {
        return value.replace(" ", "T");
      }
      return value;
    };
    exports2.toTimestampString = toTimestampString;
    var httpEndpointURL = (socketUrl) => {
      const wsUrl = new URL(socketUrl);
      wsUrl.protocol = wsUrl.protocol.replace(/^ws/i, "http");
      wsUrl.pathname = wsUrl.pathname.replace(/\/+$/, "").replace(/\/socket\/websocket$/i, "").replace(/\/socket$/i, "").replace(/\/websocket$/i, "");
      if (wsUrl.pathname === "" || wsUrl.pathname === "/") {
        wsUrl.pathname = "/api/broadcast";
      } else {
        wsUrl.pathname = wsUrl.pathname + "/api/broadcast";
      }
      return wsUrl.href;
    };
    exports2.httpEndpointURL = httpEndpointURL;
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/push.js
var require_push = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/lib/push.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var constants_1 = require_constants();
    var Push = class {
      /**
       * Initializes the Push
       *
       * @param channel The Channel
       * @param event The event, for example `"phx_join"`
       * @param payload The payload, for example `{user_id: 123}`
       * @param timeout The push timeout in milliseconds
       */
      constructor(channel, event, payload = {}, timeout = constants_1.DEFAULT_TIMEOUT) {
        this.channel = channel;
        this.event = event;
        this.payload = payload;
        this.timeout = timeout;
        this.sent = false;
        this.timeoutTimer = void 0;
        this.ref = "";
        this.receivedResp = null;
        this.recHooks = [];
        this.refEvent = null;
      }
      resend(timeout) {
        this.timeout = timeout;
        this._cancelRefEvent();
        this.ref = "";
        this.refEvent = null;
        this.receivedResp = null;
        this.sent = false;
        this.send();
      }
      send() {
        if (this._hasReceived("timeout")) {
          return;
        }
        this.startTimeout();
        this.sent = true;
        this.channel.socket.push({
          topic: this.channel.topic,
          event: this.event,
          payload: this.payload,
          ref: this.ref,
          join_ref: this.channel._joinRef()
        });
      }
      updatePayload(payload) {
        this.payload = Object.assign(Object.assign({}, this.payload), payload);
      }
      receive(status, callback) {
        var _a;
        if (this._hasReceived(status)) {
          callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
        }
        this.recHooks.push({ status, callback });
        return this;
      }
      startTimeout() {
        if (this.timeoutTimer) {
          return;
        }
        this.ref = this.channel.socket._makeRef();
        this.refEvent = this.channel._replyEventName(this.ref);
        const callback = (payload) => {
          this._cancelRefEvent();
          this._cancelTimeout();
          this.receivedResp = payload;
          this._matchReceive(payload);
        };
        this.channel._on(this.refEvent, {}, callback);
        this.timeoutTimer = setTimeout(() => {
          this.trigger("timeout", {});
        }, this.timeout);
      }
      trigger(status, response) {
        if (this.refEvent)
          this.channel._trigger(this.refEvent, { status, response });
      }
      destroy() {
        this._cancelRefEvent();
        this._cancelTimeout();
      }
      _cancelRefEvent() {
        if (!this.refEvent) {
          return;
        }
        this.channel._off(this.refEvent, {});
      }
      _cancelTimeout() {
        clearTimeout(this.timeoutTimer);
        this.timeoutTimer = void 0;
      }
      _matchReceive({ status, response }) {
        this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
      }
      _hasReceived(status) {
        return this.receivedResp && this.receivedResp.status === status;
      }
    };
    exports2.default = Push;
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/RealtimePresence.js
var require_RealtimePresence = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/RealtimePresence.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.REALTIME_PRESENCE_LISTEN_EVENTS = void 0;
    var REALTIME_PRESENCE_LISTEN_EVENTS;
    (function(REALTIME_PRESENCE_LISTEN_EVENTS2) {
      REALTIME_PRESENCE_LISTEN_EVENTS2["SYNC"] = "sync";
      REALTIME_PRESENCE_LISTEN_EVENTS2["JOIN"] = "join";
      REALTIME_PRESENCE_LISTEN_EVENTS2["LEAVE"] = "leave";
    })(REALTIME_PRESENCE_LISTEN_EVENTS || (exports2.REALTIME_PRESENCE_LISTEN_EVENTS = REALTIME_PRESENCE_LISTEN_EVENTS = {}));
    var RealtimePresence = class _RealtimePresence {
      /**
       * Creates a Presence helper that keeps the local presence state in sync with the server.
       *
       * @param channel - The realtime channel to bind to.
       * @param opts - Optional custom event names, e.g. `{ events: { state: 'state', diff: 'diff' } }`.
       *
       * @example
       * ```ts
       * const presence = new RealtimePresence(channel)
       *
       * channel.on('presence', ({ event, key }) => {
       *   console.log(`Presence ${event} on ${key}`)
       * })
       * ```
       */
      constructor(channel, opts) {
        this.channel = channel;
        this.state = {};
        this.pendingDiffs = [];
        this.joinRef = null;
        this.enabled = false;
        this.caller = {
          onJoin: () => {
          },
          onLeave: () => {
          },
          onSync: () => {
          }
        };
        const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
          state: "presence_state",
          diff: "presence_diff"
        };
        this.channel._on(events.state, {}, (newState) => {
          const { onJoin, onLeave, onSync } = this.caller;
          this.joinRef = this.channel._joinRef();
          this.state = _RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
          this.pendingDiffs.forEach((diff) => {
            this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
          });
          this.pendingDiffs = [];
          onSync();
        });
        this.channel._on(events.diff, {}, (diff) => {
          const { onJoin, onLeave, onSync } = this.caller;
          if (this.inPendingSyncState()) {
            this.pendingDiffs.push(diff);
          } else {
            this.state = _RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
            onSync();
          }
        });
        this.onJoin((key, currentPresences, newPresences) => {
          this.channel._trigger("presence", {
            event: "join",
            key,
            currentPresences,
            newPresences
          });
        });
        this.onLeave((key, currentPresences, leftPresences) => {
          this.channel._trigger("presence", {
            event: "leave",
            key,
            currentPresences,
            leftPresences
          });
        });
        this.onSync(() => {
          this.channel._trigger("presence", { event: "sync" });
        });
      }
      /**
       * Used to sync the list of presences on the server with the
       * client's state.
       *
       * An optional `onJoin` and `onLeave` callback can be provided to
       * react to changes in the client's local presences across
       * disconnects and reconnects with the server.
       *
       * @internal
       */
      static syncState(currentState, newState, onJoin, onLeave) {
        const state = this.cloneDeep(currentState);
        const transformedState = this.transformState(newState);
        const joins = {};
        const leaves = {};
        this.map(state, (key, presences) => {
          if (!transformedState[key]) {
            leaves[key] = presences;
          }
        });
        this.map(transformedState, (key, newPresences) => {
          const currentPresences = state[key];
          if (currentPresences) {
            const newPresenceRefs = newPresences.map((m) => m.presence_ref);
            const curPresenceRefs = currentPresences.map((m) => m.presence_ref);
            const joinedPresences = newPresences.filter((m) => curPresenceRefs.indexOf(m.presence_ref) < 0);
            const leftPresences = currentPresences.filter((m) => newPresenceRefs.indexOf(m.presence_ref) < 0);
            if (joinedPresences.length > 0) {
              joins[key] = joinedPresences;
            }
            if (leftPresences.length > 0) {
              leaves[key] = leftPresences;
            }
          } else {
            joins[key] = newPresences;
          }
        });
        return this.syncDiff(state, { joins, leaves }, onJoin, onLeave);
      }
      /**
       * Used to sync a diff of presence join and leave events from the
       * server, as they happen.
       *
       * Like `syncState`, `syncDiff` accepts optional `onJoin` and
       * `onLeave` callbacks to react to a user joining or leaving from a
       * device.
       *
       * @internal
       */
      static syncDiff(state, diff, onJoin, onLeave) {
        const { joins, leaves } = {
          joins: this.transformState(diff.joins),
          leaves: this.transformState(diff.leaves)
        };
        if (!onJoin) {
          onJoin = () => {
          };
        }
        if (!onLeave) {
          onLeave = () => {
          };
        }
        this.map(joins, (key, newPresences) => {
          var _a;
          const currentPresences = (_a = state[key]) !== null && _a !== void 0 ? _a : [];
          state[key] = this.cloneDeep(newPresences);
          if (currentPresences.length > 0) {
            const joinedPresenceRefs = state[key].map((m) => m.presence_ref);
            const curPresences = currentPresences.filter((m) => joinedPresenceRefs.indexOf(m.presence_ref) < 0);
            state[key].unshift(...curPresences);
          }
          onJoin(key, currentPresences, newPresences);
        });
        this.map(leaves, (key, leftPresences) => {
          let currentPresences = state[key];
          if (!currentPresences)
            return;
          const presenceRefsToRemove = leftPresences.map((m) => m.presence_ref);
          currentPresences = currentPresences.filter((m) => presenceRefsToRemove.indexOf(m.presence_ref) < 0);
          state[key] = currentPresences;
          onLeave(key, currentPresences, leftPresences);
          if (currentPresences.length === 0)
            delete state[key];
        });
        return state;
      }
      /** @internal */
      static map(obj, func) {
        return Object.getOwnPropertyNames(obj).map((key) => func(key, obj[key]));
      }
      /**
       * Remove 'metas' key
       * Change 'phx_ref' to 'presence_ref'
       * Remove 'phx_ref' and 'phx_ref_prev'
       *
       * @example
       * // returns {
       *  abc123: [
       *    { presence_ref: '2', user_id: 1 },
       *    { presence_ref: '3', user_id: 2 }
       *  ]
       * }
       * RealtimePresence.transformState({
       *  abc123: {
       *    metas: [
       *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
       *      { phx_ref: '3', user_id: 2 }
       *    ]
       *  }
       * })
       *
       * @internal
       */
      static transformState(state) {
        state = this.cloneDeep(state);
        return Object.getOwnPropertyNames(state).reduce((newState, key) => {
          const presences = state[key];
          if ("metas" in presences) {
            newState[key] = presences.metas.map((presence) => {
              presence["presence_ref"] = presence["phx_ref"];
              delete presence["phx_ref"];
              delete presence["phx_ref_prev"];
              return presence;
            });
          } else {
            newState[key] = presences;
          }
          return newState;
        }, {});
      }
      /** @internal */
      static cloneDeep(obj) {
        return JSON.parse(JSON.stringify(obj));
      }
      /** @internal */
      onJoin(callback) {
        this.caller.onJoin = callback;
      }
      /** @internal */
      onLeave(callback) {
        this.caller.onLeave = callback;
      }
      /** @internal */
      onSync(callback) {
        this.caller.onSync = callback;
      }
      /** @internal */
      inPendingSyncState() {
        return !this.joinRef || this.joinRef !== this.channel._joinRef();
      }
    };
    exports2.default = RealtimePresence;
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/RealtimeChannel.js
var require_RealtimeChannel = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/RealtimeChannel.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.REALTIME_CHANNEL_STATES = exports2.REALTIME_SUBSCRIBE_STATES = exports2.REALTIME_LISTEN_TYPES = exports2.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var constants_1 = require_constants();
    var push_1 = tslib_1.__importDefault(require_push());
    var timer_1 = tslib_1.__importDefault(require_timer());
    var RealtimePresence_1 = tslib_1.__importDefault(require_RealtimePresence());
    var Transformers = tslib_1.__importStar(require_transformers());
    var transformers_1 = require_transformers();
    var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
    (function(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2) {
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["ALL"] = "*";
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["INSERT"] = "INSERT";
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["UPDATE"] = "UPDATE";
      REALTIME_POSTGRES_CHANGES_LISTEN_EVENT2["DELETE"] = "DELETE";
    })(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (exports2.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
    var REALTIME_LISTEN_TYPES;
    (function(REALTIME_LISTEN_TYPES2) {
      REALTIME_LISTEN_TYPES2["BROADCAST"] = "broadcast";
      REALTIME_LISTEN_TYPES2["PRESENCE"] = "presence";
      REALTIME_LISTEN_TYPES2["POSTGRES_CHANGES"] = "postgres_changes";
      REALTIME_LISTEN_TYPES2["SYSTEM"] = "system";
    })(REALTIME_LISTEN_TYPES || (exports2.REALTIME_LISTEN_TYPES = REALTIME_LISTEN_TYPES = {}));
    var REALTIME_SUBSCRIBE_STATES;
    (function(REALTIME_SUBSCRIBE_STATES2) {
      REALTIME_SUBSCRIBE_STATES2["SUBSCRIBED"] = "SUBSCRIBED";
      REALTIME_SUBSCRIBE_STATES2["TIMED_OUT"] = "TIMED_OUT";
      REALTIME_SUBSCRIBE_STATES2["CLOSED"] = "CLOSED";
      REALTIME_SUBSCRIBE_STATES2["CHANNEL_ERROR"] = "CHANNEL_ERROR";
    })(REALTIME_SUBSCRIBE_STATES || (exports2.REALTIME_SUBSCRIBE_STATES = REALTIME_SUBSCRIBE_STATES = {}));
    exports2.REALTIME_CHANNEL_STATES = constants_1.CHANNEL_STATES;
    var RealtimeChannel = class _RealtimeChannel {
      /**
       * Creates a channel that can broadcast messages, sync presence, and listen to Postgres changes.
       *
       * The topic determines which realtime stream you are subscribing to. Config options let you
       * enable acknowledgement for broadcasts, presence tracking, or private channels.
       *
       * @example
       * ```ts
       * import RealtimeClient from '@supabase/realtime-js'
       *
       * const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
       *   params: { apikey: 'public-anon-key' },
       * })
       * const channel = new RealtimeChannel('realtime:public:messages', { config: {} }, client)
       * ```
       */
      constructor(topic, params = { config: {} }, socket) {
        var _a, _b;
        this.topic = topic;
        this.params = params;
        this.socket = socket;
        this.bindings = {};
        this.state = constants_1.CHANNEL_STATES.closed;
        this.joinedOnce = false;
        this.pushBuffer = [];
        this.subTopic = topic.replace(/^realtime:/i, "");
        this.params.config = Object.assign({
          broadcast: { ack: false, self: false },
          presence: { key: "", enabled: false },
          private: false
        }, params.config);
        this.timeout = this.socket.timeout;
        this.joinPush = new push_1.default(this, constants_1.CHANNEL_EVENTS.join, this.params, this.timeout);
        this.rejoinTimer = new timer_1.default(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
        this.joinPush.receive("ok", () => {
          this.state = constants_1.CHANNEL_STATES.joined;
          this.rejoinTimer.reset();
          this.pushBuffer.forEach((pushEvent) => pushEvent.send());
          this.pushBuffer = [];
        });
        this._onClose(() => {
          this.rejoinTimer.reset();
          this.socket.log("channel", `close ${this.topic} ${this._joinRef()}`);
          this.state = constants_1.CHANNEL_STATES.closed;
          this.socket._remove(this);
        });
        this._onError((reason) => {
          if (this._isLeaving() || this._isClosed()) {
            return;
          }
          this.socket.log("channel", `error ${this.topic}`, reason);
          this.state = constants_1.CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this.joinPush.receive("timeout", () => {
          if (!this._isJoining()) {
            return;
          }
          this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
          this.state = constants_1.CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this.joinPush.receive("error", (reason) => {
          if (this._isLeaving() || this._isClosed()) {
            return;
          }
          this.socket.log("channel", `error ${this.topic}`, reason);
          this.state = constants_1.CHANNEL_STATES.errored;
          this.rejoinTimer.scheduleTimeout();
        });
        this._on(constants_1.CHANNEL_EVENTS.reply, {}, (payload, ref) => {
          this._trigger(this._replyEventName(ref), payload);
        });
        this.presence = new RealtimePresence_1.default(this);
        this.broadcastEndpointURL = (0, transformers_1.httpEndpointURL)(this.socket.endPoint);
        this.private = this.params.config.private || false;
        if (!this.private && ((_b = (_a = this.params.config) === null || _a === void 0 ? void 0 : _a.broadcast) === null || _b === void 0 ? void 0 : _b.replay)) {
          throw `tried to use replay on public channel '${this.topic}'. It must be a private channel.`;
        }
      }
      /** Subscribe registers your client with the server */
      subscribe(callback, timeout = this.timeout) {
        var _a, _b, _c;
        if (!this.socket.isConnected()) {
          this.socket.connect();
        }
        if (this.state == constants_1.CHANNEL_STATES.closed) {
          const { config: { broadcast, presence, private: isPrivate } } = this.params;
          const postgres_changes = (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map((r) => r.filter)) !== null && _b !== void 0 ? _b : [];
          const presence_enabled = !!this.bindings[REALTIME_LISTEN_TYPES.PRESENCE] && this.bindings[REALTIME_LISTEN_TYPES.PRESENCE].length > 0 || ((_c = this.params.config.presence) === null || _c === void 0 ? void 0 : _c.enabled) === true;
          const accessTokenPayload = {};
          const config2 = {
            broadcast,
            presence: Object.assign(Object.assign({}, presence), { enabled: presence_enabled }),
            postgres_changes,
            private: isPrivate
          };
          if (this.socket.accessTokenValue) {
            accessTokenPayload.access_token = this.socket.accessTokenValue;
          }
          this._onError((e) => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, e));
          this._onClose(() => callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CLOSED));
          this.updateJoinPayload(Object.assign({ config: config2 }, accessTokenPayload));
          this.joinedOnce = true;
          this._rejoin(timeout);
          this.joinPush.receive("ok", async ({ postgres_changes: postgres_changes2 }) => {
            var _a2;
            this.socket.setAuth();
            if (postgres_changes2 === void 0) {
              callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
              return;
            } else {
              const clientPostgresBindings = this.bindings.postgres_changes;
              const bindingsLen = (_a2 = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a2 !== void 0 ? _a2 : 0;
              const newPostgresBindings = [];
              for (let i = 0; i < bindingsLen; i++) {
                const clientPostgresBinding = clientPostgresBindings[i];
                const { filter: { event, schema, table, filter } } = clientPostgresBinding;
                const serverPostgresFilter = postgres_changes2 && postgres_changes2[i];
                if (serverPostgresFilter && serverPostgresFilter.event === event && serverPostgresFilter.schema === schema && serverPostgresFilter.table === table && serverPostgresFilter.filter === filter) {
                  newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), { id: serverPostgresFilter.id }));
                } else {
                  this.unsubscribe();
                  this.state = constants_1.CHANNEL_STATES.errored;
                  callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error("mismatch between server and client bindings for postgres changes"));
                  return;
                }
              }
              this.bindings.postgres_changes = newPostgresBindings;
              callback && callback(REALTIME_SUBSCRIBE_STATES.SUBSCRIBED);
              return;
            }
          }).receive("error", (error) => {
            this.state = constants_1.CHANNEL_STATES.errored;
            callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.CHANNEL_ERROR, new Error(JSON.stringify(Object.values(error).join(", ") || "error")));
            return;
          }).receive("timeout", () => {
            callback === null || callback === void 0 ? void 0 : callback(REALTIME_SUBSCRIBE_STATES.TIMED_OUT);
            return;
          });
        }
        return this;
      }
      /**
       * Returns the current presence state for this channel.
       *
       * The shape is a map keyed by presence key (for example a user id) where each entry contains the
       * tracked metadata for that user.
       */
      presenceState() {
        return this.presence.state;
      }
      /**
       * Sends the supplied payload to the presence tracker so other subscribers can see that this
       * client is online. Use `untrack` to stop broadcasting presence for the same key.
       */
      async track(payload, opts = {}) {
        return await this.send({
          type: "presence",
          event: "track",
          payload
        }, opts.timeout || this.timeout);
      }
      /**
       * Removes the current presence state for this client.
       */
      async untrack(opts = {}) {
        return await this.send({
          type: "presence",
          event: "untrack"
        }, opts);
      }
      on(type, filter, callback) {
        if (this.state === constants_1.CHANNEL_STATES.joined && type === REALTIME_LISTEN_TYPES.PRESENCE) {
          this.socket.log("channel", `resubscribe to ${this.topic} due to change in presence callbacks on joined channel`);
          this.unsubscribe().then(() => this.subscribe());
        }
        return this._on(type, filter, callback);
      }
      /**
       * Sends a broadcast message explicitly via REST API.
       *
       * This method always uses the REST API endpoint regardless of WebSocket connection state.
       * Useful when you want to guarantee REST delivery or when gradually migrating from implicit REST fallback.
       *
       * @param event The name of the broadcast event
       * @param payload Payload to be sent (required)
       * @param opts Options including timeout
       * @returns Promise resolving to object with success status, and error details if failed
       */
      async httpSend(event, payload, opts = {}) {
        var _a;
        const authorization = this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "";
        if (payload === void 0 || payload === null) {
          return Promise.reject("Payload is required for httpSend()");
        }
        const options = {
          method: "POST",
          headers: {
            Authorization: authorization,
            apikey: this.socket.apiKey ? this.socket.apiKey : "",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              {
                topic: this.subTopic,
                event,
                payload,
                private: this.private
              }
            ]
          })
        };
        const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
        if (response.status === 202) {
          return { success: true };
        }
        let errorMessage = response.statusText;
        try {
          const errorBody = await response.json();
          errorMessage = errorBody.error || errorBody.message || errorMessage;
        } catch (_b) {
        }
        return Promise.reject(new Error(errorMessage));
      }
      /**
       * Sends a message into the channel.
       *
       * @param args Arguments to send to channel
       * @param args.type The type of event to send
       * @param args.event The name of the event being sent
       * @param args.payload Payload to be sent
       * @param opts Options to be used during the send process
       */
      async send(args, opts = {}) {
        var _a, _b;
        if (!this._canPush() && args.type === "broadcast") {
          console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");
          const { event, payload: endpoint_payload } = args;
          const authorization = this.socket.accessTokenValue ? `Bearer ${this.socket.accessTokenValue}` : "";
          const options = {
            method: "POST",
            headers: {
              Authorization: authorization,
              apikey: this.socket.apiKey ? this.socket.apiKey : "",
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              messages: [
                {
                  topic: this.subTopic,
                  event,
                  payload: endpoint_payload,
                  private: this.private
                }
              ]
            })
          };
          try {
            const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_a = opts.timeout) !== null && _a !== void 0 ? _a : this.timeout);
            await ((_b = response.body) === null || _b === void 0 ? void 0 : _b.cancel());
            return response.ok ? "ok" : "error";
          } catch (error) {
            if (error.name === "AbortError") {
              return "timed out";
            } else {
              return "error";
            }
          }
        } else {
          return new Promise((resolve) => {
            var _a2, _b2, _c;
            const push = this._push(args.type, args, opts.timeout || this.timeout);
            if (args.type === "broadcast" && !((_c = (_b2 = (_a2 = this.params) === null || _a2 === void 0 ? void 0 : _a2.config) === null || _b2 === void 0 ? void 0 : _b2.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
              resolve("ok");
            }
            push.receive("ok", () => resolve("ok"));
            push.receive("error", () => resolve("error"));
            push.receive("timeout", () => resolve("timed out"));
          });
        }
      }
      /**
       * Updates the payload that will be sent the next time the channel joins (reconnects).
       * Useful for rotating access tokens or updating config without re-creating the channel.
       */
      updateJoinPayload(payload) {
        this.joinPush.updatePayload(payload);
      }
      /**
       * Leaves the channel.
       *
       * Unsubscribes from server events, and instructs channel to terminate on server.
       * Triggers onClose() hooks.
       *
       * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
       * channel.unsubscribe().receive("ok", () => alert("left!") )
       */
      unsubscribe(timeout = this.timeout) {
        this.state = constants_1.CHANNEL_STATES.leaving;
        const onClose = () => {
          this.socket.log("channel", `leave ${this.topic}`);
          this._trigger(constants_1.CHANNEL_EVENTS.close, "leave", this._joinRef());
        };
        this.joinPush.destroy();
        let leavePush = null;
        return new Promise((resolve) => {
          leavePush = new push_1.default(this, constants_1.CHANNEL_EVENTS.leave, {}, timeout);
          leavePush.receive("ok", () => {
            onClose();
            resolve("ok");
          }).receive("timeout", () => {
            onClose();
            resolve("timed out");
          }).receive("error", () => {
            resolve("error");
          });
          leavePush.send();
          if (!this._canPush()) {
            leavePush.trigger("ok", {});
          }
        }).finally(() => {
          leavePush === null || leavePush === void 0 ? void 0 : leavePush.destroy();
        });
      }
      /**
       * Teardown the channel.
       *
       * Destroys and stops related timers.
       */
      teardown() {
        this.pushBuffer.forEach((push) => push.destroy());
        this.pushBuffer = [];
        this.rejoinTimer.reset();
        this.joinPush.destroy();
        this.state = constants_1.CHANNEL_STATES.closed;
        this.bindings = {};
      }
      /** @internal */
      async _fetchWithTimeout(url, options, timeout) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), { signal: controller.signal }));
        clearTimeout(id);
        return response;
      }
      /** @internal */
      _push(event, payload, timeout = this.timeout) {
        if (!this.joinedOnce) {
          throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
        }
        let pushEvent = new push_1.default(this, event, payload, timeout);
        if (this._canPush()) {
          pushEvent.send();
        } else {
          this._addToPushBuffer(pushEvent);
        }
        return pushEvent;
      }
      /** @internal */
      _addToPushBuffer(pushEvent) {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
        if (this.pushBuffer.length > constants_1.MAX_PUSH_BUFFER_SIZE) {
          const removedPush = this.pushBuffer.shift();
          if (removedPush) {
            removedPush.destroy();
            this.socket.log("channel", `discarded push due to buffer overflow: ${removedPush.event}`, removedPush.payload);
          }
        }
      }
      /**
       * Overridable message hook
       *
       * Receives all events for specialized message handling before dispatching to the channel callbacks.
       * Must return the payload, modified or unmodified.
       *
       * @internal
       */
      _onMessage(_event, payload, _ref) {
        return payload;
      }
      /** @internal */
      _isMember(topic) {
        return this.topic === topic;
      }
      /** @internal */
      _joinRef() {
        return this.joinPush.ref;
      }
      /** @internal */
      _trigger(type, payload, ref) {
        var _a, _b;
        const typeLower = type.toLocaleLowerCase();
        const { close, error, leave, join: join3 } = constants_1.CHANNEL_EVENTS;
        const events = [close, error, leave, join3];
        if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
          return;
        }
        let handledPayload = this._onMessage(typeLower, payload, ref);
        if (payload && !handledPayload) {
          throw "channel onMessage callbacks must return the payload, modified or unmodified";
        }
        if (["insert", "update", "delete"].includes(typeLower)) {
          (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter((bind) => {
            var _a2, _b2, _c;
            return ((_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event) === "*" || ((_c = (_b2 = bind.filter) === null || _b2 === void 0 ? void 0 : _b2.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower;
          }).map((bind) => bind.callback(handledPayload, ref));
        } else {
          (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter((bind) => {
            var _a2, _b2, _c, _d, _e, _f;
            if (["broadcast", "presence", "postgres_changes"].includes(typeLower)) {
              if ("id" in bind) {
                const bindId = bind.id;
                const bindEvent = (_a2 = bind.filter) === null || _a2 === void 0 ? void 0 : _a2.event;
                return bindId && ((_b2 = payload.ids) === null || _b2 === void 0 ? void 0 : _b2.includes(bindId)) && (bindEvent === "*" || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase()));
              } else {
                const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
                return bindEvent === "*" || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase());
              }
            } else {
              return bind.type.toLocaleLowerCase() === typeLower;
            }
          }).map((bind) => {
            if (typeof handledPayload === "object" && "ids" in handledPayload) {
              const postgresChanges = handledPayload.data;
              const { schema, table, commit_timestamp, type: type2, errors } = postgresChanges;
              const enrichedPayload = {
                schema,
                table,
                commit_timestamp,
                eventType: type2,
                new: {},
                old: {},
                errors
              };
              handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
            }
            bind.callback(handledPayload, ref);
          });
        }
      }
      /** @internal */
      _isClosed() {
        return this.state === constants_1.CHANNEL_STATES.closed;
      }
      /** @internal */
      _isJoined() {
        return this.state === constants_1.CHANNEL_STATES.joined;
      }
      /** @internal */
      _isJoining() {
        return this.state === constants_1.CHANNEL_STATES.joining;
      }
      /** @internal */
      _isLeaving() {
        return this.state === constants_1.CHANNEL_STATES.leaving;
      }
      /** @internal */
      _replyEventName(ref) {
        return `chan_reply_${ref}`;
      }
      /** @internal */
      _on(type, filter, callback) {
        const typeLower = type.toLocaleLowerCase();
        const binding = {
          type: typeLower,
          filter,
          callback
        };
        if (this.bindings[typeLower]) {
          this.bindings[typeLower].push(binding);
        } else {
          this.bindings[typeLower] = [binding];
        }
        return this;
      }
      /** @internal */
      _off(type, filter) {
        const typeLower = type.toLocaleLowerCase();
        if (this.bindings[typeLower]) {
          this.bindings[typeLower] = this.bindings[typeLower].filter((bind) => {
            var _a;
            return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && _RealtimeChannel.isEqual(bind.filter, filter));
          });
        }
        return this;
      }
      /** @internal */
      static isEqual(obj1, obj2) {
        if (Object.keys(obj1).length !== Object.keys(obj2).length) {
          return false;
        }
        for (const k in obj1) {
          if (obj1[k] !== obj2[k]) {
            return false;
          }
        }
        return true;
      }
      /** @internal */
      _rejoinUntilConnected() {
        this.rejoinTimer.scheduleTimeout();
        if (this.socket.isConnected()) {
          this._rejoin();
        }
      }
      /**
       * Registers a callback that will be executed when the channel closes.
       *
       * @internal
       */
      _onClose(callback) {
        this._on(constants_1.CHANNEL_EVENTS.close, {}, callback);
      }
      /**
       * Registers a callback that will be executed when the channel encounteres an error.
       *
       * @internal
       */
      _onError(callback) {
        this._on(constants_1.CHANNEL_EVENTS.error, {}, (reason) => callback(reason));
      }
      /**
       * Returns `true` if the socket is connected and the channel has been joined.
       *
       * @internal
       */
      _canPush() {
        return this.socket.isConnected() && this._isJoined();
      }
      /** @internal */
      _rejoin(timeout = this.timeout) {
        if (this._isLeaving()) {
          return;
        }
        this.socket._leaveOpenTopic(this.topic);
        this.state = constants_1.CHANNEL_STATES.joining;
        this.joinPush.resend(timeout);
      }
      /** @internal */
      _getPayloadRecords(payload) {
        const records = {
          new: {},
          old: {}
        };
        if (payload.type === "INSERT" || payload.type === "UPDATE") {
          records.new = Transformers.convertChangeData(payload.columns, payload.record);
        }
        if (payload.type === "UPDATE" || payload.type === "DELETE") {
          records.old = Transformers.convertChangeData(payload.columns, payload.old_record);
        }
        return records;
      }
    };
    exports2.default = RealtimeChannel;
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/RealtimeClient.js
var require_RealtimeClient = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/RealtimeClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var websocket_factory_1 = tslib_1.__importDefault(require_websocket_factory());
    var constants_1 = require_constants();
    var serializer_1 = tslib_1.__importDefault(require_serializer());
    var timer_1 = tslib_1.__importDefault(require_timer());
    var transformers_1 = require_transformers();
    var RealtimeChannel_1 = tslib_1.__importDefault(require_RealtimeChannel());
    var noop = () => {
    };
    var CONNECTION_TIMEOUTS = {
      HEARTBEAT_INTERVAL: 25e3,
      RECONNECT_DELAY: 10,
      HEARTBEAT_TIMEOUT_FALLBACK: 100
    };
    var RECONNECT_INTERVALS = [1e3, 2e3, 5e3, 1e4];
    var DEFAULT_RECONNECT_FALLBACK = 1e4;
    var WORKER_SCRIPT = `
  addEventListener("message", (e) => {
    if (e.data.event === "start") {
      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);
    }
  });`;
    var RealtimeClient = class {
      /**
       * Initializes the Socket.
       *
       * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
       * @param httpEndpoint The string HTTP endpoint, ie, "https://example.com", "/" (inherited host & protocol)
       * @param options.transport The Websocket Transport, for example WebSocket. This can be a custom implementation
       * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
       * @param options.params The optional params to pass when connecting.
       * @param options.headers Deprecated: headers cannot be set on websocket connections and this option will be removed in the future.
       * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
       * @param options.heartbeatCallback The optional function to handle heartbeat status.
       * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
       * @param options.logLevel Sets the log level for Realtime
       * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
       * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
       * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
       * @param options.worker Use Web Worker to set a side flow. Defaults to false.
       * @param options.workerUrl The URL of the worker script. Defaults to https://realtime.supabase.com/worker.js that includes a heartbeat event call to keep the connection alive.
       * @example
       * ```ts
       * import RealtimeClient from '@supabase/realtime-js'
       *
       * const client = new RealtimeClient('https://xyzcompany.supabase.co/realtime/v1', {
       *   params: { apikey: 'public-anon-key' },
       * })
       * client.connect()
       * ```
       */
      constructor(endPoint, options) {
        var _a;
        this.accessTokenValue = null;
        this.apiKey = null;
        this.channels = new Array();
        this.endPoint = "";
        this.httpEndpoint = "";
        this.headers = {};
        this.params = {};
        this.timeout = constants_1.DEFAULT_TIMEOUT;
        this.transport = null;
        this.heartbeatIntervalMs = CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
        this.heartbeatTimer = void 0;
        this.pendingHeartbeatRef = null;
        this.heartbeatCallback = noop;
        this.ref = 0;
        this.reconnectTimer = null;
        this.vsn = constants_1.DEFAULT_VSN;
        this.logger = noop;
        this.conn = null;
        this.sendBuffer = [];
        this.serializer = new serializer_1.default();
        this.stateChangeCallbacks = {
          open: [],
          close: [],
          error: [],
          message: []
        };
        this.accessToken = null;
        this._connectionState = "disconnected";
        this._wasManualDisconnect = false;
        this._authPromise = null;
        this._resolveFetch = (customFetch) => {
          if (customFetch) {
            return (...args) => customFetch(...args);
          }
          return (...args) => fetch(...args);
        };
        if (!((_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey)) {
          throw new Error("API key is required to connect to Realtime");
        }
        this.apiKey = options.params.apikey;
        this.endPoint = `${endPoint}/${constants_1.TRANSPORTS.websocket}`;
        this.httpEndpoint = (0, transformers_1.httpEndpointURL)(endPoint);
        this._initializeOptions(options);
        this._setupReconnectionTimer();
        this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
      }
      /**
       * Connects the socket, unless already connected.
       */
      connect() {
        if (this.isConnecting() || this.isDisconnecting() || this.conn !== null && this.isConnected()) {
          return;
        }
        this._setConnectionState("connecting");
        if (this.accessToken && !this._authPromise) {
          this._setAuthSafely("connect");
        }
        if (this.transport) {
          this.conn = new this.transport(this.endpointURL());
        } else {
          try {
            this.conn = websocket_factory_1.default.createWebSocket(this.endpointURL());
          } catch (error) {
            this._setConnectionState("disconnected");
            const errorMessage = error.message;
            if (errorMessage.includes("Node.js")) {
              throw new Error(`${errorMessage}

To use Realtime in Node.js, you need to provide a WebSocket implementation:

Option 1: Use Node.js 22+ which has native WebSocket support
Option 2: Install and provide the "ws" package:

  npm install ws

  import ws from "ws"
  const client = new RealtimeClient(url, {
    ...options,
    transport: ws
  })`);
            }
            throw new Error(`WebSocket not available: ${errorMessage}`);
          }
        }
        this._setupConnectionHandlers();
      }
      /**
       * Returns the URL of the websocket.
       * @returns string The URL of the websocket.
       */
      endpointURL() {
        return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: this.vsn }));
      }
      /**
       * Disconnects the socket.
       *
       * @param code A numeric status code to send on disconnect.
       * @param reason A custom reason for the disconnect.
       */
      disconnect(code, reason) {
        if (this.isDisconnecting()) {
          return;
        }
        this._setConnectionState("disconnecting", true);
        if (this.conn) {
          const fallbackTimer = setTimeout(() => {
            this._setConnectionState("disconnected");
          }, 100);
          this.conn.onclose = () => {
            clearTimeout(fallbackTimer);
            this._setConnectionState("disconnected");
          };
          if (typeof this.conn.close === "function") {
            if (code) {
              this.conn.close(code, reason !== null && reason !== void 0 ? reason : "");
            } else {
              this.conn.close();
            }
          }
          this._teardownConnection();
        } else {
          this._setConnectionState("disconnected");
        }
      }
      /**
       * Returns all created channels
       */
      getChannels() {
        return this.channels;
      }
      /**
       * Unsubscribes and removes a single channel
       * @param channel A RealtimeChannel instance
       */
      async removeChannel(channel) {
        const status = await channel.unsubscribe();
        if (this.channels.length === 0) {
          this.disconnect();
        }
        return status;
      }
      /**
       * Unsubscribes and removes all channels
       */
      async removeAllChannels() {
        const values_1 = await Promise.all(this.channels.map((channel) => channel.unsubscribe()));
        this.channels = [];
        this.disconnect();
        return values_1;
      }
      /**
       * Logs the message.
       *
       * For customized logging, `this.logger` can be overridden.
       */
      log(kind, msg, data) {
        this.logger(kind, msg, data);
      }
      /**
       * Returns the current state of the socket.
       */
      connectionState() {
        switch (this.conn && this.conn.readyState) {
          case constants_1.SOCKET_STATES.connecting:
            return constants_1.CONNECTION_STATE.Connecting;
          case constants_1.SOCKET_STATES.open:
            return constants_1.CONNECTION_STATE.Open;
          case constants_1.SOCKET_STATES.closing:
            return constants_1.CONNECTION_STATE.Closing;
          default:
            return constants_1.CONNECTION_STATE.Closed;
        }
      }
      /**
       * Returns `true` is the connection is open.
       */
      isConnected() {
        return this.connectionState() === constants_1.CONNECTION_STATE.Open;
      }
      /**
       * Returns `true` if the connection is currently connecting.
       */
      isConnecting() {
        return this._connectionState === "connecting";
      }
      /**
       * Returns `true` if the connection is currently disconnecting.
       */
      isDisconnecting() {
        return this._connectionState === "disconnecting";
      }
      /**
       * Creates (or reuses) a {@link RealtimeChannel} for the provided topic.
       *
       * Topics are automatically prefixed with `realtime:` to match the Realtime service.
       * If a channel with the same topic already exists it will be returned instead of creating
       * a duplicate connection.
       */
      channel(topic, params = { config: {} }) {
        const realtimeTopic = `realtime:${topic}`;
        const exists = this.getChannels().find((c) => c.topic === realtimeTopic);
        if (!exists) {
          const chan = new RealtimeChannel_1.default(`realtime:${topic}`, params, this);
          this.channels.push(chan);
          return chan;
        } else {
          return exists;
        }
      }
      /**
       * Push out a message if the socket is connected.
       *
       * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
       */
      push(data) {
        const { topic, event, payload, ref } = data;
        const callback = () => {
          this.encode(data, (result) => {
            var _a;
            (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
          });
        };
        this.log("push", `${topic} ${event} (${ref})`, payload);
        if (this.isConnected()) {
          callback();
        } else {
          this.sendBuffer.push(callback);
        }
      }
      /**
       * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
       *
       * If param is null it will use the `accessToken` callback function or the token set on the client.
       *
       * On callback used, it will set the value of the token internal to the client.
       *
       * @param token A JWT string to override the token set on the client.
       */
      async setAuth(token = null) {
        this._authPromise = this._performAuth(token);
        try {
          await this._authPromise;
        } finally {
          this._authPromise = null;
        }
      }
      /**
       * Sends a heartbeat message if the socket is connected.
       */
      async sendHeartbeat() {
        var _a;
        if (!this.isConnected()) {
          try {
            this.heartbeatCallback("disconnected");
          } catch (e) {
            this.log("error", "error in heartbeat callback", e);
          }
          return;
        }
        if (this.pendingHeartbeatRef) {
          this.pendingHeartbeatRef = null;
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
          try {
            this.heartbeatCallback("timeout");
          } catch (e) {
            this.log("error", "error in heartbeat callback", e);
          }
          this._wasManualDisconnect = false;
          (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(constants_1.WS_CLOSE_NORMAL, "heartbeat timeout");
          setTimeout(() => {
            var _a2;
            if (!this.isConnected()) {
              (_a2 = this.reconnectTimer) === null || _a2 === void 0 ? void 0 : _a2.scheduleTimeout();
            }
          }, CONNECTION_TIMEOUTS.HEARTBEAT_TIMEOUT_FALLBACK);
          return;
        }
        this.pendingHeartbeatRef = this._makeRef();
        this.push({
          topic: "phoenix",
          event: "heartbeat",
          payload: {},
          ref: this.pendingHeartbeatRef
        });
        try {
          this.heartbeatCallback("sent");
        } catch (e) {
          this.log("error", "error in heartbeat callback", e);
        }
        this._setAuthSafely("heartbeat");
      }
      /**
       * Sets a callback that receives lifecycle events for internal heartbeat messages.
       * Useful for instrumenting connection health (e.g. sent/ok/timeout/disconnected).
       */
      onHeartbeat(callback) {
        this.heartbeatCallback = callback;
      }
      /**
       * Flushes send buffer
       */
      flushSendBuffer() {
        if (this.isConnected() && this.sendBuffer.length > 0) {
          this.sendBuffer.forEach((callback) => callback());
          this.sendBuffer = [];
        }
      }
      /**
       * Return the next message ref, accounting for overflows
       *
       * @internal
       */
      _makeRef() {
        let newRef = this.ref + 1;
        if (newRef === this.ref) {
          this.ref = 0;
        } else {
          this.ref = newRef;
        }
        return this.ref.toString();
      }
      /**
       * Unsubscribe from channels with the specified topic.
       *
       * @internal
       */
      _leaveOpenTopic(topic) {
        let dupChannel = this.channels.find((c) => c.topic === topic && (c._isJoined() || c._isJoining()));
        if (dupChannel) {
          this.log("transport", `leaving duplicate topic "${topic}"`);
          dupChannel.unsubscribe();
        }
      }
      /**
       * Removes a subscription from the socket.
       *
       * @param channel An open subscription.
       *
       * @internal
       */
      _remove(channel) {
        this.channels = this.channels.filter((c) => c.topic !== channel.topic);
      }
      /** @internal */
      _onConnMessage(rawMessage) {
        this.decode(rawMessage.data, (msg) => {
          if (msg.topic === "phoenix" && msg.event === "phx_reply") {
            try {
              this.heartbeatCallback(msg.payload.status === "ok" ? "ok" : "error");
            } catch (e) {
              this.log("error", "error in heartbeat callback", e);
            }
          }
          if (msg.ref && msg.ref === this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null;
          }
          const { topic, event, payload, ref } = msg;
          const refString = ref ? `(${ref})` : "";
          const status = payload.status || "";
          this.log("receive", `${status} ${topic} ${event} ${refString}`.trim(), payload);
          this.channels.filter((channel) => channel._isMember(topic)).forEach((channel) => channel._trigger(event, payload, ref));
          this._triggerStateCallbacks("message", msg);
        });
      }
      /**
       * Clear specific timer
       * @internal
       */
      _clearTimer(timer) {
        var _a;
        if (timer === "heartbeat" && this.heartbeatTimer) {
          clearInterval(this.heartbeatTimer);
          this.heartbeatTimer = void 0;
        } else if (timer === "reconnect") {
          (_a = this.reconnectTimer) === null || _a === void 0 ? void 0 : _a.reset();
        }
      }
      /**
       * Clear all timers
       * @internal
       */
      _clearAllTimers() {
        this._clearTimer("heartbeat");
        this._clearTimer("reconnect");
      }
      /**
       * Setup connection handlers for WebSocket events
       * @internal
       */
      _setupConnectionHandlers() {
        if (!this.conn)
          return;
        if ("binaryType" in this.conn) {
          ;
          this.conn.binaryType = "arraybuffer";
        }
        this.conn.onopen = () => this._onConnOpen();
        this.conn.onerror = (error) => this._onConnError(error);
        this.conn.onmessage = (event) => this._onConnMessage(event);
        this.conn.onclose = (event) => this._onConnClose(event);
      }
      /**
       * Teardown connection and cleanup resources
       * @internal
       */
      _teardownConnection() {
        if (this.conn) {
          if (this.conn.readyState === constants_1.SOCKET_STATES.open || this.conn.readyState === constants_1.SOCKET_STATES.connecting) {
            try {
              this.conn.close();
            } catch (e) {
              this.log("error", "Error closing connection", e);
            }
          }
          this.conn.onopen = null;
          this.conn.onerror = null;
          this.conn.onmessage = null;
          this.conn.onclose = null;
          this.conn = null;
        }
        this._clearAllTimers();
        this.channels.forEach((channel) => channel.teardown());
      }
      /** @internal */
      _onConnOpen() {
        this._setConnectionState("connected");
        this.log("transport", `connected to ${this.endpointURL()}`);
        const authPromise = this._authPromise || (this.accessToken && !this.accessTokenValue ? this.setAuth() : Promise.resolve());
        authPromise.then(() => {
          this.flushSendBuffer();
        }).catch((e) => {
          this.log("error", "error waiting for auth on connect", e);
          this.flushSendBuffer();
        });
        this._clearTimer("reconnect");
        if (!this.worker) {
          this._startHeartbeat();
        } else {
          if (!this.workerRef) {
            this._startWorkerHeartbeat();
          }
        }
        this._triggerStateCallbacks("open");
      }
      /** @internal */
      _startHeartbeat() {
        this.heartbeatTimer && clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = setInterval(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
      }
      /** @internal */
      _startWorkerHeartbeat() {
        if (this.workerUrl) {
          this.log("worker", `starting worker for from ${this.workerUrl}`);
        } else {
          this.log("worker", `starting default worker`);
        }
        const objectUrl = this._workerObjectUrl(this.workerUrl);
        this.workerRef = new Worker(objectUrl);
        this.workerRef.onerror = (error) => {
          this.log("worker", "worker error", error.message);
          this.workerRef.terminate();
        };
        this.workerRef.onmessage = (event) => {
          if (event.data.event === "keepAlive") {
            this.sendHeartbeat();
          }
        };
        this.workerRef.postMessage({
          event: "start",
          interval: this.heartbeatIntervalMs
        });
      }
      /** @internal */
      _onConnClose(event) {
        var _a;
        this._setConnectionState("disconnected");
        this.log("transport", "close", event);
        this._triggerChanError();
        this._clearTimer("heartbeat");
        if (!this._wasManualDisconnect) {
          (_a = this.reconnectTimer) === null || _a === void 0 ? void 0 : _a.scheduleTimeout();
        }
        this._triggerStateCallbacks("close", event);
      }
      /** @internal */
      _onConnError(error) {
        this._setConnectionState("disconnected");
        this.log("transport", `${error}`);
        this._triggerChanError();
        this._triggerStateCallbacks("error", error);
      }
      /** @internal */
      _triggerChanError() {
        this.channels.forEach((channel) => channel._trigger(constants_1.CHANNEL_EVENTS.error));
      }
      /** @internal */
      _appendParams(url, params) {
        if (Object.keys(params).length === 0) {
          return url;
        }
        const prefix = url.match(/\?/) ? "&" : "?";
        const query = new URLSearchParams(params);
        return `${url}${prefix}${query}`;
      }
      _workerObjectUrl(url) {
        let result_url;
        if (url) {
          result_url = url;
        } else {
          const blob = new Blob([WORKER_SCRIPT], { type: "application/javascript" });
          result_url = URL.createObjectURL(blob);
        }
        return result_url;
      }
      /**
       * Set connection state with proper state management
       * @internal
       */
      _setConnectionState(state, manual = false) {
        this._connectionState = state;
        if (state === "connecting") {
          this._wasManualDisconnect = false;
        } else if (state === "disconnecting") {
          this._wasManualDisconnect = manual;
        }
      }
      /**
       * Perform the actual auth operation
       * @internal
       */
      async _performAuth(token = null) {
        let tokenToSend;
        if (token) {
          tokenToSend = token;
        } else if (this.accessToken) {
          tokenToSend = await this.accessToken();
        } else {
          tokenToSend = this.accessTokenValue;
        }
        if (this.accessTokenValue != tokenToSend) {
          this.accessTokenValue = tokenToSend;
          this.channels.forEach((channel) => {
            const payload = {
              access_token: tokenToSend,
              version: constants_1.DEFAULT_VERSION
            };
            tokenToSend && channel.updateJoinPayload(payload);
            if (channel.joinedOnce && channel._isJoined()) {
              channel._push(constants_1.CHANNEL_EVENTS.access_token, {
                access_token: tokenToSend
              });
            }
          });
        }
      }
      /**
       * Wait for any in-flight auth operations to complete
       * @internal
       */
      async _waitForAuthIfNeeded() {
        if (this._authPromise) {
          await this._authPromise;
        }
      }
      /**
       * Safely call setAuth with standardized error handling
       * @internal
       */
      _setAuthSafely(context = "general") {
        this.setAuth().catch((e) => {
          this.log("error", `error setting auth in ${context}`, e);
        });
      }
      /**
       * Trigger state change callbacks with proper error handling
       * @internal
       */
      _triggerStateCallbacks(event, data) {
        try {
          this.stateChangeCallbacks[event].forEach((callback) => {
            try {
              callback(data);
            } catch (e) {
              this.log("error", `error in ${event} callback`, e);
            }
          });
        } catch (e) {
          this.log("error", `error triggering ${event} callbacks`, e);
        }
      }
      /**
       * Setup reconnection timer with proper configuration
       * @internal
       */
      _setupReconnectionTimer() {
        this.reconnectTimer = new timer_1.default(async () => {
          setTimeout(async () => {
            await this._waitForAuthIfNeeded();
            if (!this.isConnected()) {
              this.connect();
            }
          }, CONNECTION_TIMEOUTS.RECONNECT_DELAY);
        }, this.reconnectAfterMs);
      }
      /**
       * Initialize client options with defaults
       * @internal
       */
      _initializeOptions(options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        this.transport = (_a = options === null || options === void 0 ? void 0 : options.transport) !== null && _a !== void 0 ? _a : null;
        this.timeout = (_b = options === null || options === void 0 ? void 0 : options.timeout) !== null && _b !== void 0 ? _b : constants_1.DEFAULT_TIMEOUT;
        this.heartbeatIntervalMs = (_c = options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) !== null && _c !== void 0 ? _c : CONNECTION_TIMEOUTS.HEARTBEAT_INTERVAL;
        this.worker = (_d = options === null || options === void 0 ? void 0 : options.worker) !== null && _d !== void 0 ? _d : false;
        this.accessToken = (_e = options === null || options === void 0 ? void 0 : options.accessToken) !== null && _e !== void 0 ? _e : null;
        this.heartbeatCallback = (_f = options === null || options === void 0 ? void 0 : options.heartbeatCallback) !== null && _f !== void 0 ? _f : noop;
        this.vsn = (_g = options === null || options === void 0 ? void 0 : options.vsn) !== null && _g !== void 0 ? _g : constants_1.DEFAULT_VSN;
        if (options === null || options === void 0 ? void 0 : options.params)
          this.params = options.params;
        if (options === null || options === void 0 ? void 0 : options.logger)
          this.logger = options.logger;
        if ((options === null || options === void 0 ? void 0 : options.logLevel) || (options === null || options === void 0 ? void 0 : options.log_level)) {
          this.logLevel = options.logLevel || options.log_level;
          this.params = Object.assign(Object.assign({}, this.params), { log_level: this.logLevel });
        }
        this.reconnectAfterMs = (_h = options === null || options === void 0 ? void 0 : options.reconnectAfterMs) !== null && _h !== void 0 ? _h : ((tries) => {
          return RECONNECT_INTERVALS[tries - 1] || DEFAULT_RECONNECT_FALLBACK;
        });
        switch (this.vsn) {
          case constants_1.VSN_1_0_0:
            this.encode = (_j = options === null || options === void 0 ? void 0 : options.encode) !== null && _j !== void 0 ? _j : ((payload, callback) => {
              return callback(JSON.stringify(payload));
            });
            this.decode = (_k = options === null || options === void 0 ? void 0 : options.decode) !== null && _k !== void 0 ? _k : ((payload, callback) => {
              return callback(JSON.parse(payload));
            });
            break;
          case constants_1.VSN_2_0_0:
            this.encode = (_l = options === null || options === void 0 ? void 0 : options.encode) !== null && _l !== void 0 ? _l : this.serializer.encode.bind(this.serializer);
            this.decode = (_m = options === null || options === void 0 ? void 0 : options.decode) !== null && _m !== void 0 ? _m : this.serializer.decode.bind(this.serializer);
            break;
          default:
            throw new Error(`Unsupported serializer version: ${this.vsn}`);
        }
        if (this.worker) {
          if (typeof window !== "undefined" && !window.Worker) {
            throw new Error("Web Worker is not supported");
          }
          this.workerUrl = options === null || options === void 0 ? void 0 : options.workerUrl;
        }
      }
    };
    exports2.default = RealtimeClient;
  }
});

// node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/index.js
var require_main3 = __commonJS({
  "node_modules/.pnpm/@supabase+realtime-js@2.86.0/node_modules/@supabase/realtime-js/dist/main/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WebSocketFactory = exports2.REALTIME_CHANNEL_STATES = exports2.REALTIME_SUBSCRIBE_STATES = exports2.REALTIME_PRESENCE_LISTEN_EVENTS = exports2.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = exports2.REALTIME_LISTEN_TYPES = exports2.RealtimeClient = exports2.RealtimeChannel = exports2.RealtimePresence = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var RealtimeClient_1 = tslib_1.__importDefault(require_RealtimeClient());
    exports2.RealtimeClient = RealtimeClient_1.default;
    var RealtimeChannel_1 = tslib_1.__importStar(require_RealtimeChannel());
    exports2.RealtimeChannel = RealtimeChannel_1.default;
    Object.defineProperty(exports2, "REALTIME_LISTEN_TYPES", { enumerable: true, get: function() {
      return RealtimeChannel_1.REALTIME_LISTEN_TYPES;
    } });
    Object.defineProperty(exports2, "REALTIME_POSTGRES_CHANGES_LISTEN_EVENT", { enumerable: true, get: function() {
      return RealtimeChannel_1.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
    } });
    Object.defineProperty(exports2, "REALTIME_SUBSCRIBE_STATES", { enumerable: true, get: function() {
      return RealtimeChannel_1.REALTIME_SUBSCRIBE_STATES;
    } });
    Object.defineProperty(exports2, "REALTIME_CHANNEL_STATES", { enumerable: true, get: function() {
      return RealtimeChannel_1.REALTIME_CHANNEL_STATES;
    } });
    var RealtimePresence_1 = tslib_1.__importStar(require_RealtimePresence());
    exports2.RealtimePresence = RealtimePresence_1.default;
    Object.defineProperty(exports2, "REALTIME_PRESENCE_LISTEN_EVENTS", { enumerable: true, get: function() {
      return RealtimePresence_1.REALTIME_PRESENCE_LISTEN_EVENTS;
    } });
    var websocket_factory_1 = tslib_1.__importDefault(require_websocket_factory());
    exports2.WebSocketFactory = websocket_factory_1.default;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/errors.js
var require_errors = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StorageUnknownError = exports2.StorageApiError = exports2.StorageError = void 0;
    exports2.isStorageError = isStorageError;
    var StorageError = class extends Error {
      constructor(message) {
        super(message);
        this.__isStorageError = true;
        this.name = "StorageError";
      }
    };
    exports2.StorageError = StorageError;
    function isStorageError(error) {
      return typeof error === "object" && error !== null && "__isStorageError" in error;
    }
    var StorageApiError = class extends StorageError {
      constructor(message, status, statusCode) {
        super(message);
        this.name = "StorageApiError";
        this.status = status;
        this.statusCode = statusCode;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status,
          statusCode: this.statusCode
        };
      }
    };
    exports2.StorageApiError = StorageApiError;
    var StorageUnknownError = class extends StorageError {
      constructor(message, originalError) {
        super(message);
        this.name = "StorageUnknownError";
        this.originalError = originalError;
      }
    };
    exports2.StorageUnknownError = StorageUnknownError;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/helpers.js
var require_helpers = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/helpers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isValidBucketName = exports2.isPlainObject = exports2.recursiveToCamel = exports2.resolveResponse = exports2.resolveFetch = void 0;
    var resolveFetch = (customFetch) => {
      if (customFetch) {
        return (...args) => customFetch(...args);
      }
      return (...args) => fetch(...args);
    };
    exports2.resolveFetch = resolveFetch;
    var resolveResponse = () => {
      return Response;
    };
    exports2.resolveResponse = resolveResponse;
    var recursiveToCamel = (item) => {
      if (Array.isArray(item)) {
        return item.map((el) => (0, exports2.recursiveToCamel)(el));
      } else if (typeof item === "function" || item !== Object(item)) {
        return item;
      }
      const result = {};
      Object.entries(item).forEach(([key, value]) => {
        const newKey = key.replace(/([-_][a-z])/gi, (c) => c.toUpperCase().replace(/[-_]/g, ""));
        result[newKey] = (0, exports2.recursiveToCamel)(value);
      });
      return result;
    };
    exports2.recursiveToCamel = recursiveToCamel;
    var isPlainObject = (value) => {
      if (typeof value !== "object" || value === null) {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
    };
    exports2.isPlainObject = isPlainObject;
    var isValidBucketName = (bucketName) => {
      if (!bucketName || typeof bucketName !== "string") {
        return false;
      }
      if (bucketName.length === 0 || bucketName.length > 100) {
        return false;
      }
      if (bucketName.trim() !== bucketName) {
        return false;
      }
      if (bucketName.includes("/") || bucketName.includes("\\")) {
        return false;
      }
      const bucketNameRegex = /^[\w!.\*'() &$@=;:+,?-]+$/;
      return bucketNameRegex.test(bucketName);
    };
    exports2.isValidBucketName = isValidBucketName;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/fetch.js
var require_fetch = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/fetch.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.get = get;
    exports2.post = post;
    exports2.put = put;
    exports2.head = head;
    exports2.remove = remove;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var errors_1 = require_errors();
    var helpers_1 = require_helpers();
    var _getErrorMessage = (err) => {
      var _a;
      return err.msg || err.message || err.error_description || (typeof err.error === "string" ? err.error : (_a = err.error) === null || _a === void 0 ? void 0 : _a.message) || JSON.stringify(err);
    };
    var handleError = (error, reject, options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
      const Res = yield (0, helpers_1.resolveResponse)();
      if (error instanceof Res && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
        error.json().then((err) => {
          const status = error.status || 500;
          const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || status + "";
          reject(new errors_1.StorageApiError(_getErrorMessage(err), status, statusCode));
        }).catch((err) => {
          reject(new errors_1.StorageUnknownError(_getErrorMessage(err), err));
        });
      } else {
        reject(new errors_1.StorageUnknownError(_getErrorMessage(error), error));
      }
    });
    var _getRequestParams = (method, options, parameters, body) => {
      const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
      if (method === "GET" || !body) {
        return params;
      }
      if ((0, helpers_1.isPlainObject)(body)) {
        params.headers = Object.assign({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
      } else {
        params.body = body;
      }
      if (options === null || options === void 0 ? void 0 : options.duplex) {
        params.duplex = options.duplex;
      }
      return Object.assign(Object.assign({}, params), parameters);
    };
    function _handleRequest(fetcher, method, url, options, parameters, body) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
          fetcher(url, _getRequestParams(method, options, parameters, body)).then((result) => {
            if (!result.ok)
              throw result;
            if (options === null || options === void 0 ? void 0 : options.noResolveJson)
              return result;
            return result.json();
          }).then((data) => resolve(data)).catch((error) => handleError(error, reject, options));
        });
      });
    }
    function get(fetcher, url, options, parameters) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, "GET", url, options, parameters);
      });
    }
    function post(fetcher, url, body, options, parameters) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, "POST", url, options, parameters, body);
      });
    }
    function put(fetcher, url, body, options, parameters) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, "PUT", url, options, parameters, body);
      });
    }
    function head(fetcher, url, options, parameters) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, "HEAD", url, Object.assign(Object.assign({}, options), { noResolveJson: true }), parameters);
      });
    }
    function remove(fetcher, url, body, options, parameters) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, "DELETE", url, options, parameters, body);
      });
    }
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/StreamDownloadBuilder.js
var require_StreamDownloadBuilder = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/StreamDownloadBuilder.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var errors_1 = require_errors();
    var StreamDownloadBuilder = class {
      constructor(downloadFn, shouldThrowOnError) {
        this.downloadFn = downloadFn;
        this.shouldThrowOnError = shouldThrowOnError;
      }
      then(onfulfilled, onrejected) {
        return this.execute().then(onfulfilled, onrejected);
      }
      execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const result = yield this.downloadFn();
            return {
              data: result.body,
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
    };
    exports2.default = StreamDownloadBuilder;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/BlobDownloadBuilder.js
var require_BlobDownloadBuilder = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/BlobDownloadBuilder.js"(exports2) {
    "use strict";
    var _a;
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var errors_1 = require_errors();
    var StreamDownloadBuilder_1 = tslib_1.__importDefault(require_StreamDownloadBuilder());
    var BlobDownloadBuilder = class {
      constructor(downloadFn, shouldThrowOnError) {
        this.downloadFn = downloadFn;
        this.shouldThrowOnError = shouldThrowOnError;
        this[_a] = "BlobDownloadBuilder";
        this.promise = null;
      }
      asStream() {
        return new StreamDownloadBuilder_1.default(this.downloadFn, this.shouldThrowOnError);
      }
      then(onfulfilled, onrejected) {
        return this.getPromise().then(onfulfilled, onrejected);
      }
      catch(onrejected) {
        return this.getPromise().catch(onrejected);
      }
      finally(onfinally) {
        return this.getPromise().finally(onfinally);
      }
      getPromise() {
        if (!this.promise) {
          this.promise = this.execute();
        }
        return this.promise;
      }
      execute() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const result = yield this.downloadFn();
            return {
              data: yield result.blob(),
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
    };
    _a = Symbol.toStringTag;
    exports2.default = BlobDownloadBuilder;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/StorageFileApi.js
var require_StorageFileApi = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/StorageFileApi.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var errors_1 = require_errors();
    var fetch_1 = require_fetch();
    var helpers_1 = require_helpers();
    var BlobDownloadBuilder_1 = tslib_1.__importDefault(require_BlobDownloadBuilder());
    var DEFAULT_SEARCH_OPTIONS = {
      limit: 100,
      offset: 0,
      sortBy: {
        column: "name",
        order: "asc"
      }
    };
    var DEFAULT_FILE_OPTIONS = {
      cacheControl: "3600",
      contentType: "text/plain;charset=UTF-8",
      upsert: false
    };
    var StorageFileApi = class {
      constructor(url, headers = {}, bucketId, fetch2) {
        this.shouldThrowOnError = false;
        this.url = url;
        this.headers = headers;
        this.bucketId = bucketId;
        this.fetch = (0, helpers_1.resolveFetch)(fetch2);
      }
      /**
       * Enable throwing errors instead of returning them.
       *
       * @category File Buckets
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /**
       * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
       *
       * @param method HTTP method.
       * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
       * @param fileBody The body of the file to be stored in the bucket.
       */
      uploadOrUpdate(method, path3, fileBody, fileOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            let body;
            const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
            let headers = Object.assign(Object.assign({}, this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
            const metadata = options.metadata;
            if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
              body = new FormData();
              body.append("cacheControl", options.cacheControl);
              if (metadata) {
                body.append("metadata", this.encodeMetadata(metadata));
              }
              body.append("", fileBody);
            } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
              body = fileBody;
              if (!body.has("cacheControl")) {
                body.append("cacheControl", options.cacheControl);
              }
              if (metadata && !body.has("metadata")) {
                body.append("metadata", this.encodeMetadata(metadata));
              }
            } else {
              body = fileBody;
              headers["cache-control"] = `max-age=${options.cacheControl}`;
              headers["content-type"] = options.contentType;
              if (metadata) {
                headers["x-metadata"] = this.toBase64(this.encodeMetadata(metadata));
              }
              const isStream = typeof ReadableStream !== "undefined" && body instanceof ReadableStream || body && typeof body === "object" && "pipe" in body && typeof body.pipe === "function";
              if (isStream && !options.duplex) {
                options.duplex = "half";
              }
            }
            if (fileOptions === null || fileOptions === void 0 ? void 0 : fileOptions.headers) {
              headers = Object.assign(Object.assign({}, headers), fileOptions.headers);
            }
            const cleanPath = this._removeEmptyFolders(path3);
            const _path = this._getFinalPath(cleanPath);
            const data = yield (method == "PUT" ? fetch_1.put : fetch_1.post)(this.fetch, `${this.url}/object/${_path}`, body, Object.assign({ headers }, (options === null || options === void 0 ? void 0 : options.duplex) ? { duplex: options.duplex } : {}));
            return {
              data: { path: cleanPath, id: data.Id, fullPath: data.Key },
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Uploads a file to an existing bucket.
       *
       * @category File Buckets
       * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
       * @param fileBody The body of the file to be stored in the bucket.
       * @param fileOptions Optional file upload options including cacheControl, contentType, upsert, and metadata.
       * @returns Promise with response containing file path, id, and fullPath or error
       *
       * @example Upload file
       * ```js
       * const avatarFile = event.target.files[0]
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .upload('public/avatar1.png', avatarFile, {
       *     cacheControl: '3600',
       *     upsert: false
       *   })
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "path": "public/avatar1.png",
       *     "fullPath": "avatars/public/avatar1.png"
       *   },
       *   "error": null
       * }
       * ```
       *
       * @example Upload file using `ArrayBuffer` from base64 file data
       * ```js
       * import { decode } from 'base64-arraybuffer'
       *
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .upload('public/avatar1.png', decode('base64FileData'), {
       *     contentType: 'image/png'
       *   })
       * ```
       */
      upload(path3, fileBody, fileOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return this.uploadOrUpdate("POST", path3, fileBody, fileOptions);
        });
      }
      /**
       * Upload a file with a token generated from `createSignedUploadUrl`.
       *
       * @category File Buckets
       * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
       * @param token The token generated from `createSignedUploadUrl`
       * @param fileBody The body of the file to be stored in the bucket.
       * @param fileOptions Optional file upload options including cacheControl and contentType.
       * @returns Promise with response containing file path and fullPath or error
       *
       * @example Upload to a signed URL
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .uploadToSignedUrl('folder/cat.jpg', 'token-from-createSignedUploadUrl', file)
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "path": "folder/cat.jpg",
       *     "fullPath": "avatars/folder/cat.jpg"
       *   },
       *   "error": null
       * }
       * ```
       */
      uploadToSignedUrl(path3, token, fileBody, fileOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          const cleanPath = this._removeEmptyFolders(path3);
          const _path = this._getFinalPath(cleanPath);
          const url = new URL(this.url + `/object/upload/sign/${_path}`);
          url.searchParams.set("token", token);
          try {
            let body;
            const options = Object.assign({ upsert: DEFAULT_FILE_OPTIONS.upsert }, fileOptions);
            const headers = Object.assign(Object.assign({}, this.headers), { "x-upsert": String(options.upsert) });
            if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
              body = new FormData();
              body.append("cacheControl", options.cacheControl);
              body.append("", fileBody);
            } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
              body = fileBody;
              body.append("cacheControl", options.cacheControl);
            } else {
              body = fileBody;
              headers["cache-control"] = `max-age=${options.cacheControl}`;
              headers["content-type"] = options.contentType;
            }
            const data = yield (0, fetch_1.put)(this.fetch, url.toString(), body, { headers });
            return {
              data: { path: cleanPath, fullPath: data.Key },
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Creates a signed upload URL.
       * Signed upload URLs can be used to upload files to the bucket without further authentication.
       * They are valid for 2 hours.
       *
       * @category File Buckets
       * @param path The file path, including the current file name. For example `folder/image.png`.
       * @param options.upsert If set to true, allows the file to be overwritten if it already exists.
       * @returns Promise with response containing signed upload URL, token, and path or error
       *
       * @example Create Signed Upload URL
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .createSignedUploadUrl('folder/cat.jpg')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "signedUrl": "https://example.supabase.co/storage/v1/object/upload/sign/avatars/folder/cat.jpg?token=<TOKEN>",
       *     "path": "folder/cat.jpg",
       *     "token": "<TOKEN>"
       *   },
       *   "error": null
       * }
       * ```
       */
      createSignedUploadUrl(path3, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            let _path = this._getFinalPath(path3);
            const headers = Object.assign({}, this.headers);
            if (options === null || options === void 0 ? void 0 : options.upsert) {
              headers["x-upsert"] = "true";
            }
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, { headers });
            const url = new URL(this.url + data.url);
            const token = url.searchParams.get("token");
            if (!token) {
              throw new errors_1.StorageError("No token returned by API");
            }
            return { data: { signedUrl: url.toString(), path: path3, token }, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Replaces an existing file at the specified path with a new one.
       *
       * @category File Buckets
       * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
       * @param fileBody The body of the file to be stored in the bucket.
       * @param fileOptions Optional file upload options including cacheControl, contentType, upsert, and metadata.
       * @returns Promise with response containing file path, id, and fullPath or error
       *
       * @example Update file
       * ```js
       * const avatarFile = event.target.files[0]
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .update('public/avatar1.png', avatarFile, {
       *     cacheControl: '3600',
       *     upsert: true
       *   })
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "path": "public/avatar1.png",
       *     "fullPath": "avatars/public/avatar1.png"
       *   },
       *   "error": null
       * }
       * ```
       *
       * @example Update file using `ArrayBuffer` from base64 file data
       * ```js
       * import {decode} from 'base64-arraybuffer'
       *
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .update('public/avatar1.png', decode('base64FileData'), {
       *     contentType: 'image/png'
       *   })
       * ```
       */
      update(path3, fileBody, fileOptions) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return this.uploadOrUpdate("PUT", path3, fileBody, fileOptions);
        });
      }
      /**
       * Moves an existing file to a new path in the same bucket.
       *
       * @category File Buckets
       * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
       * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
       * @param options The destination options.
       * @returns Promise with response containing success message or error
       *
       * @example Move file
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .move('public/avatar1.png', 'private/avatar2.png')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "message": "Successfully moved"
       *   },
       *   "error": null
       * }
       * ```
       */
      move(fromPath, toPath, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/object/move`, {
              bucketId: this.bucketId,
              sourceKey: fromPath,
              destinationKey: toPath,
              destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
            }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Copies an existing file to a new path in the same bucket.
       *
       * @category File Buckets
       * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
       * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
       * @param options The destination options.
       * @returns Promise with response containing copied file path or error
       *
       * @example Copy file
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .copy('public/avatar1.png', 'private/avatar2.png')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "path": "avatars/private/avatar2.png"
       *   },
       *   "error": null
       * }
       * ```
       */
      copy(fromPath, toPath, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/object/copy`, {
              bucketId: this.bucketId,
              sourceKey: fromPath,
              destinationKey: toPath,
              destinationBucket: options === null || options === void 0 ? void 0 : options.destinationBucket
            }, { headers: this.headers });
            return { data: { path: data.Key }, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
       *
       * @category File Buckets
       * @param path The file path, including the current file name. For example `folder/image.png`.
       * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
       * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
       * @param options.transform Transform the asset before serving it to the client.
       * @returns Promise with response containing signed URL or error
       *
       * @example Create Signed URL
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .createSignedUrl('folder/avatar1.png', 60)
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar1.png?token=<TOKEN>"
       *   },
       *   "error": null
       * }
       * ```
       *
       * @example Create a signed URL for an asset with transformations
       * ```js
       * const { data } = await supabase
       *   .storage
       *   .from('avatars')
       *   .createSignedUrl('folder/avatar1.png', 60, {
       *     transform: {
       *       width: 100,
       *       height: 100,
       *     }
       *   })
       * ```
       *
       * @example Create a signed URL which triggers the download of the asset
       * ```js
       * const { data } = await supabase
       *   .storage
       *   .from('avatars')
       *   .createSignedUrl('folder/avatar1.png', 60, {
       *     download: true,
       *   })
       * ```
       */
      createSignedUrl(path3, expiresIn, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            let _path = this._getFinalPath(path3);
            let data = yield (0, fetch_1.post)(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({ expiresIn }, (options === null || options === void 0 ? void 0 : options.transform) ? { transform: options.transform } : {}), { headers: this.headers });
            const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
            const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
            data = { signedUrl };
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
       *
       * @category File Buckets
       * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
       * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
       * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
       * @returns Promise with response containing array of objects with signedUrl, path, and error or error
       *
       * @example Create Signed URLs
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .createSignedUrls(['folder/avatar1.png', 'folder/avatar2.png'], 60)
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": [
       *     {
       *       "error": null,
       *       "path": "folder/avatar1.png",
       *       "signedURL": "/object/sign/avatars/folder/avatar1.png?token=<TOKEN>",
       *       "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar1.png?token=<TOKEN>"
       *     },
       *     {
       *       "error": null,
       *       "path": "folder/avatar2.png",
       *       "signedURL": "/object/sign/avatars/folder/avatar2.png?token=<TOKEN>",
       *       "signedUrl": "https://example.supabase.co/storage/v1/object/sign/avatars/folder/avatar2.png?token=<TOKEN>"
       *     }
       *   ],
       *   "error": null
       * }
       * ```
       */
      createSignedUrls(paths, expiresIn, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/object/sign/${this.bucketId}`, { expiresIn, paths }, { headers: this.headers });
            const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? "" : options.download}` : "";
            return {
              data: data.map((datum) => Object.assign(Object.assign({}, datum), { signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null })),
              error: null
            };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
       *
       * @category File Buckets
       * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
       * @param options.transform Transform the asset before serving it to the client.
       * @returns BlobDownloadBuilder instance for downloading the file
       *
       * @example Download file
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .download('folder/avatar1.png')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": <BLOB>,
       *   "error": null
       * }
       * ```
       *
       * @example Download file with transformations
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .download('folder/avatar1.png', {
       *     transform: {
       *       width: 100,
       *       height: 100,
       *       quality: 80
       *     }
       *   })
       * ```
       */
      download(path3, options) {
        const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
        const renderPath = wantsTransformation ? "render/image/authenticated" : "object";
        const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
        const queryString = transformationQuery ? `?${transformationQuery}` : "";
        const _path = this._getFinalPath(path3);
        const downloadFn = () => (0, fetch_1.get)(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
          headers: this.headers,
          noResolveJson: true
        });
        return new BlobDownloadBuilder_1.default(downloadFn, this.shouldThrowOnError);
      }
      /**
       * Retrieves the details of an existing file.
       *
       * @category File Buckets
       * @param path The file path, including the file name. For example `folder/image.png`.
       * @returns Promise with response containing file metadata or error
       *
       * @example Get file info
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .info('folder/avatar1.png')
       * ```
       */
      info(path3) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          const _path = this._getFinalPath(path3);
          try {
            const data = yield (0, fetch_1.get)(this.fetch, `${this.url}/object/info/${_path}`, {
              headers: this.headers
            });
            return { data: (0, helpers_1.recursiveToCamel)(data), error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Checks the existence of a file.
       *
       * @category File Buckets
       * @param path The file path, including the file name. For example `folder/image.png`.
       * @returns Promise with response containing boolean indicating file existence or error
       *
       * @example Check file existence
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .exists('folder/avatar1.png')
       * ```
       */
      exists(path3) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          const _path = this._getFinalPath(path3);
          try {
            yield (0, fetch_1.head)(this.fetch, `${this.url}/object/${_path}`, {
              headers: this.headers
            });
            return { data: true, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error) && error instanceof errors_1.StorageUnknownError) {
              const originalError = error.originalError;
              if ([400, 404].includes(originalError === null || originalError === void 0 ? void 0 : originalError.status)) {
                return { data: false, error };
              }
            }
            throw error;
          }
        });
      }
      /**
       * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
       * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
       *
       * @category File Buckets
       * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
       * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
       * @param options.transform Transform the asset before serving it to the client.
       * @returns Object with public URL
       *
       * @example Returns the URL for an asset in a public bucket
       * ```js
       * const { data } = supabase
       *   .storage
       *   .from('public-bucket')
       *   .getPublicUrl('folder/avatar1.png')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "publicUrl": "https://example.supabase.co/storage/v1/object/public/public-bucket/folder/avatar1.png"
       *   }
       * }
       * ```
       *
       * @example Returns the URL for an asset in a public bucket with transformations
       * ```js
       * const { data } = supabase
       *   .storage
       *   .from('public-bucket')
       *   .getPublicUrl('folder/avatar1.png', {
       *     transform: {
       *       width: 100,
       *       height: 100,
       *     }
       *   })
       * ```
       *
       * @example Returns the URL which triggers the download of an asset in a public bucket
       * ```js
       * const { data } = supabase
       *   .storage
       *   .from('public-bucket')
       *   .getPublicUrl('folder/avatar1.png', {
       *     download: true,
       *   })
       * ```
       */
      getPublicUrl(path3, options) {
        const _path = this._getFinalPath(path3);
        const _queryString = [];
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? "" : options.download}` : "";
        if (downloadQueryParam !== "") {
          _queryString.push(downloadQueryParam);
        }
        const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== "undefined";
        const renderPath = wantsTransformation ? "render/image" : "object";
        const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
        if (transformationQuery !== "") {
          _queryString.push(transformationQuery);
        }
        let queryString = _queryString.join("&");
        if (queryString !== "") {
          queryString = `?${queryString}`;
        }
        return {
          data: { publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`) }
        };
      }
      /**
       * Deletes files within the same bucket
       *
       * @category File Buckets
       * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
       * @returns Promise with response containing array of deleted file objects or error
       *
       * @example Delete file
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .remove(['folder/avatar1.png'])
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": [],
       *   "error": null
       * }
       * ```
       */
      remove(paths) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.remove)(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Get file metadata
       * @param id the file id to retrieve metadata
       */
      // async getMetadata(
      //   id: string
      // ): Promise<
      //   | {
      //       data: Metadata
      //       error: null
      //     }
      //   | {
      //       data: null
      //       error: StorageError
      //     }
      // > {
      //   try {
      //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
      //     return { data, error: null }
      //   } catch (error) {
      //     if (isStorageError(error)) {
      //       return { data: null, error }
      //     }
      //     throw error
      //   }
      // }
      /**
       * Update file metadata
       * @param id the file id to update metadata
       * @param meta the new file metadata
       */
      // async updateMetadata(
      //   id: string,
      //   meta: Metadata
      // ): Promise<
      //   | {
      //       data: Metadata
      //       error: null
      //     }
      //   | {
      //       data: null
      //       error: StorageError
      //     }
      // > {
      //   try {
      //     const data = await post(
      //       this.fetch,
      //       `${this.url}/metadata/${id}`,
      //       { ...meta },
      //       { headers: this.headers }
      //     )
      //     return { data, error: null }
      //   } catch (error) {
      //     if (isStorageError(error)) {
      //       return { data: null, error }
      //     }
      //     throw error
      //   }
      // }
      /**
       * Lists all the files and folders within a path of the bucket.
       *
       * @category File Buckets
       * @param path The folder path.
       * @param options Search options including limit (defaults to 100), offset, sortBy, and search
       * @param parameters Optional fetch parameters including signal for cancellation
       * @returns Promise with response containing array of files or error
       *
       * @example List files in a bucket
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .list('folder', {
       *     limit: 100,
       *     offset: 0,
       *     sortBy: { column: 'name', order: 'asc' },
       *   })
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": [
       *     {
       *       "name": "avatar1.png",
       *       "id": "e668cf7f-821b-4a2f-9dce-7dfa5dd1cfd2",
       *       "updated_at": "2024-05-22T23:06:05.580Z",
       *       "created_at": "2024-05-22T23:04:34.443Z",
       *       "last_accessed_at": "2024-05-22T23:04:34.443Z",
       *       "metadata": {
       *         "eTag": "\"c5e8c553235d9af30ef4f6e280790b92\"",
       *         "size": 32175,
       *         "mimetype": "image/png",
       *         "cacheControl": "max-age=3600",
       *         "lastModified": "2024-05-22T23:06:05.574Z",
       *         "contentLength": 32175,
       *         "httpStatusCode": 200
       *       }
       *     }
       *   ],
       *   "error": null
       * }
       * ```
       *
       * @example Search files in a bucket
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .from('avatars')
       *   .list('folder', {
       *     limit: 100,
       *     offset: 0,
       *     sortBy: { column: 'name', order: 'asc' },
       *     search: 'jon'
       *   })
       * ```
       */
      list(path3, options, parameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path3 || "" });
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * @experimental this method signature might change in the future
       *
       * @category File Buckets
       * @param options search options
       * @param parameters
       */
      listV2(options, parameters) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const body = Object.assign({}, options);
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/object/list-v2/${this.bucketId}`, body, { headers: this.headers }, parameters);
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      encodeMetadata(metadata) {
        return JSON.stringify(metadata);
      }
      toBase64(data) {
        if (typeof Buffer !== "undefined") {
          return Buffer.from(data).toString("base64");
        }
        return btoa(data);
      }
      _getFinalPath(path3) {
        return `${this.bucketId}/${path3.replace(/^\/+/, "")}`;
      }
      _removeEmptyFolders(path3) {
        return path3.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
      }
      transformOptsToQueryString(transform) {
        const params = [];
        if (transform.width) {
          params.push(`width=${transform.width}`);
        }
        if (transform.height) {
          params.push(`height=${transform.height}`);
        }
        if (transform.resize) {
          params.push(`resize=${transform.resize}`);
        }
        if (transform.format) {
          params.push(`format=${transform.format}`);
        }
        if (transform.quality) {
          params.push(`quality=${transform.quality}`);
        }
        return params.join("&");
      }
    };
    exports2.default = StorageFileApi;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/version.js
var require_version2 = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.version = void 0;
    exports2.version = "2.86.0";
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/constants.js
var require_constants2 = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DEFAULT_HEADERS = void 0;
    var version_1 = require_version2();
    exports2.DEFAULT_HEADERS = {
      "X-Client-Info": `storage-js/${version_1.version}`
    };
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/StorageBucketApi.js
var require_StorageBucketApi = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/StorageBucketApi.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var constants_1 = require_constants2();
    var errors_1 = require_errors();
    var fetch_1 = require_fetch();
    var helpers_1 = require_helpers();
    var StorageBucketApi = class {
      constructor(url, headers = {}, fetch2, opts) {
        this.shouldThrowOnError = false;
        const baseUrl = new URL(url);
        if (opts === null || opts === void 0 ? void 0 : opts.useNewHostname) {
          const isSupabaseHost = /supabase\.(co|in|red)$/.test(baseUrl.hostname);
          if (isSupabaseHost && !baseUrl.hostname.includes("storage.supabase.")) {
            baseUrl.hostname = baseUrl.hostname.replace("supabase.", "storage.supabase.");
          }
        }
        this.url = baseUrl.href.replace(/\/$/, "");
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.fetch = (0, helpers_1.resolveFetch)(fetch2);
      }
      /**
       * Enable throwing errors instead of returning them.
       *
       * @category File Buckets
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /**
       * Retrieves the details of all Storage buckets within an existing project.
       *
       * @category File Buckets
       * @param options Query parameters for listing buckets
       * @param options.limit Maximum number of buckets to return
       * @param options.offset Number of buckets to skip
       * @param options.sortColumn Column to sort by ('id', 'name', 'created_at', 'updated_at')
       * @param options.sortOrder Sort order ('asc' or 'desc')
       * @param options.search Search term to filter bucket names
       * @returns Promise with response containing array of buckets or error
       *
       * @example List buckets
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .listBuckets()
       * ```
       *
       * @example List buckets with options
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .listBuckets({
       *     limit: 10,
       *     offset: 0,
       *     sortColumn: 'created_at',
       *     sortOrder: 'desc',
       *     search: 'prod'
       *   })
       * ```
       */
      listBuckets(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const queryString = this.listBucketOptionsToQueryString(options);
            const data = yield (0, fetch_1.get)(this.fetch, `${this.url}/bucket${queryString}`, {
              headers: this.headers
            });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Retrieves the details of an existing Storage bucket.
       *
       * @category File Buckets
       * @param id The unique identifier of the bucket you would like to retrieve.
       * @returns Promise with response containing bucket details or error
       *
       * @example Get bucket
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .getBucket('avatars')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "id": "avatars",
       *     "name": "avatars",
       *     "owner": "",
       *     "public": false,
       *     "file_size_limit": 1024,
       *     "allowed_mime_types": [
       *       "image/png"
       *     ],
       *     "created_at": "2024-05-22T22:26:05.100Z",
       *     "updated_at": "2024-05-22T22:26:05.100Z"
       *   },
       *   "error": null
       * }
       * ```
       */
      getBucket(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.get)(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Creates a new Storage bucket
       *
       * @category File Buckets
       * @param id A unique identifier for the bucket you are creating.
       * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
       * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
       * The global file size limit takes precedence over this value.
       * The default value is null, which doesn't set a per bucket file size limit.
       * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
       * The default value is null, which allows files with all mime types to be uploaded.
       * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
       * @param options.type (private-beta) specifies the bucket type. see `BucketType` for more details.
       *   - default bucket type is `STANDARD`
       * @returns Promise with response containing newly created bucket name or error
       *
       * @example Create bucket
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .createBucket('avatars', {
       *     public: false,
       *     allowedMimeTypes: ['image/png'],
       *     fileSizeLimit: 1024
       *   })
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "name": "avatars"
       *   },
       *   "error": null
       * }
       * ```
       */
      createBucket(id_1) {
        return tslib_1.__awaiter(this, arguments, void 0, function* (id, options = {
          public: false
        }) {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/bucket`, {
              id,
              name: id,
              type: options.type,
              public: options.public,
              file_size_limit: options.fileSizeLimit,
              allowed_mime_types: options.allowedMimeTypes
            }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Updates a Storage bucket
       *
       * @category File Buckets
       * @param id A unique identifier for the bucket you are updating.
       * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
       * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
       * The global file size limit takes precedence over this value.
       * The default value is null, which doesn't set a per bucket file size limit.
       * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
       * The default value is null, which allows files with all mime types to be uploaded.
       * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
       * @returns Promise with response containing success message or error
       *
       * @example Update bucket
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .updateBucket('avatars', {
       *     public: false,
       *     allowedMimeTypes: ['image/png'],
       *     fileSizeLimit: 1024
       *   })
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "message": "Successfully updated"
       *   },
       *   "error": null
       * }
       * ```
       */
      updateBucket(id, options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.put)(this.fetch, `${this.url}/bucket/${id}`, {
              id,
              name: id,
              public: options.public,
              file_size_limit: options.fileSizeLimit,
              allowed_mime_types: options.allowedMimeTypes
            }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Removes all objects inside a single bucket.
       *
       * @category File Buckets
       * @param id The unique identifier of the bucket you would like to empty.
       * @returns Promise with success message or error
       *
       * @example Empty bucket
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .emptyBucket('avatars')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "message": "Successfully emptied"
       *   },
       *   "error": null
       * }
       * ```
       */
      emptyBucket(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
       * You must first `empty()` the bucket.
       *
       * @category File Buckets
       * @param id The unique identifier of the bucket you would like to delete.
       * @returns Promise with success message or error
       *
       * @example Delete bucket
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .deleteBucket('avatars')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "message": "Successfully deleted"
       *   },
       *   "error": null
       * }
       * ```
       */
      deleteBucket(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.remove)(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      listBucketOptionsToQueryString(options) {
        const params = {};
        if (options) {
          if ("limit" in options) {
            params.limit = String(options.limit);
          }
          if ("offset" in options) {
            params.offset = String(options.offset);
          }
          if (options.search) {
            params.search = options.search;
          }
          if (options.sortColumn) {
            params.sortColumn = options.sortColumn;
          }
          if (options.sortOrder) {
            params.sortOrder = options.sortOrder;
          }
        }
        return Object.keys(params).length > 0 ? "?" + new URLSearchParams(params).toString() : "";
      }
    };
    exports2.default = StorageBucketApi;
  }
});

// node_modules/.pnpm/iceberg-js@0.8.0/node_modules/iceberg-js/dist/index.cjs
var require_dist = __commonJS({
  "node_modules/.pnpm/iceberg-js@0.8.0/node_modules/iceberg-js/dist/index.cjs"(exports2) {
    "use strict";
    var IcebergError = class extends Error {
      constructor(message, opts) {
        super(message);
        this.name = "IcebergError";
        this.status = opts.status;
        this.icebergType = opts.icebergType;
        this.icebergCode = opts.icebergCode;
        this.details = opts.details;
        this.isCommitStateUnknown = opts.icebergType === "CommitStateUnknownException" || [500, 502, 504].includes(opts.status) && opts.icebergType?.includes("CommitState") === true;
      }
      /**
       * Returns true if the error is a 404 Not Found error.
       */
      isNotFound() {
        return this.status === 404;
      }
      /**
       * Returns true if the error is a 409 Conflict error.
       */
      isConflict() {
        return this.status === 409;
      }
      /**
       * Returns true if the error is a 419 Authentication Timeout error.
       */
      isAuthenticationTimeout() {
        return this.status === 419;
      }
    };
    function buildUrl(baseUrl, path3, query) {
      const url = new URL(path3, baseUrl);
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          if (value !== void 0) {
            url.searchParams.set(key, value);
          }
        }
      }
      return url.toString();
    }
    async function buildAuthHeaders(auth) {
      if (!auth || auth.type === "none") {
        return {};
      }
      if (auth.type === "bearer") {
        return { Authorization: `Bearer ${auth.token}` };
      }
      if (auth.type === "header") {
        return { [auth.name]: auth.value };
      }
      if (auth.type === "custom") {
        return await auth.getHeaders();
      }
      return {};
    }
    function createFetchClient(options) {
      const fetchFn = options.fetchImpl ?? globalThis.fetch;
      return {
        async request({
          method,
          path: path3,
          query,
          body,
          headers
        }) {
          const url = buildUrl(options.baseUrl, path3, query);
          const authHeaders = await buildAuthHeaders(options.auth);
          const res = await fetchFn(url, {
            method,
            headers: {
              ...body ? { "Content-Type": "application/json" } : {},
              ...authHeaders,
              ...headers
            },
            body: body ? JSON.stringify(body) : void 0
          });
          const text = await res.text();
          const isJson = (res.headers.get("content-type") || "").includes("application/json");
          const data = isJson && text ? JSON.parse(text) : text;
          if (!res.ok) {
            const errBody = isJson ? data : void 0;
            const errorDetail = errBody?.error;
            throw new IcebergError(
              errorDetail?.message ?? `Request failed with status ${res.status}`,
              {
                status: res.status,
                icebergType: errorDetail?.type,
                icebergCode: errorDetail?.code,
                details: errBody
              }
            );
          }
          return { status: res.status, headers: res.headers, data };
        }
      };
    }
    function namespaceToPath(namespace) {
      return namespace.join("");
    }
    var NamespaceOperations = class {
      constructor(client, prefix = "") {
        this.client = client;
        this.prefix = prefix;
      }
      async listNamespaces(parent) {
        const query = parent ? { parent: namespaceToPath(parent.namespace) } : void 0;
        const response = await this.client.request({
          method: "GET",
          path: `${this.prefix}/namespaces`,
          query
        });
        return response.data.namespaces.map((ns) => ({ namespace: ns }));
      }
      async createNamespace(id, metadata) {
        const request = {
          namespace: id.namespace,
          properties: metadata?.properties
        };
        const response = await this.client.request({
          method: "POST",
          path: `${this.prefix}/namespaces`,
          body: request
        });
        return response.data;
      }
      async dropNamespace(id) {
        await this.client.request({
          method: "DELETE",
          path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
        });
      }
      async loadNamespaceMetadata(id) {
        const response = await this.client.request({
          method: "GET",
          path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
        });
        return {
          properties: response.data.properties
        };
      }
      async namespaceExists(id) {
        try {
          await this.client.request({
            method: "HEAD",
            path: `${this.prefix}/namespaces/${namespaceToPath(id.namespace)}`
          });
          return true;
        } catch (error) {
          if (error instanceof IcebergError && error.status === 404) {
            return false;
          }
          throw error;
        }
      }
      async createNamespaceIfNotExists(id, metadata) {
        try {
          return await this.createNamespace(id, metadata);
        } catch (error) {
          if (error instanceof IcebergError && error.status === 409) {
            return;
          }
          throw error;
        }
      }
    };
    function namespaceToPath2(namespace) {
      return namespace.join("");
    }
    var TableOperations = class {
      constructor(client, prefix = "", accessDelegation) {
        this.client = client;
        this.prefix = prefix;
        this.accessDelegation = accessDelegation;
      }
      async listTables(namespace) {
        const response = await this.client.request({
          method: "GET",
          path: `${this.prefix}/namespaces/${namespaceToPath2(namespace.namespace)}/tables`
        });
        return response.data.identifiers;
      }
      async createTable(namespace, request) {
        const headers = {};
        if (this.accessDelegation) {
          headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
        }
        const response = await this.client.request({
          method: "POST",
          path: `${this.prefix}/namespaces/${namespaceToPath2(namespace.namespace)}/tables`,
          body: request,
          headers
        });
        return response.data.metadata;
      }
      async updateTable(id, request) {
        const response = await this.client.request({
          method: "POST",
          path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
          body: request
        });
        return {
          "metadata-location": response.data["metadata-location"],
          metadata: response.data.metadata
        };
      }
      async dropTable(id, options) {
        await this.client.request({
          method: "DELETE",
          path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
          query: { purgeRequested: String(options?.purge ?? false) }
        });
      }
      async loadTable(id) {
        const headers = {};
        if (this.accessDelegation) {
          headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
        }
        const response = await this.client.request({
          method: "GET",
          path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
          headers
        });
        return response.data.metadata;
      }
      async tableExists(id) {
        const headers = {};
        if (this.accessDelegation) {
          headers["X-Iceberg-Access-Delegation"] = this.accessDelegation;
        }
        try {
          await this.client.request({
            method: "HEAD",
            path: `${this.prefix}/namespaces/${namespaceToPath2(id.namespace)}/tables/${id.name}`,
            headers
          });
          return true;
        } catch (error) {
          if (error instanceof IcebergError && error.status === 404) {
            return false;
          }
          throw error;
        }
      }
      async createTableIfNotExists(namespace, request) {
        try {
          return await this.createTable(namespace, request);
        } catch (error) {
          if (error instanceof IcebergError && error.status === 409) {
            return await this.loadTable({ namespace: namespace.namespace, name: request.name });
          }
          throw error;
        }
      }
    };
    var IcebergRestCatalog = class {
      /**
       * Creates a new Iceberg REST Catalog client.
       *
       * @param options - Configuration options for the catalog client
       */
      constructor(options) {
        let prefix = "v1";
        if (options.catalogName) {
          prefix += `/${options.catalogName}`;
        }
        const baseUrl = options.baseUrl.endsWith("/") ? options.baseUrl : `${options.baseUrl}/`;
        this.client = createFetchClient({
          baseUrl,
          auth: options.auth,
          fetchImpl: options.fetch
        });
        this.accessDelegation = options.accessDelegation?.join(",");
        this.namespaceOps = new NamespaceOperations(this.client, prefix);
        this.tableOps = new TableOperations(this.client, prefix, this.accessDelegation);
      }
      /**
       * Lists all namespaces in the catalog.
       *
       * @param parent - Optional parent namespace to list children under
       * @returns Array of namespace identifiers
       *
       * @example
       * ```typescript
       * // List all top-level namespaces
       * const namespaces = await catalog.listNamespaces();
       *
       * // List namespaces under a parent
       * const children = await catalog.listNamespaces({ namespace: ['analytics'] });
       * ```
       */
      async listNamespaces(parent) {
        return this.namespaceOps.listNamespaces(parent);
      }
      /**
       * Creates a new namespace in the catalog.
       *
       * @param id - Namespace identifier to create
       * @param metadata - Optional metadata properties for the namespace
       * @returns Response containing the created namespace and its properties
       *
       * @example
       * ```typescript
       * const response = await catalog.createNamespace(
       *   { namespace: ['analytics'] },
       *   { properties: { owner: 'data-team' } }
       * );
       * console.log(response.namespace); // ['analytics']
       * console.log(response.properties); // { owner: 'data-team', ... }
       * ```
       */
      async createNamespace(id, metadata) {
        return this.namespaceOps.createNamespace(id, metadata);
      }
      /**
       * Drops a namespace from the catalog.
       *
       * The namespace must be empty (contain no tables) before it can be dropped.
       *
       * @param id - Namespace identifier to drop
       *
       * @example
       * ```typescript
       * await catalog.dropNamespace({ namespace: ['analytics'] });
       * ```
       */
      async dropNamespace(id) {
        await this.namespaceOps.dropNamespace(id);
      }
      /**
       * Loads metadata for a namespace.
       *
       * @param id - Namespace identifier to load
       * @returns Namespace metadata including properties
       *
       * @example
       * ```typescript
       * const metadata = await catalog.loadNamespaceMetadata({ namespace: ['analytics'] });
       * console.log(metadata.properties);
       * ```
       */
      async loadNamespaceMetadata(id) {
        return this.namespaceOps.loadNamespaceMetadata(id);
      }
      /**
       * Lists all tables in a namespace.
       *
       * @param namespace - Namespace identifier to list tables from
       * @returns Array of table identifiers
       *
       * @example
       * ```typescript
       * const tables = await catalog.listTables({ namespace: ['analytics'] });
       * console.log(tables); // [{ namespace: ['analytics'], name: 'events' }, ...]
       * ```
       */
      async listTables(namespace) {
        return this.tableOps.listTables(namespace);
      }
      /**
       * Creates a new table in the catalog.
       *
       * @param namespace - Namespace to create the table in
       * @param request - Table creation request including name, schema, partition spec, etc.
       * @returns Table metadata for the created table
       *
       * @example
       * ```typescript
       * const metadata = await catalog.createTable(
       *   { namespace: ['analytics'] },
       *   {
       *     name: 'events',
       *     schema: {
       *       type: 'struct',
       *       fields: [
       *         { id: 1, name: 'id', type: 'long', required: true },
       *         { id: 2, name: 'timestamp', type: 'timestamp', required: true }
       *       ],
       *       'schema-id': 0
       *     },
       *     'partition-spec': {
       *       'spec-id': 0,
       *       fields: [
       *         { source_id: 2, field_id: 1000, name: 'ts_day', transform: 'day' }
       *       ]
       *     }
       *   }
       * );
       * ```
       */
      async createTable(namespace, request) {
        return this.tableOps.createTable(namespace, request);
      }
      /**
       * Updates an existing table's metadata.
       *
       * Can update the schema, partition spec, or properties of a table.
       *
       * @param id - Table identifier to update
       * @param request - Update request with fields to modify
       * @returns Response containing the metadata location and updated table metadata
       *
       * @example
       * ```typescript
       * const response = await catalog.updateTable(
       *   { namespace: ['analytics'], name: 'events' },
       *   {
       *     properties: { 'read.split.target-size': '134217728' }
       *   }
       * );
       * console.log(response['metadata-location']); // s3://...
       * console.log(response.metadata); // TableMetadata object
       * ```
       */
      async updateTable(id, request) {
        return this.tableOps.updateTable(id, request);
      }
      /**
       * Drops a table from the catalog.
       *
       * @param id - Table identifier to drop
       *
       * @example
       * ```typescript
       * await catalog.dropTable({ namespace: ['analytics'], name: 'events' });
       * ```
       */
      async dropTable(id, options) {
        await this.tableOps.dropTable(id, options);
      }
      /**
       * Loads metadata for a table.
       *
       * @param id - Table identifier to load
       * @returns Table metadata including schema, partition spec, location, etc.
       *
       * @example
       * ```typescript
       * const metadata = await catalog.loadTable({ namespace: ['analytics'], name: 'events' });
       * console.log(metadata.schema);
       * console.log(metadata.location);
       * ```
       */
      async loadTable(id) {
        return this.tableOps.loadTable(id);
      }
      /**
       * Checks if a namespace exists in the catalog.
       *
       * @param id - Namespace identifier to check
       * @returns True if the namespace exists, false otherwise
       *
       * @example
       * ```typescript
       * const exists = await catalog.namespaceExists({ namespace: ['analytics'] });
       * console.log(exists); // true or false
       * ```
       */
      async namespaceExists(id) {
        return this.namespaceOps.namespaceExists(id);
      }
      /**
       * Checks if a table exists in the catalog.
       *
       * @param id - Table identifier to check
       * @returns True if the table exists, false otherwise
       *
       * @example
       * ```typescript
       * const exists = await catalog.tableExists({ namespace: ['analytics'], name: 'events' });
       * console.log(exists); // true or false
       * ```
       */
      async tableExists(id) {
        return this.tableOps.tableExists(id);
      }
      /**
       * Creates a namespace if it does not exist.
       *
       * If the namespace already exists, returns void. If created, returns the response.
       *
       * @param id - Namespace identifier to create
       * @param metadata - Optional metadata properties for the namespace
       * @returns Response containing the created namespace and its properties, or void if it already exists
       *
       * @example
       * ```typescript
       * const response = await catalog.createNamespaceIfNotExists(
       *   { namespace: ['analytics'] },
       *   { properties: { owner: 'data-team' } }
       * );
       * if (response) {
       *   console.log('Created:', response.namespace);
       * } else {
       *   console.log('Already exists');
       * }
       * ```
       */
      async createNamespaceIfNotExists(id, metadata) {
        return this.namespaceOps.createNamespaceIfNotExists(id, metadata);
      }
      /**
       * Creates a table if it does not exist.
       *
       * If the table already exists, returns its metadata instead.
       *
       * @param namespace - Namespace to create the table in
       * @param request - Table creation request including name, schema, partition spec, etc.
       * @returns Table metadata for the created or existing table
       *
       * @example
       * ```typescript
       * const metadata = await catalog.createTableIfNotExists(
       *   { namespace: ['analytics'] },
       *   {
       *     name: 'events',
       *     schema: {
       *       type: 'struct',
       *       fields: [
       *         { id: 1, name: 'id', type: 'long', required: true },
       *         { id: 2, name: 'timestamp', type: 'timestamp', required: true }
       *       ],
       *       'schema-id': 0
       *     }
       *   }
       * );
       * ```
       */
      async createTableIfNotExists(namespace, request) {
        return this.tableOps.createTableIfNotExists(namespace, request);
      }
    };
    function getCurrentSchema(metadata) {
      return metadata.schemas.find((s) => s["schema-id"] === metadata["current-schema-id"]);
    }
    exports2.IcebergError = IcebergError;
    exports2.IcebergRestCatalog = IcebergRestCatalog;
    exports2.getCurrentSchema = getCurrentSchema;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/StorageAnalyticsClient.js
var require_StorageAnalyticsClient = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/packages/StorageAnalyticsClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var iceberg_js_1 = require_dist();
    var constants_1 = require_constants2();
    var errors_1 = require_errors();
    var fetch_1 = require_fetch();
    var helpers_1 = require_helpers();
    var StorageAnalyticsClient = class {
      /**
       * @alpha
       *
       * Creates a new StorageAnalyticsClient instance
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Analytics Buckets
       * @param url - The base URL for the storage API
       * @param headers - HTTP headers to include in requests
       * @param fetch - Optional custom fetch implementation
       *
       * @example
       * ```typescript
       * const client = new StorageAnalyticsClient(url, headers)
       * ```
       */
      constructor(url, headers = {}, fetch2) {
        this.shouldThrowOnError = false;
        this.url = url.replace(/\/$/, "");
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.fetch = (0, helpers_1.resolveFetch)(fetch2);
      }
      /**
       * @alpha
       *
       * Enable throwing errors instead of returning them in the response
       * When enabled, failed operations will throw instead of returning { data: null, error }
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Analytics Buckets
       * @returns This instance for method chaining
       */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /**
       * @alpha
       *
       * Creates a new analytics bucket using Iceberg tables
       * Analytics buckets are optimized for analytical queries and data processing
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Analytics Buckets
       * @param name A unique name for the bucket you are creating
       * @returns Promise with response containing newly created analytics bucket or error
       *
       * @example Create analytics bucket
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .analytics
       *   .createBucket('analytics-data')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "name": "analytics-data",
       *     "type": "ANALYTICS",
       *     "format": "iceberg",
       *     "created_at": "2024-05-22T22:26:05.100Z",
       *     "updated_at": "2024-05-22T22:26:05.100Z"
       *   },
       *   "error": null
       * }
       * ```
       */
      createBucket(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/bucket`, { name }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * @alpha
       *
       * Retrieves the details of all Analytics Storage buckets within an existing project
       * Only returns buckets of type 'ANALYTICS'
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Analytics Buckets
       * @param options Query parameters for listing buckets
       * @param options.limit Maximum number of buckets to return
       * @param options.offset Number of buckets to skip
       * @param options.sortColumn Column to sort by ('name', 'created_at', 'updated_at')
       * @param options.sortOrder Sort order ('asc' or 'desc')
       * @param options.search Search term to filter bucket names
       * @returns Promise with response containing array of analytics buckets or error
       *
       * @example List analytics buckets
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .analytics
       *   .listBuckets({
       *     limit: 10,
       *     offset: 0,
       *     sortColumn: 'created_at',
       *     sortOrder: 'desc'
       *   })
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": [
       *     {
       *       "name": "analytics-data",
       *       "type": "ANALYTICS",
       *       "format": "iceberg",
       *       "created_at": "2024-05-22T22:26:05.100Z",
       *       "updated_at": "2024-05-22T22:26:05.100Z"
       *     }
       *   ],
       *   "error": null
       * }
       * ```
       */
      listBuckets(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const queryParams = new URLSearchParams();
            if ((options === null || options === void 0 ? void 0 : options.limit) !== void 0)
              queryParams.set("limit", options.limit.toString());
            if ((options === null || options === void 0 ? void 0 : options.offset) !== void 0)
              queryParams.set("offset", options.offset.toString());
            if (options === null || options === void 0 ? void 0 : options.sortColumn)
              queryParams.set("sortColumn", options.sortColumn);
            if (options === null || options === void 0 ? void 0 : options.sortOrder)
              queryParams.set("sortOrder", options.sortOrder);
            if (options === null || options === void 0 ? void 0 : options.search)
              queryParams.set("search", options.search);
            const queryString = queryParams.toString();
            const url = queryString ? `${this.url}/bucket?${queryString}` : `${this.url}/bucket`;
            const data = yield (0, fetch_1.get)(this.fetch, url, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * @alpha
       *
       * Deletes an existing analytics bucket
       * A bucket can't be deleted with existing objects inside it
       * You must first empty the bucket before deletion
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Analytics Buckets
       * @param bucketName The unique identifier of the bucket you would like to delete
       * @returns Promise with response containing success message or error
       *
       * @example Delete analytics bucket
       * ```js
       * const { data, error } = await supabase
       *   .storage
       *   .analytics
       *   .deleteBucket('analytics-data')
       * ```
       *
       * Response:
       * ```json
       * {
       *   "data": {
       *     "message": "Successfully deleted"
       *   },
       *   "error": null
       * }
       * ```
       */
      deleteBucket(bucketName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.remove)(this.fetch, `${this.url}/bucket/${bucketName}`, {}, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /**
       * @alpha
       *
       * Get an Iceberg REST Catalog client configured for a specific analytics bucket
       * Use this to perform advanced table and namespace operations within the bucket
       * The returned client provides full access to the Apache Iceberg REST Catalog API
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Analytics Buckets
       * @param bucketName - The name of the analytics bucket (warehouse) to connect to
       * @returns Configured IcebergRestCatalog instance for advanced Iceberg operations
       *
       * @example Get catalog and create table
       * ```js
       * // First, create an analytics bucket
       * const { data: bucket, error: bucketError } = await supabase
       *   .storage
       *   .analytics
       *   .createBucket('analytics-data')
       *
       * // Get the Iceberg catalog for that bucket
       * const catalog = supabase.storage.analytics.from('analytics-data')
       *
       * // Create a namespace
       * await catalog.createNamespace({ namespace: ['default'] })
       *
       * // Create a table with schema
       * await catalog.createTable(
       *   { namespace: ['default'] },
       *   {
       *     name: 'events',
       *     schema: {
       *       type: 'struct',
       *       fields: [
       *         { id: 1, name: 'id', type: 'long', required: true },
       *         { id: 2, name: 'timestamp', type: 'timestamp', required: true },
       *         { id: 3, name: 'user_id', type: 'string', required: false }
       *       ],
       *       'schema-id': 0,
       *       'identifier-field-ids': [1]
       *     },
       *     'partition-spec': {
       *       'spec-id': 0,
       *       fields: []
       *     },
       *     'write-order': {
       *       'order-id': 0,
       *       fields: []
       *     },
       *     properties: {
       *       'write.format.default': 'parquet'
       *     }
       *   }
       * )
       * ```
       *
       * @example List tables in namespace
       * ```js
       * const catalog = supabase.storage.analytics.from('analytics-data')
       *
       * // List all tables in the default namespace
       * const tables = await catalog.listTables({ namespace: ['default'] })
       * console.log(tables) // [{ namespace: ['default'], name: 'events' }]
       * ```
       *
       * @example Working with namespaces
       * ```js
       * const catalog = supabase.storage.analytics.from('analytics-data')
       *
       * // List all namespaces
       * const namespaces = await catalog.listNamespaces()
       *
       * // Create namespace with properties
       * await catalog.createNamespace(
       *   { namespace: ['production'] },
       *   { properties: { owner: 'data-team', env: 'prod' } }
       * )
       * ```
       *
       * @example Cleanup operations
       * ```js
       * const catalog = supabase.storage.analytics.from('analytics-data')
       *
       * // Drop table with purge option (removes all data)
       * await catalog.dropTable(
       *   { namespace: ['default'], name: 'events' },
       *   { purge: true }
       * )
       *
       * // Drop namespace (must be empty)
       * await catalog.dropNamespace({ namespace: ['default'] })
       * ```
       *
       * @example Error handling with catalog operations
       * ```js
       * import { IcebergError } from 'iceberg-js'
       *
       * const catalog = supabase.storage.analytics.from('analytics-data')
       *
       * try {
       *   await catalog.dropTable({ namespace: ['default'], name: 'events' }, { purge: true })
       * } catch (error) {
       *   // Handle 404 errors (resource not found)
       *   const is404 =
       *     (error instanceof IcebergError && error.status === 404) ||
       *     error?.status === 404 ||
       *     error?.details?.error?.code === 404
       *
       *   if (is404) {
       *     console.log('Table does not exist')
       *   } else {
       *     throw error // Re-throw other errors
       *   }
       * }
       * ```
       *
       * @remarks
       * This method provides a bridge between Supabase's bucket management and the standard
       * Apache Iceberg REST Catalog API. The bucket name maps to the Iceberg warehouse parameter.
       * All authentication and configuration is handled automatically using your Supabase credentials.
       *
       * **Error Handling**: Operations may throw `IcebergError` from the iceberg-js library.
       * Always handle 404 errors gracefully when checking for resource existence.
       *
       * **Cleanup Operations**: When using `dropTable`, the `purge: true` option permanently
       * deletes all table data. Without it, the table is marked as deleted but data remains.
       *
       * **Library Dependency**: The returned catalog is an instance of `IcebergRestCatalog`
       * from iceberg-js. For complete API documentation and advanced usage, refer to the
       * [iceberg-js documentation](https://supabase.github.io/iceberg-js/).
       *
       * For advanced Iceberg operations beyond bucket management, you can also install and use
       * the `iceberg-js` package directly with manual configuration.
       */
      from(bucketName) {
        if (!(0, helpers_1.isValidBucketName)(bucketName)) {
          throw new errors_1.StorageError("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");
        }
        return new iceberg_js_1.IcebergRestCatalog({
          baseUrl: this.url,
          catalogName: bucketName,
          // Maps to the warehouse parameter in Supabase's implementation
          auth: {
            type: "custom",
            getHeaders: () => tslib_1.__awaiter(this, void 0, void 0, function* () {
              return this.headers;
            })
          },
          fetch: this.fetch
        });
      }
    };
    exports2.default = StorageAnalyticsClient;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/constants.js
var require_constants3 = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DEFAULT_HEADERS = void 0;
    var version_1 = require_version2();
    exports2.DEFAULT_HEADERS = {
      "X-Client-Info": `storage-js/${version_1.version}`,
      "Content-Type": "application/json"
    };
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/errors.js
var require_errors2 = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StorageVectorsErrorCode = exports2.StorageVectorsUnknownError = exports2.StorageVectorsApiError = exports2.StorageVectorsError = void 0;
    exports2.isStorageVectorsError = isStorageVectorsError;
    var StorageVectorsError = class extends Error {
      constructor(message) {
        super(message);
        this.__isStorageVectorsError = true;
        this.name = "StorageVectorsError";
      }
    };
    exports2.StorageVectorsError = StorageVectorsError;
    function isStorageVectorsError(error) {
      return typeof error === "object" && error !== null && "__isStorageVectorsError" in error;
    }
    var StorageVectorsApiError = class extends StorageVectorsError {
      constructor(message, status, statusCode) {
        super(message);
        this.name = "StorageVectorsApiError";
        this.status = status;
        this.statusCode = statusCode;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status,
          statusCode: this.statusCode
        };
      }
    };
    exports2.StorageVectorsApiError = StorageVectorsApiError;
    var StorageVectorsUnknownError = class extends StorageVectorsError {
      constructor(message, originalError) {
        super(message);
        this.name = "StorageVectorsUnknownError";
        this.originalError = originalError;
      }
    };
    exports2.StorageVectorsUnknownError = StorageVectorsUnknownError;
    var StorageVectorsErrorCode;
    (function(StorageVectorsErrorCode2) {
      StorageVectorsErrorCode2["InternalError"] = "InternalError";
      StorageVectorsErrorCode2["S3VectorConflictException"] = "S3VectorConflictException";
      StorageVectorsErrorCode2["S3VectorNotFoundException"] = "S3VectorNotFoundException";
      StorageVectorsErrorCode2["S3VectorBucketNotEmpty"] = "S3VectorBucketNotEmpty";
      StorageVectorsErrorCode2["S3VectorMaxBucketsExceeded"] = "S3VectorMaxBucketsExceeded";
      StorageVectorsErrorCode2["S3VectorMaxIndexesExceeded"] = "S3VectorMaxIndexesExceeded";
    })(StorageVectorsErrorCode || (exports2.StorageVectorsErrorCode = StorageVectorsErrorCode = {}));
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/helpers.js
var require_helpers2 = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/helpers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateVectorDimension = exports2.normalizeToFloat32 = exports2.isPlainObject = exports2.resolveResponse = exports2.resolveFetch = void 0;
    var resolveFetch = (customFetch) => {
      if (customFetch) {
        return (...args) => customFetch(...args);
      }
      return (...args) => fetch(...args);
    };
    exports2.resolveFetch = resolveFetch;
    var resolveResponse = () => {
      return Response;
    };
    exports2.resolveResponse = resolveResponse;
    var isPlainObject = (value) => {
      if (typeof value !== "object" || value === null) {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in value) && !(Symbol.iterator in value);
    };
    exports2.isPlainObject = isPlainObject;
    var normalizeToFloat32 = (values) => {
      return Array.from(new Float32Array(values));
    };
    exports2.normalizeToFloat32 = normalizeToFloat32;
    var validateVectorDimension = (vector, expectedDimension) => {
      if (expectedDimension !== void 0 && vector.float32.length !== expectedDimension) {
        throw new Error(`Vector dimension mismatch: expected ${expectedDimension}, got ${vector.float32.length}`);
      }
    };
    exports2.validateVectorDimension = validateVectorDimension;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/fetch.js
var require_fetch2 = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/fetch.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.get = get;
    exports2.post = post;
    exports2.put = put;
    exports2.remove = remove;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var errors_1 = require_errors2();
    var helpers_1 = require_helpers2();
    var _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    var handleError = (error, reject, options) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
      const isResponseLike = error && typeof error === "object" && "status" in error && "ok" in error && typeof error.status === "number";
      if (isResponseLike && !(options === null || options === void 0 ? void 0 : options.noResolveJson)) {
        const status = error.status || 500;
        const responseError = error;
        if (typeof responseError.json === "function") {
          responseError.json().then((err) => {
            const statusCode = (err === null || err === void 0 ? void 0 : err.statusCode) || (err === null || err === void 0 ? void 0 : err.code) || status + "";
            reject(new errors_1.StorageVectorsApiError(_getErrorMessage(err), status, statusCode));
          }).catch(() => {
            const statusCode = status + "";
            const message = responseError.statusText || `HTTP ${status} error`;
            reject(new errors_1.StorageVectorsApiError(message, status, statusCode));
          });
        } else {
          const statusCode = status + "";
          const message = responseError.statusText || `HTTP ${status} error`;
          reject(new errors_1.StorageVectorsApiError(message, status, statusCode));
        }
      } else {
        reject(new errors_1.StorageVectorsUnknownError(_getErrorMessage(error), error));
      }
    });
    var _getRequestParams = (method, options, parameters, body) => {
      const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
      if (method === "GET" || !body) {
        return params;
      }
      if ((0, helpers_1.isPlainObject)(body)) {
        params.headers = Object.assign({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
      } else {
        params.body = body;
      }
      return Object.assign(Object.assign({}, params), parameters);
    };
    function _handleRequest(fetcher, method, url, options, parameters, body) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
          fetcher(url, _getRequestParams(method, options, parameters, body)).then((result) => {
            if (!result.ok)
              throw result;
            if (options === null || options === void 0 ? void 0 : options.noResolveJson)
              return result;
            const contentType = result.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
              return {};
            }
            return result.json();
          }).then((data) => resolve(data)).catch((error) => handleError(error, reject, options));
        });
      });
    }
    function get(fetcher, url, options, parameters) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, "GET", url, options, parameters);
      });
    }
    function post(fetcher, url, body, options, parameters) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, "POST", url, options, parameters, body);
      });
    }
    function put(fetcher, url, body, options, parameters) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, "PUT", url, options, parameters, body);
      });
    }
    function remove(fetcher, url, body, options, parameters) {
      return tslib_1.__awaiter(this, void 0, void 0, function* () {
        return _handleRequest(fetcher, "DELETE", url, options, parameters, body);
      });
    }
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/VectorIndexApi.js
var require_VectorIndexApi = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/VectorIndexApi.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var constants_1 = require_constants3();
    var errors_1 = require_errors2();
    var fetch_1 = require_fetch2();
    var helpers_1 = require_helpers2();
    var VectorIndexApi = class {
      /** Creates a new VectorIndexApi instance */
      constructor(url, headers = {}, fetch2) {
        this.shouldThrowOnError = false;
        this.url = url.replace(/\/$/, "");
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.fetch = (0, helpers_1.resolveFetch)(fetch2);
      }
      /** Enable throwing errors instead of returning them in the response */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /** Creates a new vector index within a bucket */
      createIndex(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/CreateIndex`, options, {
              headers: this.headers
            });
            return { data: data || {}, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Retrieves metadata for a specific vector index */
      getIndex(vectorBucketName, indexName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/GetIndex`, { vectorBucketName, indexName }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Lists vector indexes within a bucket with optional filtering and pagination */
      listIndexes(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/ListIndexes`, options, {
              headers: this.headers
            });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Deletes a vector index and all its data */
      deleteIndex(vectorBucketName, indexName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/DeleteIndex`, { vectorBucketName, indexName }, { headers: this.headers });
            return { data: data || {}, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
    };
    exports2.default = VectorIndexApi;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/VectorDataApi.js
var require_VectorDataApi = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/VectorDataApi.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var constants_1 = require_constants3();
    var errors_1 = require_errors2();
    var fetch_1 = require_fetch2();
    var helpers_1 = require_helpers2();
    var VectorDataApi = class {
      /** Creates a new VectorDataApi instance */
      constructor(url, headers = {}, fetch2) {
        this.shouldThrowOnError = false;
        this.url = url.replace(/\/$/, "");
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.fetch = (0, helpers_1.resolveFetch)(fetch2);
      }
      /** Enable throwing errors instead of returning them in the response */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /** Inserts or updates vectors in batch (1-500 per request) */
      putVectors(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            if (options.vectors.length < 1 || options.vectors.length > 500) {
              throw new Error("Vector batch size must be between 1 and 500 items");
            }
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/PutVectors`, options, {
              headers: this.headers
            });
            return { data: data || {}, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Retrieves vectors by their keys in batch */
      getVectors(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/GetVectors`, options, {
              headers: this.headers
            });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Lists vectors in an index with pagination */
      listVectors(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            if (options.segmentCount !== void 0) {
              if (options.segmentCount < 1 || options.segmentCount > 16) {
                throw new Error("segmentCount must be between 1 and 16");
              }
              if (options.segmentIndex !== void 0) {
                if (options.segmentIndex < 0 || options.segmentIndex >= options.segmentCount) {
                  throw new Error(`segmentIndex must be between 0 and ${options.segmentCount - 1}`);
                }
              }
            }
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/ListVectors`, options, {
              headers: this.headers
            });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Queries for similar vectors using approximate nearest neighbor search */
      queryVectors(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/QueryVectors`, options, {
              headers: this.headers
            });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Deletes vectors by their keys in batch (1-500 per request) */
      deleteVectors(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            if (options.keys.length < 1 || options.keys.length > 500) {
              throw new Error("Keys batch size must be between 1 and 500 items");
            }
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/DeleteVectors`, options, {
              headers: this.headers
            });
            return { data: data || {}, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
    };
    exports2.default = VectorDataApi;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/VectorBucketApi.js
var require_VectorBucketApi = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/VectorBucketApi.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var constants_1 = require_constants3();
    var errors_1 = require_errors2();
    var fetch_1 = require_fetch2();
    var helpers_1 = require_helpers2();
    var VectorBucketApi = class {
      /** Creates a new VectorBucketApi instance */
      constructor(url, headers = {}, fetch2) {
        this.shouldThrowOnError = false;
        this.url = url.replace(/\/$/, "");
        this.headers = Object.assign(Object.assign({}, constants_1.DEFAULT_HEADERS), headers);
        this.fetch = (0, helpers_1.resolveFetch)(fetch2);
      }
      /** Enable throwing errors instead of returning them in the response */
      throwOnError() {
        this.shouldThrowOnError = true;
        return this;
      }
      /** Creates a new vector bucket */
      createBucket(vectorBucketName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/CreateVectorBucket`, { vectorBucketName }, { headers: this.headers });
            return { data: data || {}, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Retrieves metadata for a specific vector bucket */
      getBucket(vectorBucketName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/GetVectorBucket`, { vectorBucketName }, { headers: this.headers });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Lists vector buckets with optional filtering and pagination */
      listBuckets() {
        return tslib_1.__awaiter(this, arguments, void 0, function* (options = {}) {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/ListVectorBuckets`, options, {
              headers: this.headers
            });
            return { data, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
      /** Deletes a vector bucket (must be empty first) */
      deleteBucket(vectorBucketName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          try {
            const data = yield (0, fetch_1.post)(this.fetch, `${this.url}/DeleteVectorBucket`, { vectorBucketName }, { headers: this.headers });
            return { data: data || {}, error: null };
          } catch (error) {
            if (this.shouldThrowOnError) {
              throw error;
            }
            if ((0, errors_1.isStorageVectorsError)(error)) {
              return { data: null, error };
            }
            throw error;
          }
        });
      }
    };
    exports2.default = VectorBucketApi;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/StorageVectorsClient.js
var require_StorageVectorsClient = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/StorageVectorsClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.VectorIndexScope = exports2.VectorBucketScope = exports2.StorageVectorsClient = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var VectorIndexApi_1 = tslib_1.__importDefault(require_VectorIndexApi());
    var VectorDataApi_1 = tslib_1.__importDefault(require_VectorDataApi());
    var VectorBucketApi_1 = tslib_1.__importDefault(require_VectorBucketApi());
    var StorageVectorsClient = class extends VectorBucketApi_1.default {
      /**
       * @alpha
       *
       * Creates a StorageVectorsClient that can manage buckets, indexes, and vectors.
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param url - Base URL of the Storage Vectors REST API.
       * @param options.headers - Optional headers (for example `Authorization`) applied to every request.
       * @param options.fetch - Optional custom `fetch` implementation for non-browser runtimes.
       *
       * @example
       * ```typescript
       * const client = new StorageVectorsClient(url, options)
       * ```
       */
      constructor(url, options = {}) {
        super(url, options.headers || {}, options.fetch);
      }
      /**
       *
       * @alpha
       *
       * Access operations for a specific vector bucket
       * Returns a scoped client for index and vector operations within the bucket
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param vectorBucketName - Name of the vector bucket
       * @returns Bucket-scoped client with index and vector operations
       *
       * @example
       * ```typescript
       * const bucket = supabase.storage.vectors.from('embeddings-prod')
       * ```
       */
      from(vectorBucketName) {
        return new VectorBucketScope(this.url, this.headers, vectorBucketName, this.fetch);
      }
      /**
       *
       * @alpha
       *
       * Creates a new vector bucket
       * Vector buckets are containers for vector indexes and their data
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param vectorBucketName - Unique name for the vector bucket
       * @returns Promise with empty response on success or error
       *
       * @example
       * ```typescript
       * const { data, error } = await supabase
       *   .storage
       *   .vectors
       *   .createBucket('embeddings-prod')
       * ```
       */
      createBucket(vectorBucketName) {
        const _super = Object.create(null, {
          createBucket: { get: () => super.createBucket }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.createBucket.call(this, vectorBucketName);
        });
      }
      /**
       *
       * @alpha
       *
       * Retrieves metadata for a specific vector bucket
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param vectorBucketName - Name of the vector bucket
       * @returns Promise with bucket metadata or error
       *
       * @example
       * ```typescript
       * const { data, error } = await supabase
       *   .storage
       *   .vectors
       *   .getBucket('embeddings-prod')
       *
       * console.log('Bucket created:', data?.vectorBucket.creationTime)
       * ```
       */
      getBucket(vectorBucketName) {
        const _super = Object.create(null, {
          getBucket: { get: () => super.getBucket }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.getBucket.call(this, vectorBucketName);
        });
      }
      /**
       *
       * @alpha
       *
       * Lists all vector buckets with optional filtering and pagination
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param options - Optional filters (prefix, maxResults, nextToken)
       * @returns Promise with list of buckets or error
       *
       * @example
       * ```typescript
       * const { data, error } = await supabase
       *   .storage
       *   .vectors
       *   .listBuckets({ prefix: 'embeddings-' })
       *
       * data?.vectorBuckets.forEach(bucket => {
       *   console.log(bucket.vectorBucketName)
       * })
       * ```
       */
      listBuckets() {
        const _super = Object.create(null, {
          listBuckets: { get: () => super.listBuckets }
        });
        return tslib_1.__awaiter(this, arguments, void 0, function* (options = {}) {
          return _super.listBuckets.call(this, options);
        });
      }
      /**
       *
       * @alpha
       *
       * Deletes a vector bucket (bucket must be empty)
       * All indexes must be deleted before deleting the bucket
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param vectorBucketName - Name of the vector bucket to delete
       * @returns Promise with empty response on success or error
       *
       * @example
       * ```typescript
       * const { data, error } = await supabase
       *   .storage
       *   .vectors
       *   .deleteBucket('embeddings-old')
       * ```
       */
      deleteBucket(vectorBucketName) {
        const _super = Object.create(null, {
          deleteBucket: { get: () => super.deleteBucket }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.deleteBucket.call(this, vectorBucketName);
        });
      }
    };
    exports2.StorageVectorsClient = StorageVectorsClient;
    var VectorBucketScope = class extends VectorIndexApi_1.default {
      /**
       * @alpha
       *
       * Creates a helper that automatically scopes all index operations to the provided bucket.
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @example
       * ```typescript
       * const bucket = supabase.storage.vectors.from('embeddings-prod')
       * ```
       */
      constructor(url, headers, vectorBucketName, fetch2) {
        super(url, headers, fetch2);
        this.vectorBucketName = vectorBucketName;
      }
      /**
       *
       * @alpha
       *
       * Creates a new vector index in this bucket
       * Convenience method that automatically includes the bucket name
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param options - Index configuration (vectorBucketName is automatically set)
       * @returns Promise with empty response on success or error
       *
       * @example
       * ```typescript
       * const bucket = supabase.storage.vectors.from('embeddings-prod')
       * await bucket.createIndex({
       *   indexName: 'documents-openai',
       *   dataType: 'float32',
       *   dimension: 1536,
       *   distanceMetric: 'cosine',
       *   metadataConfiguration: {
       *     nonFilterableMetadataKeys: ['raw_text']
       *   }
       * })
       * ```
       */
      createIndex(options) {
        const _super = Object.create(null, {
          createIndex: { get: () => super.createIndex }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.createIndex.call(this, Object.assign(Object.assign({}, options), { vectorBucketName: this.vectorBucketName }));
        });
      }
      /**
       *
       * @alpha
       *
       * Lists indexes in this bucket
       * Convenience method that automatically includes the bucket name
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param options - Listing options (vectorBucketName is automatically set)
       * @returns Promise with response containing indexes array and pagination token or error
       *
       * @example
       * ```typescript
       * const bucket = supabase.storage.vectors.from('embeddings-prod')
       * const { data } = await bucket.listIndexes({ prefix: 'documents-' })
       * ```
       */
      listIndexes() {
        const _super = Object.create(null, {
          listIndexes: { get: () => super.listIndexes }
        });
        return tslib_1.__awaiter(this, arguments, void 0, function* (options = {}) {
          return _super.listIndexes.call(this, Object.assign(Object.assign({}, options), { vectorBucketName: this.vectorBucketName }));
        });
      }
      /**
       *
       * @alpha
       *
       * Retrieves metadata for a specific index in this bucket
       * Convenience method that automatically includes the bucket name
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param indexName - Name of the index to retrieve
       * @returns Promise with index metadata or error
       *
       * @example
       * ```typescript
       * const bucket = supabase.storage.vectors.from('embeddings-prod')
       * const { data } = await bucket.getIndex('documents-openai')
       * console.log('Dimension:', data?.index.dimension)
       * ```
       */
      getIndex(indexName) {
        const _super = Object.create(null, {
          getIndex: { get: () => super.getIndex }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.getIndex.call(this, this.vectorBucketName, indexName);
        });
      }
      /**
       *
       * @alpha
       *
       * Deletes an index from this bucket
       * Convenience method that automatically includes the bucket name
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param indexName - Name of the index to delete
       * @returns Promise with empty response on success or error
       *
       * @example
       * ```typescript
       * const bucket = supabase.storage.vectors.from('embeddings-prod')
       * await bucket.deleteIndex('old-index')
       * ```
       */
      deleteIndex(indexName) {
        const _super = Object.create(null, {
          deleteIndex: { get: () => super.deleteIndex }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.deleteIndex.call(this, this.vectorBucketName, indexName);
        });
      }
      /**
       *
       * @alpha
       *
       * Access operations for a specific index within this bucket
       * Returns a scoped client for vector data operations
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param indexName - Name of the index
       * @returns Index-scoped client with vector data operations
       *
       * @example
       * ```typescript
       * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
       *
       * // Insert vectors
       * await index.putVectors({
       *   vectors: [
       *     { key: 'doc-1', data: { float32: [...] }, metadata: { title: 'Intro' } }
       *   ]
       * })
       *
       * // Query similar vectors
       * const { data } = await index.queryVectors({
       *   queryVector: { float32: [...] },
       *   topK: 5
       * })
       * ```
       */
      index(indexName) {
        return new VectorIndexScope(this.url, this.headers, this.vectorBucketName, indexName, this.fetch);
      }
    };
    exports2.VectorBucketScope = VectorBucketScope;
    var VectorIndexScope = class extends VectorDataApi_1.default {
      /**
       *
       * @alpha
       *
       * Creates a helper that automatically scopes all vector operations to the provided bucket/index names.
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @example
       * ```typescript
       * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
       * ```
       */
      constructor(url, headers, vectorBucketName, indexName, fetch2) {
        super(url, headers, fetch2);
        this.vectorBucketName = vectorBucketName;
        this.indexName = indexName;
      }
      /**
       *
       * @alpha
       *
       * Inserts or updates vectors in this index
       * Convenience method that automatically includes bucket and index names
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param options - Vector insertion options (bucket and index names automatically set)
       * @returns Promise with empty response on success or error
       *
       * @example
       * ```typescript
       * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
       * await index.putVectors({
       *   vectors: [
       *     {
       *       key: 'doc-1',
       *       data: { float32: [0.1, 0.2, ...] },
       *       metadata: { title: 'Introduction', page: 1 }
       *     }
       *   ]
       * })
       * ```
       */
      putVectors(options) {
        const _super = Object.create(null, {
          putVectors: { get: () => super.putVectors }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.putVectors.call(this, Object.assign(Object.assign({}, options), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        });
      }
      /**
       *
       * @alpha
       *
       * Retrieves vectors by keys from this index
       * Convenience method that automatically includes bucket and index names
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param options - Vector retrieval options (bucket and index names automatically set)
       * @returns Promise with response containing vectors array or error
       *
       * @example
       * ```typescript
       * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
       * const { data } = await index.getVectors({
       *   keys: ['doc-1', 'doc-2'],
       *   returnMetadata: true
       * })
       * ```
       */
      getVectors(options) {
        const _super = Object.create(null, {
          getVectors: { get: () => super.getVectors }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.getVectors.call(this, Object.assign(Object.assign({}, options), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        });
      }
      /**
       *
       * @alpha
       *
       * Lists vectors in this index with pagination
       * Convenience method that automatically includes bucket and index names
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param options - Listing options (bucket and index names automatically set)
       * @returns Promise with response containing vectors array and pagination token or error
       *
       * @example
       * ```typescript
       * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
       * const { data } = await index.listVectors({
       *   maxResults: 500,
       *   returnMetadata: true
       * })
       * ```
       */
      listVectors() {
        const _super = Object.create(null, {
          listVectors: { get: () => super.listVectors }
        });
        return tslib_1.__awaiter(this, arguments, void 0, function* (options = {}) {
          return _super.listVectors.call(this, Object.assign(Object.assign({}, options), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        });
      }
      /**
       *
       * @alpha
       *
       * Queries for similar vectors in this index
       * Convenience method that automatically includes bucket and index names
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param options - Query options (bucket and index names automatically set)
       * @returns Promise with response containing matches array of similar vectors ordered by distance or error
       *
       * @example
       * ```typescript
       * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
       * const { data } = await index.queryVectors({
       *   queryVector: { float32: [0.1, 0.2, ...] },
       *   topK: 5,
       *   filter: { category: 'technical' },
       *   returnDistance: true,
       *   returnMetadata: true
       * })
       * ```
       */
      queryVectors(options) {
        const _super = Object.create(null, {
          queryVectors: { get: () => super.queryVectors }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.queryVectors.call(this, Object.assign(Object.assign({}, options), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        });
      }
      /**
       *
       * @alpha
       *
       * Deletes vectors by keys from this index
       * Convenience method that automatically includes bucket and index names
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @param options - Deletion options (bucket and index names automatically set)
       * @returns Promise with empty response on success or error
       *
       * @example
       * ```typescript
       * const index = supabase.storage.vectors.from('embeddings-prod').index('documents-openai')
       * await index.deleteVectors({
       *   keys: ['doc-1', 'doc-2', 'doc-3']
       * })
       * ```
       */
      deleteVectors(options) {
        const _super = Object.create(null, {
          deleteVectors: { get: () => super.deleteVectors }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
          return _super.deleteVectors.call(this, Object.assign(Object.assign({}, options), { vectorBucketName: this.vectorBucketName, indexName: this.indexName }));
        });
      }
    };
    exports2.VectorIndexScope = VectorIndexScope;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/index.js
var require_vectors = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/vectors/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.validateVectorDimension = exports2.normalizeToFloat32 = exports2.isPlainObject = exports2.resolveResponse = exports2.resolveFetch = exports2.isStorageVectorsError = exports2.StorageVectorsErrorCode = exports2.StorageVectorsUnknownError = exports2.StorageVectorsApiError = exports2.StorageVectorsError = exports2.VectorDataApi = exports2.VectorIndexApi = exports2.VectorBucketApi = exports2.VectorIndexScope = exports2.VectorBucketScope = exports2.StorageVectorsClient = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var StorageVectorsClient_1 = require_StorageVectorsClient();
    Object.defineProperty(exports2, "StorageVectorsClient", { enumerable: true, get: function() {
      return StorageVectorsClient_1.StorageVectorsClient;
    } });
    Object.defineProperty(exports2, "VectorBucketScope", { enumerable: true, get: function() {
      return StorageVectorsClient_1.VectorBucketScope;
    } });
    Object.defineProperty(exports2, "VectorIndexScope", { enumerable: true, get: function() {
      return StorageVectorsClient_1.VectorIndexScope;
    } });
    var VectorBucketApi_1 = require_VectorBucketApi();
    Object.defineProperty(exports2, "VectorBucketApi", { enumerable: true, get: function() {
      return tslib_1.__importDefault(VectorBucketApi_1).default;
    } });
    var VectorIndexApi_1 = require_VectorIndexApi();
    Object.defineProperty(exports2, "VectorIndexApi", { enumerable: true, get: function() {
      return tslib_1.__importDefault(VectorIndexApi_1).default;
    } });
    var VectorDataApi_1 = require_VectorDataApi();
    Object.defineProperty(exports2, "VectorDataApi", { enumerable: true, get: function() {
      return tslib_1.__importDefault(VectorDataApi_1).default;
    } });
    var errors_1 = require_errors2();
    Object.defineProperty(exports2, "StorageVectorsError", { enumerable: true, get: function() {
      return errors_1.StorageVectorsError;
    } });
    Object.defineProperty(exports2, "StorageVectorsApiError", { enumerable: true, get: function() {
      return errors_1.StorageVectorsApiError;
    } });
    Object.defineProperty(exports2, "StorageVectorsUnknownError", { enumerable: true, get: function() {
      return errors_1.StorageVectorsUnknownError;
    } });
    Object.defineProperty(exports2, "StorageVectorsErrorCode", { enumerable: true, get: function() {
      return errors_1.StorageVectorsErrorCode;
    } });
    Object.defineProperty(exports2, "isStorageVectorsError", { enumerable: true, get: function() {
      return errors_1.isStorageVectorsError;
    } });
    var helpers_1 = require_helpers2();
    Object.defineProperty(exports2, "resolveFetch", { enumerable: true, get: function() {
      return helpers_1.resolveFetch;
    } });
    Object.defineProperty(exports2, "resolveResponse", { enumerable: true, get: function() {
      return helpers_1.resolveResponse;
    } });
    Object.defineProperty(exports2, "isPlainObject", { enumerable: true, get: function() {
      return helpers_1.isPlainObject;
    } });
    Object.defineProperty(exports2, "normalizeToFloat32", { enumerable: true, get: function() {
      return helpers_1.normalizeToFloat32;
    } });
    Object.defineProperty(exports2, "validateVectorDimension", { enumerable: true, get: function() {
      return helpers_1.validateVectorDimension;
    } });
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/StorageClient.js
var require_StorageClient = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/StorageClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StorageClient = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var StorageFileApi_1 = tslib_1.__importDefault(require_StorageFileApi());
    var StorageBucketApi_1 = tslib_1.__importDefault(require_StorageBucketApi());
    var StorageAnalyticsClient_1 = tslib_1.__importDefault(require_StorageAnalyticsClient());
    var vectors_1 = require_vectors();
    var StorageClient = class extends StorageBucketApi_1.default {
      /**
       * Creates a client for Storage buckets, files, analytics, and vectors.
       *
       * @category File Buckets
       * @example
       * ```ts
       * import { StorageClient } from '@supabase/storage-js'
       *
       * const storage = new StorageClient('https://xyzcompany.supabase.co/storage/v1', {
       *   apikey: 'public-anon-key',
       * })
       * const avatars = storage.from('avatars')
       * ```
       */
      constructor(url, headers = {}, fetch2, opts) {
        super(url, headers, fetch2, opts);
      }
      /**
       * Perform file operation in a bucket.
       *
       * @category File Buckets
       * @param id The bucket id to operate on.
       *
       * @example
       * ```typescript
       * const avatars = supabase.storage.from('avatars')
       * ```
       */
      from(id) {
        return new StorageFileApi_1.default(this.url, this.headers, id, this.fetch);
      }
      /**
       *
       * @alpha
       *
       * Access vector storage operations.
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Vector Buckets
       * @returns A StorageVectorsClient instance configured with the current storage settings.
       */
      get vectors() {
        return new vectors_1.StorageVectorsClient(this.url + "/vector", {
          headers: this.headers,
          fetch: this.fetch
        });
      }
      /**
       *
       * @alpha
       *
       * Access analytics storage operations using Iceberg tables.
       *
       * **Public alpha:** This API is part of a public alpha release and may not be available to your account type.
       *
       * @category Analytics Buckets
       * @returns A StorageAnalyticsClient instance configured with the current storage settings.
       */
      get analytics() {
        return new StorageAnalyticsClient_1.default(this.url + "/iceberg", this.headers, this.fetch);
      }
    };
    exports2.StorageClient = StorageClient;
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/types.js
var require_types2 = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/lib/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
  }
});

// node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/index.js
var require_main4 = __commonJS({
  "node_modules/.pnpm/@supabase+storage-js@2.86.0/node_modules/@supabase/storage-js/dist/main/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.StorageAnalyticsClient = exports2.StorageClient = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var StorageClient_1 = require_StorageClient();
    Object.defineProperty(exports2, "StorageClient", { enumerable: true, get: function() {
      return StorageClient_1.StorageClient;
    } });
    var StorageAnalyticsClient_1 = require_StorageAnalyticsClient();
    Object.defineProperty(exports2, "StorageAnalyticsClient", { enumerable: true, get: function() {
      return tslib_1.__importDefault(StorageAnalyticsClient_1).default;
    } });
    tslib_1.__exportStar(require_types2(), exports2);
    tslib_1.__exportStar(require_errors(), exports2);
    tslib_1.__exportStar(require_vectors(), exports2);
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/version.js
var require_version3 = __commonJS({
  "node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.version = void 0;
    exports2.version = "2.86.0";
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/constants.js
var require_constants4 = __commonJS({
  "node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.DEFAULT_REALTIME_OPTIONS = exports2.DEFAULT_AUTH_OPTIONS = exports2.DEFAULT_DB_OPTIONS = exports2.DEFAULT_GLOBAL_OPTIONS = exports2.DEFAULT_HEADERS = void 0;
    var version_1 = require_version3();
    var JS_ENV = "";
    if (typeof Deno !== "undefined") {
      JS_ENV = "deno";
    } else if (typeof document !== "undefined") {
      JS_ENV = "web";
    } else if (typeof navigator !== "undefined" && navigator.product === "ReactNative") {
      JS_ENV = "react-native";
    } else {
      JS_ENV = "node";
    }
    exports2.DEFAULT_HEADERS = { "X-Client-Info": `supabase-js-${JS_ENV}/${version_1.version}` };
    exports2.DEFAULT_GLOBAL_OPTIONS = {
      headers: exports2.DEFAULT_HEADERS
    };
    exports2.DEFAULT_DB_OPTIONS = {
      schema: "public"
    };
    exports2.DEFAULT_AUTH_OPTIONS = {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: "implicit"
    };
    exports2.DEFAULT_REALTIME_OPTIONS = {};
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/fetch.js
var require_fetch3 = __commonJS({
  "node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/fetch.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.fetchWithAuth = exports2.resolveHeadersConstructor = exports2.resolveFetch = void 0;
    var resolveFetch = (customFetch) => {
      if (customFetch) {
        return (...args) => customFetch(...args);
      }
      return (...args) => fetch(...args);
    };
    exports2.resolveFetch = resolveFetch;
    var resolveHeadersConstructor = () => {
      return Headers;
    };
    exports2.resolveHeadersConstructor = resolveHeadersConstructor;
    var fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
      const fetch2 = (0, exports2.resolveFetch)(customFetch);
      const HeadersConstructor = (0, exports2.resolveHeadersConstructor)();
      return async (input, init) => {
        var _a;
        const accessToken = (_a = await getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
        let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
        if (!headers.has("apikey")) {
          headers.set("apikey", supabaseKey);
        }
        if (!headers.has("Authorization")) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
        return fetch2(input, Object.assign(Object.assign({}, init), { headers }));
      };
    };
    exports2.fetchWithAuth = fetchWithAuth;
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/helpers.js
var require_helpers3 = __commonJS({
  "node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/helpers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isBrowser = void 0;
    exports2.uuid = uuid;
    exports2.ensureTrailingSlash = ensureTrailingSlash;
    exports2.applySettingDefaults = applySettingDefaults;
    exports2.validateSupabaseUrl = validateSupabaseUrl;
    function uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
        return v.toString(16);
      });
    }
    function ensureTrailingSlash(url) {
      return url.endsWith("/") ? url : url + "/";
    }
    var isBrowser = () => typeof window !== "undefined";
    exports2.isBrowser = isBrowser;
    function applySettingDefaults(options, defaults) {
      var _a, _b;
      const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions } = options;
      const { db: DEFAULT_DB_OPTIONS, auth: DEFAULT_AUTH_OPTIONS, realtime: DEFAULT_REALTIME_OPTIONS, global: DEFAULT_GLOBAL_OPTIONS } = defaults;
      const result = {
        db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS), dbOptions),
        auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), authOptions),
        realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS), realtimeOptions),
        storage: {},
        global: Object.assign(Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS), globalOptions), { headers: Object.assign(Object.assign({}, (_a = DEFAULT_GLOBAL_OPTIONS === null || DEFAULT_GLOBAL_OPTIONS === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS.headers) !== null && _a !== void 0 ? _a : {}), (_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _b !== void 0 ? _b : {}) }),
        accessToken: async () => ""
      };
      if (options.accessToken) {
        result.accessToken = options.accessToken;
      } else {
        delete result.accessToken;
      }
      return result;
    }
    function validateSupabaseUrl(supabaseUrl) {
      const trimmedUrl = supabaseUrl === null || supabaseUrl === void 0 ? void 0 : supabaseUrl.trim();
      if (!trimmedUrl) {
        throw new Error("supabaseUrl is required.");
      }
      if (!trimmedUrl.match(/^https?:\/\//i)) {
        throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");
      }
      try {
        return new URL(ensureTrailingSlash(trimmedUrl));
      } catch (_a) {
        throw Error("Invalid supabaseUrl: Provided URL is malformed.");
      }
    }
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/version.js
var require_version4 = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/version.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.version = void 0;
    exports2.version = "2.86.0";
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/constants.js
var require_constants5 = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/constants.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.JWKS_TTL = exports2.BASE64URL_REGEX = exports2.API_VERSIONS = exports2.API_VERSION_HEADER_NAME = exports2.NETWORK_FAILURE = exports2.DEFAULT_HEADERS = exports2.AUDIENCE = exports2.STORAGE_KEY = exports2.GOTRUE_URL = exports2.EXPIRY_MARGIN_MS = exports2.AUTO_REFRESH_TICK_THRESHOLD = exports2.AUTO_REFRESH_TICK_DURATION_MS = void 0;
    var version_1 = require_version4();
    exports2.AUTO_REFRESH_TICK_DURATION_MS = 30 * 1e3;
    exports2.AUTO_REFRESH_TICK_THRESHOLD = 3;
    exports2.EXPIRY_MARGIN_MS = exports2.AUTO_REFRESH_TICK_THRESHOLD * exports2.AUTO_REFRESH_TICK_DURATION_MS;
    exports2.GOTRUE_URL = "http://localhost:9999";
    exports2.STORAGE_KEY = "supabase.auth.token";
    exports2.AUDIENCE = "";
    exports2.DEFAULT_HEADERS = { "X-Client-Info": `gotrue-js/${version_1.version}` };
    exports2.NETWORK_FAILURE = {
      MAX_RETRIES: 10,
      RETRY_INTERVAL: 2
      // in deciseconds
    };
    exports2.API_VERSION_HEADER_NAME = "X-Supabase-Api-Version";
    exports2.API_VERSIONS = {
      "2024-01-01": {
        timestamp: Date.parse("2024-01-01T00:00:00.0Z"),
        name: "2024-01-01"
      }
    };
    exports2.BASE64URL_REGEX = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;
    exports2.JWKS_TTL = 10 * 60 * 1e3;
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/errors.js
var require_errors3 = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AuthInvalidJwtError = exports2.AuthWeakPasswordError = exports2.AuthRetryableFetchError = exports2.AuthPKCEGrantCodeExchangeError = exports2.AuthImplicitGrantRedirectError = exports2.AuthInvalidCredentialsError = exports2.AuthInvalidTokenResponseError = exports2.AuthSessionMissingError = exports2.CustomAuthError = exports2.AuthUnknownError = exports2.AuthApiError = exports2.AuthError = void 0;
    exports2.isAuthError = isAuthError;
    exports2.isAuthApiError = isAuthApiError;
    exports2.isAuthSessionMissingError = isAuthSessionMissingError;
    exports2.isAuthImplicitGrantRedirectError = isAuthImplicitGrantRedirectError;
    exports2.isAuthRetryableFetchError = isAuthRetryableFetchError;
    exports2.isAuthWeakPasswordError = isAuthWeakPasswordError;
    var AuthError = class extends Error {
      constructor(message, status, code) {
        super(message);
        this.__isAuthError = true;
        this.name = "AuthError";
        this.status = status;
        this.code = code;
      }
    };
    exports2.AuthError = AuthError;
    function isAuthError(error) {
      return typeof error === "object" && error !== null && "__isAuthError" in error;
    }
    var AuthApiError = class extends AuthError {
      constructor(message, status, code) {
        super(message, status, code);
        this.name = "AuthApiError";
        this.status = status;
        this.code = code;
      }
    };
    exports2.AuthApiError = AuthApiError;
    function isAuthApiError(error) {
      return isAuthError(error) && error.name === "AuthApiError";
    }
    var AuthUnknownError = class extends AuthError {
      constructor(message, originalError) {
        super(message);
        this.name = "AuthUnknownError";
        this.originalError = originalError;
      }
    };
    exports2.AuthUnknownError = AuthUnknownError;
    var CustomAuthError = class extends AuthError {
      constructor(message, name, status, code) {
        super(message, status, code);
        this.name = name;
        this.status = status;
      }
    };
    exports2.CustomAuthError = CustomAuthError;
    var AuthSessionMissingError = class extends CustomAuthError {
      constructor() {
        super("Auth session missing!", "AuthSessionMissingError", 400, void 0);
      }
    };
    exports2.AuthSessionMissingError = AuthSessionMissingError;
    function isAuthSessionMissingError(error) {
      return isAuthError(error) && error.name === "AuthSessionMissingError";
    }
    var AuthInvalidTokenResponseError = class extends CustomAuthError {
      constructor() {
        super("Auth session or user missing", "AuthInvalidTokenResponseError", 500, void 0);
      }
    };
    exports2.AuthInvalidTokenResponseError = AuthInvalidTokenResponseError;
    var AuthInvalidCredentialsError = class extends CustomAuthError {
      constructor(message) {
        super(message, "AuthInvalidCredentialsError", 400, void 0);
      }
    };
    exports2.AuthInvalidCredentialsError = AuthInvalidCredentialsError;
    var AuthImplicitGrantRedirectError = class extends CustomAuthError {
      constructor(message, details = null) {
        super(message, "AuthImplicitGrantRedirectError", 500, void 0);
        this.details = null;
        this.details = details;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status,
          details: this.details
        };
      }
    };
    exports2.AuthImplicitGrantRedirectError = AuthImplicitGrantRedirectError;
    function isAuthImplicitGrantRedirectError(error) {
      return isAuthError(error) && error.name === "AuthImplicitGrantRedirectError";
    }
    var AuthPKCEGrantCodeExchangeError = class extends CustomAuthError {
      constructor(message, details = null) {
        super(message, "AuthPKCEGrantCodeExchangeError", 500, void 0);
        this.details = null;
        this.details = details;
      }
      toJSON() {
        return {
          name: this.name,
          message: this.message,
          status: this.status,
          details: this.details
        };
      }
    };
    exports2.AuthPKCEGrantCodeExchangeError = AuthPKCEGrantCodeExchangeError;
    var AuthRetryableFetchError = class extends CustomAuthError {
      constructor(message, status) {
        super(message, "AuthRetryableFetchError", status, void 0);
      }
    };
    exports2.AuthRetryableFetchError = AuthRetryableFetchError;
    function isAuthRetryableFetchError(error) {
      return isAuthError(error) && error.name === "AuthRetryableFetchError";
    }
    var AuthWeakPasswordError = class extends CustomAuthError {
      constructor(message, status, reasons) {
        super(message, "AuthWeakPasswordError", status, "weak_password");
        this.reasons = reasons;
      }
    };
    exports2.AuthWeakPasswordError = AuthWeakPasswordError;
    function isAuthWeakPasswordError(error) {
      return isAuthError(error) && error.name === "AuthWeakPasswordError";
    }
    var AuthInvalidJwtError = class extends CustomAuthError {
      constructor(message) {
        super(message, "AuthInvalidJwtError", 400, "invalid_jwt");
      }
    };
    exports2.AuthInvalidJwtError = AuthInvalidJwtError;
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/base64url.js
var require_base64url = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/base64url.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.byteToBase64URL = byteToBase64URL;
    exports2.byteFromBase64URL = byteFromBase64URL;
    exports2.stringToBase64URL = stringToBase64URL;
    exports2.stringFromBase64URL = stringFromBase64URL;
    exports2.codepointToUTF8 = codepointToUTF8;
    exports2.stringToUTF8 = stringToUTF8;
    exports2.stringFromUTF8 = stringFromUTF8;
    exports2.base64UrlToUint8Array = base64UrlToUint8Array;
    exports2.stringToUint8Array = stringToUint8Array;
    exports2.bytesToBase64URL = bytesToBase64URL;
    var TO_BASE64URL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("");
    var IGNORE_BASE64URL = " 	\n\r=".split("");
    var FROM_BASE64URL = (() => {
      const charMap = new Array(128);
      for (let i = 0; i < charMap.length; i += 1) {
        charMap[i] = -1;
      }
      for (let i = 0; i < IGNORE_BASE64URL.length; i += 1) {
        charMap[IGNORE_BASE64URL[i].charCodeAt(0)] = -2;
      }
      for (let i = 0; i < TO_BASE64URL.length; i += 1) {
        charMap[TO_BASE64URL[i].charCodeAt(0)] = i;
      }
      return charMap;
    })();
    function byteToBase64URL(byte, state, emit) {
      if (byte !== null) {
        state.queue = state.queue << 8 | byte;
        state.queuedBits += 8;
        while (state.queuedBits >= 6) {
          const pos = state.queue >> state.queuedBits - 6 & 63;
          emit(TO_BASE64URL[pos]);
          state.queuedBits -= 6;
        }
      } else if (state.queuedBits > 0) {
        state.queue = state.queue << 6 - state.queuedBits;
        state.queuedBits = 6;
        while (state.queuedBits >= 6) {
          const pos = state.queue >> state.queuedBits - 6 & 63;
          emit(TO_BASE64URL[pos]);
          state.queuedBits -= 6;
        }
      }
    }
    function byteFromBase64URL(charCode, state, emit) {
      const bits = FROM_BASE64URL[charCode];
      if (bits > -1) {
        state.queue = state.queue << 6 | bits;
        state.queuedBits += 6;
        while (state.queuedBits >= 8) {
          emit(state.queue >> state.queuedBits - 8 & 255);
          state.queuedBits -= 8;
        }
      } else if (bits === -2) {
        return;
      } else {
        throw new Error(`Invalid Base64-URL character "${String.fromCharCode(charCode)}"`);
      }
    }
    function stringToBase64URL(str) {
      const base64 = [];
      const emitter = (char) => {
        base64.push(char);
      };
      const state = { queue: 0, queuedBits: 0 };
      stringToUTF8(str, (byte) => {
        byteToBase64URL(byte, state, emitter);
      });
      byteToBase64URL(null, state, emitter);
      return base64.join("");
    }
    function stringFromBase64URL(str) {
      const conv = [];
      const utf8Emit = (codepoint) => {
        conv.push(String.fromCodePoint(codepoint));
      };
      const utf8State = {
        utf8seq: 0,
        codepoint: 0
      };
      const b64State = { queue: 0, queuedBits: 0 };
      const byteEmit = (byte) => {
        stringFromUTF8(byte, utf8State, utf8Emit);
      };
      for (let i = 0; i < str.length; i += 1) {
        byteFromBase64URL(str.charCodeAt(i), b64State, byteEmit);
      }
      return conv.join("");
    }
    function codepointToUTF8(codepoint, emit) {
      if (codepoint <= 127) {
        emit(codepoint);
        return;
      } else if (codepoint <= 2047) {
        emit(192 | codepoint >> 6);
        emit(128 | codepoint & 63);
        return;
      } else if (codepoint <= 65535) {
        emit(224 | codepoint >> 12);
        emit(128 | codepoint >> 6 & 63);
        emit(128 | codepoint & 63);
        return;
      } else if (codepoint <= 1114111) {
        emit(240 | codepoint >> 18);
        emit(128 | codepoint >> 12 & 63);
        emit(128 | codepoint >> 6 & 63);
        emit(128 | codepoint & 63);
        return;
      }
      throw new Error(`Unrecognized Unicode codepoint: ${codepoint.toString(16)}`);
    }
    function stringToUTF8(str, emit) {
      for (let i = 0; i < str.length; i += 1) {
        let codepoint = str.charCodeAt(i);
        if (codepoint > 55295 && codepoint <= 56319) {
          const highSurrogate = (codepoint - 55296) * 1024 & 65535;
          const lowSurrogate = str.charCodeAt(i + 1) - 56320 & 65535;
          codepoint = (lowSurrogate | highSurrogate) + 65536;
          i += 1;
        }
        codepointToUTF8(codepoint, emit);
      }
    }
    function stringFromUTF8(byte, state, emit) {
      if (state.utf8seq === 0) {
        if (byte <= 127) {
          emit(byte);
          return;
        }
        for (let leadingBit = 1; leadingBit < 6; leadingBit += 1) {
          if ((byte >> 7 - leadingBit & 1) === 0) {
            state.utf8seq = leadingBit;
            break;
          }
        }
        if (state.utf8seq === 2) {
          state.codepoint = byte & 31;
        } else if (state.utf8seq === 3) {
          state.codepoint = byte & 15;
        } else if (state.utf8seq === 4) {
          state.codepoint = byte & 7;
        } else {
          throw new Error("Invalid UTF-8 sequence");
        }
        state.utf8seq -= 1;
      } else if (state.utf8seq > 0) {
        if (byte <= 127) {
          throw new Error("Invalid UTF-8 sequence");
        }
        state.codepoint = state.codepoint << 6 | byte & 63;
        state.utf8seq -= 1;
        if (state.utf8seq === 0) {
          emit(state.codepoint);
        }
      }
    }
    function base64UrlToUint8Array(str) {
      const result = [];
      const state = { queue: 0, queuedBits: 0 };
      const onByte = (byte) => {
        result.push(byte);
      };
      for (let i = 0; i < str.length; i += 1) {
        byteFromBase64URL(str.charCodeAt(i), state, onByte);
      }
      return new Uint8Array(result);
    }
    function stringToUint8Array(str) {
      const result = [];
      stringToUTF8(str, (byte) => result.push(byte));
      return new Uint8Array(result);
    }
    function bytesToBase64URL(bytes) {
      const result = [];
      const state = { queue: 0, queuedBits: 0 };
      const onChar = (char) => {
        result.push(char);
      };
      bytes.forEach((byte) => byteToBase64URL(byte, state, onChar));
      byteToBase64URL(null, state, onChar);
      return result.join("");
    }
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/helpers.js
var require_helpers4 = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/helpers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Deferred = exports2.removeItemAsync = exports2.getItemAsync = exports2.setItemAsync = exports2.looksLikeFetchResponse = exports2.resolveFetch = exports2.supportsLocalStorage = exports2.isBrowser = void 0;
    exports2.expiresAt = expiresAt;
    exports2.generateCallbackId = generateCallbackId;
    exports2.parseParametersFromURL = parseParametersFromURL;
    exports2.decodeJWT = decodeJWT;
    exports2.sleep = sleep3;
    exports2.retryable = retryable;
    exports2.generatePKCEVerifier = generatePKCEVerifier;
    exports2.generatePKCEChallenge = generatePKCEChallenge;
    exports2.getCodeChallengeAndMethod = getCodeChallengeAndMethod;
    exports2.parseResponseAPIVersion = parseResponseAPIVersion;
    exports2.validateExp = validateExp;
    exports2.getAlgorithm = getAlgorithm;
    exports2.validateUUID = validateUUID;
    exports2.userNotAvailableProxy = userNotAvailableProxy;
    exports2.insecureUserWarningProxy = insecureUserWarningProxy;
    exports2.deepClone = deepClone;
    var constants_1 = require_constants5();
    var errors_1 = require_errors3();
    var base64url_1 = require_base64url();
    function expiresAt(expiresIn) {
      const timeNow = Math.round(Date.now() / 1e3);
      return timeNow + expiresIn;
    }
    function generateCallbackId() {
      return Symbol("auth-callback");
    }
    var isBrowser = () => typeof window !== "undefined" && typeof document !== "undefined";
    exports2.isBrowser = isBrowser;
    var localStorageWriteTests = {
      tested: false,
      writable: false
    };
    var supportsLocalStorage = () => {
      if (!(0, exports2.isBrowser)()) {
        return false;
      }
      try {
        if (typeof globalThis.localStorage !== "object") {
          return false;
        }
      } catch (e) {
        return false;
      }
      if (localStorageWriteTests.tested) {
        return localStorageWriteTests.writable;
      }
      const randomKey = `lswt-${Math.random()}${Math.random()}`;
      try {
        globalThis.localStorage.setItem(randomKey, randomKey);
        globalThis.localStorage.removeItem(randomKey);
        localStorageWriteTests.tested = true;
        localStorageWriteTests.writable = true;
      } catch (e) {
        localStorageWriteTests.tested = true;
        localStorageWriteTests.writable = false;
      }
      return localStorageWriteTests.writable;
    };
    exports2.supportsLocalStorage = supportsLocalStorage;
    function parseParametersFromURL(href) {
      const result = {};
      const url = new URL(href);
      if (url.hash && url.hash[0] === "#") {
        try {
          const hashSearchParams = new URLSearchParams(url.hash.substring(1));
          hashSearchParams.forEach((value, key) => {
            result[key] = value;
          });
        } catch (e) {
        }
      }
      url.searchParams.forEach((value, key) => {
        result[key] = value;
      });
      return result;
    }
    var resolveFetch = (customFetch) => {
      if (customFetch) {
        return (...args) => customFetch(...args);
      }
      return (...args) => fetch(...args);
    };
    exports2.resolveFetch = resolveFetch;
    var looksLikeFetchResponse = (maybeResponse) => {
      return typeof maybeResponse === "object" && maybeResponse !== null && "status" in maybeResponse && "ok" in maybeResponse && "json" in maybeResponse && typeof maybeResponse.json === "function";
    };
    exports2.looksLikeFetchResponse = looksLikeFetchResponse;
    var setItemAsync = async (storage, key, data) => {
      await storage.setItem(key, JSON.stringify(data));
    };
    exports2.setItemAsync = setItemAsync;
    var getItemAsync = async (storage, key) => {
      const value = await storage.getItem(key);
      if (!value) {
        return null;
      }
      try {
        return JSON.parse(value);
      } catch (_a) {
        return value;
      }
    };
    exports2.getItemAsync = getItemAsync;
    var removeItemAsync = async (storage, key) => {
      await storage.removeItem(key);
    };
    exports2.removeItemAsync = removeItemAsync;
    var Deferred = class _Deferred {
      constructor() {
        ;
        this.promise = new _Deferred.promiseConstructor((res, rej) => {
          ;
          this.resolve = res;
          this.reject = rej;
        });
      }
    };
    exports2.Deferred = Deferred;
    Deferred.promiseConstructor = Promise;
    function decodeJWT(token) {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new errors_1.AuthInvalidJwtError("Invalid JWT structure");
      }
      for (let i = 0; i < parts.length; i++) {
        if (!constants_1.BASE64URL_REGEX.test(parts[i])) {
          throw new errors_1.AuthInvalidJwtError("JWT not in base64url format");
        }
      }
      const data = {
        // using base64url lib
        header: JSON.parse((0, base64url_1.stringFromBase64URL)(parts[0])),
        payload: JSON.parse((0, base64url_1.stringFromBase64URL)(parts[1])),
        signature: (0, base64url_1.base64UrlToUint8Array)(parts[2]),
        raw: {
          header: parts[0],
          payload: parts[1]
        }
      };
      return data;
    }
    async function sleep3(time) {
      return await new Promise((accept) => {
        setTimeout(() => accept(null), time);
      });
    }
    function retryable(fn, isRetryable) {
      const promise = new Promise((accept, reject) => {
        ;
        (async () => {
          for (let attempt = 0; attempt < Infinity; attempt++) {
            try {
              const result = await fn(attempt);
              if (!isRetryable(attempt, null, result)) {
                accept(result);
                return;
              }
            } catch (e) {
              if (!isRetryable(attempt, e)) {
                reject(e);
                return;
              }
            }
          }
        })();
      });
      return promise;
    }
    function dec2hex(dec) {
      return ("0" + dec.toString(16)).substr(-2);
    }
    function generatePKCEVerifier() {
      const verifierLength = 56;
      const array = new Uint32Array(verifierLength);
      if (typeof crypto === "undefined") {
        const charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
        const charSetLen = charSet.length;
        let verifier = "";
        for (let i = 0; i < verifierLength; i++) {
          verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
        }
        return verifier;
      }
      crypto.getRandomValues(array);
      return Array.from(array, dec2hex).join("");
    }
    async function sha256(randomString) {
      const encoder = new TextEncoder();
      const encodedData = encoder.encode(randomString);
      const hash = await crypto.subtle.digest("SHA-256", encodedData);
      const bytes = new Uint8Array(hash);
      return Array.from(bytes).map((c) => String.fromCharCode(c)).join("");
    }
    async function generatePKCEChallenge(verifier) {
      const hasCryptoSupport = typeof crypto !== "undefined" && typeof crypto.subtle !== "undefined" && typeof TextEncoder !== "undefined";
      if (!hasCryptoSupport) {
        console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.");
        return verifier;
      }
      const hashed = await sha256(verifier);
      return btoa(hashed).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    }
    async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false) {
      const codeVerifier = generatePKCEVerifier();
      let storedCodeVerifier = codeVerifier;
      if (isPasswordRecovery) {
        storedCodeVerifier += "/PASSWORD_RECOVERY";
      }
      await (0, exports2.setItemAsync)(storage, `${storageKey}-code-verifier`, storedCodeVerifier);
      const codeChallenge = await generatePKCEChallenge(codeVerifier);
      const codeChallengeMethod = codeVerifier === codeChallenge ? "plain" : "s256";
      return [codeChallenge, codeChallengeMethod];
    }
    var API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
    function parseResponseAPIVersion(response) {
      const apiVersion = response.headers.get(constants_1.API_VERSION_HEADER_NAME);
      if (!apiVersion) {
        return null;
      }
      if (!apiVersion.match(API_VERSION_REGEX)) {
        return null;
      }
      try {
        const date = /* @__PURE__ */ new Date(`${apiVersion}T00:00:00.0Z`);
        return date;
      } catch (e) {
        return null;
      }
    }
    function validateExp(exp) {
      if (!exp) {
        throw new Error("Missing exp claim");
      }
      const timeNow = Math.floor(Date.now() / 1e3);
      if (exp <= timeNow) {
        throw new Error("JWT has expired");
      }
    }
    function getAlgorithm(alg) {
      switch (alg) {
        case "RS256":
          return {
            name: "RSASSA-PKCS1-v1_5",
            hash: { name: "SHA-256" }
          };
        case "ES256":
          return {
            name: "ECDSA",
            namedCurve: "P-256",
            hash: { name: "SHA-256" }
          };
        default:
          throw new Error("Invalid alg claim");
      }
    }
    var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    function validateUUID(str) {
      if (!UUID_REGEX.test(str)) {
        throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not");
      }
    }
    function userNotAvailableProxy() {
      const proxyTarget = {};
      return new Proxy(proxyTarget, {
        get: (target, prop) => {
          if (prop === "__isUserNotAvailableProxy") {
            return true;
          }
          if (typeof prop === "symbol") {
            const sProp = prop.toString();
            if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)") {
              return void 0;
            }
          }
          throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${prop}" property of the session object is not supported. Please use getUser() instead.`);
        },
        set: (_target, prop) => {
          throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        },
        deleteProperty: (_target, prop) => {
          throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${prop}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`);
        }
      });
    }
    function insecureUserWarningProxy(user, suppressWarningRef) {
      return new Proxy(user, {
        get: (target, prop, receiver) => {
          if (prop === "__isInsecureUserWarningProxy") {
            return true;
          }
          if (typeof prop === "symbol") {
            const sProp = prop.toString();
            if (sProp === "Symbol(Symbol.toPrimitive)" || sProp === "Symbol(Symbol.toStringTag)" || sProp === "Symbol(util.inspect.custom)" || sProp === "Symbol(nodejs.util.inspect.custom)") {
              return Reflect.get(target, prop, receiver);
            }
          }
          if (!suppressWarningRef.value && typeof prop === "string") {
            console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.");
            suppressWarningRef.value = true;
          }
          return Reflect.get(target, prop, receiver);
        }
      });
    }
    function deepClone(obj) {
      return JSON.parse(JSON.stringify(obj));
    }
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/fetch.js
var require_fetch4 = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/fetch.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.handleError = handleError;
    exports2._request = _request;
    exports2._sessionResponse = _sessionResponse;
    exports2._sessionResponsePassword = _sessionResponsePassword;
    exports2._userResponse = _userResponse;
    exports2._ssoResponse = _ssoResponse;
    exports2._generateLinkResponse = _generateLinkResponse;
    exports2._noResolveJsonResponse = _noResolveJsonResponse;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var constants_1 = require_constants5();
    var helpers_1 = require_helpers4();
    var errors_1 = require_errors3();
    var _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
    var NETWORK_ERROR_CODES = [502, 503, 504];
    async function handleError(error) {
      var _a;
      if (!(0, helpers_1.looksLikeFetchResponse)(error)) {
        throw new errors_1.AuthRetryableFetchError(_getErrorMessage(error), 0);
      }
      if (NETWORK_ERROR_CODES.includes(error.status)) {
        throw new errors_1.AuthRetryableFetchError(_getErrorMessage(error), error.status);
      }
      let data;
      try {
        data = await error.json();
      } catch (e) {
        throw new errors_1.AuthUnknownError(_getErrorMessage(e), e);
      }
      let errorCode = void 0;
      const responseAPIVersion = (0, helpers_1.parseResponseAPIVersion)(error);
      if (responseAPIVersion && responseAPIVersion.getTime() >= constants_1.API_VERSIONS["2024-01-01"].timestamp && typeof data === "object" && data && typeof data.code === "string") {
        errorCode = data.code;
      } else if (typeof data === "object" && data && typeof data.error_code === "string") {
        errorCode = data.error_code;
      }
      if (!errorCode) {
        if (typeof data === "object" && data && typeof data.weak_password === "object" && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
          throw new errors_1.AuthWeakPasswordError(_getErrorMessage(data), error.status, data.weak_password.reasons);
        }
      } else if (errorCode === "weak_password") {
        throw new errors_1.AuthWeakPasswordError(_getErrorMessage(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
      } else if (errorCode === "session_not_found") {
        throw new errors_1.AuthSessionMissingError();
      }
      throw new errors_1.AuthApiError(_getErrorMessage(data), error.status || 500, errorCode);
    }
    var _getRequestParams = (method, options, parameters, body) => {
      const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
      if (method === "GET") {
        return params;
      }
      params.headers = Object.assign({ "Content-Type": "application/json;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
      params.body = JSON.stringify(body);
      return Object.assign(Object.assign({}, params), parameters);
    };
    async function _request(fetcher, method, url, options) {
      var _a;
      const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
      if (!headers[constants_1.API_VERSION_HEADER_NAME]) {
        headers[constants_1.API_VERSION_HEADER_NAME] = constants_1.API_VERSIONS["2024-01-01"].name;
      }
      if (options === null || options === void 0 ? void 0 : options.jwt) {
        headers["Authorization"] = `Bearer ${options.jwt}`;
      }
      const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
      if (options === null || options === void 0 ? void 0 : options.redirectTo) {
        qs["redirect_to"] = options.redirectTo;
      }
      const queryString = Object.keys(qs).length ? "?" + new URLSearchParams(qs).toString() : "";
      const data = await _handleRequest(fetcher, method, url + queryString, {
        headers,
        noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
      }, {}, options === null || options === void 0 ? void 0 : options.body);
      return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : { data: Object.assign({}, data), error: null };
    }
    async function _handleRequest(fetcher, method, url, options, parameters, body) {
      const requestParams = _getRequestParams(method, options, parameters, body);
      let result;
      try {
        result = await fetcher(url, Object.assign({}, requestParams));
      } catch (e) {
        console.error(e);
        throw new errors_1.AuthRetryableFetchError(_getErrorMessage(e), 0);
      }
      if (!result.ok) {
        await handleError(result);
      }
      if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
        return result;
      }
      try {
        return await result.json();
      } catch (e) {
        await handleError(e);
      }
    }
    function _sessionResponse(data) {
      var _a;
      let session = null;
      if (hasSession(data)) {
        session = Object.assign({}, data);
        if (!data.expires_at) {
          session.expires_at = (0, helpers_1.expiresAt)(data.expires_in);
        }
      }
      const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
      return { data: { session, user }, error: null };
    }
    function _sessionResponsePassword(data) {
      const response = _sessionResponse(data);
      if (!response.error && data.weak_password && typeof data.weak_password === "object" && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === "string" && data.weak_password.reasons.reduce((a, i) => a && typeof i === "string", true)) {
        response.data.weak_password = data.weak_password;
      }
      return response;
    }
    function _userResponse(data) {
      var _a;
      const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
      return { data: { user }, error: null };
    }
    function _ssoResponse(data) {
      return { data, error: null };
    }
    function _generateLinkResponse(data) {
      const { action_link, email_otp, hashed_token, redirect_to, verification_type } = data, rest = tslib_1.__rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
      const properties = {
        action_link,
        email_otp,
        hashed_token,
        redirect_to,
        verification_type
      };
      const user = Object.assign({}, rest);
      return {
        data: {
          properties,
          user
        },
        error: null
      };
    }
    function _noResolveJsonResponse(data) {
      return data;
    }
    function hasSession(data) {
      return data.access_token && data.refresh_token && data.expires_in;
    }
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/types.js
var require_types3 = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SIGN_OUT_SCOPES = void 0;
    exports2.SIGN_OUT_SCOPES = ["global", "local", "others"];
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/GoTrueAdminApi.js
var require_GoTrueAdminApi = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/GoTrueAdminApi.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var fetch_1 = require_fetch4();
    var helpers_1 = require_helpers4();
    var types_1 = require_types3();
    var errors_1 = require_errors3();
    var GoTrueAdminApi = class {
      /**
       * Creates an admin API client that can be used to manage users and OAuth clients.
       *
       * @example
       * ```ts
       * import { GoTrueAdminApi } from '@supabase/auth-js'
       *
       * const admin = new GoTrueAdminApi({
       *   url: 'https://xyzcompany.supabase.co/auth/v1',
       *   headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
       * })
       * ```
       */
      constructor({ url = "", headers = {}, fetch: fetch2 }) {
        this.url = url;
        this.headers = headers;
        this.fetch = (0, helpers_1.resolveFetch)(fetch2);
        this.mfa = {
          listFactors: this._listFactors.bind(this),
          deleteFactor: this._deleteFactor.bind(this)
        };
        this.oauth = {
          listClients: this._listOAuthClients.bind(this),
          createClient: this._createOAuthClient.bind(this),
          getClient: this._getOAuthClient.bind(this),
          updateClient: this._updateOAuthClient.bind(this),
          deleteClient: this._deleteOAuthClient.bind(this),
          regenerateClientSecret: this._regenerateOAuthClientSecret.bind(this)
        };
      }
      /**
       * Removes a logged-in session.
       * @param jwt A valid, logged-in JWT.
       * @param scope The logout sope.
       */
      async signOut(jwt, scope = types_1.SIGN_OUT_SCOPES[0]) {
        if (types_1.SIGN_OUT_SCOPES.indexOf(scope) < 0) {
          throw new Error(`@supabase/auth-js: Parameter scope must be one of ${types_1.SIGN_OUT_SCOPES.join(", ")}`);
        }
        try {
          await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/logout?scope=${scope}`, {
            headers: this.headers,
            jwt,
            noResolveJson: true
          });
          return { data: null, error: null };
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Sends an invite link to an email address.
       * @param email The email address of the user.
       * @param options Additional options to be included when inviting.
       */
      async inviteUserByEmail(email, options = {}) {
        try {
          return await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/invite`, {
            body: { email, data: options.data },
            headers: this.headers,
            redirectTo: options.redirectTo,
            xform: fetch_1._userResponse
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Generates email links and OTPs to be sent via a custom email provider.
       * @param email The user's email.
       * @param options.password User password. For signup only.
       * @param options.data Optional user metadata. For signup only.
       * @param options.redirectTo The redirect url which should be appended to the generated link
       */
      async generateLink(params) {
        try {
          const { options } = params, rest = tslib_1.__rest(params, ["options"]);
          const body = Object.assign(Object.assign({}, rest), options);
          if ("newEmail" in rest) {
            body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
            delete body["newEmail"];
          }
          return await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/admin/generate_link`, {
            body,
            headers: this.headers,
            xform: fetch_1._generateLinkResponse,
            redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return {
              data: {
                properties: null,
                user: null
              },
              error
            };
          }
          throw error;
        }
      }
      // User Admin API
      /**
       * Creates a new user.
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async createUser(attributes) {
        try {
          return await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/admin/users`, {
            body: attributes,
            headers: this.headers,
            xform: fetch_1._userResponse
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Get a list of users.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
       */
      async listUsers(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
          const pagination = { nextPage: null, lastPage: 0, total: 0 };
          const response = await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/admin/users`, {
            headers: this.headers,
            noResolveJson: true,
            query: {
              page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
              per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
            },
            xform: fetch_1._noResolveJsonResponse
          });
          if (response.error)
            throw response.error;
          const users = await response.json();
          const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
          const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
          if (links.length > 0) {
            links.forEach((link) => {
              const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
              const rel = JSON.parse(link.split(";")[1].split("=")[1]);
              pagination[`${rel}Page`] = page;
            });
            pagination.total = parseInt(total);
          }
          return { data: Object.assign(Object.assign({}, users), pagination), error: null };
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: { users: [] }, error };
          }
          throw error;
        }
      }
      /**
       * Get user by id.
       *
       * @param uid The user's unique identifier
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async getUserById(uid) {
        (0, helpers_1.validateUUID)(uid);
        try {
          return await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/admin/users/${uid}`, {
            headers: this.headers,
            xform: fetch_1._userResponse
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Updates the user data.
       *
       * @param attributes The data you want to update.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async updateUserById(uid, attributes) {
        (0, helpers_1.validateUUID)(uid);
        try {
          return await (0, fetch_1._request)(this.fetch, "PUT", `${this.url}/admin/users/${uid}`, {
            body: attributes,
            headers: this.headers,
            xform: fetch_1._userResponse
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      /**
       * Delete a user. Requires a `service_role` key.
       *
       * @param id The user id you want to remove.
       * @param shouldSoftDelete If true, then the user will be soft-deleted from the auth schema. Soft deletion allows user identification from the hashed user ID but is not reversible.
       * Defaults to false for backward compatibility.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async deleteUser(id, shouldSoftDelete = false) {
        (0, helpers_1.validateUUID)(id);
        try {
          return await (0, fetch_1._request)(this.fetch, "DELETE", `${this.url}/admin/users/${id}`, {
            headers: this.headers,
            body: {
              should_soft_delete: shouldSoftDelete
            },
            xform: fetch_1._userResponse
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: { user: null }, error };
          }
          throw error;
        }
      }
      async _listFactors(params) {
        (0, helpers_1.validateUUID)(params.userId);
        try {
          const { data, error } = await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/admin/users/${params.userId}/factors`, {
            headers: this.headers,
            xform: (factors) => {
              return { data: { factors }, error: null };
            }
          });
          return { data, error };
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      async _deleteFactor(params) {
        (0, helpers_1.validateUUID)(params.userId);
        (0, helpers_1.validateUUID)(params.id);
        try {
          const data = await (0, fetch_1._request)(this.fetch, "DELETE", `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
            headers: this.headers
          });
          return { data, error: null };
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Lists all OAuth clients with optional pagination.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async _listOAuthClients(params) {
        var _a, _b, _c, _d, _e, _f, _g;
        try {
          const pagination = { nextPage: null, lastPage: 0, total: 0 };
          const response = await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/admin/oauth/clients`, {
            headers: this.headers,
            noResolveJson: true,
            query: {
              page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : "",
              per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ""
            },
            xform: fetch_1._noResolveJsonResponse
          });
          if (response.error)
            throw response.error;
          const clients = await response.json();
          const total = (_e = response.headers.get("x-total-count")) !== null && _e !== void 0 ? _e : 0;
          const links = (_g = (_f = response.headers.get("link")) === null || _f === void 0 ? void 0 : _f.split(",")) !== null && _g !== void 0 ? _g : [];
          if (links.length > 0) {
            links.forEach((link) => {
              const page = parseInt(link.split(";")[0].split("=")[1].substring(0, 1));
              const rel = JSON.parse(link.split(";")[1].split("=")[1]);
              pagination[`${rel}Page`] = page;
            });
            pagination.total = parseInt(total);
          }
          return { data: Object.assign(Object.assign({}, clients), pagination), error: null };
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: { clients: [] }, error };
          }
          throw error;
        }
      }
      /**
       * Creates a new OAuth client.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async _createOAuthClient(params) {
        try {
          return await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/admin/oauth/clients`, {
            body: params,
            headers: this.headers,
            xform: (client) => {
              return { data: client, error: null };
            }
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Gets details of a specific OAuth client.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async _getOAuthClient(clientId) {
        try {
          return await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/admin/oauth/clients/${clientId}`, {
            headers: this.headers,
            xform: (client) => {
              return { data: client, error: null };
            }
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Updates an existing OAuth client.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async _updateOAuthClient(clientId, params) {
        try {
          return await (0, fetch_1._request)(this.fetch, "PUT", `${this.url}/admin/oauth/clients/${clientId}`, {
            body: params,
            headers: this.headers,
            xform: (client) => {
              return { data: client, error: null };
            }
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Deletes an OAuth client.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async _deleteOAuthClient(clientId) {
        try {
          await (0, fetch_1._request)(this.fetch, "DELETE", `${this.url}/admin/oauth/clients/${clientId}`, {
            headers: this.headers,
            noResolveJson: true
          });
          return { data: null, error: null };
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
      /**
       * Regenerates the secret for an OAuth client.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       *
       * This function should only be called on a server. Never expose your `service_role` key in the browser.
       */
      async _regenerateOAuthClientSecret(clientId) {
        try {
          return await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/admin/oauth/clients/${clientId}/regenerate_secret`, {
            headers: this.headers,
            xform: (client) => {
              return { data: client, error: null };
            }
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          throw error;
        }
      }
    };
    exports2.default = GoTrueAdminApi;
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/local-storage.js
var require_local_storage = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/local-storage.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.memoryLocalStorageAdapter = memoryLocalStorageAdapter;
    function memoryLocalStorageAdapter(store = {}) {
      return {
        getItem: (key) => {
          return store[key] || null;
        },
        setItem: (key, value) => {
          store[key] = value;
        },
        removeItem: (key) => {
          delete store[key];
        }
      };
    }
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/locks.js
var require_locks = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/locks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.ProcessLockAcquireTimeoutError = exports2.NavigatorLockAcquireTimeoutError = exports2.LockAcquireTimeoutError = exports2.internals = void 0;
    exports2.navigatorLock = navigatorLock;
    exports2.processLock = processLock;
    var helpers_1 = require_helpers4();
    exports2.internals = {
      /**
       * @experimental
       */
      debug: !!(globalThis && (0, helpers_1.supportsLocalStorage)() && globalThis.localStorage && globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug") === "true")
    };
    var LockAcquireTimeoutError = class extends Error {
      constructor(message) {
        super(message);
        this.isAcquireTimeout = true;
      }
    };
    exports2.LockAcquireTimeoutError = LockAcquireTimeoutError;
    var NavigatorLockAcquireTimeoutError = class extends LockAcquireTimeoutError {
    };
    exports2.NavigatorLockAcquireTimeoutError = NavigatorLockAcquireTimeoutError;
    var ProcessLockAcquireTimeoutError = class extends LockAcquireTimeoutError {
    };
    exports2.ProcessLockAcquireTimeoutError = ProcessLockAcquireTimeoutError;
    async function navigatorLock(name, acquireTimeout, fn) {
      if (exports2.internals.debug) {
        console.log("@supabase/gotrue-js: navigatorLock: acquire lock", name, acquireTimeout);
      }
      const abortController = new globalThis.AbortController();
      if (acquireTimeout > 0) {
        setTimeout(() => {
          abortController.abort();
          if (exports2.internals.debug) {
            console.log("@supabase/gotrue-js: navigatorLock acquire timed out", name);
          }
        }, acquireTimeout);
      }
      return await Promise.resolve().then(() => globalThis.navigator.locks.request(name, acquireTimeout === 0 ? {
        mode: "exclusive",
        ifAvailable: true
      } : {
        mode: "exclusive",
        signal: abortController.signal
      }, async (lock) => {
        if (lock) {
          if (exports2.internals.debug) {
            console.log("@supabase/gotrue-js: navigatorLock: acquired", name, lock.name);
          }
          try {
            return await fn();
          } finally {
            if (exports2.internals.debug) {
              console.log("@supabase/gotrue-js: navigatorLock: released", name, lock.name);
            }
          }
        } else {
          if (acquireTimeout === 0) {
            if (exports2.internals.debug) {
              console.log("@supabase/gotrue-js: navigatorLock: not immediately available", name);
            }
            throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`);
          } else {
            if (exports2.internals.debug) {
              try {
                const result = await globalThis.navigator.locks.query();
                console.log("@supabase/gotrue-js: Navigator LockManager state", JSON.stringify(result, null, "  "));
              } catch (e) {
                console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state", e);
              }
            }
            console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request");
            return await fn();
          }
        }
      }));
    }
    var PROCESS_LOCKS = {};
    async function processLock(name, acquireTimeout, fn) {
      var _a;
      const previousOperation = (_a = PROCESS_LOCKS[name]) !== null && _a !== void 0 ? _a : Promise.resolve();
      const currentOperation = Promise.race([
        previousOperation.catch(() => {
          return null;
        }),
        acquireTimeout >= 0 ? new Promise((_, reject) => {
          setTimeout(() => {
            reject(new ProcessLockAcquireTimeoutError(`Acquring process lock with name "${name}" timed out`));
          }, acquireTimeout);
        }) : null
      ].filter((x) => x)).catch((e) => {
        if (e && e.isAcquireTimeout) {
          throw e;
        }
        return null;
      }).then(async () => {
        return await fn();
      });
      PROCESS_LOCKS[name] = currentOperation.catch(async (e) => {
        if (e && e.isAcquireTimeout) {
          await previousOperation;
          return null;
        }
        throw e;
      });
      return await currentOperation;
    }
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/polyfills.js
var require_polyfills = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/polyfills.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.polyfillGlobalThis = polyfillGlobalThis;
    function polyfillGlobalThis() {
      if (typeof globalThis === "object")
        return;
      try {
        Object.defineProperty(Object.prototype, "__magic__", {
          get: function() {
            return this;
          },
          configurable: true
        });
        __magic__.globalThis = __magic__;
        delete Object.prototype.__magic__;
      } catch (e) {
        if (typeof self !== "undefined") {
          self.globalThis = self;
        }
      }
    }
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/web3/ethereum.js
var require_ethereum = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/web3/ethereum.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getAddress = getAddress;
    exports2.fromHex = fromHex;
    exports2.toHex = toHex;
    exports2.createSiweMessage = createSiweMessage;
    function getAddress(address) {
      if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        throw new Error(`@supabase/auth-js: Address "${address}" is invalid.`);
      }
      return address.toLowerCase();
    }
    function fromHex(hex) {
      return parseInt(hex, 16);
    }
    function toHex(value) {
      const bytes = new TextEncoder().encode(value);
      const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
      return "0x" + hex;
    }
    function createSiweMessage(parameters) {
      var _a;
      const { chainId, domain, expirationTime, issuedAt = /* @__PURE__ */ new Date(), nonce, notBefore, requestId, resources, scheme, uri, version } = parameters;
      {
        if (!Number.isInteger(chainId))
          throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${chainId}`);
        if (!domain)
          throw new Error(`@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.`);
        if (nonce && nonce.length < 8)
          throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${nonce}`);
        if (!uri)
          throw new Error(`@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.`);
        if (version !== "1")
          throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${version}`);
        if ((_a = parameters.statement) === null || _a === void 0 ? void 0 : _a.includes("\n"))
          throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${parameters.statement}`);
      }
      const address = getAddress(parameters.address);
      const origin = scheme ? `${scheme}://${domain}` : domain;
      const statement = parameters.statement ? `${parameters.statement}
` : "";
      const prefix = `${origin} wants you to sign in with your Ethereum account:
${address}

${statement}`;
      let suffix = `URI: ${uri}
Version: ${version}
Chain ID: ${chainId}${nonce ? `
Nonce: ${nonce}` : ""}
Issued At: ${issuedAt.toISOString()}`;
      if (expirationTime)
        suffix += `
Expiration Time: ${expirationTime.toISOString()}`;
      if (notBefore)
        suffix += `
Not Before: ${notBefore.toISOString()}`;
      if (requestId)
        suffix += `
Request ID: ${requestId}`;
      if (resources) {
        let content = "\nResources:";
        for (const resource of resources) {
          if (!resource || typeof resource !== "string")
            throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${resource}`);
          content += `
- ${resource}`;
        }
        suffix += content;
      }
      return `${prefix}
${suffix}`;
    }
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/webauthn.errors.js
var require_webauthn_errors = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/webauthn.errors.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WebAuthnUnknownError = exports2.WebAuthnError = void 0;
    exports2.isWebAuthnError = isWebAuthnError;
    exports2.identifyRegistrationError = identifyRegistrationError;
    exports2.identifyAuthenticationError = identifyAuthenticationError;
    var webauthn_1 = require_webauthn();
    var WebAuthnError = class extends Error {
      constructor({ message, code, cause, name }) {
        var _a;
        super(message, { cause });
        this.__isWebAuthnError = true;
        this.name = (_a = name !== null && name !== void 0 ? name : cause instanceof Error ? cause.name : void 0) !== null && _a !== void 0 ? _a : "Unknown Error";
        this.code = code;
      }
    };
    exports2.WebAuthnError = WebAuthnError;
    var WebAuthnUnknownError = class extends WebAuthnError {
      constructor(message, originalError) {
        super({
          code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
          cause: originalError,
          message
        });
        this.name = "WebAuthnUnknownError";
        this.originalError = originalError;
      }
    };
    exports2.WebAuthnUnknownError = WebAuthnUnknownError;
    function isWebAuthnError(error) {
      return typeof error === "object" && error !== null && "__isWebAuthnError" in error;
    }
    function identifyRegistrationError({ error, options }) {
      var _a, _b, _c;
      const { publicKey } = options;
      if (!publicKey) {
        throw Error("options was missing required publicKey property");
      }
      if (error.name === "AbortError") {
        if (options.signal instanceof AbortSignal) {
          return new WebAuthnError({
            message: "Registration ceremony was sent an abort signal",
            code: "ERROR_CEREMONY_ABORTED",
            cause: error
          });
        }
      } else if (error.name === "ConstraintError") {
        if (((_a = publicKey.authenticatorSelection) === null || _a === void 0 ? void 0 : _a.requireResidentKey) === true) {
          return new WebAuthnError({
            message: "Discoverable credentials were required but no available authenticator supported it",
            code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
            cause: error
          });
        } else if (
          // @ts-ignore: `mediation` doesn't yet exist on CredentialCreationOptions but it's possible as of Sept 2024
          options.mediation === "conditional" && ((_b = publicKey.authenticatorSelection) === null || _b === void 0 ? void 0 : _b.userVerification) === "required"
        ) {
          return new WebAuthnError({
            message: "User verification was required during automatic registration but it could not be performed",
            code: "ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",
            cause: error
          });
        } else if (((_c = publicKey.authenticatorSelection) === null || _c === void 0 ? void 0 : _c.userVerification) === "required") {
          return new WebAuthnError({
            message: "User verification was required but no available authenticator supported it",
            code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
            cause: error
          });
        }
      } else if (error.name === "InvalidStateError") {
        return new WebAuthnError({
          message: "The authenticator was previously registered",
          code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
          cause: error
        });
      } else if (error.name === "NotAllowedError") {
        return new WebAuthnError({
          message: error.message,
          code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
          cause: error
        });
      } else if (error.name === "NotSupportedError") {
        const validPubKeyCredParams = publicKey.pubKeyCredParams.filter((param) => param.type === "public-key");
        if (validPubKeyCredParams.length === 0) {
          return new WebAuthnError({
            message: 'No entry in pubKeyCredParams was of type "public-key"',
            code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
            cause: error
          });
        }
        return new WebAuthnError({
          message: "No available authenticator supported any of the specified pubKeyCredParams algorithms",
          code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
          cause: error
        });
      } else if (error.name === "SecurityError") {
        const effectiveDomain = window.location.hostname;
        if (!(0, webauthn_1.isValidDomain)(effectiveDomain)) {
          return new WebAuthnError({
            message: `${window.location.hostname} is an invalid domain`,
            code: "ERROR_INVALID_DOMAIN",
            cause: error
          });
        } else if (publicKey.rp.id !== effectiveDomain) {
          return new WebAuthnError({
            message: `The RP ID "${publicKey.rp.id}" is invalid for this domain`,
            code: "ERROR_INVALID_RP_ID",
            cause: error
          });
        }
      } else if (error.name === "TypeError") {
        if (publicKey.user.id.byteLength < 1 || publicKey.user.id.byteLength > 64) {
          return new WebAuthnError({
            message: "User ID was not between 1 and 64 characters",
            code: "ERROR_INVALID_USER_ID_LENGTH",
            cause: error
          });
        }
      } else if (error.name === "UnknownError") {
        return new WebAuthnError({
          message: "The authenticator was unable to process the specified options, or could not create a new credential",
          code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
          cause: error
        });
      }
      return new WebAuthnError({
        message: "a Non-Webauthn related error has occurred",
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: error
      });
    }
    function identifyAuthenticationError({ error, options }) {
      const { publicKey } = options;
      if (!publicKey) {
        throw Error("options was missing required publicKey property");
      }
      if (error.name === "AbortError") {
        if (options.signal instanceof AbortSignal) {
          return new WebAuthnError({
            message: "Authentication ceremony was sent an abort signal",
            code: "ERROR_CEREMONY_ABORTED",
            cause: error
          });
        }
      } else if (error.name === "NotAllowedError") {
        return new WebAuthnError({
          message: error.message,
          code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
          cause: error
        });
      } else if (error.name === "SecurityError") {
        const effectiveDomain = window.location.hostname;
        if (!(0, webauthn_1.isValidDomain)(effectiveDomain)) {
          return new WebAuthnError({
            message: `${window.location.hostname} is an invalid domain`,
            code: "ERROR_INVALID_DOMAIN",
            cause: error
          });
        } else if (publicKey.rpId !== effectiveDomain) {
          return new WebAuthnError({
            message: `The RP ID "${publicKey.rpId}" is invalid for this domain`,
            code: "ERROR_INVALID_RP_ID",
            cause: error
          });
        }
      } else if (error.name === "UnknownError") {
        return new WebAuthnError({
          message: "The authenticator was unable to process the specified options, or could not create a new assertion signature",
          code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
          cause: error
        });
      }
      return new WebAuthnError({
        message: "a Non-Webauthn related error has occurred",
        code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
        cause: error
      });
    }
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/webauthn.js
var require_webauthn = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/lib/webauthn.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.WebAuthnApi = exports2.DEFAULT_REQUEST_OPTIONS = exports2.DEFAULT_CREATION_OPTIONS = exports2.webAuthnAbortService = exports2.WebAuthnAbortService = exports2.identifyAuthenticationError = exports2.identifyRegistrationError = exports2.isWebAuthnError = exports2.WebAuthnError = void 0;
    exports2.deserializeCredentialCreationOptions = deserializeCredentialCreationOptions;
    exports2.deserializeCredentialRequestOptions = deserializeCredentialRequestOptions;
    exports2.serializeCredentialCreationResponse = serializeCredentialCreationResponse;
    exports2.serializeCredentialRequestResponse = serializeCredentialRequestResponse;
    exports2.isValidDomain = isValidDomain;
    exports2.createCredential = createCredential;
    exports2.getCredential = getCredential;
    exports2.mergeCredentialCreationOptions = mergeCredentialCreationOptions;
    exports2.mergeCredentialRequestOptions = mergeCredentialRequestOptions;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var base64url_1 = require_base64url();
    var errors_1 = require_errors3();
    var helpers_1 = require_helpers4();
    var webauthn_errors_1 = require_webauthn_errors();
    Object.defineProperty(exports2, "identifyAuthenticationError", { enumerable: true, get: function() {
      return webauthn_errors_1.identifyAuthenticationError;
    } });
    Object.defineProperty(exports2, "identifyRegistrationError", { enumerable: true, get: function() {
      return webauthn_errors_1.identifyRegistrationError;
    } });
    Object.defineProperty(exports2, "isWebAuthnError", { enumerable: true, get: function() {
      return webauthn_errors_1.isWebAuthnError;
    } });
    Object.defineProperty(exports2, "WebAuthnError", { enumerable: true, get: function() {
      return webauthn_errors_1.WebAuthnError;
    } });
    var WebAuthnAbortService = class {
      /**
       * Create an abort signal for a new WebAuthn operation.
       * Automatically cancels any existing operation.
       *
       * @returns {AbortSignal} Signal to pass to navigator.credentials.create() or .get()
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal MDN - AbortSignal}
       */
      createNewAbortSignal() {
        if (this.controller) {
          const abortError = new Error("Cancelling existing WebAuthn API call for new one");
          abortError.name = "AbortError";
          this.controller.abort(abortError);
        }
        const newController = new AbortController();
        this.controller = newController;
        return newController.signal;
      }
      /**
       * Manually cancel the current WebAuthn operation.
       * Useful for cleaning up when user cancels or navigates away.
       *
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/AbortController/abort MDN - AbortController.abort}
       */
      cancelCeremony() {
        if (this.controller) {
          const abortError = new Error("Manually cancelling existing WebAuthn API call");
          abortError.name = "AbortError";
          this.controller.abort(abortError);
          this.controller = void 0;
        }
      }
    };
    exports2.WebAuthnAbortService = WebAuthnAbortService;
    exports2.webAuthnAbortService = new WebAuthnAbortService();
    function deserializeCredentialCreationOptions(options) {
      if (!options) {
        throw new Error("Credential creation options are required");
      }
      if (typeof PublicKeyCredential !== "undefined" && "parseCreationOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseCreationOptionsFromJSON === "function") {
        return PublicKeyCredential.parseCreationOptionsFromJSON(
          /** we assert the options here as typescript still doesn't know about future webauthn types */
          options
        );
      }
      const { challenge: challengeStr, user: userOpts, excludeCredentials } = options, restOptions = tslib_1.__rest(
        options,
        ["challenge", "user", "excludeCredentials"]
      );
      const challenge = (0, base64url_1.base64UrlToUint8Array)(challengeStr).buffer;
      const user = Object.assign(Object.assign({}, userOpts), { id: (0, base64url_1.base64UrlToUint8Array)(userOpts.id).buffer });
      const result = Object.assign(Object.assign({}, restOptions), {
        challenge,
        user
      });
      if (excludeCredentials && excludeCredentials.length > 0) {
        result.excludeCredentials = new Array(excludeCredentials.length);
        for (let i = 0; i < excludeCredentials.length; i++) {
          const cred = excludeCredentials[i];
          result.excludeCredentials[i] = Object.assign(Object.assign({}, cred), {
            id: (0, base64url_1.base64UrlToUint8Array)(cred.id).buffer,
            type: cred.type || "public-key",
            // Cast transports to handle future transport types like "cable"
            transports: cred.transports
          });
        }
      }
      return result;
    }
    function deserializeCredentialRequestOptions(options) {
      if (!options) {
        throw new Error("Credential request options are required");
      }
      if (typeof PublicKeyCredential !== "undefined" && "parseRequestOptionsFromJSON" in PublicKeyCredential && typeof PublicKeyCredential.parseRequestOptionsFromJSON === "function") {
        return PublicKeyCredential.parseRequestOptionsFromJSON(options);
      }
      const { challenge: challengeStr, allowCredentials } = options, restOptions = tslib_1.__rest(
        options,
        ["challenge", "allowCredentials"]
      );
      const challenge = (0, base64url_1.base64UrlToUint8Array)(challengeStr).buffer;
      const result = Object.assign(Object.assign({}, restOptions), { challenge });
      if (allowCredentials && allowCredentials.length > 0) {
        result.allowCredentials = new Array(allowCredentials.length);
        for (let i = 0; i < allowCredentials.length; i++) {
          const cred = allowCredentials[i];
          result.allowCredentials[i] = Object.assign(Object.assign({}, cred), {
            id: (0, base64url_1.base64UrlToUint8Array)(cred.id).buffer,
            type: cred.type || "public-key",
            // Cast transports to handle future transport types like "cable"
            transports: cred.transports
          });
        }
      }
      return result;
    }
    function serializeCredentialCreationResponse(credential) {
      var _a;
      if ("toJSON" in credential && typeof credential.toJSON === "function") {
        return credential.toJSON();
      }
      const credentialWithAttachment = credential;
      return {
        id: credential.id,
        rawId: credential.id,
        response: {
          attestationObject: (0, base64url_1.bytesToBase64URL)(new Uint8Array(credential.response.attestationObject)),
          clientDataJSON: (0, base64url_1.bytesToBase64URL)(new Uint8Array(credential.response.clientDataJSON))
        },
        type: "public-key",
        clientExtensionResults: credential.getClientExtensionResults(),
        // Convert null to undefined and cast to AuthenticatorAttachment type
        authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
      };
    }
    function serializeCredentialRequestResponse(credential) {
      var _a;
      if ("toJSON" in credential && typeof credential.toJSON === "function") {
        return credential.toJSON();
      }
      const credentialWithAttachment = credential;
      const clientExtensionResults = credential.getClientExtensionResults();
      const assertionResponse = credential.response;
      return {
        id: credential.id,
        rawId: credential.id,
        // W3C spec expects rawId to match id for JSON format
        response: {
          authenticatorData: (0, base64url_1.bytesToBase64URL)(new Uint8Array(assertionResponse.authenticatorData)),
          clientDataJSON: (0, base64url_1.bytesToBase64URL)(new Uint8Array(assertionResponse.clientDataJSON)),
          signature: (0, base64url_1.bytesToBase64URL)(new Uint8Array(assertionResponse.signature)),
          userHandle: assertionResponse.userHandle ? (0, base64url_1.bytesToBase64URL)(new Uint8Array(assertionResponse.userHandle)) : void 0
        },
        type: "public-key",
        clientExtensionResults,
        // Convert null to undefined and cast to AuthenticatorAttachment type
        authenticatorAttachment: (_a = credentialWithAttachment.authenticatorAttachment) !== null && _a !== void 0 ? _a : void 0
      };
    }
    function isValidDomain(hostname) {
      return (
        // Consider localhost valid as well since it's okay wrt Secure Contexts
        hostname === "localhost" || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(hostname)
      );
    }
    function browserSupportsWebAuthn() {
      var _a, _b;
      return !!((0, helpers_1.isBrowser)() && "PublicKeyCredential" in window && window.PublicKeyCredential && "credentials" in navigator && typeof ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _a === void 0 ? void 0 : _a.create) === "function" && typeof ((_b = navigator === null || navigator === void 0 ? void 0 : navigator.credentials) === null || _b === void 0 ? void 0 : _b.get) === "function");
    }
    async function createCredential(options) {
      try {
        const response = await navigator.credentials.create(
          /** we assert the type here until typescript types are updated */
          options
        );
        if (!response) {
          return {
            data: null,
            error: new webauthn_errors_1.WebAuthnUnknownError("Empty credential response", response)
          };
        }
        if (!(response instanceof PublicKeyCredential)) {
          return {
            data: null,
            error: new webauthn_errors_1.WebAuthnUnknownError("Browser returned unexpected credential type", response)
          };
        }
        return { data: response, error: null };
      } catch (err) {
        return {
          data: null,
          error: (0, webauthn_errors_1.identifyRegistrationError)({
            error: err,
            options
          })
        };
      }
    }
    async function getCredential(options) {
      try {
        const response = await navigator.credentials.get(
          /** we assert the type here until typescript types are updated */
          options
        );
        if (!response) {
          return {
            data: null,
            error: new webauthn_errors_1.WebAuthnUnknownError("Empty credential response", response)
          };
        }
        if (!(response instanceof PublicKeyCredential)) {
          return {
            data: null,
            error: new webauthn_errors_1.WebAuthnUnknownError("Browser returned unexpected credential type", response)
          };
        }
        return { data: response, error: null };
      } catch (err) {
        return {
          data: null,
          error: (0, webauthn_errors_1.identifyAuthenticationError)({
            error: err,
            options
          })
        };
      }
    }
    exports2.DEFAULT_CREATION_OPTIONS = {
      hints: ["security-key"],
      authenticatorSelection: {
        authenticatorAttachment: "cross-platform",
        requireResidentKey: false,
        /** set to preferred because older yubikeys don't have PIN/Biometric */
        userVerification: "preferred",
        residentKey: "discouraged"
      },
      attestation: "direct"
    };
    exports2.DEFAULT_REQUEST_OPTIONS = {
      /** set to preferred because older yubikeys don't have PIN/Biometric */
      userVerification: "preferred",
      hints: ["security-key"],
      attestation: "direct"
    };
    function deepMerge(...sources) {
      const isObject = (val) => val !== null && typeof val === "object" && !Array.isArray(val);
      const isArrayBufferLike = (val) => val instanceof ArrayBuffer || ArrayBuffer.isView(val);
      const result = {};
      for (const source of sources) {
        if (!source)
          continue;
        for (const key in source) {
          const value = source[key];
          if (value === void 0)
            continue;
          if (Array.isArray(value)) {
            result[key] = value;
          } else if (isArrayBufferLike(value)) {
            result[key] = value;
          } else if (isObject(value)) {
            const existing = result[key];
            if (isObject(existing)) {
              result[key] = deepMerge(existing, value);
            } else {
              result[key] = deepMerge(value);
            }
          } else {
            result[key] = value;
          }
        }
      }
      return result;
    }
    function mergeCredentialCreationOptions(baseOptions, overrides) {
      return deepMerge(exports2.DEFAULT_CREATION_OPTIONS, baseOptions, overrides || {});
    }
    function mergeCredentialRequestOptions(baseOptions, overrides) {
      return deepMerge(exports2.DEFAULT_REQUEST_OPTIONS, baseOptions, overrides || {});
    }
    var WebAuthnApi = class {
      constructor(client) {
        this.client = client;
        this.enroll = this._enroll.bind(this);
        this.challenge = this._challenge.bind(this);
        this.verify = this._verify.bind(this);
        this.authenticate = this._authenticate.bind(this);
        this.register = this._register.bind(this);
      }
      /**
       * Enroll a new WebAuthn factor.
       * Creates an unverified WebAuthn factor that must be verified with a credential.
       *
       * @experimental This method is experimental and may change in future releases
       * @param {Omit<MFAEnrollWebauthnParams, 'factorType'>} params - Enrollment parameters (friendlyName required)
       * @returns {Promise<AuthMFAEnrollWebauthnResponse>} Enrolled factor details or error
       * @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registering a New Credential}
       */
      async _enroll(params) {
        return this.client.mfa.enroll(Object.assign(Object.assign({}, params), { factorType: "webauthn" }));
      }
      /**
       * Challenge for WebAuthn credential creation or authentication.
       * Combines server challenge with browser credential operations.
       * Handles both registration (create) and authentication (request) flows.
       *
       * @experimental This method is experimental and may change in future releases
       * @param {MFAChallengeWebauthnParams & { friendlyName?: string; signal?: AbortSignal }} params - Challenge parameters including factorId
       * @param {Object} overrides - Allows you to override the parameters passed to navigator.credentials
       * @param {PublicKeyCredentialCreationOptionsFuture} overrides.create - Override options for credential creation
       * @param {PublicKeyCredentialRequestOptionsFuture} overrides.request - Override options for credential request
       * @returns {Promise<RequestResult>} Challenge response with credential or error
       * @see {@link https://w3c.github.io/webauthn/#sctn-credential-creation W3C WebAuthn Spec - Credential Creation}
       * @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying Assertion}
       */
      async _challenge({ factorId, webauthn, friendlyName, signal }, overrides) {
        try {
          const { data: challengeResponse, error: challengeError } = await this.client.mfa.challenge({
            factorId,
            webauthn
          });
          if (!challengeResponse) {
            return { data: null, error: challengeError };
          }
          const abortSignal = signal !== null && signal !== void 0 ? signal : exports2.webAuthnAbortService.createNewAbortSignal();
          if (challengeResponse.webauthn.type === "create") {
            const { user } = challengeResponse.webauthn.credential_options.publicKey;
            if (!user.name) {
              user.name = `${user.id}:${friendlyName}`;
            }
            if (!user.displayName) {
              user.displayName = user.name;
            }
          }
          switch (challengeResponse.webauthn.type) {
            case "create": {
              const options = mergeCredentialCreationOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.create);
              const { data, error } = await createCredential({
                publicKey: options,
                signal: abortSignal
              });
              if (data) {
                return {
                  data: {
                    factorId,
                    challengeId: challengeResponse.id,
                    webauthn: {
                      type: challengeResponse.webauthn.type,
                      credential_response: data
                    }
                  },
                  error: null
                };
              }
              return { data: null, error };
            }
            case "request": {
              const options = mergeCredentialRequestOptions(challengeResponse.webauthn.credential_options.publicKey, overrides === null || overrides === void 0 ? void 0 : overrides.request);
              const { data, error } = await getCredential(Object.assign(Object.assign({}, challengeResponse.webauthn.credential_options), { publicKey: options, signal: abortSignal }));
              if (data) {
                return {
                  data: {
                    factorId,
                    challengeId: challengeResponse.id,
                    webauthn: {
                      type: challengeResponse.webauthn.type,
                      credential_response: data
                    }
                  },
                  error: null
                };
              }
              return { data: null, error };
            }
          }
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          return {
            data: null,
            error: new errors_1.AuthUnknownError("Unexpected error in challenge", error)
          };
        }
      }
      /**
       * Verify a WebAuthn credential with the server.
       * Completes the WebAuthn ceremony by sending the credential to the server for verification.
       *
       * @experimental This method is experimental and may change in future releases
       * @param {Object} params - Verification parameters
       * @param {string} params.challengeId - ID of the challenge being verified
       * @param {string} params.factorId - ID of the WebAuthn factor
       * @param {MFAVerifyWebauthnParams<T>['webauthn']} params.webauthn - WebAuthn credential response
       * @returns {Promise<AuthMFAVerifyResponse>} Verification result with session or error
       * @see {@link https://w3c.github.io/webauthn/#sctn-verifying-assertion W3C WebAuthn Spec - Verifying an Authentication Assertion}
       * */
      async _verify({ challengeId, factorId, webauthn }) {
        return this.client.mfa.verify({
          factorId,
          challengeId,
          webauthn
        });
      }
      /**
       * Complete WebAuthn authentication flow.
       * Performs challenge and verification in a single operation for existing credentials.
       *
       * @experimental This method is experimental and may change in future releases
       * @param {Object} params - Authentication parameters
       * @param {string} params.factorId - ID of the WebAuthn factor to authenticate with
       * @param {Object} params.webauthn - WebAuthn configuration
       * @param {string} params.webauthn.rpId - Relying Party ID (defaults to current hostname)
       * @param {string[]} params.webauthn.rpOrigins - Allowed origins (defaults to current origin)
       * @param {AbortSignal} params.webauthn.signal - Optional abort signal
       * @param {PublicKeyCredentialRequestOptionsFuture} overrides - Override options for navigator.credentials.get
       * @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Authentication result
       * @see {@link https://w3c.github.io/webauthn/#sctn-authentication W3C WebAuthn Spec - Authentication Ceremony}
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialRequestOptions MDN - PublicKeyCredentialRequestOptions}
       */
      async _authenticate({ factorId, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
        if (!rpId) {
          return {
            data: null,
            error: new errors_1.AuthError("rpId is required for WebAuthn authentication")
          };
        }
        try {
          if (!browserSupportsWebAuthn()) {
            return {
              data: null,
              error: new errors_1.AuthUnknownError("Browser does not support WebAuthn", null)
            };
          }
          const { data: challengeResponse, error: challengeError } = await this.challenge({
            factorId,
            webauthn: { rpId, rpOrigins },
            signal
          }, { request: overrides });
          if (!challengeResponse) {
            return { data: null, error: challengeError };
          }
          const { webauthn } = challengeResponse;
          return this._verify({
            factorId,
            challengeId: challengeResponse.challengeId,
            webauthn: {
              type: webauthn.type,
              rpId,
              rpOrigins,
              credential_response: webauthn.credential_response
            }
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          return {
            data: null,
            error: new errors_1.AuthUnknownError("Unexpected error in authenticate", error)
          };
        }
      }
      /**
       * Complete WebAuthn registration flow.
       * Performs enrollment, challenge, and verification in a single operation for new credentials.
       *
       * @experimental This method is experimental and may change in future releases
       * @param {Object} params - Registration parameters
       * @param {string} params.friendlyName - User-friendly name for the credential
       * @param {string} params.rpId - Relying Party ID (defaults to current hostname)
       * @param {string[]} params.rpOrigins - Allowed origins (defaults to current origin)
       * @param {AbortSignal} params.signal - Optional abort signal
       * @param {PublicKeyCredentialCreationOptionsFuture} overrides - Override options for navigator.credentials.create
       * @returns {Promise<RequestResult<AuthMFAVerifyResponseData, WebAuthnError | AuthError>>} Registration result
       * @see {@link https://w3c.github.io/webauthn/#sctn-registering-a-new-credential W3C WebAuthn Spec - Registration Ceremony}
       * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/PublicKeyCredentialCreationOptions MDN - PublicKeyCredentialCreationOptions}
       */
      async _register({ friendlyName, webauthn: { rpId = typeof window !== "undefined" ? window.location.hostname : void 0, rpOrigins = typeof window !== "undefined" ? [window.location.origin] : void 0, signal } = {} }, overrides) {
        if (!rpId) {
          return {
            data: null,
            error: new errors_1.AuthError("rpId is required for WebAuthn registration")
          };
        }
        try {
          if (!browserSupportsWebAuthn()) {
            return {
              data: null,
              error: new errors_1.AuthUnknownError("Browser does not support WebAuthn", null)
            };
          }
          const { data: factor, error: enrollError } = await this._enroll({
            friendlyName
          });
          if (!factor) {
            await this.client.mfa.listFactors().then((factors) => {
              var _a;
              return (_a = factors.data) === null || _a === void 0 ? void 0 : _a.all.find((v) => v.factor_type === "webauthn" && v.friendly_name === friendlyName && v.status !== "unverified");
            }).then((factor2) => factor2 ? this.client.mfa.unenroll({ factorId: factor2 === null || factor2 === void 0 ? void 0 : factor2.id }) : void 0);
            return { data: null, error: enrollError };
          }
          const { data: challengeResponse, error: challengeError } = await this._challenge({
            factorId: factor.id,
            friendlyName: factor.friendly_name,
            webauthn: { rpId, rpOrigins },
            signal
          }, {
            create: overrides
          });
          if (!challengeResponse) {
            return { data: null, error: challengeError };
          }
          return this._verify({
            factorId: factor.id,
            challengeId: challengeResponse.challengeId,
            webauthn: {
              rpId,
              rpOrigins,
              type: challengeResponse.webauthn.type,
              credential_response: challengeResponse.webauthn.credential_response
            }
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return { data: null, error };
          }
          return {
            data: null,
            error: new errors_1.AuthUnknownError("Unexpected error in register", error)
          };
        }
      }
    };
    exports2.WebAuthnApi = WebAuthnApi;
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/GoTrueClient.js
var require_GoTrueClient = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/GoTrueClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var GoTrueAdminApi_1 = tslib_1.__importDefault(require_GoTrueAdminApi());
    var constants_1 = require_constants5();
    var errors_1 = require_errors3();
    var fetch_1 = require_fetch4();
    var helpers_1 = require_helpers4();
    var local_storage_1 = require_local_storage();
    var locks_1 = require_locks();
    var polyfills_1 = require_polyfills();
    var version_1 = require_version4();
    var base64url_1 = require_base64url();
    var ethereum_1 = require_ethereum();
    var webauthn_1 = require_webauthn();
    (0, polyfills_1.polyfillGlobalThis)();
    var DEFAULT_OPTIONS = {
      url: constants_1.GOTRUE_URL,
      storageKey: constants_1.STORAGE_KEY,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      headers: constants_1.DEFAULT_HEADERS,
      flowType: "implicit",
      debug: false,
      hasCustomAuthorizationHeader: false,
      throwOnError: false
    };
    async function lockNoOp(name, acquireTimeout, fn) {
      return await fn();
    }
    var GLOBAL_JWKS = {};
    var GoTrueClient = class _GoTrueClient {
      /**
       * The JWKS used for verifying asymmetric JWTs
       */
      get jwks() {
        var _a, _b;
        return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.jwks) !== null && _b !== void 0 ? _b : { keys: [] };
      }
      set jwks(value) {
        GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { jwks: value });
      }
      get jwks_cached_at() {
        var _a, _b;
        return (_b = (_a = GLOBAL_JWKS[this.storageKey]) === null || _a === void 0 ? void 0 : _a.cachedAt) !== null && _b !== void 0 ? _b : Number.MIN_SAFE_INTEGER;
      }
      set jwks_cached_at(value) {
        GLOBAL_JWKS[this.storageKey] = Object.assign(Object.assign({}, GLOBAL_JWKS[this.storageKey]), { cachedAt: value });
      }
      /**
       * Create a new client for use in the browser.
       *
       * @example
       * ```ts
       * import { GoTrueClient } from '@supabase/auth-js'
       *
       * const auth = new GoTrueClient({
       *   url: 'https://xyzcompany.supabase.co/auth/v1',
       *   headers: { apikey: 'public-anon-key' },
       *   storageKey: 'supabase-auth',
       * })
       * ```
       */
      constructor(options) {
        var _a, _b, _c;
        this.userStorage = null;
        this.memoryStorage = null;
        this.stateChangeEmitters = /* @__PURE__ */ new Map();
        this.autoRefreshTicker = null;
        this.visibilityChangedCallback = null;
        this.refreshingDeferred = null;
        this.initializePromise = null;
        this.detectSessionInUrl = true;
        this.hasCustomAuthorizationHeader = false;
        this.suppressGetSessionWarning = false;
        this.lockAcquired = false;
        this.pendingInLock = [];
        this.broadcastChannel = null;
        this.logger = console.log;
        const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
        this.storageKey = settings.storageKey;
        this.instanceID = (_a = _GoTrueClient.nextInstanceID[this.storageKey]) !== null && _a !== void 0 ? _a : 0;
        _GoTrueClient.nextInstanceID[this.storageKey] = this.instanceID + 1;
        this.logDebugMessages = !!settings.debug;
        if (typeof settings.debug === "function") {
          this.logger = settings.debug;
        }
        if (this.instanceID > 0 && (0, helpers_1.isBrowser)()) {
          const message = `${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;
          console.warn(message);
          if (this.logDebugMessages) {
            console.trace(message);
          }
        }
        this.persistSession = settings.persistSession;
        this.autoRefreshToken = settings.autoRefreshToken;
        this.admin = new GoTrueAdminApi_1.default({
          url: settings.url,
          headers: settings.headers,
          fetch: settings.fetch
        });
        this.url = settings.url;
        this.headers = settings.headers;
        this.fetch = (0, helpers_1.resolveFetch)(settings.fetch);
        this.lock = settings.lock || lockNoOp;
        this.detectSessionInUrl = settings.detectSessionInUrl;
        this.flowType = settings.flowType;
        this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
        this.throwOnError = settings.throwOnError;
        if (settings.lock) {
          this.lock = settings.lock;
        } else if ((0, helpers_1.isBrowser)() && ((_b = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _b === void 0 ? void 0 : _b.locks)) {
          this.lock = locks_1.navigatorLock;
        } else {
          this.lock = lockNoOp;
        }
        if (!this.jwks) {
          this.jwks = { keys: [] };
          this.jwks_cached_at = Number.MIN_SAFE_INTEGER;
        }
        this.mfa = {
          verify: this._verify.bind(this),
          enroll: this._enroll.bind(this),
          unenroll: this._unenroll.bind(this),
          challenge: this._challenge.bind(this),
          listFactors: this._listFactors.bind(this),
          challengeAndVerify: this._challengeAndVerify.bind(this),
          getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this),
          webauthn: new webauthn_1.WebAuthnApi(this)
        };
        this.oauth = {
          getAuthorizationDetails: this._getAuthorizationDetails.bind(this),
          approveAuthorization: this._approveAuthorization.bind(this),
          denyAuthorization: this._denyAuthorization.bind(this),
          listGrants: this._listOAuthGrants.bind(this),
          revokeGrant: this._revokeOAuthGrant.bind(this)
        };
        if (this.persistSession) {
          if (settings.storage) {
            this.storage = settings.storage;
          } else {
            if ((0, helpers_1.supportsLocalStorage)()) {
              this.storage = globalThis.localStorage;
            } else {
              this.memoryStorage = {};
              this.storage = (0, local_storage_1.memoryLocalStorageAdapter)(this.memoryStorage);
            }
          }
          if (settings.userStorage) {
            this.userStorage = settings.userStorage;
          }
        } else {
          this.memoryStorage = {};
          this.storage = (0, local_storage_1.memoryLocalStorageAdapter)(this.memoryStorage);
        }
        if ((0, helpers_1.isBrowser)() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
          try {
            this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
          } catch (e) {
            console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available", e);
          }
          (_c = this.broadcastChannel) === null || _c === void 0 ? void 0 : _c.addEventListener("message", async (event) => {
            this._debug("received broadcast notification from other tab or client", event);
            await this._notifyAllSubscribers(event.data.event, event.data.session, false);
          });
        }
        this.initialize();
      }
      /**
       * Returns whether error throwing mode is enabled for this client.
       */
      isThrowOnErrorEnabled() {
        return this.throwOnError;
      }
      /**
       * Centralizes return handling with optional error throwing. When `throwOnError` is enabled
       * and the provided result contains a non-nullish error, the error is thrown instead of
       * being returned. This ensures consistent behavior across all public API methods.
       */
      _returnResult(result) {
        if (this.throwOnError && result && result.error) {
          throw result.error;
        }
        return result;
      }
      _logPrefix() {
        return `GoTrueClient@${this.storageKey}:${this.instanceID} (${version_1.version}) ${(/* @__PURE__ */ new Date()).toISOString()}`;
      }
      _debug(...args) {
        if (this.logDebugMessages) {
          this.logger(this._logPrefix(), ...args);
        }
        return this;
      }
      /**
       * Initializes the client session either from the url or from storage.
       * This method is automatically called when instantiating the client, but should also be called
       * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
       */
      async initialize() {
        if (this.initializePromise) {
          return await this.initializePromise;
        }
        this.initializePromise = (async () => {
          return await this._acquireLock(-1, async () => {
            return await this._initialize();
          });
        })();
        return await this.initializePromise;
      }
      /**
       * IMPORTANT:
       * 1. Never throw in this method, as it is called from the constructor
       * 2. Never return a session from this method as it would be cached over
       *    the whole lifetime of the client
       */
      async _initialize() {
        var _a;
        try {
          let params = {};
          let callbackUrlType = "none";
          if ((0, helpers_1.isBrowser)()) {
            params = (0, helpers_1.parseParametersFromURL)(window.location.href);
            if (this._isImplicitGrantCallback(params)) {
              callbackUrlType = "implicit";
            } else if (await this._isPKCECallback(params)) {
              callbackUrlType = "pkce";
            }
          }
          if ((0, helpers_1.isBrowser)() && this.detectSessionInUrl && callbackUrlType !== "none") {
            const { data, error } = await this._getSessionFromURL(params, callbackUrlType);
            if (error) {
              this._debug("#_initialize()", "error detecting session from URL", error);
              if ((0, errors_1.isAuthImplicitGrantRedirectError)(error)) {
                const errorCode = (_a = error.details) === null || _a === void 0 ? void 0 : _a.code;
                if (errorCode === "identity_already_exists" || errorCode === "identity_not_found" || errorCode === "single_identity_not_deletable") {
                  return { error };
                }
              }
              await this._removeSession();
              return { error };
            }
            const { session, redirectType } = data;
            this._debug("#_initialize()", "detected session in URL", session, "redirect type", redirectType);
            await this._saveSession(session);
            setTimeout(async () => {
              if (redirectType === "recovery") {
                await this._notifyAllSubscribers("PASSWORD_RECOVERY", session);
              } else {
                await this._notifyAllSubscribers("SIGNED_IN", session);
              }
            }, 0);
            return { error: null };
          }
          await this._recoverAndRefresh();
          return { error: null };
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ error });
          }
          return this._returnResult({
            error: new errors_1.AuthUnknownError("Unexpected error during initialization", error)
          });
        } finally {
          await this._handleVisibilityChange();
          this._debug("#_initialize()", "end");
        }
      }
      /**
       * Creates a new anonymous user.
       *
       * @returns A session where the is_anonymous claim in the access token JWT set to true
       */
      async signInAnonymously(credentials) {
        var _a, _b, _c;
        try {
          const res = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/signup`, {
            headers: this.headers,
            body: {
              data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
              gotrue_meta_security: { captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken }
            },
            xform: fetch_1._sessionResponse
          });
          const { data, error } = res;
          if (error || !data) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          const session = data.session;
          const user = data.user;
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
          return this._returnResult({ data: { user, session }, error: null });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      /**
       * Creates a new user.
       *
       * Be aware that if a user account exists in the system you may get back an
       * error message that attempts to hide this information from the user.
       * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
       *
       * @returns A logged-in session if the server has "autoconfirm" ON
       * @returns A user if the server has "autoconfirm" OFF
       */
      async signUp(credentials) {
        var _a, _b, _c;
        try {
          let res;
          if ("email" in credentials) {
            const { email, password, options } = credentials;
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === "pkce") {
              ;
              [codeChallenge, codeChallengeMethod] = await (0, helpers_1.getCodeChallengeAndMethod)(this.storage, this.storageKey);
            }
            res = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/signup`, {
              headers: this.headers,
              redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
              body: {
                email,
                password,
                data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                code_challenge: codeChallenge,
                code_challenge_method: codeChallengeMethod
              },
              xform: fetch_1._sessionResponse
            });
          } else if ("phone" in credentials) {
            const { phone, password, options } = credentials;
            res = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/signup`, {
              headers: this.headers,
              body: {
                phone,
                password,
                data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
                channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : "sms",
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              },
              xform: fetch_1._sessionResponse
            });
          } else {
            throw new errors_1.AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
          }
          const { data, error } = res;
          if (error || !data) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          const session = data.session;
          const user = data.user;
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
          return this._returnResult({ data: { user, session }, error: null });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      /**
       * Log in an existing user with an email and password or phone and password.
       *
       * Be aware that you may get back an error message that will not distinguish
       * between the cases where the account does not exist or that the
       * email/phone and password combination is wrong or that the account can only
       * be accessed via social login.
       */
      async signInWithPassword(credentials) {
        try {
          let res;
          if ("email" in credentials) {
            const { email, password, options } = credentials;
            res = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
              headers: this.headers,
              body: {
                email,
                password,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              },
              xform: fetch_1._sessionResponsePassword
            });
          } else if ("phone" in credentials) {
            const { phone, password, options } = credentials;
            res = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/token?grant_type=password`, {
              headers: this.headers,
              body: {
                phone,
                password,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              },
              xform: fetch_1._sessionResponsePassword
            });
          } else {
            throw new errors_1.AuthInvalidCredentialsError("You must provide either an email or phone number and a password");
          }
          const { data, error } = res;
          if (error) {
            return this._returnResult({ data: { user: null, session: null }, error });
          } else if (!data || !data.session || !data.user) {
            const invalidTokenError = new errors_1.AuthInvalidTokenResponseError();
            return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return this._returnResult({
            data: Object.assign({ user: data.user, session: data.session }, data.weak_password ? { weakPassword: data.weak_password } : null),
            error
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      /**
       * Log in an existing user via a third-party provider.
       * This method supports the PKCE flow.
       */
      async signInWithOAuth(credentials) {
        var _a, _b, _c, _d;
        return await this._handleProviderSignIn(credentials.provider, {
          redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
          scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
          queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
          skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
        });
      }
      /**
       * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
       */
      async exchangeCodeForSession(authCode) {
        await this.initializePromise;
        return this._acquireLock(-1, async () => {
          return this._exchangeCodeForSession(authCode);
        });
      }
      /**
       * Signs in a user by verifying a message signed by the user's private key.
       * Supports Ethereum (via Sign-In-With-Ethereum) & Solana (Sign-In-With-Solana) standards,
       * both of which derive from the EIP-4361 standard
       * With slight variation on Solana's side.
       * @reference https://eips.ethereum.org/EIPS/eip-4361
       */
      async signInWithWeb3(credentials) {
        const { chain } = credentials;
        switch (chain) {
          case "ethereum":
            return await this.signInWithEthereum(credentials);
          case "solana":
            return await this.signInWithSolana(credentials);
          default:
            throw new Error(`@supabase/auth-js: Unsupported chain "${chain}"`);
        }
      }
      async signInWithEthereum(credentials) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        let message;
        let signature;
        if ("message" in credentials) {
          message = credentials.message;
          signature = credentials.signature;
        } else {
          const { chain, wallet, statement, options } = credentials;
          let resolvedWallet;
          if (!(0, helpers_1.isBrowser)()) {
            if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
              throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            }
            resolvedWallet = wallet;
          } else if (typeof wallet === "object") {
            resolvedWallet = wallet;
          } else {
            const windowAny = window;
            if ("ethereum" in windowAny && typeof windowAny.ethereum === "object" && "request" in windowAny.ethereum && typeof windowAny.ethereum.request === "function") {
              resolvedWallet = windowAny.ethereum;
            } else {
              throw new Error(`@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.`);
            }
          }
          const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
          const accounts = await resolvedWallet.request({
            method: "eth_requestAccounts"
          }).then((accs) => accs).catch(() => {
            throw new Error(`@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid`);
          });
          if (!accounts || accounts.length === 0) {
            throw new Error(`@supabase/auth-js: No accounts available. Please ensure the wallet is connected.`);
          }
          const address = (0, ethereum_1.getAddress)(accounts[0]);
          let chainId = (_b = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _b === void 0 ? void 0 : _b.chainId;
          if (!chainId) {
            const chainIdHex = await resolvedWallet.request({
              method: "eth_chainId"
            });
            chainId = (0, ethereum_1.fromHex)(chainIdHex);
          }
          const siweMessage = {
            domain: url.host,
            address,
            statement,
            uri: url.href,
            version: "1",
            chainId,
            nonce: (_c = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _c === void 0 ? void 0 : _c.nonce,
            issuedAt: (_e = (_d = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _d === void 0 ? void 0 : _d.issuedAt) !== null && _e !== void 0 ? _e : /* @__PURE__ */ new Date(),
            expirationTime: (_f = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _f === void 0 ? void 0 : _f.expirationTime,
            notBefore: (_g = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _g === void 0 ? void 0 : _g.notBefore,
            requestId: (_h = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _h === void 0 ? void 0 : _h.requestId,
            resources: (_j = options === null || options === void 0 ? void 0 : options.signInWithEthereum) === null || _j === void 0 ? void 0 : _j.resources
          };
          message = (0, ethereum_1.createSiweMessage)(siweMessage);
          signature = await resolvedWallet.request({
            method: "personal_sign",
            params: [(0, ethereum_1.toHex)(message), address]
          });
        }
        try {
          const { data, error } = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
            headers: this.headers,
            body: Object.assign({
              chain: "ethereum",
              message,
              signature
            }, ((_k = credentials.options) === null || _k === void 0 ? void 0 : _k.captchaToken) ? { gotrue_meta_security: { captcha_token: (_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken } } : null),
            xform: fetch_1._sessionResponse
          });
          if (error) {
            throw error;
          }
          if (!data || !data.session || !data.user) {
            const invalidTokenError = new errors_1.AuthInvalidTokenResponseError();
            return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return this._returnResult({ data: Object.assign({}, data), error });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      async signInWithSolana(credentials) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        let message;
        let signature;
        if ("message" in credentials) {
          message = credentials.message;
          signature = credentials.signature;
        } else {
          const { chain, wallet, statement, options } = credentials;
          let resolvedWallet;
          if (!(0, helpers_1.isBrowser)()) {
            if (typeof wallet !== "object" || !(options === null || options === void 0 ? void 0 : options.url)) {
              throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");
            }
            resolvedWallet = wallet;
          } else if (typeof wallet === "object") {
            resolvedWallet = wallet;
          } else {
            const windowAny = window;
            if ("solana" in windowAny && typeof windowAny.solana === "object" && ("signIn" in windowAny.solana && typeof windowAny.solana.signIn === "function" || "signMessage" in windowAny.solana && typeof windowAny.solana.signMessage === "function")) {
              resolvedWallet = windowAny.solana;
            } else {
              throw new Error(`@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.`);
            }
          }
          const url = new URL((_a = options === null || options === void 0 ? void 0 : options.url) !== null && _a !== void 0 ? _a : window.location.href);
          if ("signIn" in resolvedWallet && resolvedWallet.signIn) {
            const output = await resolvedWallet.signIn(Object.assign(Object.assign(Object.assign({ issuedAt: (/* @__PURE__ */ new Date()).toISOString() }, options === null || options === void 0 ? void 0 : options.signInWithSolana), {
              // non-overridable properties
              version: "1",
              domain: url.host,
              uri: url.href
            }), statement ? { statement } : null));
            let outputToProcess;
            if (Array.isArray(output) && output[0] && typeof output[0] === "object") {
              outputToProcess = output[0];
            } else if (output && typeof output === "object" && "signedMessage" in output && "signature" in output) {
              outputToProcess = output;
            } else {
              throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");
            }
            if ("signedMessage" in outputToProcess && "signature" in outputToProcess && (typeof outputToProcess.signedMessage === "string" || outputToProcess.signedMessage instanceof Uint8Array) && outputToProcess.signature instanceof Uint8Array) {
              message = typeof outputToProcess.signedMessage === "string" ? outputToProcess.signedMessage : new TextDecoder().decode(outputToProcess.signedMessage);
              signature = outputToProcess.signature;
            } else {
              throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");
            }
          } else {
            if (!("signMessage" in resolvedWallet) || typeof resolvedWallet.signMessage !== "function" || !("publicKey" in resolvedWallet) || typeof resolvedWallet !== "object" || !resolvedWallet.publicKey || !("toBase58" in resolvedWallet.publicKey) || typeof resolvedWallet.publicKey.toBase58 !== "function") {
              throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");
            }
            message = [
              `${url.host} wants you to sign in with your Solana account:`,
              resolvedWallet.publicKey.toBase58(),
              ...statement ? ["", statement, ""] : [""],
              "Version: 1",
              `URI: ${url.href}`,
              `Issued At: ${(_c = (_b = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _b === void 0 ? void 0 : _b.issuedAt) !== null && _c !== void 0 ? _c : (/* @__PURE__ */ new Date()).toISOString()}`,
              ...((_d = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _d === void 0 ? void 0 : _d.notBefore) ? [`Not Before: ${options.signInWithSolana.notBefore}`] : [],
              ...((_e = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _e === void 0 ? void 0 : _e.expirationTime) ? [`Expiration Time: ${options.signInWithSolana.expirationTime}`] : [],
              ...((_f = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _f === void 0 ? void 0 : _f.chainId) ? [`Chain ID: ${options.signInWithSolana.chainId}`] : [],
              ...((_g = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _g === void 0 ? void 0 : _g.nonce) ? [`Nonce: ${options.signInWithSolana.nonce}`] : [],
              ...((_h = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _h === void 0 ? void 0 : _h.requestId) ? [`Request ID: ${options.signInWithSolana.requestId}`] : [],
              ...((_k = (_j = options === null || options === void 0 ? void 0 : options.signInWithSolana) === null || _j === void 0 ? void 0 : _j.resources) === null || _k === void 0 ? void 0 : _k.length) ? [
                "Resources",
                ...options.signInWithSolana.resources.map((resource) => `- ${resource}`)
              ] : []
            ].join("\n");
            const maybeSignature = await resolvedWallet.signMessage(new TextEncoder().encode(message), "utf8");
            if (!maybeSignature || !(maybeSignature instanceof Uint8Array)) {
              throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");
            }
            signature = maybeSignature;
          }
        }
        try {
          const { data, error } = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/token?grant_type=web3`, {
            headers: this.headers,
            body: Object.assign({ chain: "solana", message, signature: (0, base64url_1.bytesToBase64URL)(signature) }, ((_l = credentials.options) === null || _l === void 0 ? void 0 : _l.captchaToken) ? { gotrue_meta_security: { captcha_token: (_m = credentials.options) === null || _m === void 0 ? void 0 : _m.captchaToken } } : null),
            xform: fetch_1._sessionResponse
          });
          if (error) {
            throw error;
          }
          if (!data || !data.session || !data.user) {
            const invalidTokenError = new errors_1.AuthInvalidTokenResponseError();
            return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return this._returnResult({ data: Object.assign({}, data), error });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      async _exchangeCodeForSession(authCode) {
        const storageItem = await (0, helpers_1.getItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
        const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : "").split("/");
        try {
          const { data, error } = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/token?grant_type=pkce`, {
            headers: this.headers,
            body: {
              auth_code: authCode,
              code_verifier: codeVerifier
            },
            xform: fetch_1._sessionResponse
          });
          await (0, helpers_1.removeItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
          if (error) {
            throw error;
          }
          if (!data || !data.session || !data.user) {
            const invalidTokenError = new errors_1.AuthInvalidTokenResponseError();
            return this._returnResult({
              data: { user: null, session: null, redirectType: null },
              error: invalidTokenError
            });
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return this._returnResult({ data: Object.assign(Object.assign({}, data), { redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null }), error });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({
              data: { user: null, session: null, redirectType: null },
              error
            });
          }
          throw error;
        }
      }
      /**
       * Allows signing in with an OIDC ID token. The authentication provider used
       * should be enabled and configured.
       */
      async signInWithIdToken(credentials) {
        try {
          const { options, provider, token, access_token, nonce } = credentials;
          const res = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
            headers: this.headers,
            body: {
              provider,
              id_token: token,
              access_token,
              nonce,
              gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
            },
            xform: fetch_1._sessionResponse
          });
          const { data, error } = res;
          if (error) {
            return this._returnResult({ data: { user: null, session: null }, error });
          } else if (!data || !data.session || !data.user) {
            const invalidTokenError = new errors_1.AuthInvalidTokenResponseError();
            return this._returnResult({ data: { user: null, session: null }, error: invalidTokenError });
          }
          if (data.session) {
            await this._saveSession(data.session);
            await this._notifyAllSubscribers("SIGNED_IN", data.session);
          }
          return this._returnResult({ data, error });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      /**
       * Log in a user using magiclink or a one-time password (OTP).
       *
       * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
       * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
       * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
       *
       * Be aware that you may get back an error message that will not distinguish
       * between the cases where the account does not exist or, that the account
       * can only be accessed via social login.
       *
       * Do note that you will need to configure a Whatsapp sender on Twilio
       * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
       * channel is not supported on other providers
       * at this time.
       * This method supports PKCE when an email is passed.
       */
      async signInWithOtp(credentials) {
        var _a, _b, _c, _d, _e;
        try {
          if ("email" in credentials) {
            const { email, options } = credentials;
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === "pkce") {
              ;
              [codeChallenge, codeChallengeMethod] = await (0, helpers_1.getCodeChallengeAndMethod)(this.storage, this.storageKey);
            }
            const { error } = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/otp`, {
              headers: this.headers,
              body: {
                email,
                data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
                create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                code_challenge: codeChallenge,
                code_challenge_method: codeChallengeMethod
              },
              redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
            });
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          if ("phone" in credentials) {
            const { phone, options } = credentials;
            const { data, error } = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/otp`, {
              headers: this.headers,
              body: {
                phone,
                data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
                create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken },
                channel: (_e = options === null || options === void 0 ? void 0 : options.channel) !== null && _e !== void 0 ? _e : "sms"
              }
            });
            return this._returnResult({
              data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id },
              error
            });
          }
          throw new errors_1.AuthInvalidCredentialsError("You must provide either an email or phone number.");
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      /**
       * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
       */
      async verifyOtp(params) {
        var _a, _b;
        try {
          let redirectTo = void 0;
          let captchaToken = void 0;
          if ("options" in params) {
            redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
            captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
          }
          const { data, error } = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/verify`, {
            headers: this.headers,
            body: Object.assign(Object.assign({}, params), { gotrue_meta_security: { captcha_token: captchaToken } }),
            redirectTo,
            xform: fetch_1._sessionResponse
          });
          if (error) {
            throw error;
          }
          if (!data) {
            const tokenVerificationError = new Error("An error occurred on token verification.");
            throw tokenVerificationError;
          }
          const session = data.session;
          const user = data.user;
          if (session === null || session === void 0 ? void 0 : session.access_token) {
            await this._saveSession(session);
            await this._notifyAllSubscribers(params.type == "recovery" ? "PASSWORD_RECOVERY" : "SIGNED_IN", session);
          }
          return this._returnResult({ data: { user, session }, error: null });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      /**
       * Attempts a single-sign on using an enterprise Identity Provider. A
       * successful SSO attempt will redirect the current page to the identity
       * provider authorization page. The redirect URL is implementation and SSO
       * protocol specific.
       *
       * You can use it by providing a SSO domain. Typically you can extract this
       * domain by asking users for their email address. If this domain is
       * registered on the Auth instance the redirect will use that organization's
       * currently active SSO Identity Provider for the login.
       *
       * If you have built an organization-specific login page, you can use the
       * organization's SSO Identity Provider UUID directly instead.
       */
      async signInWithSSO(params) {
        var _a, _b, _c, _d, _e;
        try {
          let codeChallenge = null;
          let codeChallengeMethod = null;
          if (this.flowType === "pkce") {
            ;
            [codeChallenge, codeChallengeMethod] = await (0, helpers_1.getCodeChallengeAndMethod)(this.storage, this.storageKey);
          }
          const result = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/sso`, {
            body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, "providerId" in params ? { provider_id: params.providerId } : null), "domain" in params ? { domain: params.domain } : null), { redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : void 0 }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? { gotrue_meta_security: { captcha_token: params.options.captchaToken } } : null), { skip_http_redirect: true, code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
            headers: this.headers,
            xform: fetch_1._ssoResponse
          });
          if (((_d = result.data) === null || _d === void 0 ? void 0 : _d.url) && (0, helpers_1.isBrowser)() && !((_e = params.options) === null || _e === void 0 ? void 0 : _e.skipBrowserRedirect)) {
            window.location.assign(result.data.url);
          }
          return this._returnResult(result);
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      /**
       * Sends a reauthentication OTP to the user's email or phone number.
       * Requires the user to be signed-in.
       */
      async reauthenticate() {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._reauthenticate();
        });
      }
      async _reauthenticate() {
        try {
          return await this._useSession(async (result) => {
            const { data: { session }, error: sessionError } = result;
            if (sessionError)
              throw sessionError;
            if (!session)
              throw new errors_1.AuthSessionMissingError();
            const { error } = await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/reauthenticate`, {
              headers: this.headers,
              jwt: session.access_token
            });
            return this._returnResult({ data: { user: null, session: null }, error });
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      /**
       * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
       */
      async resend(credentials) {
        try {
          const endpoint = `${this.url}/resend`;
          if ("email" in credentials) {
            const { email, type, options } = credentials;
            const { error } = await (0, fetch_1._request)(this.fetch, "POST", endpoint, {
              headers: this.headers,
              body: {
                email,
                type,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              },
              redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
            });
            return this._returnResult({ data: { user: null, session: null }, error });
          } else if ("phone" in credentials) {
            const { phone, type, options } = credentials;
            const { data, error } = await (0, fetch_1._request)(this.fetch, "POST", endpoint, {
              headers: this.headers,
              body: {
                phone,
                type,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              }
            });
            return this._returnResult({
              data: { user: null, session: null, messageId: data === null || data === void 0 ? void 0 : data.message_id },
              error
            });
          }
          throw new errors_1.AuthInvalidCredentialsError("You must provide either an email or phone number and a type");
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      /**
       * Returns the session, refreshing it if necessary.
       *
       * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
       *
       * **IMPORTANT:** This method loads values directly from the storage attached
       * to the client. If that storage is based on request cookies for example,
       * the values in it may not be authentic and therefore it's strongly advised
       * against using this method and its results in such circumstances. A warning
       * will be emitted if this is detected. Use {@link #getUser()} instead.
       */
      async getSession() {
        await this.initializePromise;
        const result = await this._acquireLock(-1, async () => {
          return this._useSession(async (result2) => {
            return result2;
          });
        });
        return result;
      }
      /**
       * Acquires a global lock based on the storage key.
       */
      async _acquireLock(acquireTimeout, fn) {
        this._debug("#_acquireLock", "begin", acquireTimeout);
        try {
          if (this.lockAcquired) {
            const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
            const result = (async () => {
              await last;
              return await fn();
            })();
            this.pendingInLock.push((async () => {
              try {
                await result;
              } catch (e) {
              }
            })());
            return result;
          }
          return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
            this._debug("#_acquireLock", "lock acquired for storage key", this.storageKey);
            try {
              this.lockAcquired = true;
              const result = fn();
              this.pendingInLock.push((async () => {
                try {
                  await result;
                } catch (e) {
                }
              })());
              await result;
              while (this.pendingInLock.length) {
                const waitOn = [...this.pendingInLock];
                await Promise.all(waitOn);
                this.pendingInLock.splice(0, waitOn.length);
              }
              return await result;
            } finally {
              this._debug("#_acquireLock", "lock released for storage key", this.storageKey);
              this.lockAcquired = false;
            }
          });
        } finally {
          this._debug("#_acquireLock", "end");
        }
      }
      /**
       * Use instead of {@link #getSession} inside the library. It is
       * semantically usually what you want, as getting a session involves some
       * processing afterwards that requires only one client operating on the
       * session at once across multiple tabs or processes.
       */
      async _useSession(fn) {
        this._debug("#_useSession", "begin");
        try {
          const result = await this.__loadSession();
          return await fn(result);
        } finally {
          this._debug("#_useSession", "end");
        }
      }
      /**
       * NEVER USE DIRECTLY!
       *
       * Always use {@link #_useSession}.
       */
      async __loadSession() {
        this._debug("#__loadSession()", "begin");
        if (!this.lockAcquired) {
          this._debug("#__loadSession()", "used outside of an acquired lock!", new Error().stack);
        }
        try {
          let currentSession = null;
          const maybeSession = await (0, helpers_1.getItemAsync)(this.storage, this.storageKey);
          this._debug("#getSession()", "session from storage", maybeSession);
          if (maybeSession !== null) {
            if (this._isValidSession(maybeSession)) {
              currentSession = maybeSession;
            } else {
              this._debug("#getSession()", "session from storage is not valid");
              await this._removeSession();
            }
          }
          if (!currentSession) {
            return { data: { session: null }, error: null };
          }
          const hasExpired = currentSession.expires_at ? currentSession.expires_at * 1e3 - Date.now() < constants_1.EXPIRY_MARGIN_MS : false;
          this._debug("#__loadSession()", `session has${hasExpired ? "" : " not"} expired`, "expires_at", currentSession.expires_at);
          if (!hasExpired) {
            if (this.userStorage) {
              const maybeUser = await (0, helpers_1.getItemAsync)(this.userStorage, this.storageKey + "-user");
              if (maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) {
                currentSession.user = maybeUser.user;
              } else {
                currentSession.user = (0, helpers_1.userNotAvailableProxy)();
              }
            }
            if (this.storage.isServer && currentSession.user && !currentSession.user.__isUserNotAvailableProxy) {
              const suppressWarningRef = { value: this.suppressGetSessionWarning };
              currentSession.user = (0, helpers_1.insecureUserWarningProxy)(currentSession.user, suppressWarningRef);
              if (suppressWarningRef.value) {
                this.suppressGetSessionWarning = true;
              }
            }
            return { data: { session: currentSession }, error: null };
          }
          const { data: session, error } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            return this._returnResult({ data: { session: null }, error });
          }
          return this._returnResult({ data: { session }, error: null });
        } finally {
          this._debug("#__loadSession()", "end");
        }
      }
      /**
       * Gets the current user details if there is an existing session. This method
       * performs a network request to the Supabase Auth server, so the returned
       * value is authentic and can be used to base authorization rules on.
       *
       * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
       */
      async getUser(jwt) {
        if (jwt) {
          return await this._getUser(jwt);
        }
        await this.initializePromise;
        const result = await this._acquireLock(-1, async () => {
          return await this._getUser();
        });
        return result;
      }
      async _getUser(jwt) {
        try {
          if (jwt) {
            return await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/user`, {
              headers: this.headers,
              jwt,
              xform: fetch_1._userResponse
            });
          }
          return await this._useSession(async (result) => {
            var _a, _b, _c;
            const { data, error } = result;
            if (error) {
              throw error;
            }
            if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
              return { data: { user: null }, error: new errors_1.AuthSessionMissingError() };
            }
            return await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/user`, {
              headers: this.headers,
              jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : void 0,
              xform: fetch_1._userResponse
            });
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            if ((0, errors_1.isAuthSessionMissingError)(error)) {
              await this._removeSession();
              await (0, helpers_1.removeItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
            }
            return this._returnResult({ data: { user: null }, error });
          }
          throw error;
        }
      }
      /**
       * Updates user data for a logged in user.
       */
      async updateUser(attributes, options = {}) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._updateUser(attributes, options);
        });
      }
      async _updateUser(attributes, options = {}) {
        try {
          return await this._useSession(async (result) => {
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              throw sessionError;
            }
            if (!sessionData.session) {
              throw new errors_1.AuthSessionMissingError();
            }
            const session = sessionData.session;
            let codeChallenge = null;
            let codeChallengeMethod = null;
            if (this.flowType === "pkce" && attributes.email != null) {
              ;
              [codeChallenge, codeChallengeMethod] = await (0, helpers_1.getCodeChallengeAndMethod)(this.storage, this.storageKey);
            }
            const { data, error: userError } = await (0, fetch_1._request)(this.fetch, "PUT", `${this.url}/user`, {
              headers: this.headers,
              redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
              body: Object.assign(Object.assign({}, attributes), { code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod }),
              jwt: session.access_token,
              xform: fetch_1._userResponse
            });
            if (userError) {
              throw userError;
            }
            session.user = data.user;
            await this._saveSession(session);
            await this._notifyAllSubscribers("USER_UPDATED", session);
            return this._returnResult({ data: { user: session.user }, error: null });
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null }, error });
          }
          throw error;
        }
      }
      /**
       * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
       * If the refresh token or access token in the current session is invalid, an error will be thrown.
       * @param currentSession The current session that minimally contains an access token and refresh token.
       */
      async setSession(currentSession) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._setSession(currentSession);
        });
      }
      async _setSession(currentSession) {
        try {
          if (!currentSession.access_token || !currentSession.refresh_token) {
            throw new errors_1.AuthSessionMissingError();
          }
          const timeNow = Date.now() / 1e3;
          let expiresAt = timeNow;
          let hasExpired = true;
          let session = null;
          const { payload } = (0, helpers_1.decodeJWT)(currentSession.access_token);
          if (payload.exp) {
            expiresAt = payload.exp;
            hasExpired = expiresAt <= timeNow;
          }
          if (hasExpired) {
            const { data: refreshedSession, error } = await this._callRefreshToken(currentSession.refresh_token);
            if (error) {
              return this._returnResult({ data: { user: null, session: null }, error });
            }
            if (!refreshedSession) {
              return { data: { user: null, session: null }, error: null };
            }
            session = refreshedSession;
          } else {
            const { data, error } = await this._getUser(currentSession.access_token);
            if (error) {
              throw error;
            }
            session = {
              access_token: currentSession.access_token,
              refresh_token: currentSession.refresh_token,
              user: data.user,
              token_type: "bearer",
              expires_in: expiresAt - timeNow,
              expires_at: expiresAt
            };
            await this._saveSession(session);
            await this._notifyAllSubscribers("SIGNED_IN", session);
          }
          return this._returnResult({ data: { user: session.user, session }, error: null });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { session: null, user: null }, error });
          }
          throw error;
        }
      }
      /**
       * Returns a new session, regardless of expiry status.
       * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
       * If the current session's refresh token is invalid, an error will be thrown.
       * @param currentSession The current session. If passed in, it must contain a refresh token.
       */
      async refreshSession(currentSession) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._refreshSession(currentSession);
        });
      }
      async _refreshSession(currentSession) {
        try {
          return await this._useSession(async (result) => {
            var _a;
            if (!currentSession) {
              const { data, error: error2 } = result;
              if (error2) {
                throw error2;
              }
              currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : void 0;
            }
            if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
              throw new errors_1.AuthSessionMissingError();
            }
            const { data: session, error } = await this._callRefreshToken(currentSession.refresh_token);
            if (error) {
              return this._returnResult({ data: { user: null, session: null }, error });
            }
            if (!session) {
              return this._returnResult({ data: { user: null, session: null }, error: null });
            }
            return this._returnResult({ data: { user: session.user, session }, error: null });
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { user: null, session: null }, error });
          }
          throw error;
        }
      }
      /**
       * Gets the session data from a URL string
       */
      async _getSessionFromURL(params, callbackUrlType) {
        try {
          if (!(0, helpers_1.isBrowser)())
            throw new errors_1.AuthImplicitGrantRedirectError("No browser detected.");
          if (params.error || params.error_description || params.error_code) {
            throw new errors_1.AuthImplicitGrantRedirectError(params.error_description || "Error in URL with unspecified error_description", {
              error: params.error || "unspecified_error",
              code: params.error_code || "unspecified_code"
            });
          }
          switch (callbackUrlType) {
            case "implicit":
              if (this.flowType === "pkce") {
                throw new errors_1.AuthPKCEGrantCodeExchangeError("Not a valid PKCE flow url.");
              }
              break;
            case "pkce":
              if (this.flowType === "implicit") {
                throw new errors_1.AuthImplicitGrantRedirectError("Not a valid implicit grant flow url.");
              }
              break;
            default:
          }
          if (callbackUrlType === "pkce") {
            this._debug("#_initialize()", "begin", "is PKCE flow", true);
            if (!params.code)
              throw new errors_1.AuthPKCEGrantCodeExchangeError("No code detected.");
            const { data: data2, error: error2 } = await this._exchangeCodeForSession(params.code);
            if (error2)
              throw error2;
            const url = new URL(window.location.href);
            url.searchParams.delete("code");
            window.history.replaceState(window.history.state, "", url.toString());
            return { data: { session: data2.session, redirectType: null }, error: null };
          }
          const { provider_token, provider_refresh_token, access_token, refresh_token, expires_in, expires_at, token_type } = params;
          if (!access_token || !expires_in || !refresh_token || !token_type) {
            throw new errors_1.AuthImplicitGrantRedirectError("No session defined in URL");
          }
          const timeNow = Math.round(Date.now() / 1e3);
          const expiresIn = parseInt(expires_in);
          let expiresAt = timeNow + expiresIn;
          if (expires_at) {
            expiresAt = parseInt(expires_at);
          }
          const actuallyExpiresIn = expiresAt - timeNow;
          if (actuallyExpiresIn * 1e3 <= constants_1.AUTO_REFRESH_TICK_DURATION_MS) {
            console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
          }
          const issuedAt = expiresAt - expiresIn;
          if (timeNow - issuedAt >= 120) {
            console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale", issuedAt, expiresAt, timeNow);
          } else if (timeNow - issuedAt < 0) {
            console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew", issuedAt, expiresAt, timeNow);
          }
          const { data, error } = await this._getUser(access_token);
          if (error)
            throw error;
          const session = {
            provider_token,
            provider_refresh_token,
            access_token,
            expires_in: expiresIn,
            expires_at: expiresAt,
            refresh_token,
            token_type,
            user: data.user
          };
          window.location.hash = "";
          this._debug("#_getSessionFromURL()", "clearing window.location.hash");
          return this._returnResult({ data: { session, redirectType: params.type }, error: null });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { session: null, redirectType: null }, error });
          }
          throw error;
        }
      }
      /**
       * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
       */
      _isImplicitGrantCallback(params) {
        return Boolean(params.access_token || params.error_description);
      }
      /**
       * Checks if the current URL and backing storage contain parameters given by a PKCE flow
       */
      async _isPKCECallback(params) {
        const currentStorageContent = await (0, helpers_1.getItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
        return !!(params.code && currentStorageContent);
      }
      /**
       * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
       *
       * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
       * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
       *
       * If using `others` scope, no `SIGNED_OUT` event is fired!
       */
      async signOut(options = { scope: "global" }) {
        await this.initializePromise;
        return await this._acquireLock(-1, async () => {
          return await this._signOut(options);
        });
      }
      async _signOut({ scope } = { scope: "global" }) {
        return await this._useSession(async (result) => {
          var _a;
          const { data, error: sessionError } = result;
          if (sessionError) {
            return this._returnResult({ error: sessionError });
          }
          const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
          if (accessToken) {
            const { error } = await this.admin.signOut(accessToken, scope);
            if (error) {
              if (!((0, errors_1.isAuthApiError)(error) && (error.status === 404 || error.status === 401 || error.status === 403))) {
                return this._returnResult({ error });
              }
            }
          }
          if (scope !== "others") {
            await this._removeSession();
            await (0, helpers_1.removeItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
          }
          return this._returnResult({ error: null });
        });
      }
      onAuthStateChange(callback) {
        const id = (0, helpers_1.generateCallbackId)();
        const subscription = {
          id,
          callback,
          unsubscribe: () => {
            this._debug("#unsubscribe()", "state change callback with id removed", id);
            this.stateChangeEmitters.delete(id);
          }
        };
        this._debug("#onAuthStateChange()", "registered callback with id", id);
        this.stateChangeEmitters.set(id, subscription);
        (async () => {
          await this.initializePromise;
          await this._acquireLock(-1, async () => {
            this._emitInitialSession(id);
          });
        })();
        return { data: { subscription } };
      }
      async _emitInitialSession(id) {
        return await this._useSession(async (result) => {
          var _a, _b;
          try {
            const { data: { session }, error } = result;
            if (error)
              throw error;
            await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback("INITIAL_SESSION", session));
            this._debug("INITIAL_SESSION", "callback id", id, "session", session);
          } catch (err) {
            await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback("INITIAL_SESSION", null));
            this._debug("INITIAL_SESSION", "callback id", id, "error", err);
            console.error(err);
          }
        });
      }
      /**
       * Sends a password reset request to an email address. This method supports the PKCE flow.
       *
       * @param email The email address of the user.
       * @param options.redirectTo The URL to send the user to after they click the password reset link.
       * @param options.captchaToken Verification token received when the user completes the captcha on the site.
       */
      async resetPasswordForEmail(email, options = {}) {
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === "pkce") {
          ;
          [codeChallenge, codeChallengeMethod] = await (0, helpers_1.getCodeChallengeAndMethod)(
            this.storage,
            this.storageKey,
            true
            // isPasswordRecovery
          );
        }
        try {
          return await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/recover`, {
            body: {
              email,
              code_challenge: codeChallenge,
              code_challenge_method: codeChallengeMethod,
              gotrue_meta_security: { captcha_token: options.captchaToken }
            },
            headers: this.headers,
            redirectTo: options.redirectTo
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      /**
       * Gets all the identities linked to a user.
       */
      async getUserIdentities() {
        var _a;
        try {
          const { data, error } = await this.getUser();
          if (error)
            throw error;
          return this._returnResult({ data: { identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : [] }, error: null });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      async linkIdentity(credentials) {
        if ("token" in credentials) {
          return this.linkIdentityIdToken(credentials);
        }
        return this.linkIdentityOAuth(credentials);
      }
      async linkIdentityOAuth(credentials) {
        var _a;
        try {
          const { data, error } = await this._useSession(async (result) => {
            var _a2, _b, _c, _d, _e;
            const { data: data2, error: error2 } = result;
            if (error2)
              throw error2;
            const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
              redirectTo: (_a2 = credentials.options) === null || _a2 === void 0 ? void 0 : _a2.redirectTo,
              scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
              queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
              skipBrowserRedirect: true
            });
            return await (0, fetch_1._request)(this.fetch, "GET", url, {
              headers: this.headers,
              jwt: (_e = (_d = data2.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : void 0
            });
          });
          if (error)
            throw error;
          if ((0, helpers_1.isBrowser)() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
            window.location.assign(data === null || data === void 0 ? void 0 : data.url);
          }
          return this._returnResult({
            data: { provider: credentials.provider, url: data === null || data === void 0 ? void 0 : data.url },
            error: null
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { provider: credentials.provider, url: null }, error });
          }
          throw error;
        }
      }
      async linkIdentityIdToken(credentials) {
        return await this._useSession(async (result) => {
          var _a;
          try {
            const { error: sessionError, data: { session } } = result;
            if (sessionError)
              throw sessionError;
            const { options, provider, token, access_token, nonce } = credentials;
            const res = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/token?grant_type=id_token`, {
              headers: this.headers,
              jwt: (_a = session === null || session === void 0 ? void 0 : session.access_token) !== null && _a !== void 0 ? _a : void 0,
              body: {
                provider,
                id_token: token,
                access_token,
                nonce,
                link_identity: true,
                gotrue_meta_security: { captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken }
              },
              xform: fetch_1._sessionResponse
            });
            const { data, error } = res;
            if (error) {
              return this._returnResult({ data: { user: null, session: null }, error });
            } else if (!data || !data.session || !data.user) {
              return this._returnResult({
                data: { user: null, session: null },
                error: new errors_1.AuthInvalidTokenResponseError()
              });
            }
            if (data.session) {
              await this._saveSession(data.session);
              await this._notifyAllSubscribers("USER_UPDATED", data.session);
            }
            return this._returnResult({ data, error });
          } catch (error) {
            if ((0, errors_1.isAuthError)(error)) {
              return this._returnResult({ data: { user: null, session: null }, error });
            }
            throw error;
          }
        });
      }
      /**
       * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
       */
      async unlinkIdentity(identity) {
        try {
          return await this._useSession(async (result) => {
            var _a, _b;
            const { data, error } = result;
            if (error) {
              throw error;
            }
            return await (0, fetch_1._request)(this.fetch, "DELETE", `${this.url}/user/identities/${identity.identity_id}`, {
              headers: this.headers,
              jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0
            });
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      /**
       * Generates a new JWT.
       * @param refreshToken A valid refresh token that was returned on login.
       */
      async _refreshAccessToken(refreshToken) {
        const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
        this._debug(debugName, "begin");
        try {
          const startedAt = Date.now();
          return await (0, helpers_1.retryable)(async (attempt) => {
            if (attempt > 0) {
              await (0, helpers_1.sleep)(200 * Math.pow(2, attempt - 1));
            }
            this._debug(debugName, "refreshing attempt", attempt);
            return await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/token?grant_type=refresh_token`, {
              body: { refresh_token: refreshToken },
              headers: this.headers,
              xform: fetch_1._sessionResponse
            });
          }, (attempt, error) => {
            const nextBackOffInterval = 200 * Math.pow(2, attempt);
            return error && (0, errors_1.isAuthRetryableFetchError)(error) && // retryable only if the request can be sent before the backoff overflows the tick duration
            Date.now() + nextBackOffInterval - startedAt < constants_1.AUTO_REFRESH_TICK_DURATION_MS;
          });
        } catch (error) {
          this._debug(debugName, "error", error);
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: { session: null, user: null }, error });
          }
          throw error;
        } finally {
          this._debug(debugName, "end");
        }
      }
      _isValidSession(maybeSession) {
        const isValidSession = typeof maybeSession === "object" && maybeSession !== null && "access_token" in maybeSession && "refresh_token" in maybeSession && "expires_at" in maybeSession;
        return isValidSession;
      }
      async _handleProviderSignIn(provider, options) {
        const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
          redirectTo: options.redirectTo,
          scopes: options.scopes,
          queryParams: options.queryParams
        });
        this._debug("#_handleProviderSignIn()", "provider", provider, "options", options, "url", url);
        if ((0, helpers_1.isBrowser)() && !options.skipBrowserRedirect) {
          window.location.assign(url);
        }
        return { data: { provider, url }, error: null };
      }
      /**
       * Recovers the session from LocalStorage and refreshes the token
       * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
       */
      async _recoverAndRefresh() {
        var _a, _b;
        const debugName = "#_recoverAndRefresh()";
        this._debug(debugName, "begin");
        try {
          const currentSession = await (0, helpers_1.getItemAsync)(this.storage, this.storageKey);
          if (currentSession && this.userStorage) {
            let maybeUser = await (0, helpers_1.getItemAsync)(this.userStorage, this.storageKey + "-user");
            if (!this.storage.isServer && Object.is(this.storage, this.userStorage) && !maybeUser) {
              maybeUser = { user: currentSession.user };
              await (0, helpers_1.setItemAsync)(this.userStorage, this.storageKey + "-user", maybeUser);
            }
            currentSession.user = (_a = maybeUser === null || maybeUser === void 0 ? void 0 : maybeUser.user) !== null && _a !== void 0 ? _a : (0, helpers_1.userNotAvailableProxy)();
          } else if (currentSession && !currentSession.user) {
            if (!currentSession.user) {
              const separateUser = await (0, helpers_1.getItemAsync)(this.storage, this.storageKey + "-user");
              if (separateUser && (separateUser === null || separateUser === void 0 ? void 0 : separateUser.user)) {
                currentSession.user = separateUser.user;
                await (0, helpers_1.removeItemAsync)(this.storage, this.storageKey + "-user");
                await (0, helpers_1.setItemAsync)(this.storage, this.storageKey, currentSession);
              } else {
                currentSession.user = (0, helpers_1.userNotAvailableProxy)();
              }
            }
          }
          this._debug(debugName, "session from storage", currentSession);
          if (!this._isValidSession(currentSession)) {
            this._debug(debugName, "session is not valid");
            if (currentSession !== null) {
              await this._removeSession();
            }
            return;
          }
          const expiresWithMargin = ((_b = currentSession.expires_at) !== null && _b !== void 0 ? _b : Infinity) * 1e3 - Date.now() < constants_1.EXPIRY_MARGIN_MS;
          this._debug(debugName, `session has${expiresWithMargin ? "" : " not"} expired with margin of ${constants_1.EXPIRY_MARGIN_MS}s`);
          if (expiresWithMargin) {
            if (this.autoRefreshToken && currentSession.refresh_token) {
              const { error } = await this._callRefreshToken(currentSession.refresh_token);
              if (error) {
                console.error(error);
                if (!(0, errors_1.isAuthRetryableFetchError)(error)) {
                  this._debug(debugName, "refresh failed with a non-retryable error, removing the session", error);
                  await this._removeSession();
                }
              }
            }
          } else if (currentSession.user && currentSession.user.__isUserNotAvailableProxy === true) {
            try {
              const { data, error: userError } = await this._getUser(currentSession.access_token);
              if (!userError && (data === null || data === void 0 ? void 0 : data.user)) {
                currentSession.user = data.user;
                await this._saveSession(currentSession);
                await this._notifyAllSubscribers("SIGNED_IN", currentSession);
              } else {
                this._debug(debugName, "could not get user data, skipping SIGNED_IN notification");
              }
            } catch (getUserError) {
              console.error("Error getting user data:", getUserError);
              this._debug(debugName, "error getting user data, skipping SIGNED_IN notification", getUserError);
            }
          } else {
            await this._notifyAllSubscribers("SIGNED_IN", currentSession);
          }
        } catch (err) {
          this._debug(debugName, "error", err);
          console.error(err);
          return;
        } finally {
          this._debug(debugName, "end");
        }
      }
      async _callRefreshToken(refreshToken) {
        var _a, _b;
        if (!refreshToken) {
          throw new errors_1.AuthSessionMissingError();
        }
        if (this.refreshingDeferred) {
          return this.refreshingDeferred.promise;
        }
        const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
        this._debug(debugName, "begin");
        try {
          this.refreshingDeferred = new helpers_1.Deferred();
          const { data, error } = await this._refreshAccessToken(refreshToken);
          if (error)
            throw error;
          if (!data.session)
            throw new errors_1.AuthSessionMissingError();
          await this._saveSession(data.session);
          await this._notifyAllSubscribers("TOKEN_REFRESHED", data.session);
          const result = { data: data.session, error: null };
          this.refreshingDeferred.resolve(result);
          return result;
        } catch (error) {
          this._debug(debugName, "error", error);
          if ((0, errors_1.isAuthError)(error)) {
            const result = { data: null, error };
            if (!(0, errors_1.isAuthRetryableFetchError)(error)) {
              await this._removeSession();
            }
            (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
            return result;
          }
          (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
          throw error;
        } finally {
          this.refreshingDeferred = null;
          this._debug(debugName, "end");
        }
      }
      async _notifyAllSubscribers(event, session, broadcast = true) {
        const debugName = `#_notifyAllSubscribers(${event})`;
        this._debug(debugName, "begin", session, `broadcast = ${broadcast}`);
        try {
          if (this.broadcastChannel && broadcast) {
            this.broadcastChannel.postMessage({ event, session });
          }
          const errors = [];
          const promises = Array.from(this.stateChangeEmitters.values()).map(async (x) => {
            try {
              await x.callback(event, session);
            } catch (e) {
              errors.push(e);
            }
          });
          await Promise.all(promises);
          if (errors.length > 0) {
            for (let i = 0; i < errors.length; i += 1) {
              console.error(errors[i]);
            }
            throw errors[0];
          }
        } finally {
          this._debug(debugName, "end");
        }
      }
      /**
       * set currentSession and currentUser
       * process to _startAutoRefreshToken if possible
       */
      async _saveSession(session) {
        this._debug("#_saveSession()", session);
        this.suppressGetSessionWarning = true;
        const sessionToProcess = Object.assign({}, session);
        const userIsProxy = sessionToProcess.user && sessionToProcess.user.__isUserNotAvailableProxy === true;
        if (this.userStorage) {
          if (!userIsProxy && sessionToProcess.user) {
            await (0, helpers_1.setItemAsync)(this.userStorage, this.storageKey + "-user", {
              user: sessionToProcess.user
            });
          } else if (userIsProxy) {
          }
          const mainSessionData = Object.assign({}, sessionToProcess);
          delete mainSessionData.user;
          const clonedMainSessionData = (0, helpers_1.deepClone)(mainSessionData);
          await (0, helpers_1.setItemAsync)(this.storage, this.storageKey, clonedMainSessionData);
        } else {
          const clonedSession = (0, helpers_1.deepClone)(sessionToProcess);
          await (0, helpers_1.setItemAsync)(this.storage, this.storageKey, clonedSession);
        }
      }
      async _removeSession() {
        this._debug("#_removeSession()");
        await (0, helpers_1.removeItemAsync)(this.storage, this.storageKey);
        await (0, helpers_1.removeItemAsync)(this.storage, this.storageKey + "-code-verifier");
        await (0, helpers_1.removeItemAsync)(this.storage, this.storageKey + "-user");
        if (this.userStorage) {
          await (0, helpers_1.removeItemAsync)(this.userStorage, this.storageKey + "-user");
        }
        await this._notifyAllSubscribers("SIGNED_OUT", null);
      }
      /**
       * Removes any registered visibilitychange callback.
       *
       * {@see #startAutoRefresh}
       * {@see #stopAutoRefresh}
       */
      _removeVisibilityChangedCallback() {
        this._debug("#_removeVisibilityChangedCallback()");
        const callback = this.visibilityChangedCallback;
        this.visibilityChangedCallback = null;
        try {
          if (callback && (0, helpers_1.isBrowser)() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
            window.removeEventListener("visibilitychange", callback);
          }
        } catch (e) {
          console.error("removing visibilitychange callback failed", e);
        }
      }
      /**
       * This is the private implementation of {@link #startAutoRefresh}. Use this
       * within the library.
       */
      async _startAutoRefresh() {
        await this._stopAutoRefresh();
        this._debug("#_startAutoRefresh()");
        const ticker = setInterval(() => this._autoRefreshTokenTick(), constants_1.AUTO_REFRESH_TICK_DURATION_MS);
        this.autoRefreshTicker = ticker;
        if (ticker && typeof ticker === "object" && typeof ticker.unref === "function") {
          ticker.unref();
        } else if (typeof Deno !== "undefined" && typeof Deno.unrefTimer === "function") {
          Deno.unrefTimer(ticker);
        }
        setTimeout(async () => {
          await this.initializePromise;
          await this._autoRefreshTokenTick();
        }, 0);
      }
      /**
       * This is the private implementation of {@link #stopAutoRefresh}. Use this
       * within the library.
       */
      async _stopAutoRefresh() {
        this._debug("#_stopAutoRefresh()");
        const ticker = this.autoRefreshTicker;
        this.autoRefreshTicker = null;
        if (ticker) {
          clearInterval(ticker);
        }
      }
      /**
       * Starts an auto-refresh process in the background. The session is checked
       * every few seconds. Close to the time of expiration a process is started to
       * refresh the session. If refreshing fails it will be retried for as long as
       * necessary.
       *
       * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
       * to call this function, it will be called for you.
       *
       * On browsers the refresh process works only when the tab/window is in the
       * foreground to conserve resources as well as prevent race conditions and
       * flooding auth with requests. If you call this method any managed
       * visibility change callback will be removed and you must manage visibility
       * changes on your own.
       *
       * On non-browser platforms the refresh process works *continuously* in the
       * background, which may not be desirable. You should hook into your
       * platform's foreground indication mechanism and call these methods
       * appropriately to conserve resources.
       *
       * {@see #stopAutoRefresh}
       */
      async startAutoRefresh() {
        this._removeVisibilityChangedCallback();
        await this._startAutoRefresh();
      }
      /**
       * Stops an active auto refresh process running in the background (if any).
       *
       * If you call this method any managed visibility change callback will be
       * removed and you must manage visibility changes on your own.
       *
       * See {@link #startAutoRefresh} for more details.
       */
      async stopAutoRefresh() {
        this._removeVisibilityChangedCallback();
        await this._stopAutoRefresh();
      }
      /**
       * Runs the auto refresh token tick.
       */
      async _autoRefreshTokenTick() {
        this._debug("#_autoRefreshTokenTick()", "begin");
        try {
          await this._acquireLock(0, async () => {
            try {
              const now = Date.now();
              try {
                return await this._useSession(async (result) => {
                  const { data: { session } } = result;
                  if (!session || !session.refresh_token || !session.expires_at) {
                    this._debug("#_autoRefreshTokenTick()", "no session");
                    return;
                  }
                  const expiresInTicks = Math.floor((session.expires_at * 1e3 - now) / constants_1.AUTO_REFRESH_TICK_DURATION_MS);
                  this._debug("#_autoRefreshTokenTick()", `access token expires in ${expiresInTicks} ticks, a tick lasts ${constants_1.AUTO_REFRESH_TICK_DURATION_MS}ms, refresh threshold is ${constants_1.AUTO_REFRESH_TICK_THRESHOLD} ticks`);
                  if (expiresInTicks <= constants_1.AUTO_REFRESH_TICK_THRESHOLD) {
                    await this._callRefreshToken(session.refresh_token);
                  }
                });
              } catch (e) {
                console.error("Auto refresh tick failed with error. This is likely a transient error.", e);
              }
            } finally {
              this._debug("#_autoRefreshTokenTick()", "end");
            }
          });
        } catch (e) {
          if (e.isAcquireTimeout || e instanceof locks_1.LockAcquireTimeoutError) {
            this._debug("auto refresh token tick lock not available");
          } else {
            throw e;
          }
        }
      }
      /**
       * Registers callbacks on the browser / platform, which in-turn run
       * algorithms when the browser window/tab are in foreground. On non-browser
       * platforms it assumes always foreground.
       */
      async _handleVisibilityChange() {
        this._debug("#_handleVisibilityChange()");
        if (!(0, helpers_1.isBrowser)() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
          if (this.autoRefreshToken) {
            this.startAutoRefresh();
          }
          return false;
        }
        try {
          this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
          window === null || window === void 0 ? void 0 : window.addEventListener("visibilitychange", this.visibilityChangedCallback);
          await this._onVisibilityChanged(true);
        } catch (error) {
          console.error("_handleVisibilityChange", error);
        }
      }
      /**
       * Callback registered with `window.addEventListener('visibilitychange')`.
       */
      async _onVisibilityChanged(calledFromInitialize) {
        const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
        this._debug(methodName, "visibilityState", document.visibilityState);
        if (document.visibilityState === "visible") {
          if (this.autoRefreshToken) {
            this._startAutoRefresh();
          }
          if (!calledFromInitialize) {
            await this.initializePromise;
            await this._acquireLock(-1, async () => {
              if (document.visibilityState !== "visible") {
                this._debug(methodName, "acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting");
                return;
              }
              await this._recoverAndRefresh();
            });
          }
        } else if (document.visibilityState === "hidden") {
          if (this.autoRefreshToken) {
            this._stopAutoRefresh();
          }
        }
      }
      /**
       * Generates the relevant login URL for a third-party provider.
       * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
       * @param options.scopes A space-separated list of scopes granted to the OAuth application.
       * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
       */
      async _getUrlForProvider(url, provider, options) {
        const urlParams = [`provider=${encodeURIComponent(provider)}`];
        if (options === null || options === void 0 ? void 0 : options.redirectTo) {
          urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
        }
        if (options === null || options === void 0 ? void 0 : options.scopes) {
          urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
        }
        if (this.flowType === "pkce") {
          const [codeChallenge, codeChallengeMethod] = await (0, helpers_1.getCodeChallengeAndMethod)(this.storage, this.storageKey);
          const flowParams = new URLSearchParams({
            code_challenge: `${encodeURIComponent(codeChallenge)}`,
            code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
          });
          urlParams.push(flowParams.toString());
        }
        if (options === null || options === void 0 ? void 0 : options.queryParams) {
          const query = new URLSearchParams(options.queryParams);
          urlParams.push(query.toString());
        }
        if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
          urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
        }
        return `${url}?${urlParams.join("&")}`;
      }
      async _unenroll(params) {
        try {
          return await this._useSession(async (result) => {
            var _a;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            return await (0, fetch_1._request)(this.fetch, "DELETE", `${this.url}/factors/${params.factorId}`, {
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      async _enroll(params) {
        try {
          return await this._useSession(async (result) => {
            var _a, _b;
            const { data: sessionData, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            const body = Object.assign({ friendly_name: params.friendlyName, factor_type: params.factorType }, params.factorType === "phone" ? { phone: params.phone } : params.factorType === "totp" ? { issuer: params.issuer } : {});
            const { data, error } = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/factors`, {
              body,
              headers: this.headers,
              jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
            });
            if (error) {
              return this._returnResult({ data: null, error });
            }
            if (params.factorType === "totp" && data.type === "totp" && ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code)) {
              data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
            }
            return this._returnResult({ data, error: null });
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      async _verify(params) {
        return this._acquireLock(-1, async () => {
          try {
            return await this._useSession(async (result) => {
              var _a;
              const { data: sessionData, error: sessionError } = result;
              if (sessionError) {
                return this._returnResult({ data: null, error: sessionError });
              }
              const body = Object.assign({ challenge_id: params.challengeId }, "webauthn" in params ? {
                webauthn: Object.assign(Object.assign({}, params.webauthn), { credential_response: params.webauthn.type === "create" ? (0, webauthn_1.serializeCredentialCreationResponse)(params.webauthn.credential_response) : (0, webauthn_1.serializeCredentialRequestResponse)(params.webauthn.credential_response) })
              } : { code: params.code });
              const { data, error } = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/factors/${params.factorId}/verify`, {
                body,
                headers: this.headers,
                jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
              });
              if (error) {
                return this._returnResult({ data: null, error });
              }
              await this._saveSession(Object.assign({ expires_at: Math.round(Date.now() / 1e3) + data.expires_in }, data));
              await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED", data);
              return this._returnResult({ data, error });
            });
          } catch (error) {
            if ((0, errors_1.isAuthError)(error)) {
              return this._returnResult({ data: null, error });
            }
            throw error;
          }
        });
      }
      async _challenge(params) {
        return this._acquireLock(-1, async () => {
          try {
            return await this._useSession(async (result) => {
              var _a;
              const { data: sessionData, error: sessionError } = result;
              if (sessionError) {
                return this._returnResult({ data: null, error: sessionError });
              }
              const response = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/factors/${params.factorId}/challenge`, {
                body: params,
                headers: this.headers,
                jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
              });
              if (response.error) {
                return response;
              }
              const { data } = response;
              if (data.type !== "webauthn") {
                return { data, error: null };
              }
              switch (data.webauthn.type) {
                case "create":
                  return {
                    data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: (0, webauthn_1.deserializeCredentialCreationOptions)(data.webauthn.credential_options.publicKey) }) }) }),
                    error: null
                  };
                case "request":
                  return {
                    data: Object.assign(Object.assign({}, data), { webauthn: Object.assign(Object.assign({}, data.webauthn), { credential_options: Object.assign(Object.assign({}, data.webauthn.credential_options), { publicKey: (0, webauthn_1.deserializeCredentialRequestOptions)(data.webauthn.credential_options.publicKey) }) }) }),
                    error: null
                  };
              }
            });
          } catch (error) {
            if ((0, errors_1.isAuthError)(error)) {
              return this._returnResult({ data: null, error });
            }
            throw error;
          }
        });
      }
      /**
       * {@see GoTrueMFAApi#challengeAndVerify}
       */
      async _challengeAndVerify(params) {
        const { data: challengeData, error: challengeError } = await this._challenge({
          factorId: params.factorId
        });
        if (challengeError) {
          return this._returnResult({ data: null, error: challengeError });
        }
        return await this._verify({
          factorId: params.factorId,
          challengeId: challengeData.id,
          code: params.code
        });
      }
      /**
       * {@see GoTrueMFAApi#listFactors}
       */
      async _listFactors() {
        var _a;
        const { data: { user }, error: userError } = await this.getUser();
        if (userError) {
          return { data: null, error: userError };
        }
        const data = {
          all: [],
          phone: [],
          totp: [],
          webauthn: []
        };
        for (const factor of (_a = user === null || user === void 0 ? void 0 : user.factors) !== null && _a !== void 0 ? _a : []) {
          data.all.push(factor);
          if (factor.status === "verified") {
            ;
            data[factor.factor_type].push(factor);
          }
        }
        return {
          data,
          error: null
        };
      }
      /**
       * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
       */
      async _getAuthenticatorAssuranceLevel() {
        var _a, _b;
        const { data: { session }, error: sessionError } = await this.getSession();
        if (sessionError) {
          return this._returnResult({ data: null, error: sessionError });
        }
        if (!session) {
          return {
            data: { currentLevel: null, nextLevel: null, currentAuthenticationMethods: [] },
            error: null
          };
        }
        const { payload } = (0, helpers_1.decodeJWT)(session.access_token);
        let currentLevel = null;
        if (payload.aal) {
          currentLevel = payload.aal;
        }
        let nextLevel = currentLevel;
        const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter((factor) => factor.status === "verified")) !== null && _b !== void 0 ? _b : [];
        if (verifiedFactors.length > 0) {
          nextLevel = "aal2";
        }
        const currentAuthenticationMethods = payload.amr || [];
        return { data: { currentLevel, nextLevel, currentAuthenticationMethods }, error: null };
      }
      /**
       * Retrieves details about an OAuth authorization request.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       *
       * Returns authorization details including client info, scopes, and user information.
       * If the API returns a redirect_uri, it means consent was already given - the caller
       * should handle the redirect manually if needed.
       */
      async _getAuthorizationDetails(authorizationId) {
        try {
          return await this._useSession(async (result) => {
            const { data: { session }, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            if (!session) {
              return this._returnResult({ data: null, error: new errors_1.AuthSessionMissingError() });
            }
            return await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/oauth/authorizations/${authorizationId}`, {
              headers: this.headers,
              jwt: session.access_token,
              xform: (data) => ({ data, error: null })
            });
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      /**
       * Approves an OAuth authorization request.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       */
      async _approveAuthorization(authorizationId, options) {
        try {
          return await this._useSession(async (result) => {
            const { data: { session }, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            if (!session) {
              return this._returnResult({ data: null, error: new errors_1.AuthSessionMissingError() });
            }
            const response = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
              headers: this.headers,
              jwt: session.access_token,
              body: { action: "approve" },
              xform: (data) => ({ data, error: null })
            });
            if (response.data && response.data.redirect_url) {
              if ((0, helpers_1.isBrowser)() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) {
                window.location.assign(response.data.redirect_url);
              }
            }
            return response;
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      /**
       * Denies an OAuth authorization request.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       */
      async _denyAuthorization(authorizationId, options) {
        try {
          return await this._useSession(async (result) => {
            const { data: { session }, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            if (!session) {
              return this._returnResult({ data: null, error: new errors_1.AuthSessionMissingError() });
            }
            const response = await (0, fetch_1._request)(this.fetch, "POST", `${this.url}/oauth/authorizations/${authorizationId}/consent`, {
              headers: this.headers,
              jwt: session.access_token,
              body: { action: "deny" },
              xform: (data) => ({ data, error: null })
            });
            if (response.data && response.data.redirect_url) {
              if ((0, helpers_1.isBrowser)() && !(options === null || options === void 0 ? void 0 : options.skipBrowserRedirect)) {
                window.location.assign(response.data.redirect_url);
              }
            }
            return response;
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      /**
       * Lists all OAuth grants that the authenticated user has authorized.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       */
      async _listOAuthGrants() {
        try {
          return await this._useSession(async (result) => {
            const { data: { session }, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            if (!session) {
              return this._returnResult({ data: null, error: new errors_1.AuthSessionMissingError() });
            }
            return await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/user/oauth/grants`, {
              headers: this.headers,
              jwt: session.access_token,
              xform: (data) => ({ data, error: null })
            });
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      /**
       * Revokes a user's OAuth grant for a specific client.
       * Only relevant when the OAuth 2.1 server is enabled in Supabase Auth.
       */
      async _revokeOAuthGrant(options) {
        try {
          return await this._useSession(async (result) => {
            const { data: { session }, error: sessionError } = result;
            if (sessionError) {
              return this._returnResult({ data: null, error: sessionError });
            }
            if (!session) {
              return this._returnResult({ data: null, error: new errors_1.AuthSessionMissingError() });
            }
            await (0, fetch_1._request)(this.fetch, "DELETE", `${this.url}/user/oauth/grants`, {
              headers: this.headers,
              jwt: session.access_token,
              query: { client_id: options.clientId },
              noResolveJson: true
            });
            return { data: {}, error: null };
          });
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
      async fetchJwk(kid, jwks = { keys: [] }) {
        let jwk = jwks.keys.find((key) => key.kid === kid);
        if (jwk) {
          return jwk;
        }
        const now = Date.now();
        jwk = this.jwks.keys.find((key) => key.kid === kid);
        if (jwk && this.jwks_cached_at + constants_1.JWKS_TTL > now) {
          return jwk;
        }
        const { data, error } = await (0, fetch_1._request)(this.fetch, "GET", `${this.url}/.well-known/jwks.json`, {
          headers: this.headers
        });
        if (error) {
          throw error;
        }
        if (!data.keys || data.keys.length === 0) {
          return null;
        }
        this.jwks = data;
        this.jwks_cached_at = now;
        jwk = data.keys.find((key) => key.kid === kid);
        if (!jwk) {
          return null;
        }
        return jwk;
      }
      /**
       * Extracts the JWT claims present in the access token by first verifying the
       * JWT against the server's JSON Web Key Set endpoint
       * `/.well-known/jwks.json` which is often cached, resulting in significantly
       * faster responses. Prefer this method over {@link #getUser} which always
       * sends a request to the Auth server for each JWT.
       *
       * If the project is not using an asymmetric JWT signing key (like ECC or
       * RSA) it always sends a request to the Auth server (similar to {@link
       * #getUser}) to verify the JWT.
       *
       * @param jwt An optional specific JWT you wish to verify, not the one you
       *            can obtain from {@link #getSession}.
       * @param options Various additional options that allow you to customize the
       *                behavior of this method.
       */
      async getClaims(jwt, options = {}) {
        try {
          let token = jwt;
          if (!token) {
            const { data, error } = await this.getSession();
            if (error || !data.session) {
              return this._returnResult({ data: null, error });
            }
            token = data.session.access_token;
          }
          const { header, payload, signature, raw: { header: rawHeader, payload: rawPayload } } = (0, helpers_1.decodeJWT)(token);
          if (!(options === null || options === void 0 ? void 0 : options.allowExpired)) {
            (0, helpers_1.validateExp)(payload.exp);
          }
          const signingKey = !header.alg || header.alg.startsWith("HS") || !header.kid || !("crypto" in globalThis && "subtle" in globalThis.crypto) ? null : await this.fetchJwk(header.kid, (options === null || options === void 0 ? void 0 : options.keys) ? { keys: options.keys } : options === null || options === void 0 ? void 0 : options.jwks);
          if (!signingKey) {
            const { error } = await this.getUser(token);
            if (error) {
              throw error;
            }
            return {
              data: {
                claims: payload,
                header,
                signature
              },
              error: null
            };
          }
          const algorithm = (0, helpers_1.getAlgorithm)(header.alg);
          const publicKey = await crypto.subtle.importKey("jwk", signingKey, algorithm, true, [
            "verify"
          ]);
          const isValid = await crypto.subtle.verify(algorithm, publicKey, signature, (0, base64url_1.stringToUint8Array)(`${rawHeader}.${rawPayload}`));
          if (!isValid) {
            throw new errors_1.AuthInvalidJwtError("Invalid JWT signature");
          }
          return {
            data: {
              claims: payload,
              header,
              signature
            },
            error: null
          };
        } catch (error) {
          if ((0, errors_1.isAuthError)(error)) {
            return this._returnResult({ data: null, error });
          }
          throw error;
        }
      }
    };
    GoTrueClient.nextInstanceID = {};
    exports2.default = GoTrueClient;
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/AuthAdminApi.js
var require_AuthAdminApi = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/AuthAdminApi.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var GoTrueAdminApi_1 = tslib_1.__importDefault(require_GoTrueAdminApi());
    var AuthAdminApi = GoTrueAdminApi_1.default;
    exports2.default = AuthAdminApi;
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/AuthClient.js
var require_AuthClient = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/AuthClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var GoTrueClient_1 = tslib_1.__importDefault(require_GoTrueClient());
    var AuthClient = GoTrueClient_1.default;
    exports2.default = AuthClient;
  }
});

// node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/index.js
var require_main5 = __commonJS({
  "node_modules/.pnpm/@supabase+auth-js@2.86.0/node_modules/@supabase/auth-js/dist/main/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.processLock = exports2.lockInternals = exports2.NavigatorLockAcquireTimeoutError = exports2.navigatorLock = exports2.AuthClient = exports2.AuthAdminApi = exports2.GoTrueClient = exports2.GoTrueAdminApi = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var GoTrueAdminApi_1 = tslib_1.__importDefault(require_GoTrueAdminApi());
    exports2.GoTrueAdminApi = GoTrueAdminApi_1.default;
    var GoTrueClient_1 = tslib_1.__importDefault(require_GoTrueClient());
    exports2.GoTrueClient = GoTrueClient_1.default;
    var AuthAdminApi_1 = tslib_1.__importDefault(require_AuthAdminApi());
    exports2.AuthAdminApi = AuthAdminApi_1.default;
    var AuthClient_1 = tslib_1.__importDefault(require_AuthClient());
    exports2.AuthClient = AuthClient_1.default;
    tslib_1.__exportStar(require_types3(), exports2);
    tslib_1.__exportStar(require_errors3(), exports2);
    var locks_1 = require_locks();
    Object.defineProperty(exports2, "navigatorLock", { enumerable: true, get: function() {
      return locks_1.navigatorLock;
    } });
    Object.defineProperty(exports2, "NavigatorLockAcquireTimeoutError", { enumerable: true, get: function() {
      return locks_1.NavigatorLockAcquireTimeoutError;
    } });
    Object.defineProperty(exports2, "lockInternals", { enumerable: true, get: function() {
      return locks_1.internals;
    } });
    Object.defineProperty(exports2, "processLock", { enumerable: true, get: function() {
      return locks_1.processLock;
    } });
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/SupabaseAuthClient.js
var require_SupabaseAuthClient = __commonJS({
  "node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/lib/SupabaseAuthClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.SupabaseAuthClient = void 0;
    var auth_js_1 = require_main5();
    var SupabaseAuthClient = class extends auth_js_1.AuthClient {
      constructor(options) {
        super(options);
      }
    };
    exports2.SupabaseAuthClient = SupabaseAuthClient;
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/SupabaseClient.js
var require_SupabaseClient = __commonJS({
  "node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/SupabaseClient.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var functions_js_1 = require_main2();
    var postgrest_js_1 = require_cjs();
    var realtime_js_1 = require_main3();
    var storage_js_1 = require_main4();
    var constants_1 = require_constants4();
    var fetch_1 = require_fetch3();
    var helpers_1 = require_helpers3();
    var SupabaseAuthClient_1 = require_SupabaseAuthClient();
    var SupabaseClient3 = class {
      /**
       * Create a new client for use in the browser.
       * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
       * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
       * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
       * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
       * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
       * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
       * @param options.realtime Options passed along to realtime-js constructor.
       * @param options.storage Options passed along to the storage-js constructor.
       * @param options.global.fetch A custom fetch implementation.
       * @param options.global.headers Any additional headers to send with each network request.
       * @example
       * ```ts
       * import { createClient } from '@supabase/supabase-js'
       *
       * const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')
       * const { data } = await supabase.from('profiles').select('*')
       * ```
       */
      constructor(supabaseUrl, supabaseKey, options) {
        var _a, _b, _c;
        this.supabaseUrl = supabaseUrl;
        this.supabaseKey = supabaseKey;
        const baseUrl = (0, helpers_1.validateSupabaseUrl)(supabaseUrl);
        if (!supabaseKey)
          throw new Error("supabaseKey is required.");
        this.realtimeUrl = new URL("realtime/v1", baseUrl);
        this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace("http", "ws");
        this.authUrl = new URL("auth/v1", baseUrl);
        this.storageUrl = new URL("storage/v1", baseUrl);
        this.functionsUrl = new URL("functions/v1", baseUrl);
        const defaultStorageKey = `sb-${baseUrl.hostname.split(".")[0]}-auth-token`;
        const DEFAULTS = {
          db: constants_1.DEFAULT_DB_OPTIONS,
          realtime: constants_1.DEFAULT_REALTIME_OPTIONS,
          auth: Object.assign(Object.assign({}, constants_1.DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
          global: constants_1.DEFAULT_GLOBAL_OPTIONS
        };
        const settings = (0, helpers_1.applySettingDefaults)(options !== null && options !== void 0 ? options : {}, DEFAULTS);
        this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : "";
        this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
        if (!settings.accessToken) {
          this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch);
        } else {
          this.accessToken = settings.accessToken;
          this.auth = new Proxy({}, {
            get: (_, prop) => {
              throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
            }
          });
        }
        this.fetch = (0, fetch_1.fetchWithAuth)(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
        this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
        if (this.accessToken) {
          this.accessToken().then((token) => this.realtime.setAuth(token)).catch((e) => console.warn("Failed to set initial Realtime auth token:", e));
        }
        this.rest = new postgrest_js_1.PostgrestClient(new URL("rest/v1", baseUrl).href, {
          headers: this.headers,
          schema: settings.db.schema,
          fetch: this.fetch
        });
        this.storage = new storage_js_1.StorageClient(this.storageUrl.href, this.headers, this.fetch, options === null || options === void 0 ? void 0 : options.storage);
        if (!settings.accessToken) {
          this._listenForAuthEvents();
        }
      }
      /**
       * Supabase Functions allows you to deploy and invoke edge functions.
       */
      get functions() {
        return new functions_js_1.FunctionsClient(this.functionsUrl.href, {
          headers: this.headers,
          customFetch: this.fetch
        });
      }
      /**
       * Perform a query on a table or a view.
       *
       * @param relation - The table or view name to query
       */
      from(relation) {
        return this.rest.from(relation);
      }
      // NOTE: signatures must be kept in sync with PostgrestClient.schema
      /**
       * Select a schema to query or perform an function (rpc) call.
       *
       * The schema needs to be on the list of exposed schemas inside Supabase.
       *
       * @param schema - The schema to query
       */
      schema(schema) {
        return this.rest.schema(schema);
      }
      // NOTE: signatures must be kept in sync with PostgrestClient.rpc
      /**
       * Perform a function call.
       *
       * @param fn - The function name to call
       * @param args - The arguments to pass to the function call
       * @param options - Named parameters
       * @param options.head - When set to `true`, `data` will not be returned.
       * Useful if you only need the count.
       * @param options.get - When set to `true`, the function will be called with
       * read-only access mode.
       * @param options.count - Count algorithm to use to count rows returned by the
       * function. Only applicable for [set-returning
       * functions](https://www.postgresql.org/docs/current/functions-srf.html).
       *
       * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
       * hood.
       *
       * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
       * statistics under the hood.
       *
       * `"estimated"`: Uses exact count for low numbers and planned count for high
       * numbers.
       */
      rpc(fn, args = {}, options = {
        head: false,
        get: false,
        count: void 0
      }) {
        return this.rest.rpc(fn, args, options);
      }
      /**
       * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
       *
       * @param {string} name - The name of the Realtime channel.
       * @param {Object} opts - The options to pass to the Realtime channel.
       *
       */
      channel(name, opts = { config: {} }) {
        return this.realtime.channel(name, opts);
      }
      /**
       * Returns all Realtime channels.
       */
      getChannels() {
        return this.realtime.getChannels();
      }
      /**
       * Unsubscribes and removes Realtime channel from Realtime client.
       *
       * @param {RealtimeChannel} channel - The name of the Realtime channel.
       *
       */
      removeChannel(channel) {
        return this.realtime.removeChannel(channel);
      }
      /**
       * Unsubscribes and removes all Realtime channels from Realtime client.
       */
      removeAllChannels() {
        return this.realtime.removeAllChannels();
      }
      async _getAccessToken() {
        var _a, _b;
        if (this.accessToken) {
          return await this.accessToken();
        }
        const { data } = await this.auth.getSession();
        return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
      }
      _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, userStorage, storageKey, flowType, lock, debug, throwOnError }, headers, fetch2) {
        const authHeaders = {
          Authorization: `Bearer ${this.supabaseKey}`,
          apikey: `${this.supabaseKey}`
        };
        return new SupabaseAuthClient_1.SupabaseAuthClient({
          url: this.authUrl.href,
          headers: Object.assign(Object.assign({}, authHeaders), headers),
          storageKey,
          autoRefreshToken,
          persistSession,
          detectSessionInUrl,
          storage,
          userStorage,
          flowType,
          lock,
          debug,
          throwOnError,
          fetch: fetch2,
          // auth checks if there is a custom authorizaiton header using this flag
          // so it knows whether to return an error when getUser is called with no session
          hasCustomAuthorizationHeader: Object.keys(this.headers).some((key) => key.toLowerCase() === "authorization")
        });
      }
      _initRealtimeClient(options) {
        return new realtime_js_1.RealtimeClient(this.realtimeUrl.href, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
      }
      _listenForAuthEvents() {
        const data = this.auth.onAuthStateChange((event, session) => {
          this._handleTokenChanged(event, "CLIENT", session === null || session === void 0 ? void 0 : session.access_token);
        });
        return data;
      }
      _handleTokenChanged(event, source, token) {
        if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
          this.changedAccessToken = token;
          this.realtime.setAuth(token);
        } else if (event === "SIGNED_OUT") {
          this.realtime.setAuth();
          if (source == "STORAGE")
            this.auth.signOut();
          this.changedAccessToken = void 0;
        }
      }
    };
    exports2.default = SupabaseClient3;
  }
});

// node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/index.js
var require_main6 = __commonJS({
  "node_modules/.pnpm/@supabase+supabase-js@2.86.0/node_modules/@supabase/supabase-js/dist/main/index.js"(exports2) {
    "use strict";
    var __createBinding2 = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar2 = exports2 && exports2.__exportStar || function(m, exports3) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports3, p)) __createBinding2(exports3, m, p);
    };
    var __importDefault2 = exports2 && exports2.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.createClient = exports2.SupabaseClient = exports2.FunctionRegion = exports2.FunctionsError = exports2.FunctionsRelayError = exports2.FunctionsFetchError = exports2.FunctionsHttpError = exports2.PostgrestError = void 0;
    var SupabaseClient_1 = __importDefault2(require_SupabaseClient());
    __exportStar2(require_main5(), exports2);
    var postgrest_js_1 = require_cjs();
    Object.defineProperty(exports2, "PostgrestError", { enumerable: true, get: function() {
      return postgrest_js_1.PostgrestError;
    } });
    var functions_js_1 = require_main2();
    Object.defineProperty(exports2, "FunctionsHttpError", { enumerable: true, get: function() {
      return functions_js_1.FunctionsHttpError;
    } });
    Object.defineProperty(exports2, "FunctionsFetchError", { enumerable: true, get: function() {
      return functions_js_1.FunctionsFetchError;
    } });
    Object.defineProperty(exports2, "FunctionsRelayError", { enumerable: true, get: function() {
      return functions_js_1.FunctionsRelayError;
    } });
    Object.defineProperty(exports2, "FunctionsError", { enumerable: true, get: function() {
      return functions_js_1.FunctionsError;
    } });
    Object.defineProperty(exports2, "FunctionRegion", { enumerable: true, get: function() {
      return functions_js_1.FunctionRegion;
    } });
    __exportStar2(require_main3(), exports2);
    var SupabaseClient_2 = require_SupabaseClient();
    Object.defineProperty(exports2, "SupabaseClient", { enumerable: true, get: function() {
      return __importDefault2(SupabaseClient_2).default;
    } });
    var createClient3 = (supabaseUrl, supabaseKey, options) => {
      return new SupabaseClient_1.default(supabaseUrl, supabaseKey, options);
    };
    exports2.createClient = createClient3;
    function shouldShowDeprecationWarning() {
      if (typeof window !== "undefined") {
        return false;
      }
      if (typeof process === "undefined") {
        return false;
      }
      const processVersion = process["version"];
      if (processVersion === void 0 || processVersion === null) {
        return false;
      }
      const versionMatch = processVersion.match(/^v(\d+)\./);
      if (!versionMatch) {
        return false;
      }
      const majorVersion = parseInt(versionMatch[1], 10);
      return majorVersion <= 18;
    }
    if (shouldShowDeprecationWarning()) {
      console.warn(`\u26A0\uFE0F  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217`);
    }
  }
});

// server/services/traffic/shared/config/EngineConfigLoader.ts
var EngineConfigLoader_exports = {};
__export(EngineConfigLoader_exports, {
  EngineConfigLoader: () => EngineConfigLoader
});
var fs2, path2, import_url, import_meta, __filename, __dirname, EngineConfigLoader;
var init_EngineConfigLoader = __esm({
  "server/services/traffic/shared/config/EngineConfigLoader.ts"() {
    "use strict";
    fs2 = __toESM(require("fs/promises"), 1);
    path2 = __toESM(require("path"), 1);
    import_url = require("url");
    import_meta = {};
    __filename = (0, import_url.fileURLToPath)(import_meta.url);
    __dirname = path2.dirname(__filename);
    EngineConfigLoader = class {
      static cache = {};
      static patternCache = {};
      /**
       * JSON 파일에서 엔진 Config 로드
       */
      static async loadFromFile(version) {
        if (this.cache[version]) {
          return this.cache[version];
        }
        try {
          const filePath = path2.join(__dirname, "../../engine-patterns.json");
          const content = await fs2.readFile(filePath, "utf-8");
          const data = JSON.parse(content);
          const config2 = data.engine_config[version];
          if (!config2) {
            throw new Error(`No config found for engine ${version}`);
          }
          this.cache[version] = {
            reach: config2.reach,
            dwell: config2.dwell
          };
          return this.cache[version];
        } catch (error) {
          throw new Error(`Failed to load config for ${version}: ${error.message}`);
        }
      }
      /**
       * Reach Pattern 정의 로드 (B1, B2)
       */
      static async getPatternDefinition(patternId) {
        if (this.patternCache[patternId]) {
          return this.patternCache[patternId];
        }
        try {
          const filePath = path2.join(__dirname, "../../engine-patterns.json");
          const content = await fs2.readFile(filePath, "utf-8");
          const data = JSON.parse(content);
          const pattern = data.patterns[patternId];
          if (!pattern) {
            throw new Error(`No pattern definition found for ${patternId}`);
          }
          this.patternCache[patternId] = pattern;
          return pattern;
        } catch (error) {
          throw new Error(`Failed to load pattern ${patternId}: ${error.message}`);
        }
      }
      /**
       * 캐시 클리어 (Config 변경 시)
       */
      static clearCache() {
        this.cache = {};
        this.patternCache = {};
      }
      /**
       * 모든 엔진의 Config 로드
       */
      static async loadAllConfigs() {
        const filePath = path2.join(__dirname, "../../engine-patterns.json");
        const content = await fs2.readFile(filePath, "utf-8");
        const data = JSON.parse(content);
        return data.engine_config;
      }
    };
  }
});

// scripts/production/parallel-ip-rotation.ts
var dotenv = __toESM(require_main(), 1);
var import_os = __toESM(require("os"), 1);
var import_supabase_js2 = __toESM(require_main6(), 1);

// server/services/traffic/engines/TrafficEngineV7Simple.ts
var import_puppeteer_real_browser = require("puppeteer-real-browser");

// rank-check/accurate-rank-checker.ts
var SAFE_DELAY_MS = 2600;
var SCROLL_STEPS = 18;
var SCROLL_GAP_MS = 250;
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function findAccurateRank(page, keyword, targetMid, maxPages = 15) {
  const normalizedKeyword = keyword.trim();
  const normalizedMid = targetMid.trim();
  if (!normalizedKeyword || !normalizedMid) {
    console.log("\u26A0\uFE0F \uD0A4\uC6CC\uB4DC \uB610\uB294 MID\uAC00 \uBE44\uC5B4 \uC788\uC2B5\uB2C8\uB2E4.");
    return null;
  }
  const limit = Math.max(1, Math.min(maxPages, 15));
  console.log(`\u{1F50D} "${normalizedKeyword}" / MID ${normalizedMid} \uC21C\uC704 \uCD94\uC801 (\uCD5C\uB300 ${limit}\uD398\uC774\uC9C0)`);
  const shoppingReady = await enterShoppingTab(page, normalizedKeyword);
  if (!shoppingReady) {
    console.log("\u274C \uC1FC\uD551\uD0ED \uC9C4\uC785\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.");
    return null;
  }
  console.log(`\u{1F4C4} 1\uD398\uC774\uC9C0 \uC0C1\uD488 \uC218\uC9D1 (DOM \uBC29\uC2DD)`);
  await hydrateCurrentPage(page);
  if (await isBlocked(page)) {
    console.log("\u{1F6D1} \uBCF4\uC548 \uD398\uC774\uC9C0 \uAC10\uC9C0\uB428 (CAPTCHA)");
    return null;
  }
  const scan = await collectProductsOnPage(page, 1);
  const match = scan.products.find((item) => item.mid === normalizedMid);
  if (match) {
    console.log(
      `\u2705 \uC21C\uC704 \uBC1C\uACAC: \uC804\uCCB4 ${match.totalRank}\uC704 / \uC624\uAC00\uB2C9 ${match.organicRank > 0 ? match.organicRank : "-"}`
    );
    return {
      found: true,
      mid: match.mid,
      productName: match.productName,
      totalRank: match.totalRank,
      organicRank: match.organicRank,
      isAd: match.isAd,
      page: 1,
      pagePosition: match.pagePosition
    };
  }
  for (let currentPage = 2; currentPage <= limit; currentPage++) {
    console.log(`\u{1F4C4} ${currentPage}\uD398\uC774\uC9C0 \uC0C1\uD488 \uC218\uC9D1 (API \uBC29\uC2DD)`);
    const apiProducts = await goToPageAndGetAPIData(page, currentPage);
    if (!apiProducts) {
      console.log(`\u26A0\uFE0F ${currentPage}\uD398\uC774\uC9C0 API \uB370\uC774\uD130 \uC218\uC9D1 \uC2E4\uD328`);
      break;
    }
    const apiMatch = apiProducts.find((item) => item.mid === normalizedMid);
    if (apiMatch) {
      console.log(
        `\u2705 \uC21C\uC704 \uBC1C\uACAC: \uC804\uCCB4 ${apiMatch.totalRank}\uC704 / \uC624\uAC00\uB2C9 ${apiMatch.organicRank > 0 ? apiMatch.organicRank : "-"}`
      );
      return {
        found: true,
        mid: apiMatch.mid,
        productName: apiMatch.productName,
        totalRank: apiMatch.totalRank,
        organicRank: apiMatch.organicRank,
        isAd: apiMatch.isAd,
        page: currentPage,
        pagePosition: apiMatch.pagePosition
      };
    }
    await delay(SAFE_DELAY_MS);
  }
  console.log(`\u274C ${normalizedMid}\uC744(\uB97C) ${limit}\uD398\uC774\uC9C0 \uB0B4\uC5D0\uC11C \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.`);
  return null;
}
async function enterShoppingTab(page, keyword) {
  console.log("\u{1F9ED} \uB124\uC774\uBC84 \uBA54\uC778 \uC9C4\uC785");
  try {
    await page.goto("https://www.naver.com/", {
      waitUntil: "domcontentloaded",
      timeout: 2e4
    });
  } catch (error) {
    console.log("\u26A0\uFE0F \uB124\uC774\uBC84 \uC9C4\uC785 \uC2E4\uD328", error);
    return false;
  }
  await delay(SAFE_DELAY_MS);
  const searchInput = await page.waitForSelector('input[name="query"]', { timeout: 7e3 }).catch(() => null);
  if (!searchInput) {
    console.log("\u274C \uAC80\uC0C9 \uC785\uB825\uCC3D\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
    return false;
  }
  await searchInput.click({ clickCount: 3 });
  await page.keyboard.type(keyword, { delay: 70 });
  await page.keyboard.press("Enter");
  await delay(SAFE_DELAY_MS + 500);
  console.log("\u{1F6D2} \uC1FC\uD551\uD0ED\uC73C\uB85C \uC774\uB3D9");
  const clicked = await page.evaluate(() => {
    const link = document.querySelector('a[href*="search.shopping.naver.com"]');
    if (!link) return false;
    link.removeAttribute("target");
    link.click();
    return true;
  });
  if (!clicked) {
    console.log("\u274C \uC1FC\uD551\uD0ED \uB9C1\uD06C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
    return false;
  }
  await delay(SAFE_DELAY_MS + 800);
  if (!page.url().includes("search.shopping.naver.com")) {
    console.log("\u26A0\uFE0F \uC1FC\uD551\uD0ED URL\uC774 \uD655\uC778\uB418\uC9C0 \uC54A\uC558\uC2B5\uB2C8\uB2E4.");
    return false;
  }
  if (await isBlocked(page)) {
    console.log("\u{1F6D1} \uC1FC\uD551\uD0ED \uC9C4\uC785 \uC911 \uBCF4\uC548 \uD398\uC774\uC9C0\uAC00 \uB178\uCD9C\uB418\uC5C8\uC2B5\uB2C8\uB2E4.");
    return false;
  }
  return true;
}
async function hydrateCurrentPage(page) {
  await page.evaluate(() => window.scrollTo(0, 0));
  for (let step = 0; step < SCROLL_STEPS; step++) {
    await page.evaluate(() => window.scrollBy(0, 550));
    await delay(SCROLL_GAP_MS);
  }
  await delay(600);
}
async function collectProductsOnPage(page, pageNumber) {
  const result = await page.$$eval(
    "a[data-shp-contents-id][data-shp-contents-rank]",
    (anchors, pageNum) => {
      const seen = /* @__PURE__ */ new Set();
      const products = [];
      for (const anchor of anchors) {
        const mid = anchor.getAttribute("data-shp-contents-id");
        const rankAttr = anchor.getAttribute("data-shp-contents-rank");
        if (!mid || !rankAttr) continue;
        const totalRank = parseInt(rankAttr, 10);
        if (!Number.isFinite(totalRank)) continue;
        if (seen.has(mid)) continue;
        let organicRank = -1;
        const dtl = anchor.getAttribute("data-shp-contents-dtl");
        if (dtl) {
          try {
            const normalized = dtl.replace(/&quot;/g, '"');
            const parsed = JSON.parse(normalized);
            if (Array.isArray(parsed)) {
              const organic = parsed.find((item) => item && item.key === "organic_expose_order");
              if (organic) {
                const val = parseInt(String(organic.value), 10);
                if (Number.isFinite(val)) {
                  organicRank = val;
                }
              }
            }
          } catch (e) {
          }
        }
        let productName = "\uC0C1\uD488\uBA85 \uC5C6\uC74C";
        const titleAttr = anchor.getAttribute("title") || anchor.getAttribute("aria-label");
        if (titleAttr) {
          productName = titleAttr.trim();
        } else {
          const titleEl = anchor.querySelector('.product_title__Mmw2K, [class*="title"], strong');
          if (titleEl && titleEl.textContent) {
            productName = titleEl.textContent.replace(/\s+/g, " ").trim();
          } else if (anchor.textContent) {
            productName = anchor.textContent.replace(/\s+/g, " ").trim().substring(0, 50);
          }
        }
        const inventory = anchor.getAttribute("data-shp-inventory") || "";
        const isAd = /lst\*(A|P|D)/.test(inventory);
        products.push({
          mid,
          productName,
          totalRank,
          organicRank: organicRank >= 0 ? organicRank : -1,
          isAd,
          pagePosition: 0
        });
        seen.add(mid);
      }
      products.sort((a, b) => a.totalRank - b.totalRank);
      for (let i = 0; i < products.length; i++) {
        products[i].pagePosition = i + 1;
        if (products[i].organicRank < 0 && !products[i].isAd) {
          products[i].organicRank = products[i].totalRank;
        }
      }
      return {
        products,
        firstMid: products.length > 0 ? products[0].mid : null,
        firstRank: products.length > 0 ? products[0].totalRank : null
      };
    },
    pageNumber
  );
  return result;
}
async function goToPageAndGetAPIData(page, targetPage) {
  const buttonExists = await page.evaluate((nextPage) => {
    const buttons = document.querySelectorAll('a.pagination_btn_page__utqBz, a[class*="pagination_btn"]');
    for (const btn of buttons) {
      if (btn.textContent?.trim() === String(nextPage)) {
        return true;
      }
    }
    return false;
  }, targetPage);
  if (!buttonExists) {
    console.log(`\u26A0\uFE0F ${targetPage}\uD398\uC774\uC9C0 \uBC84\uD2BC\uC744 \uCC3E\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.`);
    return null;
  }
  const apiResponsePromise = page.waitForResponse(
    (response) => {
      const url = response.url();
      return url.includes("/api/search/all") && url.includes(`pagingIndex=${targetPage}`);
    },
    { timeout: 15e3 }
  );
  try {
    const pageButton = await page.evaluateHandle((nextPage) => {
      const buttons = document.querySelectorAll('a.pagination_btn_page__utqBz, a[class*="pagination_btn"]');
      for (const btn of buttons) {
        if (btn.textContent?.trim() === String(nextPage)) {
          return btn;
        }
      }
      return null;
    }, targetPage);
    if (!pageButton) {
      console.log(`\u26A0\uFE0F \uBC84\uD2BC element\uB97C \uAC00\uC838\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.`);
      return null;
    }
    await pageButton.asElement().click();
    console.log(`   \uBC84\uD2BC \uD074\uB9AD, API \uC751\uB2F5 \uB300\uAE30 \uC911...`);
  } catch (error) {
    console.log(`   \u26A0\uFE0F \uBC84\uD2BC \uD074\uB9AD \uC2E4\uD328: ${error}`);
    return null;
  }
  try {
    const response = await apiResponsePromise;
    console.log(`   \u2705 API \uC751\uB2F5 \uC218\uC2E0`);
    const json = await response.json();
    if (!json.shoppingResult?.products) {
      console.log(`   \u26A0\uFE0F API \uC751\uB2F5\uC5D0 products \uC5C6\uC74C`);
      return null;
    }
    const products = [];
    const apiProducts = json.shoppingResult.products;
    for (let i = 0; i < apiProducts.length; i++) {
      const p = apiProducts[i];
      const mid = p.id || p.nvMid || "";
      const totalRank = p.rank || (targetPage - 1) * 40 + i + 1;
      const organicRank = p.rankInfo?.organicRank || -1;
      const productName = p.productTitle || p.title || "\uC0C1\uD488\uBA85 \uC5C6\uC74C";
      const isAd = p.adcrType !== void 0 && p.adcrType !== null;
      if (mid) {
        products.push({
          mid,
          productName,
          totalRank,
          organicRank: organicRank > 0 ? organicRank : totalRank,
          isAd,
          pagePosition: i + 1
        });
      }
    }
    console.log(`   \uC218\uC9D1: ${products.length}\uAC1C \uC0C1\uD488 (${products[0]?.totalRank || "?"}\uC704~${products[products.length - 1]?.totalRank || "?"}\uC704)`);
    return products;
  } catch (error) {
    console.log(`   \u26A0\uFE0F API \uC751\uB2F5 \uD0C0\uC784\uC544\uC6C3 \uB610\uB294 \uD30C\uC2F1 \uC2E4\uD328: ${error}`);
    return null;
  }
}
async function isBlocked(page) {
  return page.evaluate(() => {
    const bodyText = document.body?.innerText ?? "";
    return bodyText.includes("\uBCF4\uC548 \uD655\uC778") || bodyText.includes("\uC790\uB3D9 \uC785\uB825 \uBC29\uC9C0") || bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C");
  });
}

// server/services/failureLogger.ts
var fs = __toESM(require("fs"), 1);
var path = __toESM(require("path"), 1);

// server/services/naverTrafficClient.ts
var import_supabase_js = __toESM(require_main6(), 1);
var NaverTrafficClient = class {
  supabase;
  constructor() {
    const url = process.env.SUPABASE_PRODUCTION_URL;
    const key = process.env.SUPABASE_PRODUCTION_KEY;
    if (!url || !key) {
      throw new Error(
        "SUPABASE_PRODUCTION_URL and SUPABASE_PRODUCTION_KEY must be set"
      );
    }
    this.supabase = (0, import_supabase_js.createClient)(url, key);
  }
  /**
   * traffic_navershopping에서 대기 작업 전체 조회
   * (쿠팡의 getAllPendingTrafficTasks 참조)
   */
  async getAllPendingTrafficTasks() {
    const { data, error } = await this.supabase.from("traffic_navershopping").select("*").order("id", { ascending: true });
    if (error) {
      console.error("\uD2B8\uB798\uD53D \uC870\uD68C \uC624\uB958:", error);
      throw error;
    }
    return data || [];
  }
  /**
   * traffic_navershopping에서 제한된 수의 작업 조회
   */
  async getPendingTrafficTasks(limit) {
    const { data, error } = await this.supabase.from("traffic_navershopping").select("*").order("id", { ascending: true }).limit(limit);
    if (error) {
      console.error("\uD2B8\uB798\uD53D \uC870\uD68C \uC624\uB958:", error);
      throw error;
    }
    return data || [];
  }
  /**
   * slot_naver 매칭 (쿠팡 로직 참조)
   * 1순위: slot_id로 직접 찾기
   * 2순위: 복합 조건으로 찾기
   */
  async findSlotNaver(task) {
    if (task.slot_id) {
      const { data: data2 } = await this.supabase.from("slot_naver").select("id").eq("id", task.slot_id).single();
      if (data2) return data2.id;
    }
    const { data } = await this.supabase.from("slot_naver").select("id").eq("slot_sequence", task.slot_sequence).eq("keyword", task.keyword).eq("link_url", task.link_url).eq("slot_type", "\uB124\uC774\uBC84\uC1FC\uD551").single();
    return data?.id || null;
  }
  /**
   * slot_naver에서 product_name과 mid 가져오기
   * fullname 검색에 필요한 상품명 조회
   */
  async getSlotProductInfo(slotId) {
    const { data, error } = await this.supabase.from("slot_naver").select("product_name, mid").eq("id", slotId).single();
    if (error || !data) {
      return { productName: null, mid: null };
    }
    return {
      productName: data.product_name || null,
      mid: data.mid || null
    };
  }
  /**
   * slot_naver에 결과 업데이트 (success_count++ 또는 fail_count++)
   */
  async updateSlotResult(slotId, success) {
    const column = success ? "success_count" : "fail_count";
    const { data: current, error: selectError } = await this.supabase.from("slot_naver").select(column).eq("id", slotId).single();
    if (selectError) {
      console.error(`slot_naver \uC870\uD68C \uC624\uB958 (id=${slotId}):`, selectError);
      throw selectError;
    }
    const currentValue = current?.[column] || 0;
    const newValue = currentValue + 1;
    const { error: updateError } = await this.supabase.from("slot_naver").update({ [column]: newValue }).eq("id", slotId);
    if (updateError) {
      console.error(`slot_naver \uC5C5\uB370\uC774\uD2B8 \uC624\uB958 (id=${slotId}):`, updateError);
      throw updateError;
    }
    console.log(`\u{1F4CA} slot_naver[${slotId}] ${column}: ${currentValue} \u2192 ${newValue}`);
  }
  /**
   * 처리 완료 작업 삭제 (쿠팡의 deleteProcessedTraffic 참조)
   * finally 블록에서 항상 호출 - 성공/실패 관계없이
   */
  async deleteProcessedTraffic(trafficId) {
    const { error } = await this.supabase.from("traffic_navershopping").delete().eq("id", trafficId);
    if (error) {
      console.error(`\uD2B8\uB798\uD53D \uC0AD\uC81C \uC624\uB958 (id=${trafficId}):`, error);
      throw error;
    }
    console.log(`\u{1F5D1}\uFE0F \uD2B8\uB798\uD53D ID ${trafficId} \uC0AD\uC81C \uC644\uB8CC`);
  }
  /**
   * 연결 테스트
   */
  async testConnection() {
    try {
      const { data, error } = await this.supabase.from("traffic_navershopping").select("count").limit(1);
      if (error) {
        console.error("\uC5F0\uACB0 \uD14C\uC2A4\uD2B8 \uC2E4\uD328:", error);
        return false;
      }
      console.log("\u2705 Production Supabase \uC5F0\uACB0 \uC131\uACF5");
      return true;
    } catch (err) {
      console.error("\uC5F0\uACB0 \uD14C\uC2A4\uD2B8 \uC608\uC678:", err);
      return false;
    }
  }
  /**
   * 대기 중인 작업 수 조회
   */
  async getPendingTaskCount() {
    const { count, error } = await this.supabase.from("traffic_navershopping").select("*", { count: "exact", head: true });
    if (error) {
      console.error("\uC791\uC5C5 \uC218 \uC870\uD68C \uC624\uB958:", error);
      return 0;
    }
    return count || 0;
  }
  /**
   * 실패 로그 DB 저장 (traffic_failures 테이블)
   */
  async insertFailure(data) {
    const { error } = await this.supabase.from("traffic_failures").insert({
      task_id: data.task_id,
      slot_id: data.slot_id,
      keyword: data.keyword,
      target_mid: data.target_mid,
      fail_reason: data.fail_reason,
      search_url: data.search_url,
      found_mids: data.found_mids,
      found_count: data.found_count ?? 0,
      engine_version: data.engine_version,
      error_message: data.error_message
    });
    if (error) {
      console.error("\uC2E4\uD328 \uB85C\uADF8 \uC800\uC7A5 \uC624\uB958:", error);
      throw error;
    }
    console.log(`\u{1F4DD} \uC2E4\uD328 \uB85C\uADF8 \uC800\uC7A5: ${data.fail_reason} - ${data.keyword}`);
  }
  /**
   * 실패 로그 통계 조회 (fail_reason별)
   */
  async getFailureStats() {
    const { data, error } = await this.supabase.from("traffic_failures").select("fail_reason").order("created_at", { ascending: false });
    if (error) {
      console.error("\uC2E4\uD328 \uB85C\uADF8 \uD1B5\uACC4 \uC624\uB958:", error);
      return [];
    }
    const stats2 = {};
    for (const row of data || []) {
      const reason = row.fail_reason;
      stats2[reason] = (stats2[reason] || 0) + 1;
    }
    return Object.entries(stats2).map(([fail_reason, count]) => ({
      fail_reason,
      count
    }));
  }
  /**
   * 최근 실패 로그 조회
   */
  async getRecentFailures(limit = 20) {
    const { data, error } = await this.supabase.from("traffic_failures").select("*").order("created_at", { ascending: false }).limit(limit);
    if (error) {
      console.error("\uCD5C\uADFC \uC2E4\uD328 \uB85C\uADF8 \uC870\uD68C \uC624\uB958:", error);
      return [];
    }
    return data || [];
  }
};

// server/services/failureLogger.ts
var FailureLogger = class {
  logDir;
  client = null;
  dbEnabled = true;
  constructor(options) {
    this.logDir = path.join(process.cwd(), "logs");
    this.dbEnabled = options?.dbEnabled ?? true;
    this.ensureLogDir();
    if (this.dbEnabled) {
      try {
        this.client = new NaverTrafficClient();
      } catch (error) {
        console.warn("[FailureLogger] DB \uD074\uB77C\uC774\uC5B8\uD2B8 \uCD08\uAE30\uD654 \uC2E4\uD328, \uD30C\uC77C \uB85C\uAE45\uB9CC \uC0AC\uC6A9:", error);
        this.dbEnabled = false;
      }
    }
  }
  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
      console.log(`\u{1F4C1} \uB85C\uADF8 \uB514\uB809\uD1A0\uB9AC \uC0DD\uC131: ${this.logDir}`);
    }
  }
  /**
   * 실패 기록 (DB + JSON 파일 둘 다)
   */
  async logFailure(record) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const fullRecord = { timestamp, ...record };
    this.appendToJsonl(fullRecord);
    if (this.dbEnabled && this.client) {
      try {
        await this.insertToDb(fullRecord);
      } catch (error) {
        console.error("[FailureLogger] DB \uC800\uC7A5 \uC2E4\uD328:", error);
      }
    }
  }
  /**
   * MID_NOT_FOUND 실패 기록 (편의 메서드)
   */
  async logMidNotFound(params) {
    await this.logFailure({
      ...params,
      failReason: "MID_NOT_FOUND",
      errorMessage: `MID ${params.targetMid} not found in search results`
    });
  }
  /**
   * CAPTCHA 실패 기록 (편의 메서드)
   */
  async logCaptcha(params) {
    await this.logFailure({
      ...params,
      failReason: "CAPTCHA"
    });
  }
  /**
   * BLOCKED 실패 기록 (편의 메서드)
   */
  async logBlocked(params) {
    await this.logFailure({
      ...params,
      failReason: "BLOCKED"
    });
  }
  appendToJsonl(record) {
    try {
      const filename = this.getFilename(record.failReason);
      const filepath = path.join(this.logDir, filename);
      const line = JSON.stringify(record) + "\n";
      fs.appendFileSync(filepath, line, "utf-8");
      const allFilepath = path.join(this.logDir, "all-failures.jsonl");
      fs.appendFileSync(allFilepath, line, "utf-8");
      console.log(`\u{1F4DD} [${record.failReason}] ${record.keyword} \u2192 ${filename}`);
    } catch (error) {
      console.error("[FailureLogger] \uD30C\uC77C \uC800\uC7A5 \uC2E4\uD328:", error);
    }
  }
  getFilename(failReason) {
    switch (failReason) {
      case "MID_NOT_FOUND":
        return "mid-not-found.jsonl";
      case "CAPTCHA":
        return "captcha-failures.jsonl";
      case "BLOCKED":
        return "blocked-failures.jsonl";
      case "TIMEOUT":
        return "timeout-failures.jsonl";
      default:
        return "other-failures.jsonl";
    }
  }
  async insertToDb(record) {
    if (!this.client) return;
    await this.client.insertFailure({
      task_id: record.taskId,
      slot_id: record.slotId,
      keyword: record.keyword,
      target_mid: record.targetMid,
      fail_reason: record.failReason,
      search_url: record.searchUrl,
      found_mids: record.foundMids,
      found_count: record.foundCount,
      engine_version: record.engineVersion,
      error_message: record.errorMessage
    });
  }
  /**
   * 로그 파일 읽기 (분석용)
   */
  readLogs(failReason) {
    const filename = failReason ? this.getFilename(failReason) : "all-failures.jsonl";
    const filepath = path.join(this.logDir, filename);
    if (!fs.existsSync(filepath)) {
      return [];
    }
    const content = fs.readFileSync(filepath, "utf-8");
    const lines = content.trim().split("\n").filter(Boolean);
    return lines.map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    }).filter((r) => r !== null);
  }
  /**
   * 통계 조회
   */
  getStats() {
    const all = this.readLogs();
    const stats2 = { total: all.length };
    for (const record of all) {
      stats2[record.failReason] = (stats2[record.failReason] || 0) + 1;
    }
    return stats2;
  }
};
var _instance = null;
function getFailureLogger() {
  if (!_instance) {
    _instance = new FailureLogger();
  }
  return _instance;
}

// server/services/traffic/profiles/v7-samsung-s23.json
var v7_samsung_s23_default = {
  version: "v7",
  deviceName: "Samsung Galaxy S23",
  userAgent: "Mozilla/5.0 (Linux; Android 13; SM-S911N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 360,
    height: 800,
    deviceScaleFactor: 3
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "Qualcomm",
    renderer: "Adreno (TM) 740"
  },
  deviceMemory: 8,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV7Simple.ts
var BRIDGE_PATTERNS = [
  "cr.shopping.naver.com/bridge",
  "cr2.shopping.naver.com/bridge",
  "cr3.shopping.naver.com/bridge",
  "cr4.shopping.naver.com/bridge",
  "shopping.naver.com/bridge",
  "naver.com/v2/bridge",
  "/bridge?"
];
var TrafficEngineV7Simple = class {
  browser = null;
  page = null;
  async init() {
    const { browser, page } = await (0, import_puppeteer_real_browser.connect)({
      headless: false,
      turnstile: true
      // fingerprint: true,  // 모바일 프로필 비활성화 - m.smartstore CAPTCHA 회피
      // args: ProfileApplier.getConnectArgs(profile),
    });
    this.browser = browser;
    this.page = page;
    this.page.setDefaultTimeout(3e4);
    this.page.setDefaultNavigationTimeout(3e4);
    console.log(`[v7-simple] No profile applied (PC mode)`);
  }
  async close() {
    try {
      if (this.page) await this.page.close().catch(() => {
      });
      if (this.browser) await this.browser.close().catch(() => {
      });
    } catch {
    }
    this.browser = null;
    this.page = null;
  }
  async execute(product) {
    const startTime = Date.now();
    if (!this.page) {
      return {
        success: false,
        version: "v7-simple",
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: "Browser not initialized"
      };
    }
    try {
      await this.page.goto("https://m.naver.com/", { waitUntil: "domcontentloaded" });
      await this.delay(1500 + Math.random() * 1e3);
      const searchQuery = product.productName.substring(0, 50);
      const searchFound = await this.page.evaluate((searchTerm) => {
        const input = document.querySelector('input[type="search"], input[name="query"]');
        if (input) {
          input.value = searchTerm;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          const form = input.closest("form");
          if (form) {
            form.submit();
            return true;
          }
        }
        return false;
      }, searchQuery);
      if (!searchFound) {
        return {
          success: false,
          version: "v7-simple",
          blocked: false,
          bridgeDetected: false,
          midClicked: false,
          error: "Search input not found"
        };
      }
      await this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 2e4 }).catch(() => {
      });
      await this.delay(2500 + Math.random() * 1e3);
      const captchaDetected = await this.checkCaptcha();
      if (captchaDetected) {
        const failureLogger = getFailureLogger();
        await failureLogger.logCaptcha({
          taskId: product.taskId,
          slotId: product.slotId,
          keyword: product.keyword || product.productName,
          targetMid: product.nvMid,
          searchUrl: this.page.url(),
          engineVersion: "v7-simple",
          errorMessage: "\uD1B5\uD569\uAC80\uC0C9 CAPTCHA \uAC10\uC9C0"
        });
        return {
          success: false,
          version: "v7-simple",
          blocked: true,
          bridgeDetected: false,
          midClicked: false,
          error: "\uD1B5\uD569\uAC80\uC0C9 CAPTCHA",
          duration: Date.now() - startTime
        };
      }
      for (let s = 0; s < 3; s++) {
        await this.page.evaluate(() => window.scrollBy(0, 400));
        await this.delay(500);
      }
      let clicked = await this.clickDirectSmartStore(product.nvMid);
      console.log(`[v7-simple] clickDirectSmartStore: ${clicked}`);
      if (!clicked) {
        clicked = await this.findAndClickMid(product.nvMid);
        console.log(`[v7-simple] findAndClickMid: ${clicked}`);
      }
      let usedFallback = false;
      if (!clicked) {
        console.log("[v7-simple] 1\uCC28 \uC2DC\uB3C4 \uC2E4\uD328 \u2192 Fallback \uC804\uB7B5 \uC2DC\uC791");
        clicked = await this.tryShoppingTabFallback(product);
        usedFallback = true;
        console.log(`[v7-simple] Fallback result: ${clicked}`);
      }
      if (!clicked) {
        const { mids: foundMids, count: foundCount } = await this.collectFoundMids();
        const failureLogger = getFailureLogger();
        await failureLogger.logMidNotFound({
          taskId: product.taskId,
          slotId: product.slotId,
          keyword: product.keyword || product.productName,
          targetMid: product.nvMid,
          searchUrl: this.page.url(),
          foundMids,
          foundCount,
          engineVersion: "v7-simple"
        });
        return {
          success: false,
          version: "v7-simple",
          blocked: false,
          bridgeDetected: false,
          midClicked: false,
          error: `MID ${product.nvMid} not found (both strategies failed)`,
          duration: Date.now() - startTime,
          foundMids,
          foundCount
        };
      }
      if (!usedFallback) {
        try {
          await this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 1e4 });
        } catch {
        }
        await this.delay(3e3);
        let finalUrl2 = this.page.url();
        console.log(`[v7-simple] Current URL after navigation: ${finalUrl2.substring(0, 100)}`);
        if (this.isBridgeUrl(finalUrl2)) {
          console.log("[v7-simple] Bridge URL detected, waiting for redirect...");
          for (let i = 0; i < 10; i++) {
            await this.delay(1e3);
            finalUrl2 = this.page.url();
            if (!this.isBridgeUrl(finalUrl2)) {
              console.log(`[v7-simple] Redirect completed to: ${finalUrl2.substring(0, 80)}`);
              break;
            }
          }
        }
      }
      await this.delay(1e3);
      const finalUrl = this.page.url();
      console.log(`[v7-simple] Final URL for validation: ${finalUrl.substring(0, 100)}`);
      const isProduct = finalUrl.includes("/catalog/") || finalUrl.includes("/products/") || finalUrl.includes("smartstore.naver.com") || finalUrl.includes("brand.naver.com");
      if (!isProduct) {
        return {
          success: false,
          version: "v7-simple",
          blocked: false,
          bridgeDetected: false,
          midClicked: true,
          error: "Not a product page",
          duration: Date.now() - startTime
        };
      }
      const midVerification = await this.page.evaluate((targetMid) => {
        const url = window.location.href;
        if (url.includes(targetMid)) return { found: true, method: "URL", url };
        const elements = document.querySelectorAll("[data-nv-mid], [data-nvmid], [data-product-id]");
        for (const el of Array.from(elements)) {
          const mid = el.getAttribute("data-nv-mid") || el.getAttribute("data-nvmid") || el.getAttribute("data-product-id");
          if (mid === targetMid) return { found: true, method: "data-attr", url };
        }
        const metaTags = document.querySelectorAll('meta[property*="product"], meta[name*="product"]');
        for (const meta of Array.from(metaTags)) {
          const content = meta.getAttribute("content") || "";
          if (content.includes(targetMid)) return { found: true, method: "meta", url };
        }
        const bodyText = document.body.innerText;
        const isBlocked2 = bodyText.includes("\uBCF4\uC548 \uD655\uC778") || bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C") || bodyText.includes("\uBE44\uC815\uC0C1\uC801\uC778 \uC811\uADFC");
        return { found: false, url, bodyPreview: bodyText.substring(0, 200), isBlocked: isBlocked2 };
      }, product.nvMid);
      const midVerified = midVerification.found;
      if (midVerification.isBlocked) {
        const failureLogger = getFailureLogger();
        await failureLogger.logBlocked({
          taskId: product.taskId,
          slotId: product.slotId,
          keyword: product.keyword || product.productName,
          targetMid: product.nvMid,
          searchUrl: this.page.url(),
          engineVersion: "v7-simple",
          errorMessage: `Blocked after click - ${midVerification.bodyPreview?.substring(0, 100)}`
        });
        return {
          success: false,
          version: "v7-simple",
          blocked: true,
          bridgeDetected: false,
          midClicked: true,
          error: `Blocked after click - ${midVerification.bodyPreview?.substring(0, 50)}`,
          duration: Date.now() - startTime
        };
      }
      if (!midVerified) {
        console.log(`[v7-simple] WARNING: MID mismatch - expected ${product.nvMid}, got ${midVerification.url?.substring(0, 80)}`);
      }
      await this.delay(2e3);
      return {
        success: true,
        version: "v7-simple",
        blocked: false,
        bridgeDetected: false,
        midClicked: true,
        duration: Date.now() - startTime
      };
    } catch (e) {
      return {
        success: false,
        version: "v7-simple",
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: e.message,
        duration: Date.now() - startTime
      };
    }
  }
  async checkCaptcha() {
    try {
      return await this.page.evaluate(() => {
        const bodyText = document.body.innerText;
        const blockPatterns = [
          "\uBCF4\uC548 \uD655\uC778",
          "\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C",
          "\uBCF4\uC548 \uD655\uC778\uC744 \uC644\uB8CC\uD574 \uC8FC\uC138\uC694",
          "\uC1FC\uD551 \uC11C\uBE44\uC2A4 \uC811\uC18D\uC774 \uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C",
          "\uC2E4\uC81C \uC0AC\uC6A9\uC790\uC784\uC744 \uD655\uC778",
          "\uC790\uB3D9\uC785\uB825 \uBC29\uC9C0",
          "\uBCF4\uC548\uBB38\uC790",
          "\uC790\uB3D9\uB4F1\uB85D\uBC29\uC9C0",
          "\uBE44\uC815\uC0C1\uC801\uC778 \uC811\uADFC"
        ];
        for (const pattern of blockPatterns) {
          if (bodyText.includes(pattern)) return true;
        }
        if (document.querySelector('[id*="captcha"], [class*="captcha"]')) {
          return true;
        }
        return false;
      });
    } catch {
      return false;
    }
  }
  async clickDirectSmartStore(mid) {
    return await this.page.evaluate((targetMid) => {
      const links = Array.from(document.querySelectorAll("a"));
      for (const link of links) {
        const href = link.href || "";
        if (href.includes("/bridge") || href.includes("cr.shopping") || href.includes("cr2.shopping") || href.includes("cr3.shopping") || href.includes("cr4.shopping")) {
          continue;
        }
        if (href.includes("smartstore.naver.com") && href.includes("/products/")) {
          if (href.includes(targetMid)) {
            link.click();
            return true;
          }
        }
        if (href.includes("brand.naver.com") && href.includes("/products/")) {
          if (href.includes(targetMid)) {
            link.click();
            return true;
          }
        }
      }
      return false;
    }, mid);
  }
  async findAndClickMid(mid) {
    const midLink = await this.page.evaluate((targetMid) => {
      const links = Array.from(document.querySelectorAll("a"));
      for (const link of links) {
        const href = link.href || "";
        if (href.includes(targetMid) || href.includes(`nvMid=${targetMid}`)) {
          return { found: true, href };
        }
        const dataMid = link.getAttribute("data-nv-mid") || link.getAttribute("data-nvmid");
        if (dataMid === targetMid) {
          return { found: true, href };
        }
      }
      return { found: false };
    }, mid);
    console.log(`[v7-simple] findAndClickMid result:`, midLink);
    if (!midLink.found) return false;
    if (this.isBridgeUrl(midLink.href)) {
      console.log(`[v7-simple] Bridge URL \uAC10\uC9C0, \uC9C1\uC811 \uD074\uB9AD (\uB9AC\uB2E4\uC774\uB809\uD2B8 \uB300\uAE30)`);
    }
    await this.page.evaluate((href) => {
      const link = Array.from(document.querySelectorAll("a")).find((a) => a.href === href);
      if (link) link.click();
    }, midLink.href);
    return true;
  }
  /**
   * Catalog URL로 DOM 조작을 통해 이동 (Bridge URL 우회)
   */
  async navigateViaCatalogUrl(mid) {
    const catalogUrl = `https://search.shopping.naver.com/catalog/${mid}`;
    const navigated = await this.page.evaluate((url) => {
      try {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_self";
        document.body.appendChild(link);
        link.click();
        return true;
      } catch (e) {
        return false;
      }
    }, catalogUrl);
    if (navigated) {
      console.log(`[v7-simple] \u2705 Catalog URL\uB85C \uC774\uB3D9: ${catalogUrl}`);
      await this.delay(3e3);
    }
    return navigated;
  }
  isBridgeUrl(url) {
    return BRIDGE_PATTERNS.some((pattern) => url.includes(pattern));
  }
  async avoidBridgeAndRetry(mid) {
    const MAX_RETRY = 3;
    for (let i = 0; i < MAX_RETRY; i++) {
      await this.delay(800);
      const url = this.page.url();
      if (this.isBridgeUrl(url)) {
        console.log(`[v7-simple] \uBE0C\uB9BF\uC9C0 \uAC10\uC9C0 (${i + 1}/${MAX_RETRY})`);
        await this.page.evaluate(() => window.stop());
        try {
          await this.page.goBack({ waitUntil: "domcontentloaded" });
        } catch {
        }
        await this.delay(1e3);
        const direct = await this.clickDirectSmartStore(mid);
        if (direct) {
          await this.delay(1500);
          const newUrl = this.page.url();
          if (!this.isBridgeUrl(newUrl)) {
            return { success: true, detected: true };
          }
        }
        const fallback = await this.findAndClickMid(mid);
        if (fallback) {
          await this.delay(1500);
        }
      } else {
        return { success: true, detected: false };
      }
    }
    return { success: false, detected: true };
  }
  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  /**
   * 검색 결과에서 발견된 MID 목록 수집 (실패 분석용)
   */
  async collectFoundMids() {
    if (!this.page) return { mids: [], count: 0 };
    try {
      return await this.page.evaluate(() => {
        const mids = [];
        const links = Array.from(document.querySelectorAll("a"));
        for (const link of links) {
          const href = link.href || "";
          const productMatch = href.match(/products\/(\d+)/);
          if (productMatch && !mids.includes(productMatch[1])) {
            mids.push(productMatch[1]);
          }
          const catalogMatch = href.match(/catalog\/(\d+)/);
          if (catalogMatch && !mids.includes(catalogMatch[1])) {
            mids.push(catalogMatch[1]);
          }
          const dataMid = link.getAttribute("data-nv-mid");
          if (dataMid && !mids.includes(dataMid)) {
            mids.push(dataMid);
          }
          const dataNvMid = link.getAttribute("data-nvmid");
          if (dataNvMid && !mids.includes(dataNvMid)) {
            mids.push(dataNvMid);
          }
        }
        return {
          mids: mids.slice(0, 20),
          // 최대 20개
          count: mids.length
        };
      });
    } catch (error) {
      console.error("[v7-simple] collectFoundMids error:", error);
      return { mids: [], count: 0 };
    }
  }
  /**
   * 쇼핑 탭 Fallback 전략
   * - 메인 키워드 검색
   * - 여러 페이지 스캔 (1-5페이지)
   * - MID 발견 시 클릭
   */
  /**
   * 쇼핑 탭 Fallback 전략 (순위 체크 로직 재사용)
   * - findAccurateRank()로 MID가 몇 페이지에 있는지 찾기
   * - 해당 페이지로 이동
   * - MID 클릭 → 상세페이지 진입
   */
  async tryShoppingTabFallback(product) {
    if (!this.page) return false;
    try {
      console.log("[v7-simple] Fallback: \uC21C\uC704 \uCCB4\uD06C \uC2DC\uC2A4\uD15C\uC73C\uB85C MID \uAC80\uC0C9");
      const rankResult = await findAccurateRank(
        this.page,
        product.keyword,
        product.nvMid,
        10
        // 최대 10페이지 스캔
      );
      if (!rankResult || !rankResult.found) {
        console.log(`[v7-simple] MID ${product.nvMid} not found in shopping tab (10 pages)`);
        return false;
      }
      console.log(`[v7-simple] MID found: Page ${rankResult.page}, Rank ${rankResult.totalRank}`);
      console.log(`[v7-simple] Already on page ${rankResult.page}, attempting to click MID...`);
      await this.delay(2e3);
      console.log(`[v7-simple] Creating catalog link for MID ${product.nvMid}...`);
      const catalogUrl = `https://search.shopping.naver.com/catalog/${product.nvMid}`;
      const navigated = await this.page.evaluate((url) => {
        try {
          const link = document.createElement("a");
          link.href = url;
          link.target = "_self";
          document.body.appendChild(link);
          link.click();
          return true;
        } catch (e) {
          return false;
        }
      }, catalogUrl);
      if (!navigated) {
        console.log(`[v7-simple] Failed to create/click catalog link`);
        return false;
      }
      console.log(`[v7-simple] \u2705 Catalog link clicked, waiting for navigation...`);
      await this.delay(4e3);
      const currentUrl = this.page.url();
      console.log(`[v7-simple] \u2705 Fallback success: Final URL: ${currentUrl.substring(0, 80)}`);
      return true;
    } catch (error) {
      console.log(`[v7-simple] Fallback error: ${error.message}`);
      return false;
    }
  }
};

// server/services/traffic/engines/TrafficEngineV8Simple.ts
var import_puppeteer_real_browser2 = require("puppeteer-real-browser");

// server/services/traffic/shared/fingerprint/ProfileApplier.ts
var ProfileApplier = class {
  /**
   * 브라우저 연결 옵션에 프로필 User-Agent 추가
   */
  static getConnectArgs(profile14) {
    return [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
      `--user-agent=${profile14.userAgent}`
    ];
  }
  /**
   * 페이지에 프로필 적용 (viewport + navigator 속성)
   */
  static async apply(page, profile14) {
    await page.setViewport({
      width: profile14.viewport.width,
      height: profile14.viewport.height,
      deviceScaleFactor: profile14.viewport.deviceScaleFactor,
      isMobile: true,
      hasTouch: true
    });
    await page.evaluateOnNewDocument((p) => {
      Object.defineProperty(navigator, "platform", {
        get: () => p.platform
      });
      Object.defineProperty(navigator, "hardwareConcurrency", {
        get: () => p.hardwareConcurrency
      });
      Object.defineProperty(navigator, "deviceMemory", {
        get: () => p.deviceMemory
      });
      Object.defineProperty(navigator, "maxTouchPoints", {
        get: () => p.maxTouchPoints
      });
      Object.defineProperty(navigator, "languages", {
        get: () => p.languages
      });
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(param) {
        if (param === 37445) return p.webgl.vendor;
        if (param === 37446) return p.webgl.renderer;
        return getParameter.call(this, param);
      };
      if (typeof WebGL2RenderingContext !== "undefined") {
        const getParameter2 = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function(param) {
          if (param === 37445) return p.webgl.vendor;
          if (param === 37446) return p.webgl.renderer;
          return getParameter2.call(this, param);
        };
      }
    }, profile14);
  }
};

// server/services/traffic/profiles/v8-iphone-15-pro.json
var v8_iphone_15_pro_default = {
  version: "v8",
  deviceName: "iPhone 15 Pro",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
  viewport: {
    width: 393,
    height: 852,
    deviceScaleFactor: 3
  },
  platform: "iPhone",
  webgl: {
    vendor: "Apple Inc.",
    renderer: "Apple GPU"
  },
  deviceMemory: 8,
  hardwareConcurrency: 6,
  maxTouchPoints: 5,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9",
    "sec-ch-ua": '"Not A(Brand";v="99", "Safari";v="17"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"iOS"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko"],
  colorDepth: 32
};

// server/services/traffic/engines/TrafficEngineV8Simple.ts
var profile = v8_iphone_15_pro_default;
var TrafficEngineV8Simple = class {
  browser = null;
  page = null;
  async init() {
    const { browser, page } = await (0, import_puppeteer_real_browser2.connect)({
      headless: false,
      turnstile: true,
      fingerprint: true,
      args: ProfileApplier.getConnectArgs(profile)
    });
    this.browser = browser;
    this.page = page;
    await ProfileApplier.apply(this.page, profile);
    this.page.setDefaultTimeout(3e4);
    this.page.setDefaultNavigationTimeout(3e4);
    console.log(`[v8-simple] Profile applied: ${profile.deviceName}`);
  }
  async close() {
    try {
      if (this.page) await this.page.close().catch(() => {
      });
      if (this.browser) await this.browser.close().catch(() => {
      });
    } catch {
    }
    this.browser = null;
    this.page = null;
  }
  async execute(product) {
    const startTime = Date.now();
    if (!this.page) {
      return {
        success: false,
        version: "v8-simple",
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: "Browser not initialized"
      };
    }
    try {
      await this.page.goto("https://m.naver.com/", { waitUntil: "domcontentloaded" });
      await this.delay(1500 + Math.random() * 1e3);
      const searchQuery = product.productName.substring(0, 50);
      const searchFound = await this.page.evaluate((searchTerm) => {
        const input = document.querySelector('input[type="search"], input[name="query"]');
        if (input) {
          input.value = searchTerm;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          const form = input.closest("form");
          if (form) {
            form.submit();
            return true;
          }
        }
        return false;
      }, searchQuery);
      if (!searchFound) {
        return {
          success: false,
          version: "v8-simple",
          blocked: false,
          bridgeDetected: false,
          midClicked: false,
          error: "Search input not found"
        };
      }
      await this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 2e4 }).catch(() => {
      });
      await this.delay(2500 + Math.random() * 1e3);
      const captchaDetected = await this.checkCaptcha();
      if (captchaDetected) {
        return {
          success: false,
          version: "v8-simple",
          blocked: true,
          bridgeDetected: false,
          midClicked: false,
          error: "\uD1B5\uD569\uAC80\uC0C9 CAPTCHA",
          duration: Date.now() - startTime
        };
      }
      for (let s = 0; s < 3; s++) {
        await this.page.evaluate(() => window.scrollBy(0, 400));
        await this.delay(500);
      }
      let clicked = await this.clickDirectSmartStore(product.nvMid);
      console.log(`[v8-simple] clickDirectSmartStore: ${clicked}`);
      if (!clicked) {
        clicked = await this.findAndClickMid(product.nvMid);
        console.log(`[v8-simple] findAndClickMid: ${clicked}`);
      }
      if (!clicked) {
        return {
          success: false,
          version: "v8-simple",
          blocked: false,
          bridgeDetected: false,
          midClicked: false,
          error: `MID ${product.nvMid} not found`,
          duration: Date.now() - startTime
        };
      }
      try {
        await this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 1e4 });
      } catch {
      }
      await this.delay(3e3);
      await this.delay(1e3);
      const finalUrl = this.page.url();
      const isProduct = finalUrl.includes("/catalog/") || finalUrl.includes("/products/") || finalUrl.includes("smartstore.naver.com") || finalUrl.includes("brand.naver.com");
      if (!isProduct) {
        return {
          success: false,
          version: "v8-simple",
          blocked: false,
          bridgeDetected: false,
          midClicked: true,
          error: "Not a product page",
          duration: Date.now() - startTime
        };
      }
      const midVerification = await this.page.evaluate((targetMid) => {
        const url = window.location.href;
        if (url.includes(targetMid)) return { found: true, method: "URL", url };
        const elements = document.querySelectorAll("[data-nv-mid], [data-nvmid], [data-product-id]");
        for (const el of Array.from(elements)) {
          const mid = el.getAttribute("data-nv-mid") || el.getAttribute("data-nvmid") || el.getAttribute("data-product-id");
          if (mid === targetMid) return { found: true, method: "data-attr", url };
        }
        const metaTags = document.querySelectorAll('meta[property*="product"], meta[name*="product"]');
        for (const meta of Array.from(metaTags)) {
          const content = meta.getAttribute("content") || "";
          if (content.includes(targetMid)) return { found: true, method: "meta", url };
        }
        const bodyText = document.body.innerText;
        const isBlocked2 = bodyText.includes("\uBCF4\uC548 \uD655\uC778") || bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C") || bodyText.includes("\uBE44\uC815\uC0C1\uC801\uC778 \uC811\uADFC");
        return { found: false, url, bodyPreview: bodyText.substring(0, 200), isBlocked: isBlocked2 };
      }, product.nvMid);
      const midVerified = midVerification.found;
      if (midVerification.isBlocked) {
        return {
          success: false,
          version: "v8-simple",
          blocked: true,
          bridgeDetected: false,
          midClicked: true,
          error: `Blocked after click - ${midVerification.bodyPreview?.substring(0, 50)}`,
          duration: Date.now() - startTime
        };
      }
      if (!midVerified) {
        console.log(`[v8-simple] WARNING: MID mismatch - expected ${product.nvMid}, got ${midVerification.url?.substring(0, 80)}`);
      }
      await this.delay(2e3);
      return {
        success: true,
        version: "v8-simple",
        blocked: false,
        bridgeDetected: false,
        midClicked: true,
        duration: Date.now() - startTime
      };
    } catch (e) {
      return {
        success: false,
        version: "v8-simple",
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: e.message,
        duration: Date.now() - startTime
      };
    }
  }
  async checkCaptcha() {
    try {
      return await this.page.evaluate(() => {
        const bodyText = document.body.innerText;
        const blockPatterns = [
          "\uBCF4\uC548 \uD655\uC778",
          "\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C",
          "\uBCF4\uC548 \uD655\uC778\uC744 \uC644\uB8CC\uD574 \uC8FC\uC138\uC694",
          "\uC1FC\uD551 \uC11C\uBE44\uC2A4 \uC811\uC18D\uC774 \uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C",
          "\uC2E4\uC81C \uC0AC\uC6A9\uC790\uC784\uC744 \uD655\uC778",
          "\uC790\uB3D9\uC785\uB825 \uBC29\uC9C0",
          "\uBCF4\uC548\uBB38\uC790",
          "\uC790\uB3D9\uB4F1\uB85D\uBC29\uC9C0",
          "\uBE44\uC815\uC0C1\uC801\uC778 \uC811\uADFC"
        ];
        for (const pattern of blockPatterns) {
          if (bodyText.includes(pattern)) return true;
        }
        if (document.querySelector('[id*="captcha"], [class*="captcha"]')) {
          return true;
        }
        return false;
      });
    } catch {
      return false;
    }
  }
  async clickDirectSmartStore(mid) {
    return await this.page.evaluate((targetMid) => {
      const links = Array.from(document.querySelectorAll("a"));
      for (const link of links) {
        const href = link.href || "";
        if (href.includes("/bridge") || href.includes("cr.shopping") || href.includes("cr2.shopping") || href.includes("cr3.shopping") || href.includes("cr4.shopping")) {
          continue;
        }
        if (href.includes("smartstore.naver.com") && href.includes("/products/")) {
          if (href.includes(targetMid)) {
            link.click();
            return true;
          }
        }
        if (href.includes("brand.naver.com") && href.includes("/products/")) {
          if (href.includes(targetMid)) {
            link.click();
            return true;
          }
        }
      }
      return false;
    }, mid);
  }
  async findAndClickMid(mid) {
    const midLink = await this.page.evaluate((targetMid) => {
      const links = Array.from(document.querySelectorAll("a"));
      for (const link of links) {
        const href = link.href || "";
        if (href.includes(targetMid) || href.includes(`nvMid=${targetMid}`)) {
          return { found: true, href };
        }
        const dataMid = link.getAttribute("data-nv-mid") || link.getAttribute("data-nvmid");
        if (dataMid === targetMid) {
          return { found: true, href };
        }
      }
      return { found: false };
    }, mid);
    console.log(`[v8-simple] findAndClickMid result:`, midLink);
    if (!midLink.found) return false;
    await this.page.evaluate((href) => {
      const link = Array.from(document.querySelectorAll("a")).find((a) => a.href === href);
      if (link) link.click();
    }, midLink.href);
    return true;
  }
  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
};

// server/services/traffic/engines/TrafficEngineBaseSimple.ts
var import_puppeteer_real_browser3 = require("puppeteer-real-browser");

// server/services/traffic/shared/captcha/ReceiptCaptchaSolver.ts
var import_sdk = __toESM(require("@anthropic-ai/sdk"), 1);
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
      const isReceiptCaptcha = hasReceiptImage && (hasQuestion || hasSecurityCheck);
      const hasRecaptcha = document.querySelector('[class*="recaptcha"], iframe[src*="recaptcha"]') !== null;
      const hasGeneralCaptcha = document.querySelector('[id*="captcha"], [class*="captcha"]') !== null;
      const isCaptcha = isReceiptCaptcha;
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
      'img[src*="captcha"]',
      'img[src*="receipt"]',
      ".captcha_image img",
      ".receipt_image img",
      '[class*="captcha"] img',
      '[class*="receipt"] img',
      // 네이버 영수증 CAPTCHA 특정 셀렉터
      ".security_check img",
      "#captcha_image"
    ];
    for (const selector of selectors) {
      const imageElement = await page.$(selector);
      if (imageElement) {
        try {
          const buffer2 = await imageElement.screenshot({ encoding: "base64" });
          console.log(`[CaptchaSolver] \uC774\uBBF8\uC9C0 \uCEA1\uCC98 \uC131\uACF5: ${selector}`);
          return buffer2;
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
          const buffer2 = await area.screenshot({ encoding: "base64" });
          console.log(`[CaptchaSolver] \uC601\uC5ED \uCEA1\uCC98 \uC131\uACF5: ${selector}`);
          return buffer2;
        } catch {
          continue;
        }
      }
    }
    console.log("[CaptchaSolver] \uC804\uCCB4 \uD398\uC774\uC9C0 \uCEA1\uCC98");
    const buffer = await page.screenshot({ encoding: "base64" });
    return buffer;
  }
  /**
   * Claude Vision API로 답 추출
   */
  async askClaudeVision(imageBase64, question) {
    const prompt = `\uC774 \uC601\uC218\uC99D \uC774\uBBF8\uC9C0\uB97C \uBCF4\uACE0 \uB2E4\uC74C \uC9C8\uBB38\uC5D0 \uB2F5\uD558\uC138\uC694.

\uC9C8\uBB38: ${question}

\uC601\uC218\uC99D\uC5D0\uC11C \uD574\uB2F9 \uC815\uBCF4\uB97C \uCC3E\uC544 [?] \uC704\uCE58\uC5D0 \uB4E4\uC5B4\uAC08 \uB2F5\uB9CC \uC815\uD655\uD788 \uC54C\uB824\uC8FC\uC138\uC694.
- \uC8FC\uC18C \uAD00\uB828 \uC9C8\uBB38\uC774\uBA74: \uD574\uB2F9 \uBC88\uC9C0\uC218\uB098 \uB3C4\uB85C\uBA85 \uBC88\uD638\uB9CC \uB2F5\uD558\uC138\uC694 (\uC608: "794", "123")
- \uC804\uD654\uBC88\uD638 \uAD00\uB828 \uC9C8\uBB38\uC774\uBA74: \uD574\uB2F9 \uC22B\uC790\uB9CC \uB2F5\uD558\uC138\uC694 (\uC608: "1234", "5678")
- \uC0C1\uD638\uBA85 \uAD00\uB828 \uC9C8\uBB38\uC774\uBA74: \uD574\uB2F9 \uD14D\uC2A4\uD2B8\uB9CC \uB2F5\uD558\uC138\uC694

\uB2E4\uB978 \uC124\uBA85 \uC5C6\uC774 \uB2F5\uB9CC \uCD9C\uB825\uD558\uC138\uC694. \uC22B\uC790\uB098 \uD14D\uC2A4\uD2B8\uB9CC \uB2F5\uD558\uC138\uC694.`;
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
        await page.evaluate((sel) => {
          const input = document.querySelector(sel);
          if (input) input.value = "";
        }, selector);
        await page.type(selector, answer, { delay: 80 });
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
    await this.delay(500);
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

// server/services/traffic/engines/TrafficEngineBaseSimple.ts
var BRIDGE_PATTERNS2 = [
  "cr.shopping.naver.com/bridge",
  "cr2.shopping.naver.com/bridge",
  "cr3.shopping.naver.com/bridge",
  "cr4.shopping.naver.com/bridge",
  "shopping.naver.com/bridge",
  "naver.com/v2/bridge",
  "/bridge?"
];
var TrafficEngineBaseSimple = class {
  browser = null;
  page = null;
  captchaSolver;
  constructor() {
    this.captchaSolver = new ReceiptCaptchaSolver();
  }
  async init() {
    const { browser, page } = await (0, import_puppeteer_real_browser3.connect)({
      headless: false,
      turnstile: true
      // fingerprint, args, ProfileApplier 모두 제거 → PRB가 알아서 진짜 브라우저처럼 동작
    });
    this.browser = browser;
    this.page = page;
    await this.page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
      isMobile: false,
      hasTouch: false
    });
    await this.page.evaluateOnNewDocument(() => {
      delete window.cdc_adoQpoasnfa76pfcZLmcfl_Array;
      delete window.cdc_adoQpoasnfa76pfcZLmcfl_Object;
      delete window.cdc_adoQpoasnfa76pfcZLmcfl_Promise;
      Object.defineProperty(window, "outerWidth", { value: 1366, configurable: false });
      Object.defineProperty(window, "outerHeight", { value: 768, configurable: false });
      Object.defineProperty(window, "innerWidth", { value: 1366, configurable: false });
      Object.defineProperty(window, "innerHeight", { value: 768, configurable: false });
      Object.defineProperties(screen, {
        availWidth: { value: 1366, configurable: false },
        availHeight: { value: 728, configurable: false },
        // 윈도우 작업표시줄 고려 -40px
        width: { value: 1366, configurable: false },
        height: { value: 768, configurable: false }
      });
      const realUA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
      Object.defineProperty(navigator, "userAgent", { value: realUA, configurable: false });
      Object.defineProperty(navigator, "platform", { value: "Win32" });
      Object.defineProperty(navigator, "userAgentData", {
        value: {
          brands: [
            { brand: "Google Chrome", version: "130" },
            { brand: "Chromium", version: "130" },
            { brand: "Not=A?Brand", version: "99" }
          ],
          platform: "Windows",
          mobile: false
        },
        configurable: false
      });
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) return "Intel Inc.";
        if (parameter === 37446) return "Intel(R) UHD Graphics 630";
        return getParameter.call(this, parameter);
      };
    });
    this.page.setDefaultTimeout(3e4);
    this.page.setDefaultNavigationTimeout(3e4);
    console.log(`[${this.versionString}] Browser initialized (1366x768 perfect match, no stealth)`);
  }
  async close() {
    try {
      if (this.page) await this.page.close().catch(() => {
      });
      if (this.browser) await this.browser.close().catch(() => {
      });
    } catch {
    }
    this.browser = null;
    this.page = null;
  }
  async execute(product) {
    const startTime = Date.now();
    if (!this.page) {
      return {
        success: false,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: "Browser not initialized"
      };
    }
    try {
      await this.page.goto("https://m.naver.com/", { waitUntil: "domcontentloaded" });
      await this.delay(500);
      const searchQuery = product.productName.substring(0, 50);
      const searchFound = await this.page.evaluate((searchTerm) => {
        const input = document.querySelector('input[type="search"], input[name="query"]');
        if (input) {
          input.value = searchTerm;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          const form = input.closest("form");
          if (form) {
            form.submit();
            return true;
          }
        }
        return false;
      }, searchQuery);
      if (!searchFound) {
        return {
          success: false,
          version: this.versionString,
          blocked: false,
          bridgeDetected: false,
          midClicked: false,
          error: "Search input not found"
        };
      }
      await this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 2e4 }).catch(() => {
      });
      await this.delay(1e3);
      const captchaDetected = await this.checkCaptcha();
      if (captchaDetected) {
        return {
          success: false,
          version: this.versionString,
          blocked: true,
          bridgeDetected: false,
          midClicked: false,
          error: "\uD1B5\uD569\uAC80\uC0C9 CAPTCHA",
          duration: Date.now() - startTime
        };
      }
      for (let s = 0; s < 2; s++) {
        await this.page.evaluate(() => window.scrollBy(0, 400));
        await this.delay(200);
      }
      let clicked = await this.clickDirectSmartStore(product.nvMid);
      console.log(`[${this.versionString}] clickDirectSmartStore: ${clicked}`);
      if (!clicked) {
        clicked = await this.findAndClickMid(product.nvMid);
        console.log(`[${this.versionString}] findAndClickMid: ${clicked}`);
      }
      let usedFallback = false;
      if (!clicked) {
        console.log(`[${this.versionString}] 1\uCC28 \uC2DC\uB3C4 \uC2E4\uD328 \u2192 Fallback \uC804\uB7B5 \uC2DC\uC791`);
        clicked = await this.tryShoppingTabFallback(product);
        usedFallback = true;
        console.log(`[${this.versionString}] Fallback result: ${clicked}`);
      }
      if (!clicked) {
        return {
          success: false,
          version: this.versionString,
          blocked: false,
          bridgeDetected: false,
          midClicked: false,
          error: `MID ${product.nvMid} not found (both strategies failed)`,
          duration: Date.now() - startTime
        };
      }
      if (!usedFallback) {
        try {
          await this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 8e3 });
        } catch {
        }
        await this.delay(1500);
        let finalUrl2 = this.page.url();
        console.log(`[${this.versionString}] Current URL after navigation: ${finalUrl2.substring(0, 100)}`);
        if (this.isBridgeUrl(finalUrl2)) {
          console.log(`[${this.versionString}] Bridge URL detected, waiting for redirect...`);
          for (let i = 0; i < 5; i++) {
            await this.delay(500);
            finalUrl2 = this.page.url();
            if (!this.isBridgeUrl(finalUrl2)) {
              console.log(`[${this.versionString}] Redirect completed to: ${finalUrl2.substring(0, 80)}`);
              break;
            }
          }
        }
      }
      await this.delay(500);
      const finalUrl = this.page.url();
      console.log(`[${this.versionString}] Final URL for validation: ${finalUrl.substring(0, 100)}`);
      const isProduct = finalUrl.includes("/catalog/") || finalUrl.includes("/products/") || finalUrl.includes("smartstore.naver.com") || finalUrl.includes("brand.naver.com");
      if (!isProduct) {
        return {
          success: false,
          version: this.versionString,
          blocked: false,
          bridgeDetected: false,
          midClicked: true,
          error: "Not a product page",
          duration: Date.now() - startTime
        };
      }
      const midVerification = await this.page.evaluate((targetMid) => {
        const url = window.location.href;
        if (url.includes(targetMid)) return { found: true, method: "URL", url };
        const elements = document.querySelectorAll("[data-nv-mid], [data-nvmid], [data-product-id]");
        for (const el of Array.from(elements)) {
          const mid = el.getAttribute("data-nv-mid") || el.getAttribute("data-nvmid") || el.getAttribute("data-product-id");
          if (mid === targetMid) return { found: true, method: "data-attr", url };
        }
        const metaTags = document.querySelectorAll('meta[property*="product"], meta[name*="product"]');
        for (const meta of Array.from(metaTags)) {
          const content = meta.getAttribute("content") || "";
          if (content.includes(targetMid)) return { found: true, method: "meta", url };
        }
        const bodyText = document.body.innerText;
        const isBlocked2 = bodyText.includes("\uBCF4\uC548 \uD655\uC778") || bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C") || bodyText.includes("\uBE44\uC815\uC0C1\uC801\uC778 \uC811\uADFC");
        return { found: false, url, bodyPreview: bodyText.substring(0, 200), isBlocked: isBlocked2 };
      }, product.nvMid);
      if (midVerification.isBlocked) {
        return {
          success: false,
          version: this.versionString,
          blocked: true,
          bridgeDetected: false,
          midClicked: true,
          error: `Blocked after click - ${midVerification.bodyPreview?.substring(0, 50)}`,
          duration: Date.now() - startTime
        };
      }
      if (!midVerification.found) {
        console.log(`[${this.versionString}] WARNING: MID mismatch - expected ${product.nvMid}, got ${midVerification.url?.substring(0, 80)}`);
      }
      await this.delay(2e3);
      return {
        success: true,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: true,
        duration: Date.now() - startTime
      };
    } catch (e) {
      return {
        success: false,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: e.message,
        duration: Date.now() - startTime
      };
    }
  }
  async checkCaptcha() {
    try {
      return await this.page.evaluate(() => {
        const bodyText = document.body.innerText;
        const blockPatterns = [
          "\uBCF4\uC548 \uD655\uC778",
          "\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C",
          "\uBCF4\uC548 \uD655\uC778\uC744 \uC644\uB8CC\uD574 \uC8FC\uC138\uC694",
          "\uC1FC\uD551 \uC11C\uBE44\uC2A4 \uC811\uC18D\uC774 \uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C",
          "\uC2E4\uC81C \uC0AC\uC6A9\uC790\uC784\uC744 \uD655\uC778",
          "\uC790\uB3D9\uC785\uB825 \uBC29\uC9C0",
          "\uBCF4\uC548\uBB38\uC790",
          "\uC790\uB3D9\uB4F1\uB85D\uBC29\uC9C0",
          "\uBE44\uC815\uC0C1\uC801\uC778 \uC811\uADFC"
        ];
        for (const pattern of blockPatterns) {
          if (bodyText.includes(pattern)) return true;
        }
        if (document.querySelector('[id*="captcha"], [class*="captcha"]')) {
          return true;
        }
        return false;
      });
    } catch {
      return false;
    }
  }
  /**
   * CAPTCHA 감지 + 자동 해결 시도
   * @returns true if CAPTCHA was present and solved, false otherwise
   */
  async checkAndSolveCaptcha() {
    if (!this.page) return { hadCaptcha: false, solved: false };
    const hasCaptcha = await this.checkCaptcha();
    if (!hasCaptcha) {
      return { hadCaptcha: false, solved: false };
    }
    console.log(`[${this.versionString}] CAPTCHA \uAC10\uC9C0! \uC790\uB3D9 \uD574\uACB0 \uC2DC\uB3C4...`);
    try {
      const solved = await this.captchaSolver.solve(this.page);
      if (solved) {
        console.log(`[${this.versionString}] CAPTCHA \uD574\uACB0 \uC131\uACF5!`);
        return { hadCaptcha: true, solved: true };
      } else {
        console.log(`[${this.versionString}] CAPTCHA \uD574\uACB0 \uC2E4\uD328`);
        return { hadCaptcha: true, solved: false };
      }
    } catch (error) {
      console.error(`[${this.versionString}] CAPTCHA \uD574\uACB0 \uC911 \uC5D0\uB7EC:`, error);
      return { hadCaptcha: true, solved: false };
    }
  }
  async clickDirectSmartStore(mid) {
    return await this.page.evaluate((targetMid) => {
      const links = Array.from(document.querySelectorAll("a"));
      for (const link of links) {
        const href = link.href || "";
        if (href.includes("/bridge") || href.includes("cr.shopping") || href.includes("cr2.shopping") || href.includes("cr3.shopping") || href.includes("cr4.shopping")) {
          continue;
        }
        if (href.includes("smartstore.naver.com") && href.includes("/products/")) {
          if (href.includes(targetMid)) {
            link.click();
            return true;
          }
        }
        if (href.includes("brand.naver.com") && href.includes("/products/")) {
          if (href.includes(targetMid)) {
            link.click();
            return true;
          }
        }
      }
      return false;
    }, mid);
  }
  async findAndClickMid(mid) {
    const midLink = await this.page.evaluate((targetMid) => {
      const links = Array.from(document.querySelectorAll("a"));
      for (const link of links) {
        const href = link.href || "";
        if (href.includes("/bridge") || href.includes("cr.shopping") || href.includes("cr2.shopping") || href.includes("cr3.shopping") || href.includes("cr4.shopping")) {
          continue;
        }
        if ((href.includes("smartstore.naver.com/") || href.includes("brand.naver.com/")) && href.includes("/products/")) {
          if (href.includes(targetMid)) {
            return { found: true, href, type: "smartstore-direct" };
          }
          const dataMid = link.getAttribute("data-nv-mid") || link.getAttribute("data-nvmid");
          if (dataMid === targetMid) {
            return { found: true, href, type: "smartstore-data" };
          }
        }
      }
      for (const link of links) {
        const href = link.href || "";
        if (href.includes(targetMid) || href.includes(`nvMid=${targetMid}`)) {
          return { found: true, href, type: "mid-in-url" };
        }
        const dataMid = link.getAttribute("data-nv-mid") || link.getAttribute("data-nvmid");
        if (dataMid === targetMid) {
          return { found: true, href, type: "data-attr" };
        }
      }
      return { found: false, href: "", type: "" };
    }, mid);
    console.log(`[${this.versionString}] findAndClickMid result:`, midLink);
    if (!midLink.found) return false;
    const isBridge = this.isBridgeUrl(midLink.href);
    if (isBridge) {
      console.log(`[${this.versionString}] Bridge URL \uAC10\uC9C0 \u2192 \uC9C1\uC811 \uD074\uB9AD (\uD2B8\uB798\uD0B9\uC744 \uC704\uD574)`);
    }
    await this.page.evaluate((href) => {
      const link = Array.from(document.querySelectorAll("a")).find((a) => a.href === href);
      if (link) link.click();
    }, midLink.href);
    if (isBridge) {
      await this.delay(1500);
      const captchaResult = await this.checkAndSolveCaptcha();
      if (captchaResult.hadCaptcha && !captchaResult.solved) {
        console.log(`[${this.versionString}] Bridge URL CAPTCHA \uD574\uACB0 \uC2E4\uD328`);
      }
    }
    return true;
  }
  async navigateViaCatalogUrl(mid) {
    const catalogUrl = `https://search.shopping.naver.com/catalog/${mid}`;
    const navigated = await this.page.evaluate((url) => {
      try {
        const link = document.createElement("a");
        link.href = url;
        link.target = "_self";
        document.body.appendChild(link);
        link.click();
        return true;
      } catch {
        return false;
      }
    }, catalogUrl);
    if (navigated) {
      console.log(`[${this.versionString}] \u2705 Catalog URL\uB85C \uC774\uB3D9: ${catalogUrl}`);
      await this.delay(1500);
    }
    return navigated;
  }
  isBridgeUrl(url) {
    return BRIDGE_PATTERNS2.some((pattern) => url.includes(pattern));
  }
  async tryShoppingTabFallback(product) {
    if (!this.page) return false;
    try {
      console.log(`[${this.versionString}] Fallback: \uC21C\uC704 \uCCB4\uD06C \uC2DC\uC2A4\uD15C\uC73C\uB85C MID \uAC80\uC0C9`);
      const rankResult = await findAccurateRank(
        this.page,
        product.keyword,
        product.nvMid,
        10
      );
      if (!rankResult || !rankResult.found) {
        console.log(`[${this.versionString}] MID ${product.nvMid} not found in shopping tab (10 pages)`);
        return false;
      }
      console.log(`[${this.versionString}] MID found: Page ${rankResult.page}, Rank ${rankResult.totalRank}`);
      await this.delay(2e3);
      const catalogUrl = `https://search.shopping.naver.com/catalog/${product.nvMid}`;
      const navigated = await this.page.evaluate((url) => {
        try {
          const link = document.createElement("a");
          link.href = url;
          link.target = "_self";
          document.body.appendChild(link);
          link.click();
          return true;
        } catch {
          return false;
        }
      }, catalogUrl);
      if (!navigated) {
        console.log(`[${this.versionString}] Failed to create/click catalog link`);
        return false;
      }
      console.log(`[${this.versionString}] \u2705 Catalog link clicked, waiting for navigation...`);
      await this.delay(4e3);
      const currentUrl = this.page.url();
      console.log(`[${this.versionString}] \u2705 Fallback success: Final URL: ${currentUrl.substring(0, 80)}`);
      return true;
    } catch (error) {
      console.log(`[${this.versionString}] Fallback error: ${error.message}`);
      return false;
    }
  }
  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  /**
   * 통검/쇼검 모드 분기 실행
   * - 통검: 통합검색 → smartstore 직접 클릭
   * - 쇼검: 쇼핑탭 → 마우스 클릭 → 새 탭 (봇 탐지 회피)
   */
  async executeFullname(product, mode = "\uD1B5\uAC80") {
    const startTime = Date.now();
    if (!this.page) {
      return {
        success: false,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: "Browser not initialized"
      };
    }
    try {
      const naverUrl = mode === "\uC1FC\uAC80" ? "https://www.naver.com/" : "https://m.naver.com/";
      await this.page.goto(naverUrl, { waitUntil: "domcontentloaded" });
      await this.delay(500);
      const searchQuery = product.productName.substring(0, 50);
      const searchFound = await this.page.evaluate((searchTerm) => {
        const input = document.querySelector('#query, input[type="search"], input[name="query"]');
        if (input) {
          input.value = searchTerm;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          const form = input.closest("form");
          if (form) {
            form.submit();
            return true;
          }
        }
        return false;
      }, searchQuery);
      if (!searchFound) {
        return {
          success: false,
          version: this.versionString,
          blocked: false,
          bridgeDetected: false,
          midClicked: false,
          error: "Search input not found"
        };
      }
      await this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 1e4 }).catch(() => {
      });
      await this.delay(1500);
      const captchaDetected = await this.checkCaptcha();
      if (captchaDetected) {
        return {
          success: false,
          version: this.versionString,
          blocked: true,
          bridgeDetected: false,
          midClicked: false,
          error: "\uD1B5\uD569\uAC80\uC0C9 CAPTCHA",
          duration: Date.now() - startTime
        };
      }
      if (mode === "\uD1B5\uAC80") {
        return await this.executeUnifiedSearchMode(product, startTime);
      } else {
        return await this.executeShoppingTabMode(product, startTime);
      }
    } catch (e) {
      return {
        success: false,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: e.message,
        duration: Date.now() - startTime
      };
    }
  }
  /**
   * 통검 모드: 통합검색 결과에서 smartstore 링크 직접 클릭
   */
  async executeUnifiedSearchMode(product, startTime) {
    if (!this.page) throw new Error("Page not initialized");
    for (let s = 0; s < 2; s++) {
      await this.page.evaluate(() => window.scrollBy(0, 400));
      await this.delay(500);
    }
    let clicked = await this.clickDirectSmartStore(product.nvMid);
    console.log(`[${this.versionString}] \uD1B5\uAC80 clickDirectSmartStore: ${clicked}`);
    if (!clicked) {
      clicked = await this.findAndClickMid(product.nvMid);
      console.log(`[${this.versionString}] \uD1B5\uAC80 findAndClickMid: ${clicked}`);
    }
    if (!clicked) {
      return {
        success: false,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: `MID ${product.nvMid} not found (\uD1B5\uAC80)`,
        duration: Date.now() - startTime
      };
    }
    try {
      await this.page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 1e4 });
    } catch {
    }
    await this.delay(1500);
    let finalUrl = this.page.url();
    if (this.isBridgeUrl(finalUrl)) {
      console.log(`[${this.versionString}] Bridge URL detected, waiting...`);
      for (let i = 0; i < 3; i++) {
        await this.delay(800);
        finalUrl = this.page.url();
        if (!this.isBridgeUrl(finalUrl)) break;
      }
    }
    return await this.validateFinalPage(product.nvMid, startTime);
  }
  /**
   * 쇼검 모드: 새 탭 방식 (실제 사용자 행동 모방, 10초 이내)
   *
   * 흐름: 통합검색 → 쇼핑탭 클릭 (새 탭) → MID 상품 클릭 (새 탭) → 스크롤
   */
  async executeShoppingTabMode(product, startTime) {
    if (!this.page || !this.browser) throw new Error("Browser not initialized");
    const shoppingTab = await this.page.evaluate(() => {
      const links = Array.from(document.querySelectorAll("a"));
      for (const link of links) {
        if ((link.textContent || "").trim() === "\uC1FC\uD551" && link.href.includes("shopping")) {
          const rect = link.getBoundingClientRect();
          return { found: true, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        }
      }
      return { found: false, x: 0, y: 0 };
    });
    if (!shoppingTab.found) {
      return {
        success: false,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: "\uC1FC\uD551\uD0ED not found",
        duration: Date.now() - startTime
      };
    }
    let pagesBefore = (await this.browser.pages()).length;
    console.log(`[${this.versionString}] \uC1FC\uAC80: \uC1FC\uD551\uD0ED \uD074\uB9AD (${Math.round(shoppingTab.x)}, ${Math.round(shoppingTab.y)})`);
    await this.page.mouse.click(shoppingTab.x, shoppingTab.y);
    await this.delay(1500);
    let pages = await this.browser.pages();
    if (pages.length <= pagesBefore) {
      return {
        success: false,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: "\uC1FC\uD551\uD0ED \uC0C8 \uD0ED \uC5C6\uC74C",
        duration: Date.now() - startTime
      };
    }
    const shoppingPage = pages[pages.length - 1];
    await shoppingPage.bringToFront();
    await shoppingPage.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
    await this.delay(1e3);
    console.log(`[${this.versionString}] \uC1FC\uAC80: Shopping URL: ${shoppingPage.url().substring(0, 60)}`);
    const captcha1 = await shoppingPage.evaluate(() => document.body.innerText.includes("\uBCF4\uC548 \uD655\uC778"));
    if (captcha1) {
      await shoppingPage.close();
      return {
        success: false,
        version: this.versionString,
        blocked: true,
        bridgeDetected: false,
        midClicked: false,
        error: "\uC1FC\uD551\uAC80\uC0C9 CAPTCHA",
        duration: Date.now() - startTime
      };
    }
    let midFound = false;
    for (let scroll = 0; scroll < 5 && !midFound; scroll++) {
      const midInfo = await shoppingPage.evaluate((mid) => {
        const links = Array.from(document.querySelectorAll("a"));
        for (const link of links) {
          const href = link.href || "";
          if (href.includes(`nv_mid=${mid}`) || href.includes(mid)) {
            const rect = link.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && rect.top > 0 && rect.top < window.innerHeight) {
              return { found: true, x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, href };
            }
          }
        }
        return { found: false, x: 0, y: 0, href: "" };
      }, product.nvMid);
      if (midInfo.found) {
        console.log(`[${this.versionString}] \uC1FC\uAC80: MID \uBC1C\uACAC! \uD074\uB9AD...`);
        pagesBefore = (await this.browser.pages()).length;
        await shoppingPage.mouse.click(midInfo.x, midInfo.y);
        midFound = true;
      } else {
        await shoppingPage.evaluate(() => window.scrollBy(0, 400));
        await this.delay(200);
      }
    }
    if (!midFound) {
      await shoppingPage.close();
      return {
        success: false,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: `MID not found (\uC1FC\uAC80)`,
        duration: Date.now() - startTime
      };
    }
    await this.delay(1500);
    pages = await this.browser.pages();
    if (pages.length <= pagesBefore) {
      const currentUrl = shoppingPage.url();
      console.log(`[${this.versionString}] \uC1FC\uAC80: \uAC19\uC740 \uD0ED \uC774\uB3D9 - ${currentUrl.substring(0, 60)}`);
      const isProduct = currentUrl.includes("/products/") || currentUrl.includes("smartstore.naver.com");
      if (isProduct) {
        for (let s = 0; s < 3; s++) {
          await shoppingPage.evaluate(() => window.scrollBy(0, 300));
          await this.delay(300);
        }
        return {
          success: true,
          version: this.versionString,
          blocked: false,
          bridgeDetected: false,
          midClicked: true,
          duration: Date.now() - startTime
        };
      }
    }
    const productPage = pages[pages.length - 1];
    await productPage.bringToFront();
    await productPage.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
    await this.delay(1e3);
    const productUrl = productPage.url();
    console.log(`[${this.versionString}] \uC1FC\uAC80: \uC0C1\uD488 \uD398\uC774\uC9C0: ${productUrl.substring(0, 60)}`);
    const status = await productPage.evaluate(() => {
      const bodyText = document.body.innerText;
      const hasError = bodyText.includes("\uC874\uC7AC\uD558\uC9C0 \uC54A\uB294") || bodyText.includes("\uBCF4\uC548 \uD655\uC778") || bodyText.includes("\uD310\uB9E4\uC885\uB8CC") || bodyText.includes("\uC0AD\uC81C\uB41C") || bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C");
      return { hasError, preview: bodyText.substring(0, 200) };
    });
    if (status.hasError) {
      console.log(`[${this.versionString}] \uC1FC\uAC80: \uC624\uB958 - ${status.preview.substring(0, 80)}`);
      await productPage.close();
      await shoppingPage.close();
      return {
        success: false,
        version: this.versionString,
        blocked: status.preview.includes("\uBCF4\uC548") || status.preview.includes("\uC81C\uD55C"),
        bridgeDetected: false,
        midClicked: true,
        error: status.preview.substring(0, 50),
        duration: Date.now() - startTime
      };
    }
    console.log(`[${this.versionString}] \uC1FC\uAC80: \uC2A4\uD06C\uB864...`);
    for (let s = 0; s < 2; s++) {
      await productPage.evaluate(() => window.scrollBy(0, 300));
      await this.delay(200);
    }
    await productPage.close();
    await shoppingPage.close();
    return {
      success: true,
      version: this.versionString,
      blocked: false,
      bridgeDetected: false,
      midClicked: true,
      duration: Date.now() - startTime
    };
  }
  /**
   * 최종 페이지 검증 (공통)
   */
  async validateFinalPage(nvMid, startTime) {
    if (!this.page) throw new Error("Page not initialized");
    await this.delay(300);
    const finalUrl = this.page.url();
    console.log(`[${this.versionString}] Final URL: ${finalUrl.substring(0, 100)}`);
    const isProduct = finalUrl.includes("/catalog/") || finalUrl.includes("/products/") || finalUrl.includes("smartstore.naver.com") || finalUrl.includes("brand.naver.com");
    if (!isProduct) {
      return {
        success: false,
        version: this.versionString,
        blocked: false,
        bridgeDetected: false,
        midClicked: true,
        error: "Not a product page",
        duration: Date.now() - startTime
      };
    }
    const captchaCheck = await this.page.evaluate(() => {
      const bodyText = document.body?.innerText || "";
      const patterns = [
        "\uBCF4\uC548 \uD655\uC778\uC744 \uC644\uB8CC\uD574 \uC8FC\uC138\uC694",
        "\uBCF4\uC548 \uD655\uC778",
        "\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C",
        "\uBE44\uC815\uC0C1\uC801\uC778 \uC811\uADFC",
        "\uC790\uB3D9\uC785\uB825 \uBC29\uC9C0",
        "\uC2E4\uC81C \uC0AC\uC6A9\uC790\uC784\uC744 \uD655\uC778"
      ];
      for (const pattern of patterns) {
        if (bodyText.includes(pattern)) {
          return { blocked: true, pattern, preview: bodyText.substring(0, 200) };
        }
      }
      return { blocked: false, pattern: "", preview: "" };
    });
    if (captchaCheck.blocked) {
      console.log(`[${this.versionString}] CAPTCHA detected: "${captchaCheck.pattern}"`);
      console.log(`[${this.versionString}] Page preview: ${captchaCheck.preview.substring(0, 100)}`);
      console.log(`[${this.versionString}] \uC601\uC218\uC99D CAPTCHA \uC790\uB3D9 \uD574\uACB0 \uC2DC\uB3C4...`);
      try {
        const solved = await this.captchaSolver.solve(this.page);
        if (solved) {
          console.log(`[${this.versionString}] \u2705 CAPTCHA \uD574\uACB0 \uC131\uACF5! \uD398\uC774\uC9C0 \uC7AC\uAC80\uC99D...`);
          await this.delay(2e3);
          const recheck = await this.page.evaluate(() => {
            const bodyText = document.body?.innerText || "";
            return !bodyText.includes("\uBCF4\uC548 \uD655\uC778") && !bodyText.includes("\uC601\uC218\uC99D") && !bodyText.includes("[?]");
          });
          if (recheck) {
            return {
              success: true,
              version: this.versionString,
              blocked: false,
              bridgeDetected: false,
              midClicked: true,
              duration: Date.now() - startTime
            };
          }
        }
        console.log(`[${this.versionString}] CAPTCHA \uD574\uACB0 \uC2E4\uD328`);
      } catch (e) {
        console.log(`[${this.versionString}] CAPTCHA \uD574\uACB0 \uC5D0\uB7EC: ${e.message}`);
      }
      return {
        success: false,
        version: this.versionString,
        blocked: true,
        bridgeDetected: false,
        midClicked: true,
        error: `\uC0C1\uD488\uD398\uC774\uC9C0 CAPTCHA (${captchaCheck.pattern})`,
        duration: Date.now() - startTime
      };
    }
    await this.delay(500);
    return {
      success: true,
      version: this.versionString,
      blocked: false,
      bridgeDetected: false,
      midClicked: true,
      duration: Date.now() - startTime
    };
  }
};

// server/services/traffic/profiles/v9-samsung-s24-ultra.json
var v9_samsung_s24_ultra_default = {
  version: "v9",
  deviceName: "Samsung Galaxy S24 Ultra",
  userAgent: "Mozilla/5.0 (Linux; Android 14; SM-S928N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 412,
    height: 915,
    deviceScaleFactor: 3.5
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "Qualcomm",
    renderer: "Adreno (TM) 750"
  },
  deviceMemory: 12,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV9Simple.ts
var profile2 = v9_samsung_s24_ultra_default;
var TrafficEngineV9Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile2;
  }
  get versionString() {
    return "v9-simple";
  }
};

// server/services/traffic/profiles/v10-xiaomi-13-pro.json
var v10_xiaomi_13_pro_default = {
  version: "v10",
  deviceName: "Xiaomi 13 Pro",
  userAgent: "Mozilla/5.0 (Linux; Android 13; 2210132C) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 412,
    height: 892,
    deviceScaleFactor: 3
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "Qualcomm",
    renderer: "Adreno (TM) 740"
  },
  deviceMemory: 12,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV10Simple.ts
var profile3 = v10_xiaomi_13_pro_default;
var TrafficEngineV10Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile3;
  }
  get versionString() {
    return "v10-simple";
  }
};

// server/services/traffic/profiles/v11-iphone-14-pro-max.json
var v11_iphone_14_pro_max_default = {
  version: "v11",
  deviceName: "iPhone 14 Pro Max",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
  viewport: {
    width: 430,
    height: 932,
    deviceScaleFactor: 3
  },
  platform: "iPhone",
  webgl: {
    vendor: "Apple Inc.",
    renderer: "Apple A16 GPU"
  },
  deviceMemory: 6,
  hardwareConcurrency: 6,
  maxTouchPoints: 5,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9",
    "sec-ch-ua": '"Not A(Brand";v="99", "Safari";v="16"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"iOS"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko"],
  colorDepth: 32
};

// server/services/traffic/engines/TrafficEngineV11Simple.ts
var profile4 = v11_iphone_14_pro_max_default;
var TrafficEngineV11Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile4;
  }
  get versionString() {
    return "v11-simple";
  }
};

// server/services/traffic/profiles/v12-oppo-find-x5-pro.json
var v12_oppo_find_x5_pro_default = {
  version: "v12",
  deviceName: "OPPO Find X5 Pro",
  userAgent: "Mozilla/5.0 (Linux; Android 13; PFEM10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 412,
    height: 919,
    deviceScaleFactor: 3.5
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "Qualcomm",
    renderer: "Adreno (TM) 730"
  },
  deviceMemory: 12,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV12Simple.ts
var profile5 = v12_oppo_find_x5_pro_default;
var TrafficEngineV12Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile5;
  }
  get versionString() {
    return "v12-simple";
  }
};

// server/services/traffic/profiles/v13-google-pixel-8-pro.json
var v13_google_pixel_8_pro_default = {
  version: "v13",
  deviceName: "Google Pixel 8 Pro",
  userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 412,
    height: 915,
    deviceScaleFactor: 2.625
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "Qualcomm",
    renderer: "Adreno (TM) 740"
  },
  deviceMemory: 12,
  hardwareConcurrency: 9,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV13Simple.ts
var profile6 = v13_google_pixel_8_pro_default;
var TrafficEngineV13Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile6;
  }
  get versionString() {
    return "v13-simple";
  }
};

// server/services/traffic/profiles/v14-oneplus-11.json
var v14_oneplus_11_default = {
  version: "v14",
  deviceName: "OnePlus 11",
  userAgent: "Mozilla/5.0 (Linux; Android 13; CPH2449) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 412,
    height: 919,
    deviceScaleFactor: 3.5
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "Qualcomm",
    renderer: "Adreno (TM) 740"
  },
  deviceMemory: 16,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV14Simple.ts
var profile7 = v14_oneplus_11_default;
var TrafficEngineV14Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile7;
  }
  get versionString() {
    return "v14-simple";
  }
};

// server/services/traffic/profiles/v15-vivo-x90-pro.json
var v15_vivo_x90_pro_default = {
  version: "v15",
  deviceName: "Vivo X90 Pro",
  userAgent: "Mozilla/5.0 (Linux; Android 13; V2227A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 412,
    height: 915,
    deviceScaleFactor: 3
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "ARM",
    renderer: "Mali-G715"
  },
  deviceMemory: 12,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV15Simple.ts
var profile8 = v15_vivo_x90_pro_default;
var TrafficEngineV15Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile8;
  }
  get versionString() {
    return "v15-simple";
  }
};

// server/services/traffic/profiles/v16-samsung-z-fold5.json
var v16_samsung_z_fold5_default = {
  version: "v16",
  deviceName: "Samsung Galaxy Z Fold5",
  userAgent: "Mozilla/5.0 (Linux; Android 13; SM-F946N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 344,
    height: 882,
    deviceScaleFactor: 3
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "Qualcomm",
    renderer: "Adreno (TM) 740"
  },
  deviceMemory: 12,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV16Simple.ts
var profile9 = v16_samsung_z_fold5_default;
var TrafficEngineV16Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile9;
  }
  get versionString() {
    return "v16-simple";
  }
};

// server/services/traffic/profiles/v17-iphone-13-pro.json
var v17_iphone_13_pro_default = {
  version: "v17",
  deviceName: "iPhone 13 Pro",
  userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1",
  viewport: {
    width: 390,
    height: 844,
    deviceScaleFactor: 3
  },
  platform: "iPhone",
  webgl: {
    vendor: "Apple Inc.",
    renderer: "Apple A15 GPU"
  },
  deviceMemory: 6,
  hardwareConcurrency: 6,
  maxTouchPoints: 5,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9",
    "sec-ch-ua": '"Not A(Brand";v="99", "Safari";v="15"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"iOS"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko"],
  colorDepth: 32
};

// server/services/traffic/engines/TrafficEngineV17Simple.ts
var profile10 = v17_iphone_13_pro_default;
var TrafficEngineV17Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile10;
  }
  get versionString() {
    return "v17-simple";
  }
};

// server/services/traffic/profiles/v18-asus-rog-phone-7.json
var v18_asus_rog_phone_7_default = {
  version: "v18",
  deviceName: "ASUS ROG Phone 7",
  userAgent: "Mozilla/5.0 (Linux; Android 13; ASUS_AI2205) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 412,
    height: 892,
    deviceScaleFactor: 2.625
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "Qualcomm",
    renderer: "Adreno (TM) 740"
  },
  deviceMemory: 16,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV18Simple.ts
var profile11 = v18_asus_rog_phone_7_default;
var TrafficEngineV18Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile11;
  }
  get versionString() {
    return "v18-simple";
  }
};

// server/services/traffic/profiles/v19-samsung-a54.json
var v19_samsung_a54_default = {
  version: "v19",
  deviceName: "Samsung Galaxy A54",
  userAgent: "Mozilla/5.0 (Linux; Android 13; SM-A546N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 412,
    height: 915,
    deviceScaleFactor: 2.625
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "ARM",
    renderer: "Mali-G68"
  },
  deviceMemory: 8,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV19Simple.ts
var profile12 = v19_samsung_a54_default;
var TrafficEngineV19Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile12;
  }
  get versionString() {
    return "v19-simple";
  }
};

// server/services/traffic/profiles/v20-motorola-edge-40-pro.json
var v20_motorola_edge_40_pro_default = {
  version: "v20",
  deviceName: "Motorola Edge 40 Pro",
  userAgent: "Mozilla/5.0 (Linux; Android 13; motorola edge 40 pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
  viewport: {
    width: 412,
    height: 915,
    deviceScaleFactor: 2.75
  },
  platform: "Linux armv8l",
  webgl: {
    vendor: "Qualcomm",
    renderer: "Adreno (TM) 730"
  },
  deviceMemory: 12,
  hardwareConcurrency: 8,
  maxTouchPoints: 10,
  headers: {
    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-ch-ua": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"'
  },
  timezone: "Asia/Seoul",
  languages: ["ko-KR", "ko", "en-US", "en"],
  colorDepth: 24
};

// server/services/traffic/engines/TrafficEngineV20Simple.ts
var profile13 = v20_motorola_edge_40_pro_default;
var TrafficEngineV20Simple = class extends TrafficEngineBaseSimple {
  get profile() {
    return profile13;
  }
  get versionString() {
    return "v20-simple";
  }
};

// server/services/traffic/shared/browser/BrowserManager.ts
var import_puppeteer_real_browser4 = require("puppeteer-real-browser");
var BrowserManager = class {
  constructor(profile14, userDataDir) {
    this.profile = profile14;
    this.userDataDir = userDataDir;
  }
  browser = null;
  page = null;
  async init() {
    const connectOptions = {
      headless: false,
      turnstile: true,
      fingerprint: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled",
        "--start-maximized"
        // 창 최대화 - screenRatio 정상화
      ]
    };
    if (this.userDataDir) {
      connectOptions.userDataDir = this.userDataDir;
      console.log(`[BrowserManager] Using profile: ${this.userDataDir}`);
    }
    const connection = await (0, import_puppeteer_real_browser4.connect)(connectOptions);
    this.browser = connection.browser;
    this.page = connection.page;
    await this.page.setViewport({ width: 1920, height: 1080 });
    this.page.setDefaultTimeout(3e4);
    this.page.setDefaultNavigationTimeout(3e4);
  }
  getPage() {
    if (!this.page) throw new Error("Browser not initialized");
    return this.page;
  }
  setPage(page) {
    this.page = page;
  }
  getBrowser() {
    if (!this.browser) throw new Error("Browser not initialized");
    return this.browser;
  }
  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
};

// server/services/traffic/shared/browser/NavigationOps.ts
var NavigationOps = class {
  constructor(browserManager) {
    this.browserManager = browserManager;
  }
  async goto(url) {
    const page = this.browserManager.getPage();
    await page.goto(url, { waitUntil: "domcontentloaded" });
  }
  async gotoNaverHome() {
    await this.goto("https://m.naver.com/");
    await this.delay(2e3);
  }
  async delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
};

// server/services/traffic/shared/browser/InputOps.ts
var InputOps = class {
  constructor(browserManager) {
    this.browserManager = browserManager;
  }
  async typeSearch(keyword) {
    const page = this.browserManager.getPage();
    const searchSuccess = await page.evaluate((searchTerm) => {
      const input = document.querySelector('input[type="search"], input[name="query"]');
      if (input) {
        input.value = searchTerm;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        const form = input.closest("form");
        if (form) {
          form.submit();
          return true;
        }
      }
      return false;
    }, keyword);
    if (!searchSuccess) {
      throw new Error("Search input not found");
    }
    try {
      await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 2e4 });
    } catch (error) {
    }
    await this.delay(2500 + Math.random() * 1e3);
  }
  naturalDelay(baseMs) {
    const randomMs = baseMs + Math.random() * 500;
    return new Promise((r) => setTimeout(r, randomMs));
  }
  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
};

// server/services/traffic/shared/detection/BlockDetector.ts
var BlockDetector = class {
  constructor(browserManager) {
    this.browserManager = browserManager;
  }
  async isBlocked() {
    try {
      const page = this.browserManager.getPage();
      const blocked = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        const html = document.documentElement.innerHTML;
        if (bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C")) {
          console.log("[BlockDetector] Detected: \uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C");
          return true;
        }
        if (bodyText.includes("\uC790\uB3D9\uC785\uB825 \uBC29\uC9C0") || bodyText.includes("\uBCF4\uC548\uBB38\uC790") || bodyText.includes("\uC790\uB3D9\uB4F1\uB85D\uBC29\uC9C0") || html.includes("captcha") || html.includes("Captcha") || html.includes("CAPTCHA")) {
          console.log("[BlockDetector] Detected: CAPTCHA");
          return true;
        }
        const captchaElements = [
          document.querySelector('img[src*="captcha"]'),
          document.querySelector('[id*="captcha"]'),
          document.querySelector('[class*="captcha"]'),
          document.querySelector('input[name*="captcha"]')
        ];
        if (captchaElements.some((el) => el !== null)) {
          console.log("[BlockDetector] Detected: CAPTCHA element found");
          return true;
        }
        if (bodyText.includes("\uB85C\uBD07\uC774 \uC544\uB2D9\uB2C8\uB2E4") || bodyText.includes("robot") || bodyText.includes("Robot")) {
          console.log("[BlockDetector] Detected: Robot verification");
          return true;
        }
        return false;
      });
      if (blocked) {
        console.log("[BlockDetector] \u26A0\uFE0F Page is blocked or has CAPTCHA");
      }
      return blocked;
    } catch (error) {
      console.error("[BlockDetector] Error checking block status:", error);
      return false;
    }
  }
};

// server/services/traffic/shared/browser/MidMatcher.ts
var MidMatcher = class {
  constructor(browserManager) {
    this.browserManager = browserManager;
  }
  /**
   * V5 방식: 먼저 스마트스토어 직접 링크 시도 (브릿지 제외)
   */
  async clickDirectSmartStore(mid) {
    const page = this.browserManager.getPage();
    return await page.evaluate((targetMid) => {
      const links = Array.from(document.querySelectorAll("a"));
      for (const link of links) {
        const href = link.href || "";
        if (href.includes("/bridge") || href.includes("cr.shopping") || href.includes("cr2.shopping") || href.includes("cr3.shopping") || href.includes("cr4.shopping")) {
          continue;
        }
        if (href.includes("smartstore.naver.com") && href.includes("/products/")) {
          if (href.includes(targetMid)) {
            console.log(`[MidMatcher] Direct smartstore: ${href.substring(0, 80)}`);
            link.click();
            return true;
          }
        }
        if (href.includes("brand.naver.com") && href.includes("/products/")) {
          if (href.includes(targetMid)) {
            console.log(`[MidMatcher] Direct brand: ${href.substring(0, 80)}`);
            link.click();
            return true;
          }
        }
      }
      return false;
    }, mid);
  }
  /**
   * V5 방식: MID 매칭 (브릿지 포함)
   */
  async clickByMid(mid) {
    const page = this.browserManager.getPage();
    const directClicked = await this.clickDirectSmartStore(mid);
    if (directClicked) {
      console.log(`[MidMatcher] \u2705 Direct link clicked: ${mid}`);
      return true;
    }
    const midLink = await page.evaluate((targetMid) => {
      const links = Array.from(document.querySelectorAll("a"));
      for (const link of links) {
        const href = link.href || "";
        if (href.includes(targetMid) || href.includes(`nvMid=${targetMid}`)) {
          return { found: true, href };
        }
        const dataMid = link.getAttribute("data-nv-mid") || link.getAttribute("data-nvmid");
        if (dataMid === targetMid) {
          return { found: true, href };
        }
      }
      return { found: false };
    }, mid);
    if (!midLink.found) {
      console.warn(`[MidMatcher] \u274C MID not found: ${mid}`);
      return false;
    }
    await page.evaluate((href) => {
      const link = Array.from(document.querySelectorAll("a")).find((a) => a.href === href);
      if (link) {
        console.log(`[MidMatcher] Clicking MID link: ${href.substring(0, 80)}`);
        link.click();
      }
    }, midLink.href);
    console.log(`[MidMatcher] \u2705 MID link clicked: ${mid}`);
    return true;
  }
  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
};

// server/services/traffic/shared/detection/BridgeDetector.ts
var BRIDGE_PATTERNS3 = [
  "cr.shopping.naver.com/bridge",
  "cr2.shopping.naver.com/bridge",
  "cr3.shopping.naver.com/bridge",
  "cr4.shopping.naver.com/bridge",
  "shopping.naver.com/bridge",
  "naver.com/v2/bridge",
  "/bridge?"
];
var BridgeDetector = class {
  constructor(browserManager) {
    this.browserManager = browserManager;
    this.midMatcher = new MidMatcher(browserManager);
  }
  midMatcher;
  isBridgeUrl(url) {
    return BRIDGE_PATTERNS3.some((pattern) => url.includes(pattern));
  }
  /**
   * V5 방식: 브릿지 우회 및 재시도 (최대 3회)
   */
  async avoidIfDetected(mid) {
    const MAX_RETRY = 3;
    const page = this.browserManager.getPage();
    for (let i = 0; i < MAX_RETRY; i++) {
      await this.delay(800);
      const url = page.url();
      if (this.isBridgeUrl(url)) {
        console.log(`[BridgeDetector] \uBE0C\uB9BF\uC9C0 \uAC10\uC9C0 (${i + 1}/${MAX_RETRY}): ${url.substring(0, 50)}...`);
        await page.evaluate(() => {
          window.stop();
        });
        try {
          await page.goBack({ waitUntil: "domcontentloaded" });
        } catch {
        }
        await this.delay(1e3);
        const direct = await this.midMatcher.clickDirectSmartStore(mid);
        if (direct) {
          await this.delay(1500);
          const newUrl = page.url();
          if (!this.isBridgeUrl(newUrl)) {
            console.log(`[BridgeDetector] \u2705 \uBE0C\uB9BF\uC9C0 \uC6B0\uD68C \uC131\uACF5 (\uC9C1\uC811 \uB9C1\uD06C)`);
            return true;
          }
        }
        const fallback = await this.midMatcher.clickByMid(mid);
        if (fallback) {
          await this.delay(1500);
        }
      } else {
        console.log(`[BridgeDetector] \u2705 \uBE0C\uB9BF\uC9C0 \uC5C6\uC74C`);
        return true;
      }
    }
    console.warn(`[BridgeDetector] \u274C \uBE0C\uB9BF\uC9C0 \uC6B0\uD68C \uC2E4\uD328 (${MAX_RETRY}\uD68C \uC2DC\uB3C4)`);
    return false;
  }
  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
};

// server/services/traffic/shared/utils/Logger.ts
var Logger = class {
  constructor(engineVersion) {
    this.engineVersion = engineVersion;
  }
  info(message, data) {
    console.log(`[${this.engineVersion}] ${message}`, data || "");
  }
  warn(message, data) {
    console.warn(`[${this.engineVersion}] ${message}`, data || "");
  }
  error(message, error) {
    console.error(`[${this.engineVersion}] ${message}`, error || "");
  }
  success(message, data) {
    console.log(`[${this.engineVersion}] \u2705 ${message}`, data || "");
  }
};

// server/services/traffic/engines/TrafficEngineBase.ts
var TrafficEngineBase = class {
  constructor(profile14) {
    this.profile = profile14;
    this.browserManager = new BrowserManager(profile14);
    this.navigationOps = new NavigationOps(this.browserManager);
    this.inputOps = new InputOps(this.browserManager);
    this.blockDetector = new BlockDetector(this.browserManager);
    this.bridgeDetector = new BridgeDetector(this.browserManager);
    this.midMatcher = new MidMatcher(this.browserManager);
    this.logger = new Logger(profile14.version);
  }
  browserManager;
  navigationOps;
  inputOps;
  blockDetector;
  bridgeDetector;
  midMatcher;
  logger;
  async init() {
    this.logger.info("Initializing traffic engine");
    await this.browserManager.init();
  }
  async execute(product) {
    this.logger.info(`Executing traffic for ${product.productName}`);
    try {
      const page = this.browserManager.getPage();
      await this.navigationOps.gotoNaverHome();
      this.logger.info("Navigated to Naver home");
      await this.delay(1500 + Math.random() * 1e3);
      await this.inputOps.typeSearch(product.productName);
      this.logger.info(`Searched for: ${product.productName}`);
      await this.delay(2500 + Math.random() * 1e3);
      const blocked = await this.blockDetector.isBlocked();
      if (blocked) {
        this.logger.warn("Traffic blocked by Naver");
        return {
          success: false,
          version: this.profile.version,
          blocked: true,
          bridgeDetected: false,
          midClicked: false,
          error: "Naver blocked traffic"
        };
      }
      this.logger.info("Scrolling search results...");
      for (let i = 0; i < 5; i++) {
        await page.evaluate(() => window.scrollBy(0, 400));
        await this.delay(500);
      }
      const midClicked = await this.midMatcher.clickByMid(product.nvMid);
      if (!midClicked) {
        this.logger.warn("Failed to click MID");
        return {
          success: false,
          version: this.profile.version,
          blocked: false,
          bridgeDetected: false,
          midClicked: false,
          error: "MID not found in search results"
        };
      }
      this.logger.info("MID clicked successfully");
      await this.naturalDelay(1500);
      const currentUrl = page.url();
      const bridgeDetected = this.bridgeDetector.isBridgeUrl(currentUrl);
      if (bridgeDetected) {
        this.logger.warn("Bridge URL detected, avoiding...");
        const avoided = await this.bridgeDetector.avoidIfDetected(product.nvMid);
        if (!avoided) {
          return {
            success: false,
            version: this.profile.version,
            blocked: false,
            bridgeDetected: true,
            midClicked: true,
            error: "Bridge avoidance failed"
          };
        }
      }
      this.logger.info("Dwelling on product page...");
      await this.naturalDelay(5e3);
      this.logger.success("Traffic executed successfully");
      return {
        success: true,
        version: this.profile.version,
        blocked: false,
        bridgeDetected,
        midClicked: true
      };
    } catch (error) {
      this.logger.error("Traffic execution failed", error);
      return {
        success: false,
        version: this.profile.version,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: error.message
      };
    }
  }
  delay(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }
  /**
   * 자연스러운 랜덤 딜레이 (사람처럼)
   */
  naturalDelay(baseMs) {
    const randomMs = baseMs + Math.random() * 1e3;
    return new Promise((r) => setTimeout(r, randomMs));
  }
  /**
   * 네이버 히스토리 쌓기 (trust score 상승)
   * - 뉴스 2개 + 쇼핑탭 1개 방문
   */
  async buildNaverHistory() {
    const page = this.browserManager.getPage();
    this.logger.info("\uD788\uC2A4\uD1A0\uB9AC \uC313\uAE30 \uC2DC\uC791 (\uB274\uC2A4 2\uAC1C + \uC1FC\uD551 1\uAC1C)");
    const newsUrls = [
      "https://news.naver.com/",
      "https://entertain.naver.com/"
    ];
    for (const url of newsUrls) {
      await page.goto(url, { waitUntil: "domcontentloaded" });
      this.logger.info(`\uD788\uC2A4\uD1A0\uB9AC: ${url.substring(8, 30)}...`);
      await this.delay(2e3 + Math.random() * 2e3);
      await page.evaluate(() => window.scrollBy(0, 300 + Math.random() * 200));
      await this.delay(500 + Math.random() * 500);
      await this.microMouseJitter(400 + Math.random() * 200, 300 + Math.random() * 100);
      await this.delay(1e3 + Math.random() * 1e3);
    }
    await page.goto("https://shopping.naver.com/", { waitUntil: "domcontentloaded" });
    this.logger.info("\uD788\uC2A4\uD1A0\uB9AC: shopping.naver.com");
    await this.delay(2e3 + Math.random() * 2e3);
    await page.evaluate(() => window.scrollBy(0, 400 + Math.random() * 200));
    await this.microMouseJitter(350 + Math.random() * 200, 250 + Math.random() * 100);
    await this.delay(1500 + Math.random() * 1e3);
    this.logger.info("\uD788\uC2A4\uD1A0\uB9AC \uC313\uAE30 \uC644\uB8CC");
  }
  /**
   * 실수 행동 삽입 (35% 확률)
   * - bot score 절반 감소 효과
   */
  async mistakeAction(currentX, currentY) {
    const page = this.browserManager.getPage();
    if (Math.random() < 0.35) {
      const offsetX = (Math.random() - 0.5) * 60 + (Math.random() > 0.5 ? 30 : -30);
      const offsetY = (Math.random() - 0.5) * 60 + (Math.random() > 0.5 ? 30 : -30);
      const mistakeX = currentX + offsetX;
      const mistakeY = currentY + offsetY;
      this.logger.info(`\uC2E4\uC218 \uD589\uB3D9: (${Math.round(currentX)}, ${Math.round(currentY)}) \u2192 (${Math.round(mistakeX)}, ${Math.round(mistakeY)})`);
      await this.moveMouseBezier(currentX, currentY, mistakeX, mistakeY);
      await this.delay(300 + Math.random() * 500);
      return { x: mistakeX, y: mistakeY };
    }
    return { x: currentX, y: currentY };
  }
  /**
   * 베지어 곡선 + 흔들림 마우스 이동 (쇼검2 최적화)
   */
  async moveMouseBezier(startX, startY, endX, endY) {
    const page = this.browserManager.getPage();
    const steps = 20 + Math.floor(Math.random() * 10);
    const cp1x = startX + (endX - startX) * 0.3 + (Math.random() - 0.5) * 100;
    const cp1y = startY + (endY - startY) * 0.3 + (Math.random() - 0.5) * 100;
    const cp2x = startX + (endX - startX) * 0.7 + (Math.random() - 0.5) * 100;
    const cp2y = startY + (endY - startY) * 0.7 + (Math.random() - 0.5) * 100;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = Math.pow(1 - t, 3) * startX + 3 * Math.pow(1 - t, 2) * t * cp1x + 3 * (1 - t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * endX;
      const y = Math.pow(1 - t, 3) * startY + 3 * Math.pow(1 - t, 2) * t * cp1y + 3 * (1 - t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * endY;
      const jitterX = x + (Math.random() - 0.5) * (3 + Math.random() * 3);
      const jitterY = y + (Math.random() - 0.5) * (3 + Math.random() * 3);
      await page.mouse.move(jitterX, jitterY);
      await this.delay(10 + Math.random() * 15);
    }
  }
  /**
   * 스크롤 후 미세 마우스 흔들림 (쇼검2 최적화)
   */
  async microMouseJitter(baseX, baseY) {
    const page = this.browserManager.getPage();
    const jitterCount = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < jitterCount; i++) {
      const jitterX = baseX + (Math.random() - 0.5) * 30;
      const jitterY = baseY + (Math.random() - 0.5) * 30;
      await page.mouse.move(jitterX, jitterY);
      await this.delay(50 + Math.random() * 100);
    }
  }
  /**
   * 랜덤 상품 요소 위치 반환 (쇼검2: 상위 10개 중)
   */
  async getRandomProductElement() {
    const page = this.browserManager.getPage();
    return await page.evaluate(() => {
      const products = document.querySelectorAll("[data-shp-contents-id]");
      if (products.length === 0) return null;
      const randomIdx = Math.floor(Math.random() * Math.min(products.length, 10));
      const elem = products[randomIdx];
      const rect = elem.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
        y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 40
      };
    });
  }
  /**
   * 목표 상품 위치 반환 (쇼검2: 좌표 오차 추가)
   */
  async findTargetProductPosition(targetMid) {
    const page = this.browserManager.getPage();
    return await page.evaluate((mid) => {
      const products = document.querySelectorAll("[data-shp-contents-id]");
      for (const elem of products) {
        const catalogMid = elem.getAttribute("data-shp-contents-id");
        if (catalogMid === mid) {
          const rect = elem.getBoundingClientRect();
          const anchor = elem.closest("a") || elem.querySelector("a");
          return {
            x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 40,
            y: rect.top + rect.height / 2 + (Math.random() - 0.5) * 40,
            url: anchor?.href || ""
          };
        }
      }
      return null;
    }, targetMid);
  }
  /**
   * 쇼검2 최적화 시나리오 v3 (Behavior Engine v2.0)
   * CAPTCHA 회피율 95%~99% 목표
   */
  async executeShopping2Scenario(product) {
    const page = this.browserManager.getPage();
    this.logger.info("v3 Step 1: \uCD08\uAE30 \uBA48\uCDA4 1.4~2.4\uCD08");
    await this.delay(1400 + Math.random() * 1e3);
    const startX = 100 + Math.random() * 300;
    const startY = 50 + Math.random() * 50;
    let currentX = 200 + Math.random() * 400;
    let currentY = 150 + Math.random() * 100;
    this.logger.info("v3 Step 2: \uCD08\uAE30 \uB9C8\uC6B0\uC2A4 \uACE1\uC120 \uC774\uB3D9");
    await this.moveMouseBezier(startX, startY, currentX, currentY);
    await this.delay(400 + Math.random() * 500);
    this.logger.info("v3 Step 3: \uC2A4\uD06C\uB864 2~3\uD68C");
    const scroll1 = 180 + Math.floor(Math.random() * 80);
    await page.evaluate((amt) => window.scrollBy(0, amt), scroll1);
    await this.delay(350 + Math.random() * 350);
    const scroll2 = 200 + Math.floor(Math.random() * 130);
    await page.evaluate((amt) => window.scrollBy(0, amt), scroll2);
    await this.delay(500 + Math.random() * 400);
    if (Math.random() < 0.25) {
      const scroll3 = 120 + Math.floor(Math.random() * 100);
      this.logger.info(`v3 Step 3: \uCD94\uAC00 \uC2A4\uD06C\uB864 ${scroll3}px`);
      await page.evaluate((amt) => window.scrollBy(0, amt), scroll3);
      await this.delay(300 + Math.random() * 300);
    }
    const afterMistake = await this.mistakeAction(currentX, currentY);
    currentX = afterMistake.x;
    currentY = afterMistake.y;
    const fakeProduct = await this.getRandomProductElement();
    if (fakeProduct) {
      this.logger.info("v3 Step 5: \uB79C\uB364 \uC0C1\uD488 hover");
      await this.moveMouseBezier(currentX, currentY, fakeProduct.x, fakeProduct.y);
      await this.delay(500 + Math.random() * 600);
      currentX = fakeProduct.x;
      currentY = fakeProduct.y;
    }
    const targetProduct = await this.findTargetProductPosition(product.nvMid);
    if (!targetProduct) {
      this.logger.warn("v3: MID not found");
      return {
        success: false,
        version: this.profile.version,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: "MID not found (v3)"
      };
    }
    this.logger.info("v3 Step 6: \uBAA9\uD45C \uC0C1\uD488\uC73C\uB85C \uC774\uB3D9");
    await this.moveMouseBezier(currentX, currentY, targetProduct.x, targetProduct.y);
    await this.delay(500 + Math.random() * 400);
    const clickX = targetProduct.x + (Math.random() - 0.5) * 50;
    const clickY = targetProduct.y + (Math.random() - 0.5) * 50;
    const clickDelay = 30 + Math.floor(Math.random() * 60);
    this.logger.info(`v3 Step 7: \uD074\uB9AD (${Math.round(clickX)}, ${Math.round(clickY)}) delay=${clickDelay}ms`);
    await page.mouse.click(clickX, clickY, { delay: clickDelay });
    await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15e3 }).catch(() => {
    });
    this.logger.info("v3 Step 8: \uC0C1\uC138\uD398\uC774\uC9C0 \uB300\uAE30");
    await this.delay(900 + Math.random() * 900);
    const detailScrollCount = 2 + Math.floor(Math.random() * 3);
    this.logger.info(`v3 Step 9: \uC0C1\uC138\uD398\uC774\uC9C0 \uC2A4\uD06C\uB864 ${detailScrollCount}\uD68C`);
    for (let i = 0; i < detailScrollCount; i++) {
      const scrollAmt = 220 + Math.floor(Math.random() * 200);
      await page.evaluate((amt) => window.scrollBy(0, amt), scrollAmt);
      await this.delay(400 + Math.random() * 500);
    }
    this.logger.info("v3 Step 10: \uB9C8\uC9C0\uB9C9 \uCCB4\uB958 1.4~2.6\uCD08");
    await this.delay(1400 + Math.random() * 1200);
    this.logger.success("v3 \uC2DC\uB098\uB9AC\uC624 \uC644\uB8CC");
    return {
      success: true,
      version: this.profile.version,
      blocked: false,
      bridgeDetected: false,
      midClicked: true
    };
  }
  /**
   * Fullname 트래픽 실행 (통검/쇼검/쇼검2 통합 - mode 파라미터 기반)
   *
   * 통검: 네이버 메인 → 통합검색 → 상품 클릭 (100% 성공률)
   * 쇼검: 네이버 메인 → 통합검색 → 쇼핑 링크 클릭 → 상품 클릭
   * 쇼검2: 네이버 쇼핑 직접 진입 → 검색 → 상품 클릭
   */
  async executeFullname(product, mode = "\uD1B5\uAC80") {
    this.logger.info(`Executing fullname traffic (${mode}) for ${product.productName}`);
    try {
      let page = this.browserManager.getPage();
      if (mode === "\uC1FC\uAC802") {
        await this.buildNaverHistory();
      }
      await page.goto("https://www.naver.com/", { waitUntil: "domcontentloaded" });
      this.logger.info("Navigated to Naver home (PC)");
      await this.delay(mode === "\uC1FC\uAC80" ? 800 : 1500);
      if (mode === "\uC1FC\uAC802") {
        const storeUrl = await page.evaluate(() => {
          const shoppingIcon = document.querySelector("span.service_icon.type_shopping");
          if (shoppingIcon) {
            const parentLink = shoppingIcon.closest("a");
            if (parentLink && parentLink.href) {
              return parentLink.href;
            }
          }
          const storeLink = document.querySelector('a[href*="shopping.naver.com/ns/home"]');
          if (storeLink) {
            return storeLink.href;
          }
          const links = Array.from(document.querySelectorAll("a"));
          for (const link of links) {
            if (link.innerText.trim() === "\uC2A4\uD1A0\uC5B4" && link.href.includes("shopping")) {
              return link.href;
            }
          }
          return null;
        });
        if (storeUrl) {
          this.logger.info(`Found store URL: ${storeUrl.substring(0, 60)}`);
          const referer = page.url();
          await page.goto(storeUrl, {
            waitUntil: "domcontentloaded",
            timeout: 15e3,
            referer
          });
        } else {
          this.logger.warn("Store button not found, falling back to direct URL");
          await page.goto("https://shopping.naver.com/ns/home", { waitUntil: "domcontentloaded" });
        }
        this.logger.info("\uC1FC\uAC802: \uC2A4\uD1A0\uC5B4 \uD648 \uC0AC\uC804 \uB3D9\uC791 \uC2DC\uC791");
        await this.delay(5e3 + Math.random() * 3e3);
        const startMouseX = 400 + Math.random() * 200;
        const startMouseY = 400 + Math.random() * 100;
        await this.moveMouseBezier(startMouseX, startMouseY, 300 + Math.random() * 200, 150 + Math.random() * 50);
        const homeScroll = 200 + Math.floor(Math.random() * 150);
        await page.evaluate((amt) => window.scrollBy(0, amt), homeScroll);
        this.logger.info(`\uC1FC\uAC802: \uC2A4\uD1A0\uC5B4 \uD648 \uC2A4\uD06C\uB864 ${homeScroll}px`);
        await this.delay(800 + Math.random() * 400);
        await page.evaluate((amt) => window.scrollBy(0, -amt), homeScroll);
        await this.delay(600 + Math.random() * 300);
        await this.microMouseJitter(350 + Math.random() * 100, 100 + Math.random() * 50);
        this.logger.info(`Now at: ${page.url()}`);
      }
      this.logger.info(`Searching fullname (${mode}): ${product.productName.substring(0, 50)}...`);
      let searchSuccess = false;
      if (mode === "\uC1FC\uAC802") {
        const inputSelector = 'input#input_text, input[name="query"]';
        const inputBox = await page.evaluate(() => {
          const input = document.querySelector('input#input_text, input[name="query"]');
          if (input) {
            const rect = input.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
          }
          return null;
        });
        if (!inputBox) {
          return {
            success: false,
            version: this.profile.version,
            blocked: false,
            bridgeDetected: false,
            midClicked: false,
            error: "Shopping search input not found (position)"
          };
        }
        this.logger.info("\uC1FC\uAC802: \uAC80\uC0C9\uCC3D\uC73C\uB85C \uB9C8\uC6B0\uC2A4 \uC774\uB3D9");
        await this.moveMouseBezier(350, 150, inputBox.x, inputBox.y);
        await this.delay(400 + Math.random() * 300);
        try {
          await page.mouse.click(inputBox.x, inputBox.y);
          this.logger.info("\uC1FC\uAC802: \uAC80\uC0C9\uCC3D \uD074\uB9AD");
          await this.delay(500 + Math.random() * 300);
          this.logger.info("\uC1FC\uAC802: \uD0C0\uC774\uD551 \uC2DC\uC791 (\uB290\uB9B0 \uC18D\uB3C4)");
          await page.type(inputSelector, product.productName, { delay: 80 + Math.random() * 70 });
          await this.delay(600 + Math.random() * 400);
          const searchBtnPos = await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll("button"));
            for (const btn of btns) {
              if (btn.className.includes("_searchInput_button_search_") || btn.innerText.trim() === "\uAC80\uC0C9" && btn.type === "button") {
                const rect = btn.getBoundingClientRect();
                return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
              }
            }
            return null;
          });
          if (searchBtnPos) {
            this.logger.info("\uC1FC\uAC802: \uAC80\uC0C9 \uBC84\uD2BC\uC73C\uB85C \uB9C8\uC6B0\uC2A4 \uC774\uB3D9");
            await this.moveMouseBezier(inputBox.x, inputBox.y, searchBtnPos.x, searchBtnPos.y);
            await this.delay(300 + Math.random() * 200);
            await page.mouse.click(searchBtnPos.x, searchBtnPos.y);
            this.logger.info("\uC1FC\uAC802: \uAC80\uC0C9 \uBC84\uD2BC \uD074\uB9AD");
            searchSuccess = true;
          } else {
            this.logger.info("\uC1FC\uAC802: \uAC80\uC0C9 \uBC84\uD2BC \uC5C6\uC74C, Enter \uD0A4 \uC0AC\uC6A9");
            await page.keyboard.press("Enter");
            searchSuccess = true;
          }
        } catch (e) {
          this.logger.warn("Shopping search input click/type failed");
          searchSuccess = false;
        }
        if (!searchSuccess) {
          return {
            success: false,
            version: this.profile.version,
            blocked: false,
            bridgeDetected: false,
            midClicked: false,
            error: "Shopping search input not found"
          };
        }
        await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 15e3 }).catch(() => {
        });
        await this.delay(2500 + Math.random() * 500);
        const blocked = await page.evaluate(() => {
          const bodyText = document.body?.innerText || "";
          return bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C") || bodyText.includes("\uBCF4\uC548 \uD655\uC778\uC744 \uC644\uB8CC\uD574 \uC8FC\uC138\uC694") || bodyText.includes("\uC790\uB3D9\uC785\uB825 \uBC29\uC9C0") || bodyText.includes("\uC601\uC218\uC99D");
        });
        if (blocked) {
          this.logger.warn("Shopping CAPTCHA detected (\uC1FC\uAC802)");
          return {
            success: false,
            version: this.profile.version,
            blocked: true,
            bridgeDetected: false,
            midClicked: false,
            error: "CAPTCHA at shopping search (\uC1FC\uAC802)"
          };
        }
        this.logger.info("\uC1FC\uAC802: \uCD5C\uC801\uD654 \uC2DC\uB098\uB9AC\uC624 \uC2DC\uC791 (12\uB2E8\uACC4)");
        return await this.executeShopping2Scenario(product);
      } else if (mode === "\uD1B5\uAC80") {
        searchSuccess = await page.evaluate((query) => {
          const input = document.querySelector("input.search_input, input#query");
          if (input) {
            input.value = query;
            input.focus();
            input.dispatchEvent(new Event("input", { bubbles: true }));
            const btn = document.querySelector("button.btn_search, button.bt_search");
            if (btn) {
              btn.click();
              return true;
            }
          }
          return false;
        }, product.productName);
      } else {
        searchSuccess = await page.evaluate((query) => {
          const input = document.querySelector("input.search_input, input#query");
          if (input) {
            input.value = query;
            input.focus();
            input.dispatchEvent(new Event("input", { bubbles: true }));
            const btn = document.querySelector("button.btn_search, button.bt_search");
            if (btn) {
              btn.click();
              return true;
            }
          }
          return false;
        }, product.productName);
        if (!searchSuccess) {
          return {
            success: false,
            version: this.profile.version,
            blocked: false,
            bridgeDetected: false,
            midClicked: false,
            error: "Unified search failed"
          };
        }
        await page.waitForNavigation({ waitUntil: "domcontentloaded" }).catch(() => {
        });
        await this.delay(2e3);
        const shoppingUrl = await page.evaluate(() => {
          const links = Array.from(document.querySelectorAll("a"));
          for (const link of links) {
            const href = link.getAttribute("href") || "";
            if (href.includes("search.shopping.naver.com/search")) {
              return href;
            }
          }
          return null;
        });
        if (!shoppingUrl) {
          return {
            success: false,
            version: this.profile.version,
            blocked: false,
            bridgeDetected: false,
            midClicked: false,
            error: "Shopping link not found"
          };
        }
        const unifiedUrl = page.url();
        await page.goto(shoppingUrl, {
          waitUntil: "networkidle0",
          // 네트워크 완전 대기
          timeout: 3e4,
          referer: unifiedUrl
        });
        await this.delay(5e3);
        const shoppingBlocked = await page.evaluate(() => {
          const bodyText = document.body?.innerText || "";
          return bodyText.includes("\uBCF4\uC548 \uD655\uC778\uC744 \uC644\uB8CC\uD574 \uC8FC\uC138\uC694") || bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C") || bodyText.includes("\uC790\uB3D9\uC785\uB825 \uBC29\uC9C0") || bodyText.includes("\uC2E4\uC81C \uC0AC\uC6A9\uC790\uC784\uC744 \uD655\uC778");
        });
        if (shoppingBlocked) {
          this.logger.warn("CAPTCHA detected at shopping search (\uC1FC\uAC80)");
          return {
            success: false,
            version: this.profile.version,
            blocked: true,
            bridgeDetected: false,
            midClicked: false,
            error: "CAPTCHA at shopping search"
          };
        }
        searchSuccess = true;
      }
      if (!searchSuccess) {
        return {
          success: false,
          version: this.profile.version,
          blocked: false,
          bridgeDetected: false,
          midClicked: false,
          error: "Search input not found"
        };
      }
      if (mode === "\uD1B5\uAC80") {
        await page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 2e4 }).catch(() => {
        });
        await this.naturalDelay(2e3);
        const blocked = await page.evaluate(() => {
          const bodyText = document.body?.innerText || "";
          return bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C") || bodyText.includes("\uBCF4\uC548 \uD655\uC778") || bodyText.includes("\uC790\uB3D9\uC785\uB825 \uBC29\uC9C0");
        });
        if (blocked) {
          this.logger.warn("CAPTCHA detected");
          return {
            success: false,
            version: this.profile.version,
            blocked: true,
            bridgeDetected: false,
            midClicked: false,
            error: "CAPTCHA at unified search"
          };
        }
      }
      if (mode === "\uD1B5\uAC80") {
        const { EngineConfigLoader: EngineConfigLoader2 } = await Promise.resolve().then(() => (init_EngineConfigLoader(), EngineConfigLoader_exports));
        const config2 = await EngineConfigLoader2.loadFromFile(this.profile.version);
        const reachPattern = await EngineConfigLoader2.getPatternDefinition(config2.reach);
        this.logger.info(`Pattern: ${config2.reach} + ${config2.dwell}\uCD08`);
        if (reachPattern.scrollBeforeClick) {
          this.logger.info(`B2: Scroll ${reachPattern.scrollAmount}px before click`);
          await page.evaluate((amount) => window.scrollBy(0, amount), reachPattern.scrollAmount);
          await this.delay(reachPattern.scrollDelay);
        } else {
          this.logger.info(`B1: Direct click`);
        }
      } else {
        this.logger.info(`${mode}: Direct click (no pattern)`);
      }
      this.logger.info(`Finding MID ${product.nvMid} in search results...`);
      if (mode === "\uD1B5\uAC80") {
        const productUrl = await page.evaluate((targetMid) => {
          const links = Array.from(document.querySelectorAll("a"));
          for (const link of links) {
            const href = link.href || "";
            if (href.includes(`smartstore.naver.com`) && href.includes(`/products/${targetMid}`)) {
              console.log(`[Found Exact] smartstore: ${href}`);
              return href;
            }
            if (href.includes(`brand.naver.com`) && href.includes(`/products/${targetMid}`)) {
              console.log(`[Found Exact] brand: ${href}`);
              return href;
            }
            if (href.includes(`/catalog/${targetMid}`)) {
              console.log(`[Found Exact] catalog: ${href}`);
              return href;
            }
          }
          for (const link of links) {
            const href = link.href || "";
            const nvMidMatch = href.match(/[?&]nv_mid=(\d+)/i);
            if (nvMidMatch && nvMidMatch[1] === targetMid) {
              console.log(`[Found Exact] nv_mid param: ${href}`);
              return href;
            }
          }
          console.log(`[Strict] Exact MID ${targetMid} not found - NO FALLBACK`);
          console.log(`[Debug] Total links scanned: ${links.length}`);
          return null;
        }, product.nvMid);
        if (!productUrl) {
          this.logger.warn("MID not found in unified search results");
          return {
            success: false,
            version: this.profile.version,
            blocked: false,
            bridgeDetected: false,
            midClicked: false,
            error: "MID not found (\uD1B5\uAC80)"
          };
        }
        this.logger.info(`Found product URL: ${productUrl.substring(0, 60)}...`);
        const currentUrl = page.url();
        await page.goto(productUrl, {
          waitUntil: "domcontentloaded",
          timeout: 15e3,
          referer: currentUrl
        });
        await this.delay(1e3);
      } else {
        const clickResult = await page.evaluate((targetMid) => {
          const elements = document.querySelectorAll("[data-shp-contents-id]");
          for (const elem of elements) {
            const catalogMid = elem.getAttribute("data-shp-contents-id");
            if (catalogMid === targetMid) {
              const anchor = elem.tagName === "A" ? elem : elem.closest("a") || elem.querySelector("a");
              if (anchor) {
                const rect = anchor.getBoundingClientRect();
                return {
                  found: true,
                  x: rect.left + rect.width / 2,
                  y: rect.top + rect.height / 2,
                  href: anchor.href
                };
              }
            }
          }
          const links = Array.from(document.querySelectorAll("a"));
          for (const link of links) {
            const href = link.href || "";
            const nvMidMatch = href.match(/[?&]nv_mid=(\d+)/i);
            if (nvMidMatch && nvMidMatch[1] === targetMid) {
              const rect = link.getBoundingClientRect();
              return {
                found: true,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                href
              };
            }
            if (href.includes(`/products/${targetMid}`) || href.includes(`/catalog/${targetMid}`)) {
              const rect = link.getBoundingClientRect();
              return {
                found: true,
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                href
              };
            }
          }
          return { found: false, x: 0, y: 0, href: "" };
        }, product.nvMid);
        if (!clickResult.found) {
          return {
            success: false,
            version: this.profile.version,
            blocked: false,
            bridgeDetected: false,
            midClicked: false,
            error: `MID not found (${mode})`
          };
        }
        this.logger.info(`Found product URL (\uC1FC\uAC80): ${clickResult.href.substring(0, 60)}...`);
        const browser = page.browser();
        const pagesBefore = (await browser.pages()).length;
        await page.mouse.click(clickResult.x, clickResult.y);
        await this.delay(2e3);
        const pagesAfter = await browser.pages();
        if (pagesAfter.length > pagesBefore) {
          const newPage = pagesAfter[pagesAfter.length - 1];
          await newPage.bringToFront();
          await newPage.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 1e4 }).catch(() => {
          });
          const newUrl = newPage.url();
          const isProductPage2 = newUrl.includes("/catalog/") || newUrl.includes("/products/") || newUrl.includes("smartstore.naver.com") || newUrl.includes("brand.naver.com");
          const newPageBlocked = await newPage.evaluate(() => {
            const bodyText = document.body?.innerText || "";
            return bodyText.includes("\uBCF4\uC548 \uD655\uC778\uC744 \uC644\uB8CC\uD574 \uC8FC\uC138\uC694") || bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C");
          });
          await newPage.close();
          if (newPageBlocked) {
            this.logger.warn("Product page CAPTCHA detected (new tab)");
            return {
              success: false,
              version: this.profile.version,
              blocked: true,
              bridgeDetected: false,
              midClicked: true,
              error: "Product page CAPTCHA (new tab)"
            };
          }
          if (isProductPage2) {
            this.logger.info(`Dwell (\uC1FC\uAC80): 1.0\uCD08`);
            await this.delay(1e3);
            return {
              success: true,
              version: this.profile.version,
              blocked: false,
              bridgeDetected: false,
              midClicked: true
            };
          }
        }
        await this.delay(1e3);
      }
      const productPageBlocked = await page.evaluate(() => {
        const bodyText = document.body?.innerText || "";
        const title = document.title || "";
        if (bodyText.includes("\uBCF4\uC548 \uD655\uC778\uC744 \uC644\uB8CC\uD574 \uC8FC\uC138\uC694")) {
          return true;
        }
        if (title.includes("\uBCF4\uC548 \uD655\uC778")) {
          return true;
        }
        if (bodyText.includes("\uC77C\uC2DC\uC801\uC73C\uB85C \uC81C\uD55C")) {
          return true;
        }
        return false;
      });
      if (productPageBlocked) {
        this.logger.warn("Product page CAPTCHA detected");
        return {
          success: false,
          version: this.profile.version,
          blocked: true,
          bridgeDetected: false,
          midClicked: true,
          error: "Product page CAPTCHA"
        };
      }
      const finalUrl = page.url();
      const isProductPage = finalUrl.includes("/catalog/") || finalUrl.includes("/products/") || finalUrl.includes("smartstore.naver.com") || finalUrl.includes("brand.naver.com");
      if (!isProductPage) {
        return {
          success: false,
          version: this.profile.version,
          blocked: false,
          bridgeDetected: false,
          midClicked: true,
          error: "Not a product page"
        };
      }
      if (mode === "\uD1B5\uAC80") {
        const { EngineConfigLoader: EngineConfigLoader2 } = await Promise.resolve().then(() => (init_EngineConfigLoader(), EngineConfigLoader_exports));
        const config2 = await EngineConfigLoader2.loadFromFile(this.profile.version);
        const dwellMs = config2.dwell * 1e3;
        this.logger.info(`Dwell (\uD1B5\uAC80): ${config2.dwell}\uCD08`);
        await this.delay(dwellMs);
      } else {
        this.logger.info(`Dwell (${mode}): 1.0\uCD08`);
        await this.delay(1e3);
      }
      this.logger.success("Fullname traffic executed successfully");
      return {
        success: true,
        version: this.profile.version,
        blocked: false,
        bridgeDetected: false,
        midClicked: true
      };
    } catch (error) {
      this.logger.error("Fullname traffic execution failed", error);
      return {
        success: false,
        version: this.profile.version,
        blocked: false,
        bridgeDetected: false,
        midClicked: false,
        error: error.message
      };
    }
  }
  async close() {
    this.logger.info("Closing browser");
    await this.browserManager.close();
  }
};

// server/services/traffic/shared/fingerprint/ProfileLoader.ts
var ProfileLoader = class {
  static load(profile14) {
    return profile14;
  }
};

// server/services/traffic/engines/TrafficEngineV7Fullname.ts
var TrafficEngineV7Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v7_samsung_s23_default));
  }
};

// server/services/traffic/engines/TrafficEngineV8Fullname.ts
var TrafficEngineV8Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v8_iphone_15_pro_default));
  }
};

// server/services/traffic/engines/TrafficEngineV9Fullname.ts
var TrafficEngineV9Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v9_samsung_s24_ultra_default));
  }
};

// server/services/traffic/engines/TrafficEngineV10Fullname.ts
var TrafficEngineV10Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v10_xiaomi_13_pro_default));
  }
};

// server/services/traffic/engines/TrafficEngineV11Fullname.ts
var TrafficEngineV11Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v11_iphone_14_pro_max_default));
  }
};

// server/services/traffic/engines/TrafficEngineV12Fullname.ts
var TrafficEngineV12Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v12_oppo_find_x5_pro_default));
  }
};

// server/services/traffic/engines/TrafficEngineV13Fullname.ts
var TrafficEngineV13Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v13_google_pixel_8_pro_default));
  }
};

// server/services/traffic/engines/TrafficEngineV14Fullname.ts
var TrafficEngineV14Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v14_oneplus_11_default));
  }
};

// server/services/traffic/engines/TrafficEngineV15Fullname.ts
var TrafficEngineV15Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v15_vivo_x90_pro_default));
  }
};

// server/services/traffic/engines/TrafficEngineV16Fullname.ts
var TrafficEngineV16Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v16_samsung_z_fold5_default));
  }
};

// server/services/traffic/engines/TrafficEngineV17Fullname.ts
var TrafficEngineV17Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v17_iphone_13_pro_default));
  }
};

// server/services/traffic/engines/TrafficEngineV18Fullname.ts
var TrafficEngineV18Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v18_asus_rog_phone_7_default));
  }
};

// server/services/traffic/engines/TrafficEngineV19Fullname.ts
var TrafficEngineV19Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v19_samsung_a54_default));
  }
};

// server/services/traffic/engines/TrafficEngineV20Fullname.ts
var TrafficEngineV20Fullname = class extends TrafficEngineBase {
  constructor() {
    super(ProfileLoader.load(v20_motorola_edge_40_pro_default));
  }
};

// server/services/traffic/engineRouter.ts
var EngineRouter = class {
  static getEngine(version) {
    switch (version) {
      case "v7":
        return new TrafficEngineV7Simple();
      case "v8":
        return new TrafficEngineV8Simple();
      case "v9":
        return new TrafficEngineV9Simple();
      case "v10":
        return new TrafficEngineV10Simple();
      case "v11":
        return new TrafficEngineV11Simple();
      case "v12":
        return new TrafficEngineV12Simple();
      case "v13":
        return new TrafficEngineV13Simple();
      case "v14":
        return new TrafficEngineV14Simple();
      case "v15":
        return new TrafficEngineV15Simple();
      case "v16":
        return new TrafficEngineV16Simple();
      case "v17":
        return new TrafficEngineV17Simple();
      case "v18":
        return new TrafficEngineV18Simple();
      case "v19":
        return new TrafficEngineV19Simple();
      case "v20":
        return new TrafficEngineV20Simple();
      default:
        throw new Error(`Unknown engine version: ${version}`);
    }
  }
  static getAllVersions() {
    return [
      "v7",
      "v8",
      "v9",
      "v10",
      "v11",
      "v12",
      "v13",
      "v14",
      "v15",
      "v16",
      "v17",
      "v18",
      "v19",
      "v20"
    ];
  }
  static getRandomVersion() {
    const versions = this.getAllVersions();
    return versions[Math.floor(Math.random() * versions.length)];
  }
  /**
   * Fullname 엔진 가져오기 (통합검색 모드)
   */
  static getFullnameEngine(version) {
    switch (version) {
      case "v7":
        return new TrafficEngineV7Fullname();
      case "v8":
        return new TrafficEngineV8Fullname();
      case "v9":
        return new TrafficEngineV9Fullname();
      case "v10":
        return new TrafficEngineV10Fullname();
      case "v11":
        return new TrafficEngineV11Fullname();
      case "v12":
        return new TrafficEngineV12Fullname();
      case "v13":
        return new TrafficEngineV13Fullname();
      case "v14":
        return new TrafficEngineV14Fullname();
      case "v15":
        return new TrafficEngineV15Fullname();
      case "v16":
        return new TrafficEngineV16Fullname();
      case "v17":
        return new TrafficEngineV17Fullname();
      case "v18":
        return new TrafficEngineV18Fullname();
      case "v19":
        return new TrafficEngineV19Fullname();
      case "v20":
        return new TrafficEngineV20Fullname();
      default:
        throw new Error(`Unknown fullname engine version: ${version}`);
    }
  }
  /**
   * 랜덤 Fullname 엔진 가져오기 (프로필 로테이션)
   */
  static getRandomFullnameEngine() {
    const version = this.getRandomVersion();
    return this.getFullnameEngine(version);
  }
};

// server/services/traffic/ipRotation.ts
var import_child_process = require("child_process");
var import_util = require("util");
var execAsync = (0, import_util.promisify)(import_child_process.exec);
var TETHERING_OFF_DELAY = 3e3;
var TETHERING_ON_DELAY = 5e3;
var IP_CHECK_RETRY = 3;
var IP_CHECK_RETRY_DELAY = 2e3;
async function getCurrentIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    try {
      const response = await fetch("https://ifconfig.me/ip");
      return (await response.text()).trim();
    } catch {
      throw new Error("IP \uD655\uC778 \uC2E4\uD328: \uB124\uD2B8\uC6CC\uD06C \uC5F0\uACB0 \uD655\uC778 \uD544\uC694");
    }
  }
}
async function getTetheringAdapter() {
  try {
    try {
      const { stdout: wmicOut } = await execAsync(
        'wmic nic where "NetEnabled=true" get Name,NetConnectionID /format:csv',
        { encoding: "utf8" }
      );
      const tetheringKeywords = [
        "Remote NDIS",
        "USB \uD14C\uB354\uB9C1",
        "USB Tethering",
        "Android USB",
        "RNDIS",
        "iPhone USB",
        "Apple Mobile Device Ethernet",
        "SAMSUNG Mobile",
        "Mobile USB"
      ];
      const lines2 = wmicOut.split("\n").filter((l) => l.trim());
      for (const line of lines2) {
        const lowerLine = line.toLowerCase();
        for (const keyword of tetheringKeywords) {
          if (lowerLine.includes(keyword.toLowerCase())) {
            const parts = line.split(",");
            if (parts.length >= 3) {
              const adapterName = parts[parts.length - 1].trim();
              if (adapterName && adapterName !== "NetConnectionID") {
                console.log(`[IPRotation] \uD14C\uB354\uB9C1 \uC5B4\uB311\uD130 \uAC10\uC9C0 (wmic): ${adapterName}`);
                return adapterName;
              }
            }
          }
        }
      }
    } catch {
    }
    const { stdout } = await execAsync("netsh interface show interface", { encoding: "utf8" });
    const lines = stdout.split("\n");
    for (const line of lines) {
      if (line.includes("\uC5F0\uACB0\uB428") || line.includes("Connected")) {
        const parts = line.trim().split(/\s{2,}/);
        if (parts.length >= 4) {
          const adapterName = parts[parts.length - 1];
          if (adapterName && !adapterName.includes("VMware") && !adapterName.includes("Tailscale") && !adapterName.includes("Loopback")) {
            const match = adapterName.match(/이더넷\s*(\d+)/);
            if (match && parseInt(match[1]) > 10) {
              console.log(`[IPRotation] \uD14C\uB354\uB9C1 \uC5B4\uB311\uD130 \uCD94\uC815: ${adapterName}`);
              return adapterName;
            }
          }
        }
      }
    }
    console.log("[IPRotation] \uD14C\uB354\uB9C1 \uC5B4\uB311\uD130\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC74C");
    console.log("[IPRotation] \uC5F0\uACB0\uB41C \uC5B4\uB311\uD130 \uBAA9\uB85D:");
    console.log(stdout);
    return null;
  } catch (error) {
    console.error(`[IPRotation] \uC5B4\uB311\uD130 \uAC10\uC9C0 \uC2E4\uD328: ${error.message}`);
    return null;
  }
}
async function disableTethering(adapterName) {
  try {
    console.log(`[IPRotation] \uD14C\uB354\uB9C1 \uBE44\uD65C\uC131\uD654: ${adapterName}`);
    await execAsync(`netsh interface set interface "${adapterName}" disable`);
  } catch (error) {
    if (!error.message.includes("already")) {
      throw new Error(`\uD14C\uB354\uB9C1 \uBE44\uD65C\uC131\uD654 \uC2E4\uD328: ${error.message}`);
    }
  }
}
async function enableTethering(adapterName) {
  try {
    console.log(`[IPRotation] \uD14C\uB354\uB9C1 \uD65C\uC131\uD654: ${adapterName}`);
    await execAsync(`netsh interface set interface "${adapterName}" enable`);
  } catch (error) {
    if (!error.message.includes("already")) {
      throw new Error(`\uD14C\uB354\uB9C1 \uD65C\uC131\uD654 \uC2E4\uD328: ${error.message}`);
    }
  }
}
async function rotateIP(adapterName) {
  const adapter = adapterName || await getTetheringAdapter();
  if (!adapter) {
    return {
      success: false,
      oldIP: "",
      newIP: "",
      error: "\uD14C\uB354\uB9C1 \uC5B4\uB311\uD130\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC74C"
    };
  }
  let oldIP;
  try {
    oldIP = await getCurrentIP();
    console.log(`[IPRotation] \uD604\uC7AC IP: ${oldIP}`);
  } catch (error) {
    return {
      success: false,
      oldIP: "",
      newIP: "",
      error: `\uD604\uC7AC IP \uD655\uC778 \uC2E4\uD328: ${error.message}`
    };
  }
  try {
    await disableTethering(adapter);
    console.log(`[IPRotation] ${TETHERING_OFF_DELAY / 1e3}\uCD08 \uB300\uAE30...`);
    await sleep(TETHERING_OFF_DELAY);
  } catch (error) {
    return {
      success: false,
      oldIP,
      newIP: "",
      error: `\uD14C\uB354\uB9C1 \uBE44\uD65C\uC131\uD654 \uC2E4\uD328: ${error.message}`
    };
  }
  try {
    await enableTethering(adapter);
    console.log(`[IPRotation] ${TETHERING_ON_DELAY / 1e3}\uCD08 \uB300\uAE30 (\uC7AC\uC5F0\uACB0)...`);
    await sleep(TETHERING_ON_DELAY);
  } catch (error) {
    return {
      success: false,
      oldIP,
      newIP: "",
      error: `\uD14C\uB354\uB9C1 \uD65C\uC131\uD654 \uC2E4\uD328: ${error.message}`
    };
  }
  let newIP = "";
  for (let i = 0; i < IP_CHECK_RETRY; i++) {
    try {
      newIP = await getCurrentIP();
      break;
    } catch {
      console.log(`[IPRotation] IP \uD655\uC778 \uC7AC\uC2DC\uB3C4 ${i + 1}/${IP_CHECK_RETRY}...`);
      await sleep(IP_CHECK_RETRY_DELAY);
    }
  }
  if (!newIP) {
    return {
      success: false,
      oldIP,
      newIP: "",
      error: "\uC0C8 IP \uD655\uC778 \uC2E4\uD328: \uB124\uD2B8\uC6CC\uD06C \uC7AC\uC5F0\uACB0 \uC2E4\uD328"
    };
  }
  if (oldIP === newIP) {
    console.log(`[IPRotation] \uACBD\uACE0: IP\uAC00 \uBCC0\uACBD\uB418\uC9C0 \uC54A\uC74C (${oldIP})`);
    return {
      success: false,
      oldIP,
      newIP,
      error: "IP\uAC00 \uBCC0\uACBD\uB418\uC9C0 \uC54A\uC74C"
    };
  }
  console.log(`[IPRotation] IP \uBCC0\uACBD \uC131\uACF5: ${oldIP} \u2192 ${newIP}`);
  return {
    success: true,
    oldIP,
    newIP
  };
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function testIPRotation() {
  console.log("========================================");
  console.log("  IP Rotation \uD14C\uC2A4\uD2B8");
  console.log("========================================");
  console.log("\n[1] \uD604\uC7AC IP \uD655\uC778...");
  try {
    const ip = await getCurrentIP();
    console.log(`  \uD604\uC7AC IP: ${ip}`);
  } catch (error) {
    console.error(`  \uC2E4\uD328: ${error.message}`);
    return;
  }
  console.log("\n[2] \uD14C\uB354\uB9C1 \uC5B4\uB311\uD130 \uAC10\uC9C0...");
  const adapter = await getTetheringAdapter();
  if (!adapter) {
    console.error("  \uD14C\uB354\uB9C1 \uC5B4\uB311\uD130\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC74C");
    console.log("  USB \uD14C\uB354\uB9C1\uC774 \uC5F0\uACB0\uB418\uC5B4 \uC788\uB294\uC9C0 \uD655\uC778\uD558\uC138\uC694");
    return;
  }
  console.log(`  \uC5B4\uB311\uD130: ${adapter}`);
  console.log("\n[3] IP \uB85C\uD14C\uC774\uC158 \uC2E4\uD589...");
  const result = await rotateIP(adapter);
  if (result.success) {
    console.log(`  \uC131\uACF5! ${result.oldIP} \u2192 ${result.newIP}`);
  } else {
    console.error(`  \uC2E4\uD328: ${result.error}`);
  }
  console.log("\n========================================");
  console.log("  \uD14C\uC2A4\uD2B8 \uC644\uB8CC");
  console.log("========================================");
}
if (require.main === module) {
  testIPRotation().catch(console.error);
}

// scripts/production/parallel-ip-rotation.ts
dotenv.config();
var NODE_ID = process.env.NODE_ID || `parallel-${import_os.default.hostname()}`;
var PARALLEL_COUNT = parseInt(process.env.PARALLEL_COUNT || "3");
var TETHERING_ADAPTER = process.env.TETHERING_ADAPTER || void 0;
var POLL_INTERVAL = parseInt(process.env.POLL_INTERVAL || "10") * 1e3;
var TASK_TIMEOUT = 60 * 1e3;
var supabase;
function initSupabase() {
  const url = process.env.SUPABASE_PRODUCTION_URL;
  const key = process.env.SUPABASE_PRODUCTION_KEY;
  if (!url || !key) {
    console.error("[ERROR] SUPABASE_PRODUCTION_URL and SUPABASE_PRODUCTION_KEY required");
    process.exit(1);
  }
  return (0, import_supabase_js2.createClient)(url, key);
}
var stats = {
  total: 0,
  success: 0,
  failed: 0,
  captcha: 0,
  ipRotations: 0,
  startTime: /* @__PURE__ */ new Date()
};
var isRunning = true;
var currentAdapter = null;
function log(msg, level = "info") {
  const time = (/* @__PURE__ */ new Date()).toISOString();
  const prefix = { info: "[INFO]", warn: "[WARN]", error: "[ERROR]" }[level];
  console.log(`[${time}] ${prefix} ${msg}`);
}
function sleep2(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function extractMidFromUrl(url) {
  const match = url.match(/products\/(\d+)/);
  return match ? match[1] : "";
}
function printStats() {
  const elapsed = Math.floor((Date.now() - stats.startTime.getTime()) / 1e3 / 60);
  const rate = stats.total > 0 ? (stats.success / stats.total * 100).toFixed(1) : "0";
  log(`Stats: Total=${stats.total} Success=${stats.success}(${rate}%) Failed=${stats.failed} Captcha=${stats.captcha} IPRotations=${stats.ipRotations} Time=${elapsed}min`);
}
async function getNextTasks(count) {
  const validTasks = [];
  const { data: tasks, error } = await supabase.from("traffic_navershopping").select("*").order("id", { ascending: true }).limit(count * 2);
  if (error || !tasks) return [];
  for (const task of tasks) {
    if (validTasks.length >= count) break;
    if (!task.slot_id) {
      await deleteProcessedTraffic(task.id);
      continue;
    }
    const slotInfo = await getSlotProductInfo(task.slot_id);
    if (slotInfo.productName && slotInfo.mid) {
      validTasks.push(task);
    } else {
      log(`Skipping task #${task.id}: missing product_name or mid`, "warn");
      await deleteProcessedTraffic(task.id);
    }
  }
  return validTasks;
}
async function getSlotProductInfo(slotId) {
  const { data } = await supabase.from("slot_naver").select("product_name, mid").eq("id", slotId).single();
  return {
    productName: data?.product_name || null,
    mid: data?.mid || null
  };
}
async function updateSlotResult(slotId, success) {
  const column = success ? "success_count" : "fail_count";
  const { data: current } = await supabase.from("slot_naver").select(column).eq("id", slotId).single();
  const currentValue = current?.[column] || 0;
  await supabase.from("slot_naver").update({ [column]: currentValue + 1 }).eq("id", slotId);
}
async function deleteProcessedTraffic(taskId) {
  await supabase.from("traffic_navershopping").delete().eq("id", taskId);
}
async function getPendingCount() {
  const { count } = await supabase.from("traffic_navershopping").select("*", { count: "exact", head: true });
  return count || 0;
}
async function executeTrafficWithTimeout(task) {
  return new Promise(async (resolve) => {
    const timeout = setTimeout(() => {
      resolve({
        taskId: task.id,
        success: false,
        captcha: false,
        error: "Timeout",
        engineVersion: "unknown",
        productName: task.keyword,
        nvMid: ""
      });
    }, TASK_TIMEOUT);
    try {
      const result = await executeTraffic(task);
      clearTimeout(timeout);
      resolve(result);
    } catch (error) {
      clearTimeout(timeout);
      resolve({
        taskId: task.id,
        success: false,
        captcha: false,
        error: error.message,
        engineVersion: "unknown",
        productName: task.keyword,
        nvMid: ""
      });
    }
  });
}
async function executeTraffic(task) {
  const version = EngineRouter.getRandomVersion();
  let productName = "";
  let nvMid = "";
  try {
    const engine = EngineRouter.getEngine(version);
    if (task.slot_id) {
      const slotInfo = await getSlotProductInfo(task.slot_id);
      if (slotInfo.mid) nvMid = slotInfo.mid;
      if (slotInfo.productName) productName = slotInfo.productName;
    }
    if (!nvMid) {
      nvMid = task.product_id || extractMidFromUrl(task.link_url);
    }
    if (!productName) {
      productName = task.keyword;
    }
    log(`[${task.id}] Executing: ${productName.substring(0, 30)}... (${version})`);
    await engine.init();
    const result = await engine.execute({
      nvMid,
      productName,
      keyword: task.keyword
    });
    await engine.close();
    const isSuccess = result.success && !result.error?.includes("CAPTCHA") && !result.error?.includes("418");
    const isCaptcha = result.error?.includes("CAPTCHA") || false;
    return {
      taskId: task.id,
      success: isSuccess,
      captcha: isCaptcha,
      error: result.error,
      engineVersion: version,
      productName,
      nvMid
    };
  } catch (error) {
    return {
      taskId: task.id,
      success: false,
      captcha: false,
      error: error.message,
      engineVersion: version,
      productName,
      nvMid
    };
  }
}
async function main() {
  log("========================================");
  log("  TURAFIC Parallel IP Rotation Worker");
  log("========================================");
  log(`  Node ID: ${NODE_ID}`);
  log(`  Parallel: ${PARALLEL_COUNT} browsers`);
  log(`  Engine: v7-v20 rotation`);
  log("========================================");
  supabase = initSupabase();
  try {
    const count = await getPendingCount();
    log(`Connected! Pending tasks: ${count}`);
  } catch (error) {
    log(`Connection failed: ${error.message}`, "error");
    process.exit(1);
  }
  log("Detecting tethering adapter...");
  currentAdapter = TETHERING_ADAPTER || await getTetheringAdapter();
  if (!currentAdapter) {
    log("WARNING: No tethering adapter found. IP rotation disabled.", "warn");
    log("Connect USB tethering and restart.", "warn");
  } else {
    log(`Tethering adapter: ${currentAdapter}`);
  }
  try {
    const ip = await getCurrentIP();
    log(`Current IP: ${ip}`);
  } catch {
    log("Could not get current IP", "warn");
  }
  process.on("SIGINT", () => {
    log("Shutdown signal received...");
    isRunning = false;
    printStats();
  });
  while (isRunning) {
    const tasks = await getNextTasks(PARALLEL_COUNT);
    if (tasks.length === 0) {
      const count = await getPendingCount();
      if (count === 0) {
        log("No pending tasks. Waiting...");
      }
      await sleep2(POLL_INTERVAL);
      continue;
    }
    let currentIP = "";
    try {
      currentIP = await getCurrentIP();
      log(`Current IP: ${currentIP}`);
    } catch {
      log("Could not get current IP", "warn");
    }
    log(`========================================`);
    log(`Starting parallel batch: ${tasks.length} tasks`);
    log(`========================================`);
    const startTime = Date.now();
    const results = await Promise.all(
      tasks.map((task) => executeTrafficWithTimeout(task))
    );
    const elapsed = ((Date.now() - startTime) / 1e3).toFixed(1);
    let batchSuccess = 0;
    let batchFailed = 0;
    let batchCaptcha = 0;
    for (const result of results) {
      stats.total++;
      if (result.success) {
        stats.success++;
        batchSuccess++;
      } else {
        stats.failed++;
        batchFailed++;
        if (result.captcha) {
          stats.captcha++;
          batchCaptcha++;
        }
      }
      const task = tasks.find((t) => t.id === result.taskId);
      if (task?.slot_id) {
        try {
          await updateSlotResult(task.slot_id, result.success);
        } catch (e) {
          log(`slot_naver update failed: ${e}`, "warn");
        }
      }
      try {
        await deleteProcessedTraffic(result.taskId);
      } catch (e) {
        log(`traffic delete failed: ${e}`, "warn");
      }
      const status = result.success ? "OK" : result.captcha ? "CAPTCHA" : "FAIL";
      log(`[${result.taskId}] ${status} - ${result.productName.substring(0, 25)}...`);
    }
    log(`----------------------------------------`);
    log(`Batch completed in ${elapsed}s: ${batchSuccess} success, ${batchFailed} failed, ${batchCaptcha} captcha`);
    if (currentAdapter && isRunning) {
      log(`IP rotation starting...`);
      const rotationResult = await rotateIP(currentAdapter);
      if (rotationResult.success) {
        stats.ipRotations++;
        log(`IP changed: ${rotationResult.oldIP} -> ${rotationResult.newIP}`);
      } else {
        log(`IP rotation failed: ${rotationResult.error}`, "warn");
      }
    }
    printStats();
    log(``);
  }
  log("Worker stopped");
  printStats();
}
main().catch((error) => {
  log(`Fatal error: ${error.message}`, "error");
  process.exit(1);
});
