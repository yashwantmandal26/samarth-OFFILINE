@echo off
TITLE Samarth AI - Full Stack Launcher
COLOR 0B

echo.
echo  =======================================================
echo           SAMARTH AI - LOCAL INTELLIGENCE
echo  =======================================================
echo.

:: 1. START OLLAMA (if not already running)
echo [1/3] Checking Ollama Service...
set OLLAMA_ORIGINS=*
start /min "Ollama Service" cmd /c "ollama serve"
timeout /t 5 >nul

:: 2. START BACKEND AGENTS
echo [2/3] Starting Samarth Backend Agents...
cd backend
start /min "Samarth Backend" cmd /c "node server.js"
timeout /t 3 >nul

:: 3. START FRONTEND INTERFACE
echo [3/3] Starting Samarth Frontend Interface...
cd ../frontend
:: We use port 3001 as default in the script to avoid conflicts
set PORT=3001
start /min "Samarth Frontend" cmd /c "npm start"

echo.
echo  -------------------------------------------------------
echo   SUCCESS: All Samarth components are initializing!
echo  -------------------------------------------------------
echo   - Backend: http://localhost:5000
echo   - Frontend: http://localhost:3001
echo   - AI Model: Ollama (Llama3)
echo  -------------------------------------------------------
echo.
echo  Keep this window open to maintain the environment.
echo  Press any key to close this launcher (Services will keep running).
pause >nul
