@echo off
cd /d "%~dp0frontend"
npm run dev

if errorlevel 1 (
    echo.
    echo [ERROR] Frontend dev server stopped unexpectedly with code %errorlevel%.
    pause
)
