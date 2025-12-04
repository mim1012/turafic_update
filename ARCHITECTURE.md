# TURAFIC Update - 시스템 아키텍처

> 원격 PC 자동 배포 및 네이버 트래픽 자동화 시스템

---

## 1. 전체 시스템 구조

```mermaid
flowchart TB
    subgraph REMOTE["🖥️ 원격 PC (1000대)"]
        EXE["turafic-updater.exe<br/>자동 업데이트"]
        RUNNER["worker-runner.js<br/>트래픽 실행"]
        OPT["auto-optimizer<br/>PC 최적화"]
        CAPTCHA["CaptchaSolver<br/>CAPTCHA 해결"]

        EXE -->|"프로세스 관리"| RUNNER
        RUNNER --> OPT
        RUNNER --> CAPTCHA
    end

    subgraph CLOUD["☁️ 클라우드"]
        GH["GitHub<br/>코드 저장소"]
        SB_CTRL["Supabase<br/>제어 DB"]
        SB_PROD["Supabase<br/>프로덕션 DB"]
        CLAUDE["Claude API<br/>Vision"]
    end

    subgraph NAVER["🛒 네이버"]
        SEARCH["통합검색"]
        SHOP["쇼핑검색"]
        STORE["스마트스토어"]
    end

    EXE <-->|"버전 체크/다운로드"| GH
    RUNNER <-->|"모드 설정, 하트비트"| SB_CTRL
    RUNNER <-->|"상품 목록"| SB_PROD
    CAPTCHA <-->|"이미지 분석"| CLAUDE
    RUNNER -->|"검색/클릭"| NAVER
```

---

## 2. 모듈 의존성

```mermaid
flowchart LR
    subgraph CORE["핵심 모듈"]
        UR["unified-runner.ts<br/>메인 워커"]
        AO["auto-optimizer.ts<br/>PC 최적화"]
        CS["ReceiptCaptchaSolver.ts<br/>CAPTCHA 해결"]
        IR["ipRotation.ts<br/>IP 로테이션"]
    end

    subgraph BUILD["빌드 결과물"]
        WR["worker-runner.js"]
    end

    subgraph EXT["외부 의존성"]
        PW["Playwright<br/>브라우저 자동화"]
        AN["@anthropic-ai/sdk<br/>Claude Vision"]
        SP["@supabase/supabase-js<br/>DB 클라이언트"]
    end

    UR --> AO
    UR --> CS
    UR --> IR
    UR --> PW
    UR --> SP
    CS --> AN

    UR -->|"esbuild"| WR
```

---

## 3. 트래픽 실행 흐름

```mermaid
sequenceDiagram
    participant R as Runner
    participant N as 네이버
    participant S as Supabase
    participant C as Claude Vision

    R->>S: 활성 모드 조회
    S-->>R: tonggum_login 활성

    R->>S: 상품 목록 요청
    S-->>R: [{mid, keyword, productName}]

    loop 각 상품
        R->>N: 네이버 메인 접속
        R->>N: 상품명 검색
        R->>N: 스크롤 (인간 행동)
        R->>N: MID 상품 클릭

        alt CAPTCHA 감지
            R->>R: 스크린샷 캡처
            R->>C: 이미지 + 질문 전송
            C-->>R: 정답 반환
            R->>N: 정답 입력 + 확인
        end

        R->>R: MID 검증
        R->>S: 결과 보고 (하트비트)
    end
```

---

## 4. 자동 업데이트 흐름

```mermaid
flowchart TB
    START([시작]) --> CHECK{3분 경과?}
    CHECK -->|No| WAIT[대기]
    WAIT --> CHECK

    CHECK -->|Yes| FETCH[GitHub version.json 가져오기]
    FETCH --> COMPARE{버전 비교}

    COMPARE -->|같음| CHECK
    COMPARE -->|다름| DOWNLOAD[worker-runner.js 다운로드]

    DOWNLOAD --> KILL[기존 Runner 종료]
    KILL --> SPAWN[새 Runner 시작]
    SPAWN --> CHECK

    style DOWNLOAD fill:#f96,stroke:#333
    style SPAWN fill:#9f6,stroke:#333
```

---

## 5. CAPTCHA 해결 흐름

```mermaid
flowchart TB
    subgraph DETECT["감지"]
        D1["페이지 텍스트 분석"]
        D2{"'보안 확인' OR<br/>'영수증' 포함?"}
        D3["질문 대기 (최대 10초)"]
    end

    subgraph SOLVE["해결"]
        S1["#rcpt_img 캡처"]
        S2["Claude Vision 전송"]
        S3["정답 추출"]
    end

    subgraph INPUT["입력"]
        I1["입력창 클릭"]
        I2["한 글자씩 타이핑<br/>(50-180ms 딜레이)"]
        I3["확인 버튼 hover"]
        I4["버튼 클릭"]
    end

    D1 --> D2
    D2 -->|Yes| D3
    D2 -->|No| SKIP([스킵])
    D3 --> S1
    S1 --> S2
    S2 --> S3
    S3 --> I1
    I1 --> I2
    I2 --> I3
    I3 --> I4
    I4 --> VERIFY{성공?}
    VERIFY -->|No| S1
    VERIFY -->|Yes| DONE([완료])
```

---

## 6. PC 최적화 계산

```mermaid
flowchart LR
    subgraph INPUT["입력"]
        RAM["전체 RAM"]
        CPU["CPU 코어"]
    end

    subgraph CALC["계산"]
        AVAIL["가용 메모리<br/>= RAM × 0.6"]
        BROWSERS["브라우저 수<br/>= 가용 / 600MB"]
        BATCH["배치 크기<br/>= 브라우저 × 5"]
    end

    subgraph OUTPUT["출력"]
        PC["parallelCount"]
        BS["batchSize"]
        BR["batchRestSec"]
        TR["taskRestSec"]
    end

    RAM --> AVAIL
    AVAIL --> BROWSERS
    BROWSERS --> PC
    BROWSERS --> BATCH
    BATCH --> BS
    PC --> BR
    PC --> TR
```

---

## 7. 파일 구조

```
turafic_update/
├── 📦 배포 파일
│   ├── turafic-updater.exe    # 원격 PC 실행 파일
│   ├── worker-runner.js       # 트래픽 워커 (빌드 결과)
│   └── version.json           # 버전 정보
│
├── 🔧 핵심 모듈
│   ├── unified-runner.ts      # 메인 트래픽 엔진
│   ├── auto-optimizer.ts      # PC 최적화
│   ├── ReceiptCaptchaSolver.ts # CAPTCHA 해결
│   ├── ipRotation.ts          # IP 로테이션
│   └── auto-updater.ts        # 자동 업데이트
│
├── 🧪 테스트/디버그
│   ├── test-captcha-local.ts  # CAPTCHA 로컬 테스트
│   ├── test-captcha-prb.ts    # PRB 버전 테스트
│   └── debug-captcha-*.ts     # 디버그 스크립트
│
├── ⚙️ 설정
│   ├── config.ts              # 전역 설정
│   ├── .env                   # 환경변수 (비밀)
│   └── package.json           # 의존성
│
└── 📚 문서
    ├── README.md              # 설치 가이드
    ├── MODULES.md             # 모듈 설명
    └── ARCHITECTURE.md        # 이 문서
```

---

## 8. 환경변수

| 변수 | 설명 | 필수 |
|------|------|:----:|
| `NODE_ID` | 워커 식별자 (예: worker-pc-001) | ✅ |
| `SUPABASE_CONTROL_URL` | 제어 DB URL | ✅ |
| `SUPABASE_CONTROL_KEY` | 제어 DB API 키 | ✅ |
| `SUPABASE_PRODUCTION_URL` | 프로덕션 DB URL | ✅ |
| `SUPABASE_PRODUCTION_KEY` | 프로덕션 DB API 키 | ✅ |
| `ANTHROPIC_API_KEY` | Claude Vision API 키 | ⚠️ CAPTCHA용 |
| `PARALLEL_COUNT` | 병렬 수 (오버라이드) | ❌ |
| `BATCH_SIZE` | 배치 크기 (오버라이드) | ❌ |

---

## 9. 데이터베이스 테이블

### Control DB (navertrafictest)
```sql
-- 트래픽 모드 설정
traffic_mode_settings (
  mode_type: 'tonggum_login' | 'tonggum_nologin' | ...
  enabled: boolean
)

-- 워커 노드 관리
workerNodes (
  node_id: string
  status: 'online' | 'offline'
  last_heartbeat: timestamp
  current_version: string
)
```

### Production DB (adpang_production)
```sql
-- 상품 목록
traffic_navershopping (
  id: number
  keyword: string
  mid: string
  product_name: string
  link_url: string
)
```

---

## 10. 빌드 & 배포

```bash
# 1. 워커 빌드
npm run build:worker
# → worker-runner.js 생성

# 2. 버전 업데이트
# version.json의 version 값 수정

# 3. GitHub 푸시
git add worker-runner.js version.json
git commit -m "feat: 새 기능"
git push

# → 원격 PC가 3분 내 자동 업데이트
```
