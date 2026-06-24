# Schnellstart für den Mac 🍎

So einfach wie möglich – du brauchst **nur Python**, sonst nichts. Kein
Homebrew, keine Zusatz-Bibliotheken.

---

## Einmalig: Python installieren

1. Diese Seite öffnen: **https://www.python.org/downloads/macos/**
2. Den großen gelben Knopf **„Download Python"** klicken.
3. Die geladene Datei (endet auf **`.pkg`**) öffnen und einfach durchklicken
   („Fortfahren" → „Installieren", evtl. Mac-Passwort eingeben).

Das war's – musst du nie wieder machen.

---

## Programm starten

1. Das ZIP **entpacken** (Doppelklick darauf).
2. Im entpackten Ordner **`Start.command`** doppelklicken.

   ⚠️ **Nur beim allerersten Mal** meldet der Mac evtl.: *„… kann nicht geöffnet
   werden, da es von einem nicht verifizierten Entwickler stammt."*
   Dann so machen:
   - Mit der Maus **Rechtsklick** (oder Ctrl + Klick) auf `Start.command`
   - **„Öffnen"** wählen → im Hinweisfenster nochmal **„Öffnen"**.

   Ab dann reicht immer ein normaler Doppelklick.

3. Es öffnet sich ein schwarzes Fenster. Beim **ersten Start** lädt es 1–2
   Minuten die Pakete – das ist normal. Danach **öffnet sich der Browser von
   selbst**.

---

## Anmelden

Im Browser erscheint der Login:

- Benutzer: **admin**
- Passwort: **admin**

Danach oben rechts unter „Passwort" gleich ein eigenes setzen. **Fertig.** 🎉

---

## Welche Booklets gehen?

Du lädst einfach das Master-PDF hoch, der Rest passiert automatisch:

- **Referenz-Booklets als Massenware** (eindeutige Nummer pro Stück): CBRN
  Red Zone, **Post Mortem (PM)**, **PM Interpol & Minnesota (PMMP)**,
  **DVI Recovery**, **CSI/Exhibit (EX)** und **Family Liaison (AMFSB / AM)**.
  Das Tool erkennt die sichtbare Referenz (z.B. `EX 971 7408`) selbst und
  tauscht sie samt **Barcode und QR-Code** überall konsistent aus. Du gibst
  nur den Nummern­bereich **von–bis** (oder Anzahl) ein.
  - **Barcode = Aufdruck:** Der Barcode bekommt immer exakt die sichtbare
    Nummer. Falls ein Master-Barcode einen abweichenden Code trug (kam bei
    CSI vor: Barcode „PM", Aufdruck „EX"), wird das automatisch korrigiert
    und als Hinweis angezeigt.
  - **QR trägt die Nummer mit:** Der QR-Code zeigt pro Stück die eindeutige
    Referenz (Basis-URL bleibt erhalten).
- **Officer-Management-Booklet** (ein Blatt pro Person): per Excel-Maske
  oder im Modus „Nur Nummern".
  - **Aufkleberfarbe:** Die Maske liest die Farbe der Seitenleiste rechts je
    Rolle aus (Spalte **„Farbe"**, z.B. `#045B74`). Brauchst du eine Person
    mehr, trägst du dort einfach die passende Farbe ein – die Leiste wird
    angeglichen, die Beschriftung bleibt. Leer = Originalfarbe bleibt.
  - **Nur Nummern:** Du gibst **Von** (und optional **Bis**) ein; das Tool
    zeigt sofort den resultierenden Bereich und vergibt die IDs fortlaufend.

## Gut zu wissen

- **Das schwarze Fenster offen lassen**, solange du arbeitest. Zum Beenden
  einfach schließen. Zum erneuten Starten wieder `Start.command` doppelklicken.
- **Backup:** Alles (Datenbank, Master-PDFs, erzeugte Drucke) liegt im
  Unterordner **`webapp/data/`**. Den per FTP sichern = komplettes Backup.
- **PDF/A-Archiv** (optional): braucht zusätzlich „Ghostscript". Nur falls du es
  nutzen willst, einmal im Terminal: `brew install ghostscript`
  (Homebrew gibt es auf https://brew.sh). Ohne das läuft alles andere normal.

## Wenn mal etwas klemmt

- „Seite nicht erreichbar" im Browser → das schwarze Startfenster muss offen
  sein; einfach `Start.command` erneut doppelklicken.
- Browser ging nicht von selbst auf → manuell **http://127.0.0.1:8765** eingeben.

---

*(Windows oder Linux? Dann stattdessen `start.bat` bzw. `start.sh` verwenden –
funktioniert genauso.)*
