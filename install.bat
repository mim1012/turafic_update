@echo off

echo.
echo   ========================================
echo   TURAFIC Auto-Updater Install
echo   ========================================
echo.

:: .env file check
if not exist ".env" (
    echo [1/3] Creating .env file...
    copy .env.example .env >nul
    echo   Done: .env file created
    echo.
    echo   IMPORTANT: Edit .env file:
    echo      - NODE_TYPE: experiment or worker
    echo      - NODE_ID: unique PC name
    echo      - DATABASE_URL: Supabase connection string
    echo.
) else (
    echo [1/3] .env file already exists
)

echo [2/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo   ERROR: npm install failed!
    goto :fail
)
echo   Done: dependencies installed
echo.

echo [3/3] Building EXE...
call npx esbuild auto-updater.ts --bundle --platform=node --target=node18 --outfile=auto-updater.js
if %errorlevel% neq 0 goto :fail

call npx pkg auto-updater.js -t node18-win-x64 -o turafic-updater.exe
if %errorlevel% neq 0 goto :fail
echo   Done: turafic-updater.exe created
echo.

echo   ========================================
echo   Installation Complete!
echo   ========================================
echo.
echo   1. Edit .env file if needed
echo   2. Run turafic-updater.exe
echo.
goto :end

:fail
echo.
echo   ERROR: Installation failed!
echo.

:end
pause
