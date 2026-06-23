"""ETAF Booklet-Personalisierung.

Zwei Werkzeuge in einem Paket:

1. **Officer-ID-Booklet** – das Aufkleber-/Badge-Booklet anhand einer
   Excel-Tabelle personalisieren (Name, Rolle/Bedeutung, eindeutiger QR).
2. **CBRN-Exhibit-Booklet** – ein druckfertiges Master-Booklet als Massenware
   mit je eindeutiger Referenznummer erzeugen; jede QR-/Barcode-/Text-Stelle
   wird konsistent ausgetauscht und anschließend 100%ig verifiziert.

Module:
    config        Layout- und Farbkonstanten der Officer-ID-Vorlage.
    qr_util       Erzeugung von QR-Codes als Vektor (ReportLab) und Bild.
    barcode_util  Erzeugung von Code128-Barcodes als Bild.
    excel_io      Einlesen der Excel-Tabelle und Erzeugen einer Beispiel-Datei.
    overlay       Officer-ID-Modus "overlay": Original-PDF wiederverwenden.
    template      Officer-ID-Modus "generate": eigene Vorlage neu rendern.
    booklet       CBRN-Massenproduktion: Referenznummer ersetzen + verifizieren.
"""

__version__ = "2.0.0"
