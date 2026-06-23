"""Code128-Barcode-Erzeugung.

Liefert einen Code128-Barcode als scharfes PIL-Bild. Wird genutzt, um die im
CBRN-Booklet eingebetteten Barcodes druckidentisch durch eine neue, eindeutige
Referenznummer zu ersetzen.
"""

from __future__ import annotations

from io import BytesIO

import barcode
from barcode.writer import ImageWriter
from PIL import Image

_CODE128 = barcode.get_barcode_class("code128")


def make_image(data: str, dpi: int = 600, module_width: float = 0.3,
               module_height: float = 12.0, quiet_zone: float = 2.0) -> Image.Image:
    """Erzeuge einen Code128-Barcode für ``data`` als 1-bit-PIL-Bild (ohne Text)."""
    bc = _CODE128(data, writer=ImageWriter())
    buf = BytesIO()
    bc.write(buf, options={
        "module_width": module_width,
        "module_height": module_height,
        "quiet_zone": quiet_zone,
        "write_text": False,
        "dpi": dpi,
        "background": "white",
        "foreground": "black",
    })
    buf.seek(0)
    return Image.open(buf).convert("1")


def make_image_for_box(data: str, aspect: float, **kw) -> Image.Image:
    """Wie :func:`make_image`, aber auf das Seitenverhältnis ``aspect`` (B/H)
    der Ziel-Platzierung weiß aufgefüllt, damit beim Ersetzen nichts verzerrt.

    Der Barcode wird auf volle Breite skaliert und vertikal zentriert; die
    Balkenproportionen (und damit die Lesbarkeit) bleiben erhalten.
    """
    img = make_image(data, **kw).convert("L")
    w, h = img.size
    target_h = max(h, int(round(w / aspect))) if aspect > 0 else h
    if target_h <= h:
        return img.convert("1")
    canvas = Image.new("L", (w, target_h), 255)
    canvas.paste(img, (0, (target_h - h) // 2))
    return canvas.convert("1")
