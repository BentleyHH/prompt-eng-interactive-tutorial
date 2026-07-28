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

## Ergebnis

- Job-ID: `9b815a61-4a7c-4244-b607-9480d395c61a`
- Video: https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/hf_20260728_114459_9b815a61-4a7c-4244-b607-9480d395c61a.mp4
