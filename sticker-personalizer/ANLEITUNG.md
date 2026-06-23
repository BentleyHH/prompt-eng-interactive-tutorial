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
- Browser ging nicht von selbst auf → manuell **http://127.0.0.1:5000** eingeben.

---

*(Windows oder Linux? Dann stattdessen `start.bat` bzw. `start.sh` verwenden –
funktioniert genauso.)*
