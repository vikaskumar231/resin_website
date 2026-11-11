@echo off
echo ========================================================
echo   Artआलय (Resin E-Commerce) - Starting Dev Server
echo ========================================================
cd /d "%~dp0\.."

echo Checking for stale processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Terminating stale process PID %%a on port 3000...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Starting Next.js Dev Server on http://localhost:3000 ...
echo Press Ctrl+C to stop.
echo.
call npm run dev
pause

