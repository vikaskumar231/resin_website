@echo off
echo ========================================================
echo   Artआलय (Resin E-Commerce) - Stopping Server
echo ========================================================

set FOUND=0
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    set FOUND=1
    echo Terminating process PID %%a listening on port 3000...
    taskkill /F /PID %%a
)

if "%FOUND%"=="0" (
    echo No active process found listening on port 3000.
) else (
    echo Port 3000 is now released successfully.
)

echo.
pause

