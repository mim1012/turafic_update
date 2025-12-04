# TURAFIC Update - 모듈 구조

원격 PC 자동 배포 및 트래픽 실행 시스템

## 핵심 모듈

### 1. `auto-updater.ts` → `turafic-updater.exe`
**역할:** 원격 PC 자동 업데이트 및 Runner 관리

- 180초(3분)마다 GitHub에서 버전 확인
- 새 버전 감지 시 자동 다운로드 (`worker-runner.js`)
- Runner 프로세스 시작/재시작/모니터링
- Node.js 내장 (exe로 패키징)

```
실행: turafic-updater.exe (더블클릭)
빌드: npm run build:exe
```

---

### 2. `unified-runner.ts` → `worker-runner.js`
**역할:** 트래픽 실행 엔진 (메인 워커)

**지원 모드 (4가지):**
- `tonggum_login` - 통합검색 + 로그인
- `tonggum_nologin` - 통합검색 + 비로그인
- `shogum_login` - 쇼핑검색 + 로그인
- `shogum_nologin` - 쇼핑검색 + 비로그인

**기능:**
- Supabase에서 상품 목록 조회
- Playwright로 브라우저 자동화
- 네이버 검색 → 상품 클릭 → MID 검증
- CAPTCHA 자동 감지 및 해결 (Claude Vision)
- 워커 하트비트 전송

```
실행: node worker-runner.js
빌드: npm run build:worker
```

---

### 3. `auto-optimizer.ts`
**역할:** PC 성능 기반 자동 최적화

**자동 계산 항목:**
- `parallelCount` - 병렬 브라우저 수 (RAM 기준)
- `batchSize` - 배치당 작업 수
- `batchRestSec` - 배치 간 휴식 시간
- `taskRestSec` - 작업 간 휴식 시간

**계산 공식:**
```
가용 메모리 = 전체 RAM × 0.6 (60% 안전 마진)
브라우저당 메모리 = 600MB (headful 모드)
병렬 수 = 가용 메모리 / 600MB
```

**환경변수 오버라이드:**
- `PARALLEL_COUNT` - 병렬 수 강제 지정
- `BATCH_SIZE` - 배치 크기 강제 지정

---

### 4. `ReceiptCaptchaSolver.ts`
**역할:** 네이버 영수증 CAPTCHA 자동 해결

**동작 과정:**
1. 보안 확인 페이지 감지
2. CAPTCHA 질문 대기 (최대 10초)
3. 영수증 이미지 캡처 (`#rcpt_img`)
4. Claude Vision API로 답 추출
5. 사람처럼 타이핑 (랜덤 딜레이 50-180ms)
6. 확인 버튼 클릭

**지원 질문 유형:**
- "가게 위치는 [도로명] [?] 입니다"
- "전화번호의 뒤에서 X번째 숫자는?"
- "상호명은 [?] 입니다"

**필수 환경변수:**
- `ANTHROPIC_API_KEY` - Claude API 키

---

### 5. `ipRotation.ts`
**역할:** USB 테더링 IP 로테이션

**동작:**
1. USB 테더링 어댑터 자동 감지
2. 어댑터 비활성화 → 활성화 (IP 변경)
3. 새 IP로 연결 확인

**지원 어댑터:**
- SAMSUNG Mobile USB
- Remote NDIS
- 이더넷 XX (숫자 기반)

**필요 권한:** 관리자 권한 (netsh 명령어)

---

## 테스트/디버그 모듈

### `test-captcha-local.ts`
Playwright로 CAPTCHA 감지/해결 테스트

### `test-captcha-prb.ts`
puppeteer-real-browser로 CAPTCHA 테스트 (봇 탐지 우회 강화)

### `debug-captcha-page.ts`
CAPTCHA 페이지 HTML/텍스트 덤프 (분석용)

### `debug-captcha-solver.ts`
CAPTCHA 해결 과정 상세 로그

---

## 설정 파일

### `config.ts`
전역 설정 (Supabase URL, 타임아웃 등)

### `.env`
```env
NODE_ID=worker-pc-001              # 워커 식별자
SUPABASE_CONTROL_URL=...           # 제어 DB (모드 설정)
SUPABASE_CONTROL_KEY=...
SUPABASE_PRODUCTION_URL=...        # 프로덕션 DB (상품 목록)
SUPABASE_PRODUCTION_KEY=...
ANTHROPIC_API_KEY=...              # CAPTCHA 해결용
```

### `version.json`
```json
{
  "version": "1.0.0",
  "files": ["worker-runner.js"]
}
```
→ auto-updater가 이 파일로 버전 비교

---

## 빌드 명령어

```bash
# 워커 빌드 (개발 후 배포)
npm run build:worker

# Updater EXE 빌드 (최초 1회)
npm run build:exe

# 전체 빌드
npm run build:all
```

---

## 아키텍처

```
┌─────────────────────────────────────────────────────┐
│                    원격 PC                          │
├─────────────────────────────────────────────────────┤
│  turafic-updater.exe                                │
│    ├─ 3분마다 GitHub 버전 체크                      │
│    ├─ worker-runner.js 다운로드                     │
│    └─ Runner 프로세스 관리                          │
│                                                     │
│  worker-runner.js (unified-runner.ts)               │
│    ├─ auto-optimizer.ts (PC 최적화)                 │
│    ├─ ReceiptCaptchaSolver.ts (CAPTCHA)             │
│    └─ Playwright 브라우저 자동화                    │
└─────────────────────────────────────────────────────┘
          │                              │
          ▼                              ▼
┌──────────────────┐           ┌──────────────────┐
│  GitHub          │           │  Supabase        │
│  (버전/코드)      │           │  (상품/설정)      │
└──────────────────┘           └──────────────────┘
```

---

## 데이터 흐름

1. **Updater 시작** → GitHub에서 `version.json` 확인
2. **새 버전 있음** → `worker-runner.js` 다운로드
3. **Runner 시작** → PC 스펙 분석 → 최적 설정 계산
4. **Supabase 연결** → 활성 모드 조회 → 상품 목록 가져오기
5. **트래픽 실행** → 네이버 검색 → 상품 클릭 → MID 검증
6. **CAPTCHA 감지** → Claude Vision으로 해결
7. **하트비트** → 30초마다 Supabase에 상태 보고
