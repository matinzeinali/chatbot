@echo off
setlocal
cd /d "%~dp0"
title Chat bot - dev server

rem --- Node.js (20.12+ is needed for the backend's --env-file) ---
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install it from https://nodejs.org and run this file again.
  pause
  exit /b 1
)
node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>20||(a===20&&b>=12)?0:1)"
if errorlevel 1 (
  echo Node.js 20.12 or later is required. Update it from https://nodejs.org and run this file again.
  pause
  exit /b 1
)

rem --- Frontend dependencies ---
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install --fetch-retries=5
  if errorlevel 1 (
    echo.
    echo npm install failed. Check your internet connection and run this file again.
    pause
    exit /b 1
  )
)

rem --- Backend (AI replies) ---
set "ENV_FILE=backend\server\.env"
set "HAS_KEY="
if exist "%ENV_FILE%" (
  findstr /R /C:"^GEMINI_API_KEY=..*" /C:"^PAASTA_AI_KEY=..*" "%ENV_FILE%" >nul 2>nul && set "HAS_KEY=1"
)

if not defined HAS_KEY (
  echo.
  echo The backend is not configured, so AI replies will fail.
  echo Copy backend\server\.env.example to backend\server\.env and set GEMINI_API_KEY
  echo ^(or PAASTA_AI_KEY^), then run this file again.
  echo.
) else (
  netstat -ano | findstr /R /C:":8787 .*LISTENING" >nul 2>nul
  if errorlevel 1 (
    echo Starting the backend at http://localhost:8787 ^(in its own window^)
    start "Chat bot - backend" /min cmd /k "cd /d backend\server && npm run dev"
  ) else (
    echo The backend is already running at http://localhost:8787
  )
)

rem --- Frontend: Vite opens the browser itself once ready, on whichever port it got ---
echo Starting the app...
call npm run dev -- --host 127.0.0.1 --port 5173 --open

pause
