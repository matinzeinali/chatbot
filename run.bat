@echo off
setlocal
cd /d "%~dp0"
title Chat bot - dev server

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install it from https://nodejs.org and run this file again.
  pause
  exit /b 1
)

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

echo Starting the app at http://localhost:5173
start "" "http://localhost:5173"
call npm run dev -- --host 127.0.0.1 --port 5173

pause
