#!/usr/bin/env bash
# render.sh — Ein-Befehl-Schnitt fuer das Reel.
# Modus 1 (Egress frei): laedt die 3 Higgsfield-Clips selbst und schneidet.
#         Aufruf:  bash render.sh
# Modus 2 (Clips lokal): nutzt bereits vorhandene clips/clipA|B|C.mp4
#         (z.B. ueber GitHub in den Ordner reel-stressfrei/clips/ hochgeladen)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
CLIPS="$HERE/clips"; mkdir -p "$CLIPS"
OUT="$HERE/reel_final.mp4"

A_URL="https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260619_123123_9c97761b-90f7-4a08-abfd-39fe9377a608.mp4"
B_URL="https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260619_123138_09789647-aed5-463a-a76f-284130bcb906.mp4"
C_URL="https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260619_123129_04d6961b-3962-419c-87cb-e13c87d6bf11.mp4"

command -v ffmpeg >/dev/null || { echo "ffmpeg fehlt: sudo apt-get update && sudo apt-get install -y ffmpeg"; exit 1; }

fetch () { # $1 url, $2 dest
  [ -s "$2" ] && file "$2" | grep -qi "MP4\|ISO Media" && { echo "vorhanden: $2"; return 0; }
  echo "lade $2 ..."
  code=$(curl -sS -o "$2" -w "%{http_code}" "$1") || true
  if ! file "$2" | grep -qi "MP4\|ISO Media"; then
    echo "FEHLER: Download blockiert (http=$code). Egress fuer cloudfront.net noetig,"
    echo "oder lege die Datei manuell unter $2 ab (z.B. via GitHub-Upload)."; exit 2
  fi
}

fetch "$A_URL" "$CLIPS/clipA.mp4"
fetch "$B_URL" "$CLIPS/clipB.mp4"
fetch "$C_URL" "$CLIPS/clipC.mp4"

bash "$HERE/assemble.sh" "$CLIPS/clipA.mp4" "$CLIPS/clipB.mp4" "$CLIPS/clipC.mp4" "$OUT"
echo "FERTIG: $OUT"
