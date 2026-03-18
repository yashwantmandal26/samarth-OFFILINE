@echo off
TITLE Samarth AI - Auto Launcher
COLOR 0A

echo.
echo  =======================================================
echo           SAMARTH AI - AUTOMATED STARTUP
echo  =======================================================
echo.

:: 1. CLEANUP PORTS (Kill any existing process on 5000 and 3001)
echo [*] Cleaning up existing processes on ports 5000 and 3001...
:: Force kill any node processes first to be sure
taskkill /f /im node.exe >nul 2>&1
:: Use a more robust way to find and kill processes on specific ports
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /r ":5000.*LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /r ":3001.*LISTENING"') do taskkill /f /pid %%a >nul 2>&1
timeout /t 3 >nul

:: 2. START OLLAMA (if not already running)
echo [1/3] Starting Ollama Service...
set OLLAMA_ORIGINS=*
:: Start ollama in its own window so user can see logs if needed
start "Ollama Engine" cmd /c "ollama serve"
timeout /t 10 >nul

:: 3. START BACKEND
echo [2/3] Starting Backend Agents (Port 5000)...
cd backend
start "Samarth Backend" cmd /k "node server.js"
timeout /t 10 >nul

:: 4. START FRONTEND
echo [3/3] Starting Frontend Interface (Port 3001)...
cd ../frontend
set PORT=3001
set CI=true
start "Samarth Frontend" cmd /k "npm start"

echo.
echo  -------------------------------------------------------
echo   SUCCESS: All systems launched!
echo  -------------------------------------------------------
echo   Launcher will close in 3 seconds...
echo  -------------------------------------------------------
timeout /t 3 >nul
exit
