# TURAFIC Auto-Updater

1000대 PC 자동 업데이트 시스템 (Node.js 설치 불필요!)

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
→ .env 파일 자동 생성 → 메모장으로 열림

### 3. .env 설정
메모장에서 수정:
```env
NODE_TYPE=worker
NODE_ID=worker-pc-001
DATABASE_URL=postgresql://postgres:비밀번호@db.프로젝트.supabase.co:5432/postgres
```

### 4. 실행
```cmd
turafic-updater.exe
```
더블클릭하면 끝!

## 자동 시작 설정 (선택)

### Windows 시작 프로그램
1. `Win + R` → `shell:startup`
2. `turafic-updater.exe` 바로가기 만들기

## 동작 방식
- 3분마다 GitHub에서 버전 확인
- 변경 감지 시 자동 다운로드 및 재시작
- Node.js 설치 불필요 (exe에 런타임 포함)
