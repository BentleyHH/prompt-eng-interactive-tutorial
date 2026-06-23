@echo off
REM Idiotensicherer Start fuer Windows. Einfach doppelklicken.
cd /d "%~dp0"

echo ==^> Pruefe Python...
where py >nul 2>nul && (set PY=py) || (set PY=python)
%PY% --version >nul 2>nul
if errorlevel 1 (
  echo.
  echo FEHLER: Python ist nicht installiert.
  echo   Bitte von https://www.python.org/downloads/ herunterladen und installieren.
  echo   WICHTIG: beim Installieren Haekchen "Add Python to PATH" setzen!
  echo.
  pause
  exit /b 1
)

if not exist ".venv" (
  echo ==^> Richte beim ersten Start die Umgebung ein ^(dauert 1-2 Minuten^)...
  %PY% -m venv .venv
)
call .venv\Scripts\activate.bat
python -m pip install --quiet --upgrade pip
echo ==^> Installiere/aktualisiere die benoetigten Pakete...
python -m pip install --quiet -r requirements.txt

echo.
echo ============================================================
echo   Dashboard startet auf:   http://127.0.0.1:5000
echo   Login beim ersten Mal:   admin / admin
echo   Zum Beenden: dieses Fenster schliessen oder Strg+C druecken.
echo ============================================================
echo.
python -m webapp.app
pause
