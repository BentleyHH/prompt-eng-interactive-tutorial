# ETAF Trainer-Koordination — Installation & App aufs Handy

Dieses Paket enthält das komplette Dashboard. Vorgeladen ist das reale
**Operational DVI Elite Team Programme 2026–2027** (Abu Dhabi Police, 24 Einsätze).
**Zugangs-PIN: `481509`**

## Was ist drin

```
trainer-dashboard/
  index.html              ← die App (Demo-Modus läuft ohne Server)
  manifest.webmanifest    ← macht die App auf dem Handy installierbar
  icons/                  ← App-Icon (ETAF) in allen Größen
  config.js.sample        ← Vorlage, um den Live-Modus einzuschalten
  README.md               ← Überblick / Funktionen
  DEPLOY.md               ← Server-Einrichtung (PHP + MySQL, artfiles.de)
  INSTALL.md              ← diese Anleitung
  backend/                ← PHP-Backend (nur für den Live-Betrieb nötig)
```

---

## Variante A — Nur schnell ansehen (Demo, ohne Server)

`index.html` doppelklicken → öffnet im Browser. Alles läuft lokal im Browser
(localStorage), Versand/Rücklauf sind simuliert. PIN `481509` (im Demo-Modus
entsperrt jede 6-stellige Zahl).

> Hinweis: Die **Installation aufs Handy (Home-Bildschirm, Fullscreen)** funktioniert
> nur, wenn die App über **`https://…`** ausgeliefert wird — also über Variante B.
> Lokal geöffnete Dateien (`file://`) kann iOS/Android nicht als App installieren.

---

## Variante B — Auf einen Webserver / artfiles.de laden (empfohlen)

So bekommst du die App aufs Handy und optional das echte Backend (zentrale
Datenbank, echte E-Mails, Mehrgeräte-Nutzung).

1. **Kompletten Ordner `trainer-dashboard/` hochladen** (FTP/SFTP oder
   artfiles-Dateimanager) in dein Web-Verzeichnis, z. B. nach `/dashboard/`.
   Wichtig: der Ordner `icons/` und `manifest.webmanifest` müssen **mit hoch**.
2. Sicherstellen, dass die Domain über **HTTPS** läuft (artfiles bietet
   kostenlose Let's-Encrypt-Zertifikate).
3. Aufrufen: `https://deine-domain.de/dashboard/` → PIN eingeben. Fertig für den
   Demo-Betrieb auf dem Server.
4. **Live-Backend** (optional, für zentrale DB + echten E-Mail-Rückkanal):
   Anleitung in **`DEPLOY.md`** — `backend/config.php` aus `config.sample.php`
   anlegen und `config.js` aus `config.js.sample` neben `index.html` erstellen.

---

## App aufs Handy legen (Fullscreen, mit ETAF-Icon)

Voraussetzung: Die App ist über eine **HTTPS-URL** erreichbar (Variante B).

### iPhone / iPad (Safari)
1. Die Dashboard-URL in **Safari** öffnen.
2. Unten auf **Teilen** (Quadrat mit Pfeil nach oben) tippen.
3. **„Zum Home-Bildschirm"** wählen → Name „ETAF DVI" bestätigen → **Hinzufügen**.
4. Das ETAF-Icon liegt jetzt auf dem Home-Bildschirm. Antippen startet die App
   **im Vollbild ohne Safari-Leiste**.

### Android (Chrome)
1. Die Dashboard-URL in **Chrome** öffnen.
2. Menü **⋮** → **„App installieren"** bzw. **„Zum Startbildschirm hinzufügen"**.
3. Bestätigen → das ETAF-Icon liegt auf dem Startbildschirm, Start im Vollbild.

> Tipp: Kommt der Menüpunkt nicht sofort, die Seite einmal neu laden. Chrome zeigt
> die Installation an, sobald `manifest.webmanifest` und die Icons geladen wurden.

---

## Kurz-Checkliste

- [ ] Ordner inkl. `icons/` und `manifest.webmanifest` hochgeladen
- [ ] Über **HTTPS** erreichbar
- [ ] PIN `481509` funktioniert
- [ ] iPhone: Safari → Teilen → Zum Home-Bildschirm
- [ ] (optional) Live-Backend nach `DEPLOY.md` eingerichtet

Fragen oder Anpassungen? Einfach melden.
