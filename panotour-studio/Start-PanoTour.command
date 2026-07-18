#!/bin/bash
# Doppelklick startet PanoTour Studio (macOS).
# Beim ersten Start werden einmalig die Bausteine installiert.
cd "$(dirname "$0")" || exit 1
clear
echo "===================================================="
echo "   PanoTour Studio"
echo "===================================================="
echo ""

# Node.js vorhanden?
if ! command -v npm >/dev/null 2>&1; then
  echo "❌ Node.js scheint nicht installiert zu sein."
  echo "   Bitte einmalig von https://nodejs.org (LTS) installieren,"
  echo "   danach diese Datei erneut doppelklicken."
  echo ""
  echo "Drücke die Eingabetaste, um dieses Fenster zu schließen."
  read -r
  exit 1
fi

# Einmalige Installation der Bausteine
if [ ! -d node_modules ]; then
  echo "Erstinstallation der Bausteine (einmalig, dauert ~1 Minute)…"
  echo ""
  if ! npm install; then
    echo ""
    echo "❌ Installation fehlgeschlagen. Bitte Screenshot machen."
    echo "Drücke die Eingabetaste, um zu schließen."
    read -r
    exit 1
  fi
fi

echo ""
echo "✓ Der Browser öffnet gleich automatisch:  http://localhost:3000"
echo ""
echo "   • Dieses Fenster bitte OFFEN lassen, solange du arbeitest."
echo "   • Beenden: dieses Fenster schließen (oder Strg + C drücken)."
echo ""

# Browser kurz zeitversetzt öffnen (wenn der Server läuft)
( sleep 4 && open "http://localhost:3000" ) &

# Server starten (läuft im Vordergrund)
npm start
