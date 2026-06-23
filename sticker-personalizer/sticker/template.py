"""Modus "generate": selbst entworfene, druckfertige Vorlage.

Rendert pro Person eine Seite im Stil des Original-Booklets neu – mit
ETAF-Logo, Team-Kategorie, Rolle/Bedeutung, Namensfeld, Officer-ID, einem
ausfüllbaren Logbuch-Label und der türkisen Seitenleiste mit vertikalem
Rollentext. Voll flexibel für beliebig viele Personen und freie Rollen.
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

from . import config as cfg
from . import qr_util
from .excel_io import Person

# Linke Aufkleber-Spalte.
LX0, LX1 = 33.0, 306.0
LW = LX1 - LX0
# Türkise Seitenleiste.
SB_X0, SB_X1 = 330.0, cfg.PAGE_W - 15.0


def _box(c, x0, y0, x1, y1, lw=1.4):
    c.setLineWidth(lw)
    c.setStrokeColorRGB(*cfg.INK)
    c.rect(x0, y0, x1 - x0, y1 - y0, stroke=1, fill=0)


def _centered(c, cx, y, text, font, size, color=cfg.INK):
    c.setFont(font, size)
    c.setFillColorRGB(*color)
    c.drawCentredString(cx, y, text)


def _fit_centered(c, x0, x1, y, text, font, max_size, min_size=8.0, color=cfg.INK):
    """Zentrierter Text, dessen Größe auf die Breite eingepasst wird."""
    from reportlab.pdfbase.pdfmetrics import stringWidth

    avail = (x1 - x0) - 8
    size = max_size
    while size > min_size and stringWidth(text, font, size) > avail:
        size -= 0.5
    _centered(c, (x0 + x1) / 2, y, text, font, size, color)


def _label(c, x, y, text, size=10.5):
    c.setFont(cfg.FONT_BOLD, size)
    c.setFillColorRGB(*cfg.INK)
    c.drawString(x, y, text)


def _sidebar(c, role_text: str):
    """Türkise Leiste rechts mit großem, vertikal laufendem Rollentext."""
    c.setFillColorRGB(*cfg.TEAL)
    c.rect(SB_X0, 15.0, SB_X1 - SB_X0, cfg.PAGE_H - 30.0, stroke=0, fill=1)

    words = role_text.upper().split()
    # In bis zu zwei Zeilen aufteilen (wie im Original, z.B. "ENTRANCE / EXIT" + "CONTROL A").
    if len(words) <= 1:
        lines = words or [""]
    else:
        mid = (len(words) + 1) // 2
        lines = [" ".join(words[:mid]), " ".join(words[mid:])]

    from reportlab.pdfbase.pdfmetrics import stringWidth

    band_w = SB_X1 - SB_X0
    avail_len = cfg.PAGE_H - 90.0          # nutzbare Höhe entlang der Drehung
    line_gap = band_w / (len(lines) + 1)
    c.saveState()
    c.setFillColorRGB(*cfg.WHITE)
    for i, line in enumerate(lines):
        size = 78.0
        while size > 16 and stringWidth(line, cfg.FONT_BOLD, size) > avail_len:
            size -= 1
        cx = SB_X1 - line_gap * (i + 1)
        c.saveState()
        c.translate(cx, cfg.PAGE_H / 2.0)
        c.rotate(-90)                       # Text läuft von unten nach oben lesbar
        c.setFont(cfg.FONT_BOLD, size)
        c.drawCentredString(0, -size * 0.35, line)
        c.restoreState()
    c.restoreState()


def draw_page(c, person: Person, base_url: Optional[str],
              logo: Optional[ImageReader]):
    """Zeichne eine komplette personalisierte Seite auf die Canvas."""
    team = (person.team or "").upper()
    role = (person.role or "").upper()
    oid = person.officer_id
    payload = person.qr_payload(base_url)

    _sidebar(c, role or team or oid)

    top = cfg.PAGE_H - 60.0  # Oberkante des Badges

    # ---------------- Sticker 1: Badge ----------------
    # Header: Logo links, QR rechts.
    head_h = 74.0
    head_y0 = top - head_h
    _box(c, LX0, head_y0, LX1, top)
    if logo is not None:
        lw, lh = logo.getSize()
        target_w = 120.0
        target_h = target_w * lh / lw
        c.drawImage(logo, LX0 + 12, top - 14 - target_h, width=target_w,
                    height=target_h, mask="auto", preserveAspectRatio=True)
    qr_size = 60.0
    qr_util.draw_on_canvas(c, payload, LX1 - qr_size - 10, head_y0 + (head_h - qr_size) / 2,
                           qr_size, fill=cfg.INK)

    # Team-Kategorie.
    team_h = 40.0
    team_y0 = head_y0 - team_h
    _box(c, LX0, team_y0, LX1, head_y0)
    if team:
        _fit_centered(c, LX0, LX1, team_y0 + 12, team, cfg.FONT_BOLD, 28)

    # Site + Name (zwei Zellen).
    sn_h = 50.0
    sn_y0 = team_y0 - sn_h
    split = LX0 + 70.0
    _box(c, LX0, sn_y0, split, team_y0)
    _box(c, split, sn_y0, LX1, team_y0)
    _label(c, LX0 + 6, sn_y0 + 6, "Site", 9)
    _label(c, split + 6, sn_y0 + 6, "Name:", 9)
    if person.site:
        _fit_centered(c, LX0, split, sn_y0 + 24, person.site, cfg.FONT_BOLD, 12)
    if person.name:
        _fit_centered(c, split, LX1, sn_y0 + 26, person.name, cfg.FONT_BOLD, 15)

    # Rolle / Bedeutung.
    role_h = 34.0
    role_y0 = sn_y0 - role_h
    _box(c, LX0, role_y0, LX1, sn_y0)
    if role:
        _fit_centered(c, LX0, LX1, role_y0 + 10, role, cfg.FONT_BOLD, 22)

    # Officer ID + Nummer.
    oidlab_h = 52.0
    oidlab_y0 = role_y0 - oidlab_h
    _box(c, LX0, oidlab_y0, LX1, role_y0)
    _fit_centered(c, LX0, LX1, oidlab_y0 + 14, "Officer ID", cfg.FONT_BOLD, 46)
    num_h = 60.0
    num_y0 = oidlab_y0 - num_h
    _box(c, LX0, num_y0, LX1, oidlab_y0)
    _fit_centered(c, LX0, LX1, num_y0 + 14, oid, cfg.FONT_BOLD, 50)

    # ---------------- Sticker 2: Logbuch-Label ----------------
    gap = 16.0
    s2_top = num_y0 - gap

    l_lab_h = 44.0
    l_lab_y0 = s2_top - l_lab_h
    _box(c, LX0, l_lab_y0, LX1, s2_top)
    _fit_centered(c, LX0, LX1, l_lab_y0 + 12, "Officer ID", cfg.FONT_BOLD, 40)

    l_num_h = 58.0
    l_num_y0 = l_lab_y0 - l_num_h
    _box(c, LX0, l_num_y0, LX1, l_lab_y0)
    small_qr = 44.0
    qr_util.draw_on_canvas(c, payload, LX1 - small_qr - 10,
                           l_num_y0 + (l_num_h - small_qr) / 2, small_qr, fill=cfg.INK)
    _centered(c, LX0 + 95, l_num_y0 + 16, oid, cfg.FONT_BOLD, 46)

    # Ausfüllbares Formular.
    rows = ["NAME:", "RANK:", "AGENCY:", "PHONE:",
            ("DATE:", "TIME:"), ("TEAM:", "SITE:"), "SIGNATURE:"]
    row_h = 20.0
    sig_h = 56.0
    y = l_num_y0
    c.setLineWidth(1.0)
    for row in rows:
        h = sig_h if row == "SIGNATURE:" else row_h
        y0 = y - h
        if isinstance(row, tuple):
            mid = LX0 + LW / 2
            _box(c, LX0, y0, mid, y)
            _box(c, mid, y0, LX1, y)
            _label(c, LX0 + 5, y0 + h - 14, row[0], 9.5)
            _label(c, mid + 5, y0 + h - 14, row[1], 9.5)
        else:
            _box(c, LX0, y0, LX1, y)
            _label(c, LX0 + 5, y0 + h - 14, row, 9.5)
        y = y0

    # Fußnote.
    _centered(c, (LX0 + LX1) / 2, y - 22, "FILL OUT + SCAN", cfg.FONT_BOLD, 16, cfg.GREY)
    _centered(c, (LX0 + LX1) / 2, y - 42, "ATTACH TO LOGBOOK", cfg.FONT_BOLD, 16, cfg.GREY)


def build(people: list[Person], out_pdf: str | Path,
          base_url: Optional[str] = None,
          logo_path: str | Path | None = cfg.LOGO_PATH) -> Path:
    """Erzeuge das personalisierte Booklet komplett neu (selbst entworfene Vorlage)."""
    out_pdf = Path(out_pdf)
    logo = None
    if logo_path and Path(logo_path).exists():
        logo = ImageReader(str(logo_path))
    c = canvas.Canvas(str(out_pdf), pagesize=(cfg.PAGE_W, cfg.PAGE_H))
    for person in people:
        draw_page(c, person, base_url, logo)
        c.showPage()
    c.save()
    return out_pdf
