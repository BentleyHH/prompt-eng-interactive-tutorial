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


# Schreibrichtung -> insert_text-Drehwinkel (gedrehte Nummern bleiben gedreht).
_DIR_ROTATE = {(1, 0): 0, (0, -1): 90, (-1, 0): 180, (0, 1): 270}


def role_pages(doc) -> list[tuple]:
    """Liefere die Rollen-Seiten als (Seitenindex, Officer-ID) in Reihenfolge."""
    pages = []
    for i, page in enumerate(doc):
        ids = sorted(set(re.findall(r"\b(74\d{3})\b", page.get_text())))
        if ids:
            pages.append((i, ids[0]))
    return pages


def _renumber_page(page, orig_id: str, new_id: str, base_url: Optional[str]) -> None:
    """Ersetze auf einer Rollen-Seite die Officer-ID (Text + beide QR-Codes)."""
    ops = []
    for b in page.get_text("dict")["blocks"]:
        if b["type"] != 0:
            continue
        for l in b["lines"]:
            rot = _DIR_ROTATE.get((round(l.get("dir", (1, 0))[0]),
                                   round(l.get("dir", (1, 0))[1])), 0)
            for s in l["spans"]:
                if orig_id in s["text"]:
                    bbox = fitz.Rect(s["bbox"])
                    size = s["size"]
                    ox, oy = s["origin"]
                    # Lösch-Box eng um die Glyphen (Font-Metrik), damit darüber
                    # liegender Text (z.B. "Officer ID") nicht angeschnitten wird.
                    if rot == 0:
                        red = fitz.Rect(bbox.x0, oy - 0.82 * size, bbox.x1, oy + 0.16 * size)
                    elif rot == 90:
                        red = fitz.Rect(ox - 0.16 * size, bbox.y0, ox + 0.82 * size, bbox.y1)
                    else:
                        red = bbox
                    page.add_redact_annot(red, fill=(1, 1, 1))
                    ops.append((s["origin"], s["text"].replace(orig_id, new_id), size, rot))
    if ops:
        page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
        for origin, text, size, rot in ops:
            page.insert_text(origin, text, fontname="hebo", fontsize=size,
                             color=(0.137, 0.122, 0.125), rotate=rot)
    # QR-Codes neu setzen (Inhalt = Basis-URL + ID oder 'Officer ID <id>')
    payload = f"{base_url.rstrip('/')}/{new_id}" if base_url else f"Officer ID {new_id}"
    pix = _qr_pixmap(payload)
    for rect in (_QR_BIG, _QR_SMALL):
        page.draw_rect(rect + (-1.5, -1.5, 1.5, 1.5), color=None, fill=(1, 1, 1))
        page.insert_image(rect, pixmap=pix, keep_proportion=True)


def renumber_build(original_pdf: str | Path, start: int, out_pdf: str | Path,
                   base_url: Optional[str] = None, include_cover: bool = True) -> dict:
    """Erzeuge ein Booklet, in dem die Officer-IDs ab ``start`` fortlaufend neu
    vergeben werden (Design/Rollen bleiben gleich, nur Nummern + QR-Codes ändern
    sich). Liefert ein Info-Dict mit der ID-Zuordnung."""
    src = fitz.open(original_pdf)
    pages = role_pages(src)
    out = fitz.open()
    if include_cover:
        out.insert_pdf(src, from_page=0, to_page=0)
    mapping = []
    for n, (pi, orig_id) in enumerate(pages):
        new_id = str(int(start) + n)
        out.insert_pdf(src, from_page=pi, to_page=pi)
        _renumber_page(out[-1], orig_id, new_id, base_url)
        mapping.append((orig_id, new_id))
    out_pdf = Path(out_pdf)
    out.save(out_pdf, garbage=4, deflate=True)
    out.close()
    src.close()
    return {"path": out_pdf, "count": len(mapping), "mapping": mapping,
            "first": mapping[0][1] if mapping else None,
            "last": mapping[-1][1] if mapping else None}
