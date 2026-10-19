@echo off
title CloudConvert Launcher
color 0B
echo.
echo   ==========================================
echo        CloudConvert - Starting Up...
echo   ==========================================
echo.

set "ROOT=%~dp0"

echo   [1/2] Starting Backend Server (port 5000)...
start "CloudConvert - SERVER" cmd /k "cd /d "%ROOT%server" && npm run dev"

echo   [2/2] Starting React Frontend (port 3000)...
start "CloudConvert - CLIENT" cmd /k "cd /d "%ROOT%client" && npm start"

echo.
echo   ==========================================
echo        Both servers are launching!
echo        Open http://localhost:3000
echo   ==========================================
echo.
echo   This window will close in 8 seconds...
echo   Close the SERVER and CLIENT windows to stop.
echo.
timeout /t 8 >nul