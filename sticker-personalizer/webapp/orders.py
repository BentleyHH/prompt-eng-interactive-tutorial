"""Excel-Auftragsvorlage je Protokoll: erzeugen und einlesen.

Jede Zeile der Vorlage ist ein Produktionsauftrag (Bereich oder Menge). Damit
kann man bequem offline planen, die Datei ablegen/per FTP teilen und im
Dashboard wieder importieren.
"""

from __future__ import annotations

import io

from openpyxl import Workbook, load_workbook
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter

HEADERS = ["Country-Code", "Team", "Von", "Bis", "Anzahl", "Auslassen", "Modus", "Notiz"]
_HELP = {
    "Country-Code": "Ländercode, z.B. 49 (DE) oder 4971 (Abu Dhabi)",
    "Team": "Team-/Booklet-Kürzel, z.B. CBRN",
    "Von": "Startnummer, z.B. 35",
    "Bis": "Endnummer (für Bereich), z.B. 134  – ODER 'Anzahl' nutzen",
    "Anzahl": "Stückzahl ab 'Von' (falls 'Bis' leer), z.B. 100",
    "Auslassen": "Zu überspringende Nummern, z.B. 50,51,77",
    "Modus": "neu = nur unbenutzte Nummern | nachdruck = auch bereits erzeugte",
    "Notiz": "frei, z.B. 'Nachdruck Drucker-Fehler 3–48'",
}


def build_template(protocol: dict) -> bytes:
    """Erzeuge eine Auftragsvorlage (xlsx) als Bytes, vorbefüllt mit den
    erkannten Werten des Protokolls."""
    wb = Workbook()
    ws = wb.active
    ws.title = "Auftraege"

    title = Font(bold=True, color="FFFFFF")
    fill = PatternFill("solid", fgColor="C0392B")
    for c, h in enumerate(HEADERS, start=1):
        cell = ws.cell(row=1, column=c, value=h)
        cell.font = title
        cell.fill = fill
        cell.alignment = Alignment(horizontal="center")
        ws.column_dimensions[get_column_letter(c)].width = max(12, len(_HELP[h]) // 2)
    # Hinweiszeile
    for c, h in enumerate(HEADERS, start=1):
        ws.cell(row=2, column=c, value=_HELP[h]).font = Font(italic=True, size=8, color="888888")
    # Beispielzeilen, vorbefüllt
    team = protocol.get("team") or "CBRN"
    country = protocol.get("country") or "971"
    ws.append([country, team, 35, 134, None, None, "neu", "Erstauflage 100 Stück"])
    ws.append([country, team, 3, 48, None, None, "nachdruck", "Nachdruck Drucker-Fehler"])
    ws.freeze_panes = "A3"

    info = wb.create_sheet("Hinweise")
    info["A1"] = "Auftragsvorlage – so füllst du sie aus"
    info["A1"].font = Font(bold=True, size=12)
    notes = [
        "",
        "• Eine Zeile = ein Auftrag. Mehrere Zeilen sind erlaubt.",
        "• Bereich: 'Von' und 'Bis' setzen (z.B. 35 bis 134).",
        "• Menge: 'Von' und 'Anzahl' setzen, 'Bis' leer (z.B. ab 35, 100 Stück).",
        "• 'Auslassen': einzelne Nummern weglassen, z.B. 50,51,77.",
        "• Modus 'neu': bereits produzierte Nummern werden automatisch übersprungen.",
        "• Modus 'nachdruck': erzeugt auch bereits produzierte Nummern erneut.",
        "• Eindeutigkeit gilt je (Protokoll + Country-Code + Nummer).",
        f"• Dieses Protokoll: {protocol.get('name','?')} – Quelle "
        f"{team} {country} {protocol.get('src_ref','????')}.",
    ]
    for i, n in enumerate(notes, start=2):
        info[f"A{i}"] = n

    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


def parse_orders(data: bytes) -> list[dict]:
    """Lies eine ausgefüllte Auftragsvorlage und liefere normalisierte Aufträge."""
    wb = load_workbook(io.BytesIO(data), data_only=True)
    ws = wb["Auftraege"] if "Auftraege" in wb.sheetnames else wb.active
    orders: list[dict] = []
    for r in ws.iter_rows(min_row=3, values_only=True):  # Zeile 1=Header, 2=Hilfe
        if r is None or all(v is None or str(v).strip() == "" for v in r):
            continue
        country, team, von, bis, anzahl, auslassen, modus, notiz = (list(r) + [None] * 8)[:8]
        if country is None or von is None:
            continue
        orders.append({
            "country": str(country).strip(),
            "team": (str(team).strip() if team else None),
            "von": int(von),
            "bis": int(bis) if bis not in (None, "") else None,
            "anzahl": int(anzahl) if anzahl not in (None, "") else None,
            "auslassen": str(auslassen).strip() if auslassen else None,
            "modus": (str(modus).strip().lower() if modus else "neu"),
            "notiz": str(notiz).strip() if notiz else "",
        })
    return orders
