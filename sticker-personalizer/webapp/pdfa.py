"""PDF/A-Konvertierung für Archivkopien (via Ghostscript).

PDF/A-2b ist ein ISO-Archivformat (selbsterhaltend, eingebettete Schriften,
definierter Farbraum). Die Konvertierung übernimmt Ghostscript (``gs``); ist es
nicht installiert, wird eine klare Fehlermeldung geliefert.
"""

from __future__ import annotations

import concurrent.futures as _cf
import shutil
import subprocess
from pathlib import Path


def available() -> bool:
    return shutil.which("gs") is not None


def to_pdfa(src: str | Path, dst: str | Path) -> Path:
    gs = shutil.which("gs")
    if not gs:
        raise RuntimeError("Ghostscript (gs) ist nicht installiert – PDF/A nicht möglich. "
                           "Unter Debian/Ubuntu:  sudo apt-get install -y ghostscript")
    src, dst = str(src), str(dst)
    cmd = [
        gs, "-dPDFA=2", "-dBATCH", "-dNOPAUSE", "-dNOOUTERSAVE", "-dQUIET",
        "-sProcessColorModel=DeviceRGB",
        "-sColorConversionStrategy=RGB",
        "-sDEVICE=pdfwrite", "-dPDFACompatibilityPolicy=1",
        # KEIN Downsampling – sonst werden kleine QR-/Barcode-Bilder unkenntlich.
        "-dDownsampleColorImages=false",
        "-dDownsampleGrayImages=false",
        "-dDownsampleMonoImages=false",
        "-dAutoFilterColorImages=false",
        "-dAutoFilterGrayImages=false",
        f"-sOutputFile={dst}", src,
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0 or not Path(dst).exists():
        raise RuntimeError(f"Ghostscript-Fehler bei PDF/A: {res.stderr.strip()[-400:]}")
    _verify_symbols_preserved(src, dst)
    return Path(dst)


def _convert_one(pair):
    """Worker für die Parallel-Konvertierung (modulweit für ProcessPool)."""
    src, dst = pair
    try:
        to_pdfa(src, dst)
        return (src, str(dst), None)
    except Exception as e:  # noqa: BLE001
        return (src, None, str(e))


def to_pdfa_many(pairs: list[tuple], workers: int = 4, on_progress=None) -> list[tuple]:
    """Konvertiere mehrere PDFs parallel zu PDF/A. ``pairs`` = Liste (src, dst).
    Liefert je Eintrag (src, dst_or_None, error_or_None)."""
    results = []
    workers = max(1, int(workers))
    if workers == 1:
        for i, pr in enumerate(pairs, 1):
            results.append(_convert_one(pr))
            if on_progress:
                on_progress(i, len(pairs))
    else:
        with _cf.ProcessPoolExecutor(max_workers=workers) as ex:
            futures = [ex.submit(_convert_one, pr) for pr in pairs]
            for i, fut in enumerate(_cf.as_completed(futures), 1):
                results.append(fut.result())
                if on_progress:
                    on_progress(i, len(pairs))
    return results


def _decoded(path, page_index, zoom=8) -> set:
    import fitz
    from PIL import Image
    from sticker import symbols
    doc = fitz.open(path)
    if page_index >= doc.page_count:
        return set()
    pix = doc[page_index].get_pixmap(matrix=fitz.Matrix(zoom, zoom))
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    out = {s.data.decode(errors="replace") for s in symbols.decode(img)}
    doc.close()
    return out


def _verify_symbols_preserved(src, dst) -> None:
    """Stelle sicher, dass die PDF/A-Konvertierung keine scannbaren Symbole
    verloren hat (Stichprobe je Booklet-Anfang). Schlägt sonst hart fehl."""
    import fitz
    n = fitz.open(src).page_count
    # Stichproben: feste Schlüsselseiten + einige Booklet-Anfänge (gedeckelt,
    # damit der Check auch bei großen kombinierten PDFs schnell bleibt).
    booklet_starts = list(range(0, n, 32))
    if len(booklet_starts) > 6:
        booklet_starts = booklet_starts[:: max(1, len(booklet_starts) // 6)]
    sample = sorted(set([0, 1, min(9, n - 1), min(30, n - 1)] + booklet_starts))
    for i in sample:
        before = _decoded(src, i)
        if not before:
            continue
        after = _decoded(dst, i)
        if not before <= after:
            raise RuntimeError(
                f"PDF/A-Konvertierung hat Symbole auf Seite {i} beschädigt "
                f"(vorher {sorted(before)}, nachher {sorted(after) or 'nichts'}). "
                f"Archivkopie verworfen.")
