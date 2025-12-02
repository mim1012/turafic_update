@echo off
chcp 65001 >nul
echo.
echo  ████████████████████████████████████████████
echo  █                                          █
echo  █   TURAFIC Auto-Updater 설치              █
echo  █                                          █
echo  ████████████████████████████████████████████
echo.

:: .env 파일 확인
if not exist ".env" (
    echo [1/3] .env 파일 생성 중...
    copy .env.example .env >nul
    echo   ✅ .env.example → .env 복사됨
    echo.
    echo   ⚠️  중요: .env 파일을 열어서 다음을 수정하세요:
    echo      - NODE_TYPE: experiment 또는 worker
    echo      - NODE_ID: 이 PC의 고유 이름
    echo      - DATABASE_URL: Supabase 연결 문자열
    echo.
) else (
    echo [1/3] .env 파일 이미 존재함 ✅
)

echo [2/3] 의존성 설치 중...
call npm install
if %errorlevel% neq 0 (
    echo   ❌ npm install 실패!
    goto :fail
)
echo   ✅ 의존성 설치 완료
echo.

echo [3/3] EXE 빌드 중...
call npx esbuild auto-updater.ts --bundle --platform=node --target=node18 --outfile=auto-updater.js
if %errorlevel% neq 0 goto :fail

call npx pkg auto-updater.js -t node18-win-x64 -o turafic-updater.exe
if %errorlevel% neq 0 goto :fail
echo   ✅ turafic-updater.exe 빌드 완료
echo.

echo  ████████████████████████████████████████████
echo  █                                          █
echo  █   ✅ 설치 완료!                          █
echo  █                                          █
echo  █   1. .env 파일 설정 확인                 █
echo  █   2. turafic-updater.exe 실행            █
echo  █                                          █
echo  ████████████████████████████████████████████
echo.
goto :end

:fail
echo.
echo   ❌ 설치 실패! 오류를 확인하세요.
echo.

:end
pause
