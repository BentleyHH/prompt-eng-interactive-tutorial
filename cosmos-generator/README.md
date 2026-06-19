# Kosmos-Generator

Ein eigenständiger, interaktiver Knoten-/Wolken-Generator als **eine einzige HTML-Datei** — komplett offline, ohne Server, ohne Internet.

## Öffnen

`index.html` per Doppelklick im Browser öffnen. Das war's. Beim Start wird ein Beispiel-Kosmos angezeigt.

## Funktionen

| Bereich | Was es kann |
|---|---|
| **Navigation** | Mausrad = Zoom, Hintergrund ziehen = Verschieben, Knoten ziehen = bewegen. Die Wolke „lebt" und driftet leicht. |
| **Details** | Klick auf einen Knoten öffnet rechts ein kleines Fenster mit Ebene, Gruppe, übergeordnetem Knoten und allen Verbindungen (anklickbar). |
| **Import** | „＋ Importieren": Gliederung als Text einfügen **oder** eine `.docx`/`.txt` hochladen. Nummerierung wie `1`, `1.2`, `1.2.1` (Kinder & Kindeskinder) wird automatisch in die Hierarchie übersetzt. Word-Dateien werden direkt im Browser entpackt und gelesen. |
| **Einstellungen** | Hintergrundfarbe, Kosmos-Grundfarbe (Blau/Rot/Grün oder frei), pro Gruppe (Hauptzweig) eine eigene Farbe, Lebendigkeit (Bewegung) und Knoten-Abstand. |
| **Export** | „⬇ Als HTML exportieren" erzeugt eine neue, eigenständige HTML-Datei (`mein-kosmos.html`) mit den aktuellen Daten + Einstellungen fest eingebacken. Diese Datei läuft überall, ganz ohne diesen Generator. |

## Import-Format

```
1 Universum
1.1 Galaxie Andromeda
1.1.1 Sonnensystem
1.2 Milchstraße
2 Wissen
2.1 Physik
```

- Die Anzahl der Punkte in der Nummer bestimmt die Tiefe (`1.2.1` = Ebene 2).
- Jeder oberste Zweig (`1`, `2`, `3` …) ist eine **Gruppe** und bekommt eine eigene Farbe.
- Alternativ funktioniert auch reine Einrückung (Tabs/Leerzeichen) oder Aufzählungszeichen.

## Technik

Reines HTML + Canvas-2D + Vanilla-JS. Keine externen Bibliotheken, keine CDNs.
`.docx`-Import nutzt die im Browser eingebaute `DecompressionStream`-API, um das
ZIP zu entpacken und `word/document.xml` auszulesen.
