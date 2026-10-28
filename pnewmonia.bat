@echo off
cd /d "%~dp0"

echo Starting backend server...
start "Backend" cmd /k backend.bat

echo Starting frontend server...
start "Frontend" cmd /k frontend.bat

echo Both servers are starting in separate windows.
