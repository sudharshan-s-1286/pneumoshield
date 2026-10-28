@echo off
setlocal
cd /d "%~dp0"

if exist "%~dp0venv\Scripts\python.exe" (
    set "PYTHON_EXE=%~dp0venv\Scripts\python.exe"
) else (
    set "PYTHON_EXE=python"
)

echo ===================================================
echo [PneumoShield Backend] Starting Flask Server
echo Python: %PYTHON_EXE%
echo ===================================================

cd /d "%~dp0backend"
"%PYTHON_EXE%" app.py

if errorlevel 1 (
    echo.
    echo [ERROR] Backend server stopped unexpectedly with code %errorlevel%.
    pause
)
