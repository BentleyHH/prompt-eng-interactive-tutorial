"""Modus "overlay": Original-PDF wiederverwenden und personalisieren.

Der Druck sieht damit exakt aus wie das Original – es werden nur die beiden
QR-Codes durch personenindividuelle Codes ersetzt und das Namensfeld gefüllt
(optional auch die Officer-ID überschrieben). Ergebnis: pro Person eine Seite,
in der Reihenfolge der Excel-Tabelle.
"""

from __future__ import annotations

import io
import re
from pathlib import Path
from typing import Optional

import fitz  # PyMuPDF

from . import qr_util
from .excel_io import Person

# QR-Positionen im Original (PDF-Koordinaten, Ursprung oben links).
_QR_BIG = fitz.Rect(209.8, 94.0, 288.8, 173.0)
_QR_SMALL = fitz.Rect(230.0, 558.5, 273.75, 602.25)
# Schreibfläche des Namensfeldes (oberhalb des "Name:"-Labels).
_NAME_BOX = fitz.Rect(138.0, 249.0, 303.0, 281.0)


def _page_id_map(doc: "fitz.Document") -> dict[str, int]:
    """Ordne jeder 5-stelligen Officer-ID die Seitenzahl im Original zu."""
    mapping: dict[str, int] = {}
    for i, page in enumerate(doc):
        for m in re.findall(r"\b(74\d{3})\b", page.get_text()):
            mapping.setdefault(m, i)
    return mapping


def _qr_pixmap(data: str) -> "fitz.Pixmap":
    img = qr_util.make_image(data, box_pixels=900, border=2)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return fitz.Pixmap(buf.getvalue())


def _fit_text(page, rect, text, fontsize_max=15.0, fontsize_min=6.0):
    """Schreibe ``text`` zentriert in ``rect`` mit größtmöglicher Schrift."""
    size = fontsize_max
    while size >= fontsize_min:
        rc = page.insert_textbox(
            rect, text, fontname="hebo", fontsize=size,
            color=(0.137, 0.122, 0.125), align=fitz.TEXT_ALIGN_CENTER,
        )
        if rc >= 0:
            return
        size -= 0.5
    # Notfalls kleinstmöglich (abgeschnitten) setzen.
    page.insert_textbox(rect, text, fontname="hebo", fontsize=fontsize_min,
                        color=(0.137, 0.122, 0.125), align=fitz.TEXT_ALIGN_CENTER)


def personalize_page(page, person: Person, base_url: Optional[str],
                     write_name: bool = True) -> None:
    """Personalisiere eine bereits in das Ziel-Dokument kopierte Seite."""
    payload = person.qr_payload(base_url)
    pix = _qr_pixmap(payload)

    for rect in (_QR_BIG, _QR_SMALL):
        # Alten QR mit Weiß abdecken (minimal größer) ...
        cover = rect + (-1.5, -1.5, 1.5, 1.5)
        page.draw_rect(cover, color=None, fill=(1, 1, 1))
        # ... und neuen QR exakt an gleicher Stelle einsetzen.
        page.insert_image(rect, pixmap=pix, keep_proportion=True)

    if write_name and person.name:
        _fit_text(page, _NAME_BOX, person.name)


def build(original_pdf: str | Path, people: list[Person], out_pdf: str | Path,
          base_url: Optional[str] = None, include_cover: bool = True,
          write_name: bool = True) -> Path:
    """Erzeuge das personalisierte Booklet aus dem Original.

    Für jede Person wird die zu ihrer Officer-ID passende Original-Seite
    kopiert und personalisiert. Gibt es keine passende ID, wird eine neutrale
    Blanko-Vorlagenseite (74440–74445) verwendet.
    """
    src = fitz.open(original_pdf)
    id_map = _page_id_map(src)
    blank_ids = [i for i in ("74440", "74441", "74442", "74443", "74444", "74445")
                 if i in id_map]
    out = fitz.open()

    if include_cover:
        out.insert_pdf(src, from_page=0, to_page=0)

    for person in people:
        idx = id_map.get(person.officer_id)
        if idx is None:
            idx = id_map[blank_ids[0]] if blank_ids else 1
        out.insert_pdf(src, from_page=idx, to_page=idx)
        personalize_page(out[-1], person, base_url, write_name=write_name)

    out_pdf = Path(out_pdf)
    out.save(out_pdf, garbage=4, deflate=True)
    out.close()
    src.close()
    return out_pdf
