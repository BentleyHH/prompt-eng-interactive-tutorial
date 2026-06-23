#!/bin/bash
# ============================================================
#  ETAF Booklet-Dashboard  –  Start für macOS
#  Einfach DOPPELKLICKEN. Beim ersten Mal richtet sich alles
#  selbst ein, danach öffnet sich der Browser automatisch.
# ============================================================

cd "$(dirname "$0")" || exit 1

# Sicherheits-Markierung von heruntergeladenen Dateien entfernen,
# damit Folgestarts nicht von macOS blockiert werden.
xattr -dr com.apple.quarantine "$(pwd)" >/dev/null 2>&1 || true

echo "==> Suche Python 3 ..."
PYBIN=""
for c in \
  /Library/Frameworks/Python.framework/Versions/Current/bin/python3 \
  /opt/homebrew/bin/python3 \
  /usr/local/bin/python3 \
  python3 ; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c 'import sys' >/dev/null 2>&1; then
    PYBIN="$c"; break
  fi
done

if [ -z "$PYBIN" ]; then
  echo ""
  echo "  Python 3 ist noch nicht installiert."
  echo "  1) Bitte hier herunterladen:  https://www.python.org/downloads/macos/"
  echo "  2) Die geladene .pkg-Datei öffnen und durchklicken."
  echo "  3) Danach diese Datei (Start.command) erneut doppelklicken."
  echo ""
  read -r -p "  Mit ENTER schließen ..." _
  exit 1
fi
echo "    Python gefunden: $PYBIN"

# Lokale Umgebung (.venv) – einmalige Einrichtung
if [ ! -d ".venv" ]; then
  echo "==> Erste Einrichtung (1-2 Minuten, einmalig) ..."
  "$PYBIN" -m venv .venv || { echo "Konnte Umgebung nicht anlegen."; read -r _; exit 1; }
fi
# shellcheck disable=SC1091
source .venv/bin/activate

python -m pip install --quiet --upgrade pip
echo "==> Installiere/aktualisiere die benötigten Pakete ..."
if ! python -m pip install --quiet -r requirements.txt; then
  echo "Installation fehlgeschlagen. Bitte Internetverbindung prüfen und erneut versuchen."
  read -r -p "  Mit ENTER schließen ..." _
  exit 1
fi

# Optionaler Hinweis: Ghostscript nur für PDF/A-Archiv nötig
command -v gs >/dev/null 2>&1 || \
  echo "    (Hinweis: PDF/A-Archiv braucht 'ghostscript' – optional: brew install ghostscript)"

echo ""
echo "============================================================"
echo "  Dashboard läuft gleich auf:   http://127.0.0.1:5000"
echo "  Login beim ersten Mal:        admin / admin"
echo "  Beenden: dieses Fenster schließen oder Strg+C drücken."
echo "============================================================"
echo ""

# Browser nach kurzem Moment automatisch öffnen
( sleep 3; open "http://127.0.0.1:5000" >/dev/null 2>&1 ) &

python -m webapp.app

echo ""
read -r -p "Dashboard beendet. Mit ENTER schließen ..." _
