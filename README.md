# TURAFIC Auto-Updater

1000대 PC 자동 업데이트 시스템

## 원격 PC 설치 방법

### 1. Git Clone
```cmd
cd C:\
git clone https://github.com/mim1012/turafic_update.git turafic-runner
cd turafic-runner
```

### 2. 설치 실행
```cmd
install.bat
```

### 3. .env 설정
`.env` 파일을 열고 수정:
```env
NODE_TYPE=worker          # experiment 또는 worker
NODE_ID=worker-pc-001     # 이 PC의 고유 이름
DATABASE_URL=postgresql://postgres:비밀번호@db.프로젝트.supabase.co:5432/postgres
```

### 4. 실행
```cmd
turafic-updater.exe
```

## 자동 시작 설정 (선택)

### Windows 작업 스케줄러
1. `Win + R` → `taskschd.msc`
2. 작업 만들기 → 트리거: 시작 시
3. 동작: `C:\turafic-runner\turafic-updater.exe`

### 시작 프로그램
1. `Win + R` → `shell:startup`
2. `turafic-updater.exe` 바로가기 만들기

## 업데이트 주기
- 3분마다 GitHub에서 버전 확인
- 변경 감지 시 자동 다운로드 및 재시작
