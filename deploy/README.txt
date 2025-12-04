========================================
  TURAFIC Worker 배포 가이드
========================================

[사전 준비 - 원격 PC에서 1회만]
1. Node.js 설치: https://nodejs.org (LTS 버전)

2. 이 폴더를 원격 PC에 복사

3. .env.example을 .env로 복사 후 API 키 입력:
   - SUPABASE_PRODUCTION_URL: Supabase URL
   - SUPABASE_PRODUCTION_KEY: Supabase ANON KEY
   - ANTHROPIC_API_KEY: Claude API 키 (CAPTCHA 해결용)

4. config.json에서 nodeId 수정:
   - "nodeId": "worker-pc-001" → 각 PC마다 고유값

5. turafic-updater.exe 실행
   - 자동으로 C:\turafic 폴더 생성
   - GitHub에서 최신 스크립트 다운로드

6. C:\turafic 폴더에서:
   npm install playwright @supabase/supabase-js @anthropic-ai/sdk dotenv
   npx playwright install chromium

7. 네이버 로그인 세션 저장 (1회):
   npx tsx playwright-save-login.ts
   → 브라우저에서 네이버 로그인 후 Enter

8. turafic-updater.exe 다시 실행
   → 자동으로 트래픽 작업 시작

========================================
  자동 시작 설정 (선택)
========================================
- turafic-updater.exe를 시작프로그램에 등록
- PC 부팅 시 자동 실행됨

========================================
  문제 해결
========================================
- "login.json not found": 7번 단계 다시 실행
- "CAPTCHA 해결 실패": ANTHROPIC_API_KEY 확인
- "연결 실패": SUPABASE 키 확인
