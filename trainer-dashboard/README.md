# ETAF Trainer-Koordination — Prototyp

Klickbarer Prototyp für die Koordination der Abu-Dhabi-Trainings (ca. 20 Trainingswochen
über 14 Monate, je 5–8 Trainer). Zeigt den kompletten Ablauf – von der KI-Vorauswahl über
die E-Mail-Anfrage bis zum automatischen Verfügbarkeits-Rücklauf ins Dashboard.

> **Status:** Frontend-Prototyp mit Beispieldaten. Alle Daten liegen lokal im Browser
> (`localStorage`), E-Mail-Versand & Rücklauf sind **simuliert**. Kein Backend, keine echten
> Nachrichten. Dient dazu, Flow und Design abzustimmen, bevor die produktive Version gebaut wird.

## Öffnen

`trainer-dashboard/index.html` im Browser öffnen. **Demo-PIN: `481509`** (jede 6-stellige
Zahl entsperrt). Läuft auf Desktop und Handy, hell/dunkel automatisch.

## Was der Prototyp zeigt

- **PIN-Login** (6-stellig) als Zugangsschutz
- **Übersicht** mit KPIs und Besetzungs-Timeline über alle 20 Wochen (Ampel: besetzt / in Arbeit / kritisch)
- **Trainings** mit Besetzungsstand; Detailansicht je Training
- **KI-Vorauswahl**: Trainer werden nach Fachgebiet, Region, UAE-Erfahrung, Auslastung &
  Bewertung gerankt (Fit-%). Manuell in Reihenfolge anfragen, Nachrücker rutschen nach
- **E-Mail-Composer** (Slide-over) mit Vorlagen, gefüllten Platzhaltern und Mini-Editor;
  Absender `trainer@etaf-akademie.org`
- **Simulierter Rücklauf**: nach dem Senden „trudeln Antworten ein“ und färben den Status
  (zugesagt / vielleicht / abgesagt) automatisch zurück ins Dashboard
- **Schnell-Ersatz**: Ein-Klick-Blitzanfrage an die besten verfügbaren Trainer bei Ausfall
- **Zweisprachig (DE/EN)**: Oberfläche per Umschalter (Login + Seitenleiste). Im E-Mail-Composer
  ist die **Sprache der Anfrage separat wählbar** (Standard Englisch) mit eigenen Vorlagen je Sprache —
  d. h. auf Deutsch planen, Anfragen auf Englisch versenden.
- **Vorlagen** bearbeiten & speichern (je Sprache DE/EN)
- **Import** (angedeutet): Excel/CSV, Angebot-PDF, KI-Extraktion aus Lebensläufen

Tipp: „Antwort simulieren“ am angefragten Trainer bzw. das Warten nach dem Senden zeigt den
Rücklauf. Über **◐ Design wechseln** hell/dunkel testen.

## Weg zur Vollversion (Vorschlag)

| Baustein | Prototyp | Produktiv |
|---|---|---|
| Daten | localStorage | Cloud-DB (Postgres/Supabase), multi-device, EU-Hosting (DSGVO) |
| Login | 6-stelliger Demo-PIN | PIN + Magic-Link, Rollen & Audit-Log |
| E-Mail | simuliert | Postfach `trainer@etaf…` + Versand-Service |
| Verfügbarkeit | Zufalls-Simulation | One-Click-Buttons (Magic-Link) **+** KI-Parsing freier Antworten |
| KI-Matching | Heuristik im Browser | Claude API: Profil-Anlage aus Rohdaten + Ranking |
| Reise/Logistik | angedeutet | Flug-, Hotel-, Visum- & Per-Diem-Modul (wichtig für UAE) |

Nicht vergessen: 50 Trainerprofile = personenbezogene Daten mit internationalem Transfer
(Abu Dhabi) → Einwilligung, Löschkonzept und EU-Hosting von Anfang an mitdenken.
