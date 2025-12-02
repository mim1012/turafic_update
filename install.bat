@echo off
chcp 65001 >nul
echo.
echo   TURAFIC Auto-Updater 설치
echo   ==========================
echo.

:: .env 파일 확인
if not exist ".env" (
    echo [1/2] .env 파일 생성 중...
    copy .env.example .env >nul
    echo   완료! .env 파일이 생성되었습니다.
    echo.
    echo   [중요] .env 파일을 수정해야 합니다:
    echo      - NODE_TYPE: experiment 또는 worker
    echo      - NODE_ID: 이 PC의 고유 이름
    echo      - DATABASE_URL: Supabase 연결 문자열
    echo.
    echo   메모장으로 .env 파일을 엽니다...
    timeout /t 2 >nul
    notepad .env
) else (
    echo [1/2] .env 파일 이미 존재함
)

echo.
echo [2/2] 설치 완료!
echo.
echo   실행방법: turafic-updater.exe 더블클릭
echo.
echo   (Node.js 설치 불필요 - exe에 모두 포함됨)
echo.
pause
