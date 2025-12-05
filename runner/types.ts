/**
 * 공통 타입 정의
 */

export interface Product {
  id: number;
  keyword: string;
  product_name: string;
  mid: string;
}

export interface Profile {
  name: string;
  description: string;
  fingerprint: boolean;
  browser: "prb" | "playwright";
  viewport: {
    width: number;
    height: number;
  };
  locale: string;
  timezone: string;
  headers?: Record<string, string>;
  prb_options?: {
    headless: boolean;
    turnstile: boolean;
  };
}

export interface Behavior {
  scroll_times: number;
  shuffle_keywords: boolean;
  random_delay: [number, number];
}

export interface Preset {
  engine: string;
  profile: string;
  behavior?: string;
  login: boolean;
  repeat?: number;
}

export interface RunContext {
  log: (event: string, data?: any) => void;
  profile: Profile;
  behavior?: Behavior;
  login: boolean;
}

export interface EngineResult {
  success: boolean;
  captchaDetected: boolean;
  midMatched: boolean;
  productPageEntered: boolean;
  duration: number;
  error?: string;
}

export interface TestResult extends EngineResult {
  index: number;
  product: string;
  mid: string;
}
