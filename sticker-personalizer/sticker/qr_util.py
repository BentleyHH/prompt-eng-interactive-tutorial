"""QR-Code-Erzeugung.

Liefert QR-Codes wahlweise als scharfe Vektor-Zeichnung direkt auf eine
ReportLab-Canvas (kein Qualitätsverlust beim Drucken) oder als PIL-Bild.
"""

from __future__ import annotations

import qrcode
from qrcode.constants import ERROR_CORRECT_M


def make_matrix(data: str, error_correction=ERROR_CORRECT_M, border: int = 2):
    """Erzeuge die QR-Modul-Matrix (Liste von bool-Zeilen) für ``data``."""
    qr = qrcode.QRCode(error_correction=error_correction, border=border)
    qr.add_data(data)
    qr.make(fit=True)
    return qr.get_matrix()


def draw_on_canvas(c, data: str, x: float, y: float, size: float,
                   fill=(0, 0, 0), border: int = 2) -> None:
    """Zeichne ``data`` als QR-Code als Vektor-Rechtecke auf die Canvas ``c``.

    (x, y) ist die untere linke Ecke, ``size`` die Kantenlänge in Punkt. Die
    "quiet zone" (Rand) ist in ``size`` enthalten, damit der Code an der
    gewünschten Stelle bündig sitzt.
    """
    matrix = make_matrix(data, border=border)
    n = len(matrix)
    module = size / n
    c.saveState()
    c.setFillColorRGB(*fill)
    for row_idx, row in enumerate(matrix):
        # PDF-y wächst nach oben -> oberste Matrixzeile bekommt größtes y.
        ry = y + (n - 1 - row_idx) * module
        col = 0
        while col < n:
            if row[col]:
                run = 1
                while col + run < n and row[col + run]:
                    run += 1
                # Rechtecke pro zusammenhängendem Lauf zeichnen (kleinere PDF).
                c.rect(x + col * module, ry, module * run, module,
                       stroke=0, fill=1)
                col += run
            else:
                col += 1
    c.restoreState()


def make_image(data: str, box_pixels: int = 600, border: int = 2):
    """Erzeuge ein scharfes PIL-Schwarzweißbild des QR-Codes."""
    from PIL import Image

    matrix = make_matrix(data, border=border)
    n = len(matrix)
    scale = max(1, box_pixels // n)
    img = Image.new("1", (n * scale, n * scale), 1)
    px = img.load()
    for r, row in enumerate(matrix):
        for col, val in enumerate(row):
            if val:
                for dy in range(scale):
                    for dx in range(scale):
                        px[col * scale + dx, r * scale + dy] = 0
    return img
