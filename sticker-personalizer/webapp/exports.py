"""Exporte: Ledger als CSV und Produktionsnachweis als PDF."""

from __future__ import annotations

import csv
import io

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (Paragraph, SimpleDocTemplate, Spacer, Table,
                                TableStyle)


def ledger_csv(rows: list[dict]) -> bytes:
    """Produzierte Nummern als CSV (Semikolon, UTF-8 mit BOM für Excel)."""
    out = io.StringIO()
    w = csv.writer(out, delimiter=";")
    w.writerow(["Protokoll-ID", "Team", "Country-Code", "Nummer", "Siegel",
                "Nachdruck", "Benutzer", "Lauf", "Zeitpunkt"])
    for r in rows:
        w.writerow([r.get("protocol_id"), r.get("team"), r.get("country"),
                    r.get("ref"), r.get("seal") or "", "ja" if r.get("is_reprint") else "nein",
                    r.get("username") or "", r.get("run_id") or "", r.get("produced_at") or ""])
    return out.getvalue().encode("utf-8-sig")


def certificate_pdf(protocol: dict, country: str, rows: list[dict], coverage: dict,
                    generated_by: str, generated_at: str) -> bytes:
    """Produktionsnachweis als PDF: Zusammenfassung + Tabelle aller Nummern mit Siegel."""
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, topMargin=18 * mm, bottomMargin=16 * mm,
                            leftMargin=16 * mm, rightMargin=16 * mm,
                            title=f"Produktionsnachweis {protocol.get('name','')}")
    styles = getSampleStyleSheet()
    h1, h2, normal = styles["Title"], styles["Heading2"], styles["BodyText"]
    accent = colors.HexColor("#C0392B")

    story = [Paragraph("Produktionsnachweis", h1)]
    cov = coverage or {}
    gaps = ", ".join(cov.get("gaps", [])) or "lückenlos"
    summary = (
        f"<b>Protokoll:</b> {protocol.get('name','?')}<br/>"
        f"<b>Quelle:</b> {protocol.get('team','?')} {country} "
        f"(Referenz-Master {protocol.get('src_ref','????')})<br/>"
        f"<b>Country-Code:</b> {country}<br/>"
        f"<b>Anzahl Nummern:</b> {cov.get('count', len(rows))}<br/>"
        f"<b>Bereich:</b> {cov.get('min','?')}–{cov.get('max','?')}<br/>"
        f"<b>Lücken:</b> {gaps}<br/>"
        f"<b>Erstellt von:</b> {generated_by} &nbsp; <b>am:</b> {generated_at}"
    )
    story += [Spacer(1, 6 * mm), Paragraph(summary, normal), Spacer(1, 6 * mm),
              Paragraph("Erzeugte Nummern", h2)]

    data = [["Nummer", "Siegel", "Nachdruck", "Benutzer", "Zeitpunkt"]]
    for r in rows:
        data.append([f"{r.get('team','')} {r.get('country','')} {r.get('ref','')}",
                     r.get("seal") or "—", "ja" if r.get("is_reprint") else "—",
                     r.get("username") or "—", (r.get("produced_at") or "")[:19]])
    table = Table(data, repeatRows=1, colWidths=[45 * mm, 38 * mm, 22 * mm, 28 * mm, 38 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), accent),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 8),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#BBBBBB")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F4F4F4")]),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(table)
    story += [Spacer(1, 8 * mm),
              Paragraph("Jede Nummer trägt ein HMAC-Siegel mit Prüfziffer (mod 97); "
                        "damit ist nachträglich überprüfbar, dass sie aus dieser "
                        "Produktion stammt.", styles["Italic"])]
    doc.build(story)
    return buf.getvalue()
