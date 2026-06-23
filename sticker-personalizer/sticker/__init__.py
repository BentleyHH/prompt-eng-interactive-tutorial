"""ETAF Officer-ID Sticker-Personalisierung.

Werkzeug, um das Officer-Management-Booklet (Aufkleber-/Badge-PDF) anhand
einer Excel-Tabelle individuell zu personalisieren: Name, Bedeutung/Rolle und
ein pro Person eindeutiger QR-Code je Seite.

Module:
    config      Layout- und Farbkonstanten der Vorlage.
    qr_util     Erzeugung von QR-Codes als Vektor (ReportLab) und Bild.
    excel_io    Einlesen der Excel-Tabelle und Erzeugen einer Beispiel-Datei.
    overlay     Modus "overlay": Original-PDF wiederverwenden und personalisieren.
    template    Modus "generate": selbst entworfene Vorlage neu rendern.
"""

__version__ = "1.0.0"
