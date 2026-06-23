"""Symbol-Decoder für QR-Codes und Code128-Barcodes mit einheitlicher Schnittstelle.

Bevorzugt **zxing-cpp** – ein selbst-enthaltenes pip-Wheel ohne Systembibliothek
(ideal für eine reibungslose Installation, u.a. auf macOS). Ist zxing-cpp nicht
verfügbar, wird automatisch auf **pyzbar** (benötigt die Systembibliothek
``libzbar``) zurückgegriffen.

``decode(pil_image)`` liefert eine Liste von :class:`Sym` mit ``type``
(``"QRCODE"``/``"CODE128"``), ``data`` (Bytes) und ``rect`` (Position).
"""

from __future__ import annotations

from dataclasses import dataclass

try:                       # bevorzugter Decoder (keine Systembibliothek nötig)
    import zxingcpp as _zx
except Exception:          # noqa: BLE001
    _zx = None

try:                       # Fallback (benötigt libzbar)
    from pyzbar.pyzbar import decode as _zbar_decode
except Exception:          # noqa: BLE001
    _zbar_decode = None


@dataclass
class Rect:
    left: int
    top: int
    width: int
    height: int


@dataclass
class Sym:
    type: str
    data: bytes
    rect: Rect


def backend() -> str:
    if _zx is not None:
        return "zxing-cpp"
    if _zbar_decode is not None:
        return "pyzbar"
    return "none"


def decode(pil_image):
    if _zx is not None:
        return _decode_zxing(pil_image)
    if _zbar_decode is not None:
        return _decode_zbar(pil_image)
    raise RuntimeError(
        "Kein Symbol-Decoder verfügbar. Bitte 'zxing-cpp' (empfohlen) oder "
        "'pyzbar' (+ libzbar) installieren:  pip install zxing-cpp")


def _decode_zxing(img):
    out = []
    for r in _zx.read_barcodes(img):
        fmt = r.format
        if fmt == _zx.BarcodeFormat.QRCode:
            t = "QRCODE"
        elif fmt == _zx.BarcodeFormat.Code128:
            t = "CODE128"
        else:
            t = str(fmt).upper().replace(" ", "")
        p = r.position
        xs = [p.top_left.x, p.top_right.x, p.bottom_right.x, p.bottom_left.x]
        ys = [p.top_left.y, p.top_right.y, p.bottom_right.y, p.bottom_left.y]
        data = (r.text or "").encode("utf-8")
        out.append(Sym(t, data, Rect(min(xs), min(ys),
                                     max(xs) - min(xs), max(ys) - min(ys))))
    return out


def _decode_zbar(img):
    out = []
    for s in _zbar_decode(img):
        r = s.rect
        out.append(Sym(s.type, s.data, Rect(r.left, r.top, r.width, r.height)))
    return out
