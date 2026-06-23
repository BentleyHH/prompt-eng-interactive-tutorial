# Clips hier ablegen (Fallback ohne Egress)

Wenn der automatische Download der Higgsfield-Clips in der Umgebung gesperrt ist,
kannst du die 3 Clips hierher hochladen — dann kann das Reel ohne Netzwerkzugriff
geschnitten werden.

## So geht's (am PC, ~2 Min)
1. Lade die 3 Clips aus deinem Higgsfield-Account herunter.
2. Auf github.com dieses Repo öffnen → Branch
   `claude/stressfreieventwerkzeugkasten-reels-strategy-u6pnhg` wählen.
3. In den Ordner `reel-stressfrei/clips/` gehen → **Add file → Upload files**.
4. Die 3 Dateien als **clipA.mp4**, **clipB.mp4**, **clipC.mp4** hochladen und committen.

Reihenfolge:
- **clipA.mp4** = Gala / Ruhe (5s)
- **clipB.mp4** = Sprinkler-Chaos (6s)
- **clipC.mp4** = Auflösung (5s)

Danach im Chat schreiben: **„Die Clips sind hochgeladen, render das Reel."**
Ich hole sie per `git pull` und erzeuge `reel_final.mp4`.
