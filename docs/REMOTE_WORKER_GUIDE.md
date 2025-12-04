# TURAFIC Remote Worker 시스템 가이드

> 원격 PC에서 자동으로 네이버 트래픽을 실행하는 시스템

## 1. 시스템 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                      GitHub Repository                          │
│  (mim1012/turafic_update)                                       │
│                                                                 │
│  ├── auto-updater.ts    # 자동 업데이트 (3분마다 체크)           │
│  ├── unified-runner.ts  # 트래픽 실행 엔진                       │
│  ├── worker-runner.js   # 빌드된 실행 파일                       │
│  ├── version.json       # 버전 정보 (업데이트 트리거)            │
│  └── .env.remote        # 환경변수 템플릿                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ git pull (3분마다)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      원격 PC (1000대)                            │
│                                                                 │
│  C:\turafic-runner\                                             │
│  ├── auto-updater.exe   # 항상 실행 (시작프로그램 등록)          │
│  ├── worker-runner.js   # 자동 다운로드됨                        │
│  ├── .env               # 환경변수 (수동 설정)                   │
│  └── accounts\          # 네이버 로그인 세션 (선택)              │
│      └── user1.json                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Supabase API
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Supabase 데이터베이스                       │
│                                                                 │
│  [Control DB - navertrafictest]                                 │
│  ├── workerNodes          # 워커 등록/상태                       │
│  └── traffic_mode_settings # 모드 설정 (통검/쇼검)               │
│                                                                 │
│  [Production DB - adpang_production]                            │
│  └── slot_naver           # 상품 목록 (keyword, mid, etc.)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. 파일별 역할

### 2.1 auto-updater.ts (자동 업데이트)
```
역할: GitHub에서 새 버전 감지 → worker-runner.js 다운로드 → 재시작

실행 주기: 3분마다 version.json 체크
```

### 2.2 unified-runner.ts (트래픽 엔진)
```
역할: 실제 트래픽 실행 (브라우저 자동화)

주요 기능:
- 워커 등록/하트비트
- 모드별 트래픽 실행 (통검/쇼검)
- CAPTCHA 자동 해결
- MID 검증
```

### 2.3 worker-runner.js (빌드 파일)
```
역할: unified-runner.ts를 esbuild로 번들링한 파일

빌드 명령: npm run build:worker
```

### 2.4 auto-optimizer.ts (PC 최적화)
```
역할: PC 사양에 따라 자동으로 설정 최적화

- CPU 코어 수 → 병렬 브라우저 수
- RAM 크기 → 배치 크기
- 자동 휴식 시간 계산
```

### 2.5 ReceiptCaptchaSolver.ts (CAPTCHA 해결)
```
역할: 네이버 영수증 CAPTCHA 자동 해결

- Claude Vision API로 이미지 분석
- 질문 인식 → 답변 추출
- 사람처럼 타이핑 (랜덤 딜레이)
```

---

## 3. 데이터 플로우

```
┌──────────────────────────────────────────────────────────────────┐
│                        데이터 플로우                              │
└──────────────────────────────────────────────────────────────────┘

[시작]
   │
   ▼
┌─────────────────┐
│ 1. 환경변수 로드  │  .env 파일에서 Supabase 키 로드
└─────────────────┘
   │
   ▼
┌─────────────────┐
│ 2. 워커 등록     │  workerNodes 테이블에 자신 등록
└─────────────────┘   (nodeId, nodeType, status, hostname)
   │
   ▼
┌─────────────────┐
│ 3. 하트비트 시작 │  30초마다 lastHeartbeat 업데이트
└─────────────────┘
   │
   ▼
┌─────────────────┐
│ 4. 모드 조회    │  traffic_mode_settings에서 enabled=true 조회
└─────────────────┘   (통검_로그인, 통검_비로그인, 쇼검_로그인, 쇼검_비로그인)
   │
   ▼
┌─────────────────┐
│ 5. 상품 조회    │  slot_naver에서 mid IS NOT NULL, status='active' 조회
└─────────────────┘
   │
   ▼
┌─────────────────┐
│ 6. 트래픽 실행  │  브라우저 열기 → 검색 → 클릭 → MID 검증
└─────────────────┘
   │
   ├── 성공 → stats.success++
   │
   ├── CAPTCHA → ReceiptCaptchaSolver로 해결 시도
   │
   └── 실패 → stats.failed++
   │
   ▼
┌─────────────────┐
│ 7. 배치 휴식    │  BATCH_REST 시간만큼 대기
└─────────────────┘
   │
   └── → 4단계로 돌아가서 반복
```

---

## 4. 주요 함수 설명

### 4.1 unified-runner.ts

```typescript
// ============ 초기화 ============

initSupabase()
├── Control DB 연결 (navertrafictest) - 워커/모드 관리
└── Production DB 연결 (adpang_production) - 상품 목록

// ============ 워커 관리 ============

registerWorker()
├── workerNodes 테이블에 upsert
├── nodeId: 워커 고유 ID
├── nodeType: "worker"
├── status: "online"
├── lastHeartbeat: 현재 시간
└── hostname: PC 이름

updateHeartbeat()
├── 30초마다 호출
└── lastHeartbeat 업데이트

setWorkerOffline()
└── 종료 시 status를 "offline"으로 변경

// ============ 데이터 조회 ============

fetchEnabledModes(): TrafficMode[]
├── traffic_mode_settings에서 enabled=true 조회
└── 반환: [{ mode_type, enabled, updated_at }]

fetchProducts(): Product[]
├── slot_naver에서 조회
├── 조건: mid IS NOT NULL, status='active'
└── 반환: [{ id, keyword, link_url, mid, product_name }]

// ============ 트래픽 실행 ============

executeTraffic(product, searchMode, account?): boolean
│
├── 1. 브라우저 실행 (Playwright)
│   └── headless: false (실제 브라우저)
│
├── 2. 네이버 메인 접속
│   └── https://www.naver.com/
│
├── 3. 검색어 입력
│   ├── 통검: product_name (상품명 전체)
│   └── 쇼검: keyword (메인 키워드)
│
├── 4. [쇼검만] 쇼핑 탭 클릭
│
├── 5. 스크롤 (3회)
│
├── 6. MID로 상품 찾아 클릭
│   ├── smartstore.naver.com/xxx/products/{mid}
│   └── brand.naver.com/xxx/products/{mid}
│
├── 7. CAPTCHA 감지 시
│   └── ReceiptCaptchaSolver.solve(page)
│
├── 8. MID 검증
│   ├── URL에 mid 포함?
│   └── data-nv-mid 속성 확인
│
└── 9. 결과 반환
    ├── true: 성공 (MID 일치)
    └── false: 실패 (MID 불일치 또는 에러)
```

### 4.2 ReceiptCaptchaSolver.ts

```typescript
solve(page: Page): Promise<boolean>
│
├── 1. CAPTCHA 이미지 요소 찾기
│   └── .captcha_box, #captcha, img[alt*="보안"]
│
├── 2. 이미지 스크린샷
│   └── Buffer → base64 변환
│
├── 3. Claude Vision API 호출
│   ├── 모델: claude-sonnet-4-20250514
│   ├── 이미지: base64 인코딩
│   └── 프롬프트: "영수증에서 질문을 찾고 답을 추출"
│
├── 4. 답변 입력
│   ├── 입력창 찾기: input[type="text"]
│   └── 사람처럼 타이핑 (50-180ms 딜레이)
│
├── 5. 확인 버튼 클릭
│   └── button:has-text("확인")
│
└── 6. 결과 확인
    ├── true: 페이지 변경됨 (성공)
    └── false: 여전히 CAPTCHA 페이지 (실패)
```

### 4.3 auto-optimizer.ts

```typescript
getConfigWithEnvOverride(): AutoConfig
│
├── 시스템 정보 수집
│   ├── CPU 코어 수
│   ├── 총 RAM
│   └── 가용 RAM
│
├── 최적 설정 계산
│   ├── parallelCount: min(코어수/2, RAM/2GB, 4)
│   ├── batchSize: RAM >= 16GB ? 20 : RAM >= 8GB ? 10 : 5
│   ├── batchRestSec: 60-90초 (RAM 기반)
│   └── taskRestSec: 3-8초 (코어 기반)
│
└── 환경변수 오버라이드
    ├── PARALLEL_COUNT
    ├── BATCH_SIZE
    ├── BATCH_REST_SEC
    └── TASK_REST_SEC
```

---

## 5. 환경변수 (.env)

```bash
# 워커 식별자 (각 PC마다 고유하게 설정)
NODE_ID=worker-pc-001

# Control DB (navertrafictest) - 워커 등록, 모드 설정
SUPABASE_CONTROL_URL=https://hdtjkaieulphqwmcjhcx.supabase.co
SUPABASE_CONTROL_KEY=eyJ...

# Production DB (adpang_production) - 상품 목록
SUPABASE_PRODUCTION_URL=https://cwsdvgkjptuvbdtxcejt.supabase.co
SUPABASE_PRODUCTION_KEY=eyJ...

# CAPTCHA 자동 해결 (Claude Vision)
ANTHROPIC_API_KEY=sk-ant-...

# [선택] USB 테더링 어댑터 (IP 로테이션용)
TETHERING_ADAPTER=이더넷 27
```

---

## 6. 데이터베이스 스키마

### 6.1 workerNodes (Control DB)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | integer | PK, 자동증가 |
| nodeId | varchar(50) | 워커 고유 ID (unique) |
| nodeType | enum | "experiment" \| "worker" |
| status | enum | "online" \| "offline" \| "busy" |
| lastHeartbeat | timestamp | 마지막 하트비트 |
| hostname | varchar(100) | PC 호스트명 |
| ipAddress | varchar(50) | IP 주소 |
| createdAt | timestamp | 생성일 |
| updatedAt | timestamp | 수정일 |

### 6.2 traffic_mode_settings (Control DB)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| mode_type | varchar | "tonggum_login", "tonggum_nologin", "shogum_login", "shogum_nologin" |
| enabled | boolean | 활성화 여부 |
| updated_at | timestamp | 수정일 |

### 6.3 slot_naver (Production DB)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | integer | PK |
| keyword | varchar | 검색 키워드 |
| link_url | text | 상품 URL |
| mid | varchar | 네이버 상품 MID |
| product_name | text | 상품명 전체 |
| status | varchar | "active", "paused" 등 |
| current_rank | integer | 현재 순위 |
| traffic_counter | integer | 트래픽 카운터 |

---

## 7. 트러블슈팅

### 7.1 Worker registration failed

```
에러: Could not find the 'xxx' column of 'workerNodes'
해결: unified-runner.ts의 컬럼명이 DB 스키마와 일치하는지 확인
     - node_id (X) → nodeId (O)
     - last_heartbeat (X) → lastHeartbeat (O)
```

### 7.2 Failed to fetch products

```
에러: column xxx does not exist
해결: 올바른 테이블 사용 확인
     - traffic_navershopping (X, mid 컬럼 없음)
     - slot_naver (O, mid 컬럼 있음)
```

### 7.3 import.meta.url undefined

```
에러: TypeError: The "path" argument must be of type string
원인: pkg + ESM 호환 문제
해결:
     1. unified-runner.ts에서 shebang 제거
     2. esbuild에 --format=cjs 추가
     3. import.meta 관련 코드 모두 제거
```

### 7.4 CAPTCHA 해결 실패

```
에러: CAPTCHA 해결 에러: Input should be a valid string
원인: Playwright screenshot이 Buffer 반환
해결: buffer.toString('base64') 사용
```

---

## 8. 배포 절차

### 8.1 코드 수정 시

```bash
# 1. unified-runner.ts 수정

# 2. 빌드
npm run build:worker

# 3. version.json 업데이트 (버전 번호 변경!)
{
  "version": "2025-12-05-003000",  # ← 이거 바꿔야 함
  "hash": "fix-description"
}

# 4. GitHub 푸시
git add unified-runner.ts worker-runner.js version.json
git commit -m "fix: description"
git push origin main

# 5. 원격 PC가 3분 내 자동 업데이트
```

### 8.2 새 PC 설정

```bash
# 1. Node.js 설치 (v18+)

# 2. 폴더 생성
mkdir C:\turafic-runner
cd C:\turafic-runner

# 3. 파일 다운로드
# - auto-updater.exe (또는 node auto-updater.js)
# - .env (환경변수 설정)

# 4. .env 설정
# NODE_ID를 고유하게 설정 (예: worker-office-pc-01)

# 5. 시작프로그램에 auto-updater.exe 등록
# 또는 Windows 서비스로 등록
```

---

## 9. 모니터링

### 9.1 워커 상태 확인 (Supabase)

```sql
-- Control DB에서 실행
SELECT nodeId, status, lastHeartbeat, hostname
FROM "workerNodes"
WHERE status = 'online'
ORDER BY lastHeartbeat DESC;
```

### 9.2 트래픽 모드 변경

```sql
-- 통검 비로그인 모드 활성화
UPDATE traffic_mode_settings
SET enabled = true
WHERE mode_type = 'tonggum_nologin';

-- 모든 모드 비활성화 (긴급 중지)
UPDATE traffic_mode_settings
SET enabled = false;
```

---

## 10. 버전 히스토리

| 버전 | 날짜 | 변경사항 |
|------|------|----------|
| 2025-12-05-003000 | 2025-12-05 | DB 스키마 수정 (slot_naver, workerNodes 컬럼) |
| 2025-12-05-002000 | 2025-12-05 | pkg 호환성 수정 (shebang, CJS) |
| 2025-12-05-001000 | 2025-12-05 | CAPTCHA 솔버 Buffer→base64 수정 |
| 1.0.0 | 2025-12-04 | 초기 버전 |
