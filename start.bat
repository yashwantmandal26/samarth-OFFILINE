@echo off
SETLOCAL EnableDelayedExpansion

echo ====================================================
echo      SAMARTH - PROJECT STARTUP SCRIPT
echo ====================================================

:: Step 1: Check for Node.js
echo [1/4] Detecting Runtime Environment...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js to run Samarth.
    pause
    exit /b 1
)
echo [OK] Node.js detected.

:: Step 2: Install Backend Dependencies
echo [2/4] Checking Backend Dependencies...
cd backend
if not exist "node_modules\" (
    echo [INFO] node_modules not found in backend. Installing...
    call npm install
    if !errorlevel! neq 0 (
        echo [ERROR] Backend dependency installation failed.
        pause
        exit /b 1
    )
) else (
    echo [OK] Backend dependencies already installed.
)
cd ..

:: Step 3: Install Frontend Dependencies
echo [3/4] Checking Frontend Dependencies...
cd frontend
if not exist "node_modules\" (
    echo [INFO] node_modules not found in frontend. Installing...
    call npm install
    if !errorlevel! neq 0 (
        echo [ERROR] Frontend dependency installation failed.
        pause
        exit /b 1
    )
) else (
    echo [OK] Frontend dependencies already installed.
)
cd ..

:: Step 4: Launching Application
echo [4/4] Starting Samarth Platform...
echo ----------------------------------------------------
echo [TIP] Ensure Ollama is running for AI features.
echo [TIP] Backend will run on http://localhost:5000
echo [TIP] Frontend will run on http://localhost:3000
echo ----------------------------------------------------

:: Start Backend in a new window
start cmd /k "cd backend && echo Starting Backend Server... && npm start"

:: Start Frontend in the current window (or new)
start cmd /k "cd frontend && echo Starting Frontend Dev Server... && npm start"

echo [SUCCESS] Samarth is starting up. Please wait for the browser to open.
timeout /t 5 >nul
exit /b 0
