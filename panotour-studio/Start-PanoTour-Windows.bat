@echo off
REM Doppelklick startet PanoTour Studio (Windows).
cd /d "%~dp0"
title PanoTour Studio
echo ====================================================
echo    PanoTour Studio
echo ====================================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js scheint nicht installiert zu sein.
  echo Bitte einmalig von https://nodejs.org ^(LTS^) installieren,
  echo danach diese Datei erneut doppelklicken.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Erstinstallation der Bausteine ^(einmalig, dauert ~1 Minute^)...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo Installation fehlgeschlagen. Bitte Screenshot machen.
    pause
    exit /b 1
  )
)

echo.
echo Der Browser oeffnet gleich automatisch:  http://localhost:3000
echo Dieses Fenster bitte OFFEN lassen. Beenden: Fenster schliessen.
echo.

start "" http://localhost:3000
call npm start
pause
