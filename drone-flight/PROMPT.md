# Helgoland Drohnenflug – Prompt-Entwicklung

Simulierter Drohnenflug über Helgoland auf Basis von zwei Google-Maps-Screenshots:
`helgoland-uebersicht.jpg` (Gesamtbereich) und `helgoland-route.jpg` (eingezeichnete rote Flugbahn).

## Interpretation der Route

1. Start über der Inselmitte (Oberland) aus 300 m Höhe, Kamera senkrecht nach unten
2. Sturzflug zur Nordwestspitze, Kamera richtet sich dabei zum Horizont auf
3. Tiefe Umrundung der Langen Anna, vorbei am Lummenfelsen
4. Flach zurück über die Klippenkante nach Südosten, an Sportplatz und Nordufer vorbei
5. Bogen um das Museums-/AWI-Viertel
6. Über die Dächer des Unterlands zur östlichen Uferpromenade
7. Schleife hinaus über Landungsbrücke und Hafenstrand
8. Vorbei an den Hummerbuden, tief durch den Südhafen (Seenotretter-Station)
9. Finale entlang der Südmole hinaus aufs offene Meer, sanft steigend

## Generierungsparameter

| Parameter | Wert |
|---|---|
| Modell | Seedance 2.0 (Bytedance), via Higgsfield |
| Dauer | 15 s |
| Auflösung | 1080p (1920×1080, 16:9) |
| Modus | std, Audio aktiviert |
| Referenzen | beide Karten-Screenshots als `image_references` |

## Finaler Video-Prompt (englisch)

> Photorealistic cinematic drone flight over Helgoland, Germany's offshore island in the North Sea, in warm golden-hour evening light. The two reference satellite maps define the real geography of the island; the red line drawn on the second map is the exact flight path to follow. Never show any map graphics, labels, pins or the red line itself — only real photorealistic scenery.
>
> The film opens at 300 meters altitude, camera pointing almost straight down: the whole spade-shaped island lies below like a living map, green Oberland plateau, the small town, the harbor and the sandy Düne islet across the water. The drone pitches forward into a steep, accelerating dive toward the northwestern tip; as it plunges, the camera tilts smoothly up from top-down to a forward horizon view — a breathtaking speed-ramp descent. It levels off just meters above the waves and carves a tight, low orbit around Lange Anna, the famous free-standing red sandstone sea stack, seabirds bursting past the camera along the white-streaked Lummenfelsen bird cliffs.
>
> Staying low, it races southeast along the clifftop edge of the green plateau, sweeps down past the northern shore and the sports field, and banks in a wide arc around the museum quarter with its small colorful wooden houses. It skims the red-tiled rooftops and narrow lanes of the lower town, glides along the eastern waterfront promenade, then swings an elegant loop out over the Landungsbrücke pier and the small crescent harbor beach, sunlight glittering on the shallow turquoise water. Passing the row of brightly painted Hummerbuden lobster huts, it drops to two meters above the water, threads through the southern harbor between moored fishing boats and the sea-rescue cruiser, follows the long south mole and finally accelerates out over the open sea, climbing gently into the golden haze as the shot ends.
>
> Smooth stabilized FPV-style cinematography, subtle motion blur, gentle speed ramps, wide-angle 35mm look, crisp natural color grade, realistic water, spray and light. Ambient audio: wind rush, seabird cries, distant surf, low cinematic score swelling during the dive. No text, no watermark, no map overlay, no UI elements.

## Ergebnis (Version 1: schnell/kinetisch, 15 s)

- Job-ID: `9b815a61-4a7c-4244-b607-9480d395c61a`
- Video: https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260728_114459_9b815a61-4a7c-4244-b607-9480d395c61a.mp4

---

# Version 2: Dokumentarischer 30-Sekunden-Film (final)

Nach Feedback überarbeitet: Das Video startet wörtlich auf dem Original-Google-Maps-Screenshot
mit der roten Route (Startbild), die Karte verwandelt sich beim langsamen Eintauchen in die
reale Insel. Tempo deutlich langsamer, einfühlsam, dokumentarisch. Da kein Modell 30 s am
Stück kann (Maximum 15 s), wurde der Film als zwei nahtlose Kapitel gebaut und per ffmpeg
(Higgsfield-Sandbox) zusammengefügt.

## Pipeline

1. **Teil 1** (Seedance 2.0, 15 s, 1080p): `start_image` = Route-Screenshot, Übersichtskarte
   als Referenz. Karten-Eröffnung → langsamer Sinkflug aus 300 m → ruhige halbe Umrundung
   der Langen Anna. Job `13b77489-294c-44ec-9c2e-98281a5b52bf`.
2. **Letztes Frame von Teil 1** per ffmpeg in der Higgsfield-Cloud-Sandbox extrahiert und
   als Bild wieder hochgeladen (Media `5ee4a0d1-cd13-470e-8d39-a648e7c821a4`).
   Hinweis: Eine Job-ID direkt als `start_image` zu übergeben funktioniert nicht —
   der Server setzt dann die Videodatei ein und der Job schlägt fehl.
3. **Teil 2** (Seedance 2.0, 15 s, 1080p): `start_image` = extrahiertes Frame.
   Klippenkante → Oberland → Stadt → Hummerbuden → Landungsbrücke → Südhafen →
   Abschied über die Südmole aufs offene Meer. Job `ece1a28e-f32a-4deb-ac8c-ceb82035f148`.
4. **Zusammenfügen** in der Sandbox: ffmpeg concat (Video+Audio, x264 crf 18), 30,1 s,
   Upload zurück in den Higgsfield-Speicher.

Veo 3 (die Engine hinter Google Flow) wurde zweimal probiert (preview + fast), beide Male
abgelehnt — vermutlich wegen des Google-Brandings/der UI-Labels im Startbild. Nicht berechnet.

## Finale Videos

- **30-Sekunden-Film (final):** https://d2ol7oe51mr4n9.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/972bf77e-643c-4dd8-bc2a-02dd63be4e54.mp4
- Teil 1 einzeln: https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260728_115953_13b77489-294c-44ec-9c2e-98281a5b52bf.mp4
- Teil 2 einzeln: https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260728_122228_ece1a28e-f32a-4deb-ac8c-ceb82035f148.mp4

## Prompts Version 2 (englisch, gekürzt auf die Kernpunkte)

**Teil 1:** Documentary-style aerial film. Begins on the actual Google Maps screenshot
(start frame) with labels and the hand-drawn red route line; the camera pushes slowly into
the map, labels and red line dissolve as the satellite image becomes the real island from
300 m altitude in soft evening light. Calm, patient descent toward the northwestern tip;
gentle, unhurried half-orbit around Lange Anna, seabirds along the Lummenfelsen. Slow
observational camerawork, no speed ramps. Ambient audio: wind, surf, seabirds, sparse piano.

**Teil 2:** Continues seamlessly from the provided start frame at the cliff edge. Slow glide
along the clifftop, gently down over the plateau to the town, red rooftops, waterfront
promenade, Hummerbuden, pause above the Landungsbrücke, low and slow across the southern
harbor past fishing boats and the sea-rescue cruiser, then out along the south mole over the
open sea, rising gently — a quiet, wistful farewell. Same documentary pacing and ambience.
