# Website-Baukasten – Onboarding-Anleitung (DomainFactory / Duda)

Kundenfreundliche Kurzanleitung als druckfertige A4-PDF: Texte ändern, Bilder
einfügen, Blogbeitrag schreiben & veröffentlichen.

## Dateien
- `anleitung.html` – die Quelle (alles inline, keine externen Abhängigkeiten)
- `Website-Baukasten-Anleitung.pdf` – die fertige PDF zum Aushändigen (9 Seiten)

## Logo & Kontaktdaten eintragen
In `anleitung.html` diese Platzhalter per Suchen & Ersetzen austauschen:

| Platzhalter        | Bedeutung                    |
|--------------------|------------------------------|
| `[DEINE AGENTUR]`  | Agentur-/Absendername        |
| `[DEINE-WEBSITE.DE]` | Website der Agentur        |
| `[SUPPORT-EMAIL]`  | Kontakt-E-Mail               |
| `[SUPPORT-TELEFON]`| Kontakt-Telefon              |

Eigenes **Logo**: im Deckblatt den Block `<div class="logo-slot">…</div>`
durch ein `<img src="assets/logo.png" style="height:26px">` ersetzen.

## PDF neu erzeugen
```bash
chromium --headless=new --no-pdf-header-footer \
  --print-to-pdf=Website-Baukasten-Anleitung.pdf anleitung.html
```
(oder die HTML im Browser öffnen → Drucken → „Als PDF speichern“, A4,
Ränder „Keine“, Hintergrundgrafiken aktivieren).
