# Zahnarztpraxis Dr. Stiehler · Helgoland — Website-Neugestaltung

Eine komplett neu gestaltete, moderne One-Page-Website für die Zahnarztpraxis
Dr. med. dent. Willi Stiehler auf Helgoland. Maritimes Design, cinematischer
Hintergrundfilm (Orbit-Kamerafahrt um die *Lange Anna*) und mit KI optimierte
Bildwelten.

## Inhalt

```
zahnarzt-helgoland-website/
├── index.html        # komplette Seite (semantisch, SEO-Meta, OpenGraph)
├── css/style.css     # maritimes Design-System, responsive, Animationen
├── js/main.js        # Navigation, Scroll-Reveal, sanfter Parallax
└── assets/           # für lokale Medien (siehe Hinweis unten)
```

## Highlights

- **Hero mit Hintergrundfilm** – Vollbild-Video (Orbit um die Lange Anna),
  automatisch, stummgeschaltet, in Endlosschleife. Zweiter großer Filmeinsatz
  in der Sektion „Die Insel".
- **Maritimes Design** – Helgoland-Rot, Nordsee-Türkis & Navy, elegante
  Serifen-Headlines (Cormorant Garamond) + klare Grotesk (Inter).
- **Sektionen** – Willkommen/Philosophie, Leistungen (7 Karten), Praxis,
  Über Dr. Stiehler, Die Insel, Galerie, Kontakt mit Terminformular.
- **Responsive & barrierearm** – mobiles Burger-Menü, `prefers-reduced-motion`,
  Tap-to-Call-Button.
- **Mit Higgsfield optimierte Bilder** – Lange Anna, Hafen mit Hummerbuden,
  Praxis-Interieur mit Meerblick, Zahnarzt-Porträt, Patienten-Lächeln.

## Wichtiger Hinweis zu den Medien

Die Bilder und der Film wurden mit **Higgsfield** erzeugt und liegen auf dessen
öffentlichem CDN. In `index.html` sind sie direkt per URL eingebunden – die
Seite ist damit sofort online lauffähig (Browser lädt die Medien vom CDN).

**Für eine vollständig lokale (offline) Version** die folgenden Dateien
herunterladen, in `assets/` ablegen und die URLs in `index.html` durch die
lokalen Pfade ersetzen:

| Lokaler Pfad | Quelle (Higgsfield CDN) |
|---|---|
| `assets/img/hero-cliffs.jpg` | `.../hf_20260613_074541_cf39d371-...png` (Lange Anna) |
| `assets/img/harbor.jpg` | `.../hf_20260613_074542_9adf10a7-...png` (Hafen) |
| `assets/img/praxis-interior.jpg` | `.../hf_20260613_074545_4ed44510-...png` (Praxis) |
| `assets/img/dentist.jpg` | `.../hf_20260613_074546_49853dfa-...png` (Zahnarzt) |
| `assets/img/smile.jpg` | `.../hf_20260613_074547_301e7f9a-...png` (Lächeln) |
| `assets/video/helgoland-hero.mp4` | `.../hf_20260613_092919_3792a6cf-...mp4` (Orbit-Film) |

CDN-Basis: `https://d8j0ntlcm91z4.cloudfront.net/user_3B4FXw36K2KIMQ6fgXs9vDxxWQ9/`

## Praxisdaten (bitte vor dem Livegang prüfen)

- **Dr. med. dent. Willi Stiehler**, Zahnarztpraxis Helgoland
- Aquariumstraße 182, 27498 Helgoland · Nordsee
- Tel. 04725 · 800 61 36
- Öffnungszeiten: Mo–Fr 7:00–12:00 Uhr, Termine nach Vereinbarung

> Hinweis: Die Original-Website (zahnarzt-helgoland.com) war durch Bot-Schutz
> nicht direkt auslesbar; die Kontaktdaten stammen aus öffentlichen
> Verzeichnissen und sollten vor Veröffentlichung verifiziert werden. Das
> Terminformular ist eine Demo und muss an ein Mail-/Praxissystem angebunden
> werden. Impressum & Datenschutz sind als Platzhalter zu ergänzen.

## Lokal ansehen

Einfach `index.html` im Browser öffnen (Internetverbindung für die CDN-Medien
vorausgesetzt) oder lokal serven:

```bash
cd zahnarzt-helgoland-website
python3 -m http.server 8000
# http://localhost:8000
```
