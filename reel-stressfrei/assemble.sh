#!/usr/bin/env bash
set -euo pipefail
# Usage: assemble.sh clipA.mp4 clipB.mp4 clipC.mp4 out.mp4
A="$1"; B="$2"; C="$3"; OUT="${4:-/home/user/reel/reel_final.mp4}"
DIR="$(dirname "$OUT")"; cd "$DIR"

FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
[ -f "$FONT" ] || FONT="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

# --- caption text files (German, no emoji so they render cleanly) ---
printf 'POV: Der Chef sagt:\n„Mach du mal das Sommerfest."' > t_a1.txt
printf 'Du denkst: wird schon laufen…' > t_a2.txt
printf '…wird'"'"'s nicht.' > t_b1.txt
printf 'EIN übersehenes Detail =\nder Abend ist ruiniert.' > t_b2.txt
printf 'Und alle schauen auf DICH.' > t_b3.txt
printf 'Oder du nimmst den Plan,\nden die Profis nutzen.' > t_c1.txt
printf 'Stressfreier Eventwerkzeugkasten' > t_c2.txt
printf 'stressfreieventwerkzeugkasten.de' > t_c3.txt
printf 'Link in Bio' > t_c4.txt

NORM="scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,fps=30,format=yuv420p"
BOX="box=1:boxcolor=black@0.55:boxborderw=24:line_spacing=12"
FS_BIG=78; FS_MED=60; FS_SM=48

# ---------- Segment A ----------
ffmpeg -y -i "$A" -t 4 -filter_complex \
"[0:v]$NORM,\
drawtext=fontfile=$FONT:textfile=t_a1.txt:fontcolor=white:fontsize=$FS_MED:$BOX:x=(w-text_w)/2:y=h*0.10:enable='between(t,0,4)',\
drawtext=fontfile=$FONT:textfile=t_a2.txt:fontcolor=white:fontsize=$FS_SM:$BOX:x=(w-text_w)/2:y=h*0.80:enable='gte(t,1.8)'[v]" \
-map "[v]" -map 0:a? -r 30 -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -ar 48000 -ac 2 -shortest segA.mp4

# ---------- Segment B (chaos) ----------
ffmpeg -y -i "$B" -t 6 -filter_complex \
"[0:v]$NORM,\
drawtext=fontfile=$FONT:textfile=t_b1.txt:fontcolor=white:fontsize=$FS_BIG:$BOX:x=(w-text_w)/2:y=h*0.42:enable='between(t,0,2)',\
drawtext=fontfile=$FONT:textfile=t_b2.txt:fontcolor=white:fontsize=$FS_MED:$BOX:x=(w-text_w)/2:y=h*0.38:enable='between(t,2,4.4)',\
drawtext=fontfile=$FONT:textfile=t_b3.txt:fontcolor=white:fontsize=$FS_MED:$BOX:x=(w-text_w)/2:y=h*0.78:enable='gte(t,4.4)'[v]" \
-map "[v]" -map 0:a? -r 30 -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -ar 48000 -ac 2 -shortest segB.mp4

# ---------- Segment C (resolution + green CTA endcard) ----------
ffmpeg -y -i "$C" -t 5 -filter_complex \
"[0:v]$NORM,\
drawtext=fontfile=$FONT:textfile=t_c1.txt:fontcolor=white:fontsize=$FS_MED:$BOX:x=(w-text_w)/2:y=h*0.12:enable='between(t,0,2.4)',\
drawbox=x=0:y=h*0.62:w=iw:h=h*0.26:color=0x0E3B26@0.92:t=fill:enable='gte(t,2)',\
drawbox=x=0:y=h*0.62:w=iw:h=8:color=0x1FB873@1.0:t=fill:enable='gte(t,2)',\
drawtext=fontfile=$FONT:textfile=t_c2.txt:fontcolor=0x9FF3C8:fontsize=46:x=(w-text_w)/2:y=h*0.655:enable='gte(t,2)',\
drawtext=fontfile=$FONT:textfile=t_c3.txt:fontcolor=white:fontsize=54:x=(w-text_w)/2:y=h*0.715:enable='gte(t,2.2)',\
drawtext=fontfile=$FONT:textfile=t_c4.txt:fontcolor=0x0E3B26:box=1:boxcolor=0x1FB873:boxborderw=22:fontsize=44:x=(w-text_w)/2:y=h*0.795:enable='gte(t,2.5)'[v]" \
-map "[v]" -map 0:a? -r 30 -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -c:a aac -ar 48000 -ac 2 -shortest segC.mp4

# ---------- concat ----------
printf "file '%s'\nfile '%s'\nfile '%s'\n" "$DIR/segA.mp4" "$DIR/segB.mp4" "$DIR/segC.mp4" > concat.txt
ffmpeg -y -f concat -safe 0 -i concat.txt -c copy "$OUT"
echo "DONE -> $OUT"
ffprobe -v error -show_entries format=duration,size -of default=nw=1 "$OUT"
