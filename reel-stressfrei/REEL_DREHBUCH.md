# Reel: "Mach du mal das Sommerfest" — Stressfreier Eventwerkzeugkasten

**Format:** 9:16 (1080×1920), ~14 Sek., Ton an, maximal Drama
**Zielgruppe:** Mitarbeiter:innen, die ohne Agentur plötzlich ein Firmen-Event stemmen müssen und Angst haben, etwas falsch zu machen.
**Mechanik:** Relatable Hook → Eskalation/Panik → Auflösung (Werkzeugkasten) → CTA.

---

## Segment 1 — GALA / Ruhe (0:00–0:03) · Clip A
- **Bild:** Edle Abendveranstaltung, Kronleuchter, Gäste stoßen an.
- **Ton:** Lounge-Jazz, Gläserklirren, entspanntes Stimmengewirr.
- **Overlay (oben):** `POV: Der Chef sagt „Mach du mal das Sommerfest."`
- **Overlay (unten, später):** `Du denkst: wird schon laufen… 🥂`

## Segment 2 — SPRINKLER-CHAOS / Panik (0:03–0:09) · Clip B
- **Bild:** Sprinkleranlage geht an, Wasser von oben, Gäste springen auf, Panik, alle rennen raus.
- **Ton:** Zischen/Rauschen, Feueralarm, Schreie.
- **Overlay (Cut auf Wasser):** `…wird's nicht. 😱💦`
- **Overlay (Mitte):** `EIN übersehenes Detail = Abend ruiniert.`
- **Overlay (unten):** `Und alle schauen auf DICH.`

## Segment 3 — AUFLÖSUNG / Kontrolle (0:09–0:14) · Clip C
- **Bild:** Ruhige Eventmanagerin mit Tablet/Checkliste, grüner Marken-Akzent.
- **Ton:** Chaos verklingt, ruhiger, hoffnungsvoller Ton.
- **Overlay (oben):** `Oder du nimmst den Plan, den Profis nutzen.`
- **Endcard (grüner Marken-Balken unten):**
  - Titel: `Stressfreier Eventwerkzeugkasten`
  - CTA: `stressfreieventwerkzeugkasten.de`
  - Button: `👉 Link in Bio`

---

## Caption (Instagram Post-Text)
> Erstes Firmen-Event geplant – und keiner sagt dir, worauf es ankommt? 😰
> Genau dafür gibt's den Stressfreien Eventwerkzeugkasten: Checklisten, Vorlagen & Notfallpläne, mit denen nichts ins Wasser fällt. 💧❌
> 🔗 stressfreieventwerkzeugkasten.de (Link in Bio)
> #eventplanung #firmenevent #büroleben #eventmanagement #stressfrei

## Hashtag-/Hook-Varianten zum Testen (A/B)
1. `POV: Der Chef sagt „Mach du mal das Sommerfest."`
2. `Wenn die Firma sich die Eventagentur spart…`
3. `Niemand hat dir gesagt, dass DU jetzt das Event planst.`
4. `Tag 1 als „Eventmanager wider Willen".`

---

## Fertige Clips (Higgsfield, 9:16, 720×1280, mit Ton)
Im Higgsfield-Account abspielbar/herunterladbar. Direkt-URLs:

- **Clip A — Gala (5s):**
  https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260619_123123_9c97761b-90f7-4a08-abfd-39fe9377a608.mp4
- **Clip B — Sprinkler-Chaos (6s):**
  https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260619_123138_09789647-aed5-463a-a76f-284130bcb906.mp4
- **Clip C — Auflösung (5s):**
  https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260619_123129_04d6961b-3962-419c-87cb-e13c87d6bf11.mp4

Start-Keyframes (Recraft 4.1, 9:16, 2k):
- Gala: hf_20260619_122239_9f831e9d-…png · Sprinkler: hf_20260619_122242_3b402723-…png · Auflösung: hf_20260619_122250_318a1d22-…png

## Finalen MP4-Schnitt erzeugen (1 Befehl)
Sobald die 3 Clips lokal liegen (`clipA.mp4 clipB.mp4 clipC.mp4`):

```bash
bash assemble.sh clipA.mp4 clipB.mp4 clipC.mp4 reel_final.mp4
```

Das Skript: normalisiert auf 1080×1920/30fps, brennt alle deutschen Overlays
segmentgenau ein, setzt am Ende den grünen Marken-CTA-Balken und hängt die
Clips zu einem ~16s-Reel zusammen (`reel_final.mp4`).

> Hinweis: In dieser Web-Session ist der Higgsfield-Download-Host
> (`d8j0ntlcm91z4.cloudfront.net`) durch die Netzwerk-Policy gesperrt, daher
> konnte der Schnitt hier nicht ausgeführt werden. Lösung: Session/Umgebung mit
> diesem Host auf der Egress-Allowlist neu starten — dann erledigt das Skript
> den Rest in Sekunden. Alternativ Clips herunterladen und in CapCut nach
> diesem Drehbuch schneiden (~10 Min).
