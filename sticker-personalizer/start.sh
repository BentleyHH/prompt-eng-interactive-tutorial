#!/usr/bin/env bash
# Idiotensicherer Start für macOS / Linux.
# Doppelklick (oder im Terminal:  ./start.sh) – richtet beim ersten Mal alles
# automatisch ein und startet danach das Dashboard.
set -e
cd "$(dirname "$0")"

echo "==> Prüfe Python..."
if ! command -v python3 >/dev/null 2>&1; then
  echo "FEHLER: Python 3 ist nicht installiert."
  echo "  macOS:  https://www.python.org/downloads/  (Datei herunterladen, installieren)"
  echo "  Linux:  sudo apt-get install -y python3 python3-venv python3-pip"
  exit 1
fi

# Einmalige Einrichtung in einer lokalen Umgebung (.venv)
if [ ! -d ".venv" ]; then
  echo "==> Richte beim ersten Start die Umgebung ein (dauert 1-2 Minuten)..."
  python3 -m venv .venv
fi
# shellcheck disable=SC1091
source .venv/bin/activate
python -m pip install --quiet --upgrade pip setuptools wheel
echo "==> Installiere/aktualisiere die benötigten Pakete..."
python -m pip install --quiet --prefer-binary -r requirements.txt

# Hinweis auf Systemwerkzeuge (nur einmalig nötig)
command -v gs >/dev/null 2>&1 || echo "Hinweis: 'ghostscript' fehlt – nur für PDF/A nötig (macOS: brew install ghostscript)."

echo ""
echo "============================================================"
echo "  Dashboard startet auf:   http://127.0.0.1:5000"
echo "  Login beim ersten Mal:   admin / admin"
echo "  Zum Beenden: dieses Fenster schließen oder Strg+C drücken."
echo "============================================================"
echo ""
python -m webapp.app
