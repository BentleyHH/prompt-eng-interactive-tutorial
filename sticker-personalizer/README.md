# ETAF Officer-ID Sticker-Personalisierung

Werkzeug, um das **Officer-Management-Booklet** (die Aufkleber-/Badge-PDF
`OM_BOOKLET_…_74401_74445.pdf`) anhand einer **Excel-Tabelle** individuell zu
personalisieren. Pro Person wird eine Seite erzeugt mit:

- **Name** (im Namensfeld des Badges),
- **Bedeutung / Rolle** (z. B. `ENTRANCE EXIT A`, `CBRN COMMANDER`) und Team,
- **Officer-ID**,
- einem **pro Person eindeutigen QR-Code** (zwei Stück je Seite – auf Badge und
  Logbuch-Label).

Heraus kommt eine **druckfertige Booklet-PDF** im Format und Stil des Originals.

---

## Was die PDF enthält (Analyse des Originals)

- **46 Seiten**: 1 Titelseite + 45 Rollen-/Aufkleberseiten (IDs `74401`–`74445`).
- Format **226,6 × 313,6 mm** (inkl. Beschnitt/Crop-Marks), Adobe InDesign.
- Pro Seite **zwei Aufkleber**: ein **Badge** (ETAF-Logo, QR, Team, Rolle,
  Officer-ID, Site/Name-Feld) und ein **Logbuch-Label** (Officer-ID, kleiner QR,
  Formular NAME/RANK/AGENCY/… + „FILL OUT + SCAN / ATTACH TO LOGBOOK“), plus eine
  **türkise Seitenleiste** (#045B74) mit großem vertikalem Rollentext.
- Die beiden QR-Codes kodierten im Original jeweils den Text `Officer ID 74401`.
  Beim Personalisieren werden sie durch person-individuelle Codes ersetzt.

---

## Zwei Betriebsarten

| Modus | Befehl | Ergebnis |
|-------|--------|----------|
| **overlay** | `overlay` | Nutzt die **Original-PDF** als Hintergrund und personalisiert nur QR + Name. **Druckidentisch** zum Original. Empfohlen, wenn die vorhandenen 45 Rollen genutzt werden. |
| **generate** | `generate` | Rendert das Booklet aus einer **selbst entworfenen Vorlage** komplett neu. **Frei skalierbar** für beliebig viele Personen und freie Rollen/Teams. |

---

## Installation

```bash
cd sticker-personalizer
pip install -r requirements.txt
```

## Benutzung

**1) Excel-Vorlage erzeugen** (Beispieldaten + Legende):

```bash
python personalize.py init-excel teams.xlsx
```

Spalten (Überschriften werden deutsch/englisch und groß/klein tolerant erkannt):

| Spalte | Bedeutung | Pflicht |
|--------|-----------|---------|
| `Name` | Name der Person → Namensfeld | empfohlen |
| `Bedeutung` (`Rolle`/`Role`) | Rolle/Funktion, z. B. `ENTRANCE EXIT A` | ja |
| `Team` | Kategorie, z. B. `CONTROL`, `CBRN`, `CSI`, `DVI` | optional |
| `OfficerID` (`ID`/`Nummer`) | Nummer; **leer = automatisch ab 74401** | optional |
| `Site` | Standort/Einsatzort | optional |
| `QR` (`URL`) | Eigener QR-Inhalt; **leer = automatisch** | optional |

**2a) Druckidentisch aus dem Original personalisieren:**

```bash
python personalize.py overlay teams.xlsx \
    --original OM_BOOKLET_260209_Booklet_1_74401_74445.pdf \
    --out booklet_personalisiert.pdf \
    --qr-base-url https://etaf.example/o
```

**2b) Neu aus selbst entworfener Vorlage erzeugen:**

```bash
python personalize.py generate teams.xlsx \
    --out booklet_neu.pdf \
    --qr-base-url https://etaf.example/o
```

### QR-Inhalt

Priorität: **Spalte `QR`** > **`--qr-base-url` + OfficerID** > Fallback
`Officer ID <id>` (wie im Original). Mit `--qr-base-url https://etaf.example/o`
ergibt sich z. B. `https://etaf.example/o/74401` – pro Person eindeutig.

### Nützliche Optionen

- `overlay --no-cover` – Titelseite weglassen.
- `overlay --no-name` – Namensfeld leer lassen (nur QR ersetzen).
- `generate --logo eigenes_logo.png` – eigenes Logo statt ETAF.

---

## Projektstruktur

```
sticker-personalizer/
├── personalize.py          CLI (init-excel | overlay | generate)
├── requirements.txt
├── assets/etaf_logo.png    aus dem Original extrahiertes Logo
├── examples/
│   ├── teams_example.xlsx          Beispiel-Tabelle
│   └── sample_output_generate.pdf  Muster-Ergebnis (generate-Modus)
└── sticker/
    ├── config.py           Maße, Farben, Positionen
    ├── qr_util.py          QR-Erzeugung (Vektor/Bild)
    ├── excel_io.py         Excel lesen + Datenmodell
    ├── overlay.py          Modus „overlay“
    └── template.py         Modus „generate“ (eigene Vorlage)
```

## Hinweise

- Die **Original-PDF wird nicht mitgeliefert**; für den `overlay`-Modus den
  eigenen Pfad via `--original` angeben.
- Für scharfen Druck werden QR-Codes im `generate`-Modus als **Vektor**
  gezeichnet, im `overlay`-Modus als hochauflösendes Bild eingesetzt.
- Die Schrift ist Helvetica-Bold (metrisch nah an Arial-BoldMT des Originals).
