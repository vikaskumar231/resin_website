@echo off
echo ========================================================
echo   Artआलय (Resin E-Commerce) - Clean Cache & Restart
echo ========================================================
cd /d "%~dp0\.."

echo [1/3] Stopping any processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Terminating PID %%a...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo [2/3] Flushing Next.js build cache (.next directory)...
if exist ".next" (
    rmdir /s /q ".next"
    echo Cache cleared successfully.
) else (
    echo No .next directory found.
)

echo.
echo [3/3] Starting clean Next.js server on http://localhost:3000 ...
echo.
call npm run dev
pause

