"""Massenproduktion des CBRN-Booklets mit eindeutiger Referenznummer.

Dieses Modul nimmt ein druckfertiges Master-Booklet (z.B.
``ETAF_CBRN_REDZONE_Booklet_EN_MASTER_...pdf``) und erzeugt daraus beliebig
viele Kopien, in denen die eindeutige Referenznummer (Team-Code, Country-Code
und fortlaufende Unique Reference Number) konsistent in **jedem** Vorkommen
ausgetauscht wird:

* im Text (große Referenzfelder *und* kombinierte Beschriftungen),
* in jedem **QR-Code** und
* in jedem **Code128-Barcode**.

Anschließend wird jede erzeugte Kopie automatisch **verifiziert**: jedes Symbol
wird neu gescannt und der Textlayer geprüft. Bleibt irgendwo die alte Nummer
stehen oder trägt ein Symbol die falsche Nummer, bricht der Lauf mit einer klaren
Fehlermeldung ab – damit es im DVI-Einsatz zu keiner Verwechslung kommt.

Symbol-Architektur des Masters (automatisch erkannt):

* **Bild-Symbole** – QR-/Barcode-Bildobjekte, die seitenübergreifend mehrfach
  platziert sind. Wird das Bildobjekt einmal ersetzt, aktualisieren sich alle
  Platzierungen pixelgenau (Position/Größe bleiben erhalten).
* **Vektor-Symbole** – einzeln gezeichnete QR-Codes mit Suffix (Asservaten-
  Labels ``... - 1`` … ``... - N``). Diese werden zellweise neu erzeugt.
"""

from __future__ import annotations

import concurrent.futures as _cf
import io
import re
import shutil
import tempfile
import zipfile
from dataclasses import dataclass, field
from pathlib import Path

import fitz
from PIL import Image
from pyzbar.pyzbar import decode as zbar_decode

from . import qr_util, barcode_util

INK = (35 / 255, 31 / 255, 32 / 255)   # #231F20  Schriftfarbe der Referenzfelder
FONT_BOLD = "hebo"                       # Helvetica-Bold (eingebauter ReportLab/MuPDF-Font)


# ---------------------------------------------------------------------------
# Datenmodell
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Reference:
    """Strukturierte Referenz: ``<team> <country> <ref>`` (z.B. ``CBRN 971 0035``)."""
    team: str
    country: str
    ref: str

    def base(self) -> str:
        return f"{self.team} {self.country} {self.ref}"


@dataclass
class ImageSymbol:
    xref: int
    kind: str            # 'QRCODE' | 'CODE128'
    master_string: str
    page: int            # erste Seite, auf der das Objekt vorkommt
    aspect: float        # Pixel-Seitenverhältnis des Bildobjekts (unverzerrte Ersetzung)
    placements: list = field(default_factory=list)  # [(page, bbox)] – stabil über replace_image


@dataclass
class VectorSymbol:
    page: int
    bbox: tuple          # (x0, y0, x1, y1) in PDF-Punkten
    master_string: str


@dataclass
class MasterPlan:
    src: Reference
    ref_width: int
    image_symbols: list = field(default_factory=list)
    vector_symbols: list = field(default_factory=list)

    def summary(self) -> str:
        nqr = sum(1 for s in self.image_symbols if s.kind == "QRCODE")
        nbc = sum(1 for s in self.image_symbols if s.kind == "CODE128")
        return (f"Quell-Referenz: {self.src.base()!r} (Ref-Breite {self.ref_width})\n"
                f"  Bild-Symbole: {len(self.image_symbols)}  (QR={nqr}, Barcode={nbc})\n"
                f"  Vektor-Symbole: {len(self.vector_symbols)} (z.B. Asservaten-Labels)")


# ---------------------------------------------------------------------------
# String-Transformation
# ---------------------------------------------------------------------------
def _num_sub(old: str, new: str, text: str) -> str:
    """Ersetze die Zahl ``old`` durch ``new``, aber nur als ganzes Zahl-Token
    (keine Treffer innerhalb längerer Ziffernfolgen)."""
    return re.sub(rf"(?<!\d){re.escape(old)}(?!\d)", new, text)


def transform_symbol(text: str, src: Reference, dst: Reference) -> str:
    """Transformiere den in einem Symbol kodierten String (Team/Country/Ref)."""
    s = _num_sub(src.ref, dst.ref, text)
    if dst.country != src.country:
        s = _num_sub(src.country, dst.country, s)
    if dst.team != src.team:
        s = re.sub(rf"(?<![A-Za-z0-9]){re.escape(src.team)}(?![A-Za-z0-9])", dst.team, s)
    return s


def transform_text(text: str, src: Reference, dst: Reference) -> str:
    """Wie :func:`transform_symbol`, aber für sichtbaren Text.

    Der Team-Code wird nur in eindeutigen Referenz-Kontexten ersetzt (großes
    Einzelfeld oder kombinierte Beschriftung), damit Produkttitel
    (``CBRN RED ZONE``) und Dokumentcode im Fuß (``ETAF_CBRN_REDZONE_BOOKLET_…``)
    unangetastet bleiben."""
    s = _num_sub(src.ref, dst.ref, text)
    if dst.country != src.country:
        s = _num_sub(src.country, dst.country, s)
    if dst.team != src.team:
        ref_ctx = (text.strip() == src.team) or (src.country in text) or (src.ref in text)
        if ref_ctx:
            s = re.sub(rf"(?<![A-Za-z0-9]){re.escape(src.team)}(?![A-Za-z0-9])", dst.team, s)
    return s


# ---------------------------------------------------------------------------
# Master-Analyse
# ---------------------------------------------------------------------------
def _decode_region(page, bbox, zoom: float = 8.0):
    clip = fitz.Rect(bbox)
    if clip.is_empty or clip.is_infinite:
        return []
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), clip=clip)
    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
    return [(s.type, s.data.decode(errors="replace")) for s in zbar_decode(img)]


def _decode_image_xref(doc, xref):
    """Dekodiere die **Rohpixel** eines Bild-XObjects. Liefert (kind, data,
    fill_ratio) oder None. ``fill_ratio`` = Flächenanteil des Symbols am Bild –
    so lassen sich reine Symbole von zusammengesetzten Kacheln (die nur zufällig
    ein Symbol enthalten) unterscheiden."""
    try:
        pix = fitz.Pixmap(doc, xref)
        if pix.alpha or (pix.colorspace and pix.colorspace.n > 3):
            pix = fitz.Pixmap(fitz.csRGB, pix)
        mode = "RGB" if pix.n >= 3 else "L"
        img = Image.frombytes(mode, [pix.width, pix.height], pix.samples).convert("L")
    except Exception:
        return None
    area = (pix.width * pix.height) or 1
    best = None
    for s in zbar_decode(img):
        ratio = (s.rect.width * s.rect.height) / area
        if best is None or ratio > best[2]:
            best = (s.type, s.data.decode(errors="replace"), ratio)
    return best


_REF_RE = re.compile(r"^(\S+)\s+(\d{2,4})\s+(\d{2,6})$")


def analyze_master(pdf_path: str | Path) -> MasterPlan:
    """Erkenne automatisch Quell-Referenz, Bild-Symbole und Vektor-Symbole."""
    doc = fitz.open(pdf_path)
    try:
        # 1) Bild-Symbole: jedes Bild-XObject einmal dekodieren
        first_use: dict[int, tuple] = {}
        placements: dict[int, list] = {}
        for i, page in enumerate(doc):
            for im in page.get_image_info(xrefs=True):
                # aspect = Pixel-Seitenverhältnis des Bildobjekts selbst (NICHT der
                # ggf. rotierten Platzierungs-Box) – beim Ersetzen bleibt die
                # Platzierungs-Matrix erhalten.
                px_aspect = (im["width"] / im["height"]) if im["height"] else 1.0
                first_use.setdefault(im["xref"], (i, im["bbox"], px_aspect))
                placements.setdefault(im["xref"], []).append((i, tuple(im["bbox"])))

        image_symbols: list[ImageSymbol] = []
        ref_strings: list[str] = []
        for xref, (pi, bbox, px_aspect) in first_use.items():
            # Rohpixel dekodieren – ein echtes Symbol füllt das Bild weitgehend
            # aus (>= 50%); zusammengesetzte Label-Kacheln werden so verworfen.
            res = _decode_image_xref(doc, xref)
            if not res:
                continue
            kind, data, ratio = res
            if (kind in ("QRCODE", "CODE128") and ratio >= 0.5
                    and re.search(r"\d{2,}\s+\d{2,}", data)):
                image_symbols.append(ImageSymbol(xref, kind, data, pi, px_aspect,
                                                 placements.get(xref, [])))
                ref_strings.append(data)

        # 2) Quell-Referenz bestimmen (häufigster "TEAM COUNTRY REF"-String)
        from collections import Counter
        base_counts = Counter()
        for s in ref_strings:
            m = _REF_RE.match(s)
            if m:
                base_counts[m.groups()] += 1
        if not base_counts:
            raise ValueError("Konnte im Master keine eindeutige Referenz (TEAM COUNTRY REF) erkennen.")
        team, country, ref = base_counts.most_common(1)[0][0]
        src = Reference(team, country, ref)

        # 3) Vektor-Symbole (gezeichnete QR-Codes mit Suffix) je Seite finden
        vector_symbols = _find_vector_symbols(doc, src)

        return MasterPlan(src=src, ref_width=len(ref),
                          image_symbols=image_symbols, vector_symbols=vector_symbols)
    finally:
        doc.close()


def _find_vector_symbols(doc, src: Reference) -> list[VectorSymbol]:
    """Finde gezeichnete QR-Codes (Cluster kleiner gefüllter Rechtecke) und ordne
    sie über die danebenstehenden Text-Labels ihrer Referenz inkl. Suffix zu."""
    out: list[VectorSymbol] = []
    suffix_re = re.compile(rf"{re.escape(src.base())}\s*-\s*(\d+)")
    for i, page in enumerate(doc):
        rects = [fitz.Rect(d["rect"]) for d in page.get_drawings()
                 if d.get("fill") and 0 < fitz.Rect(d["rect"]).width <= 6
                 and 0 < fitz.Rect(d["rect"]).height <= 6]
        if len(rects) < 50:
            continue  # keine Vektor-Symbole auf dieser Seite
        # Labels "<base> - N" mit Position
        labels = []
        for b in page.get_text("dict")["blocks"]:
            if b["type"] != 0:
                continue
            for l in b["lines"]:
                txt = "".join(s["text"] for s in l["spans"])
                m = suffix_re.search(txt.replace("  ", " "))
                if m:
                    labels.append((int(m.group(1)), fitz.Rect(l["bbox"])))
        if not labels:
            continue
        # Cluster der kleinen Rechtecke in Spalten- und Zeilenbänder
        col_bands = _bands(sorted((r.x0 + r.x1) / 2 for r in rects), gap=30)
        row_bands = _bands(sorted((r.y0 + r.y1) / 2 for r in rects), gap=15)
        # exakte Bounding-Box je (Spalte, Zeile)-Zelle
        for n, lab in labels:
            # Zeile = Band, das das Label vertikal enthält
            ry = (lab.y0 + lab.y1) / 2
            row = _which_band(row_bands, ry)
            # Spalte = das Band links vom Label
            col = None
            for ci, (cx0, cx1) in enumerate(col_bands):
                if cx1 <= lab.x0 + 2:
                    col = ci
            if row is None or col is None:
                continue
            cell = [r for r in rects
                    if col_bands[col][0] - 4 <= (r.x0 + r.x1) / 2 <= col_bands[col][1] + 4
                    and row_bands[row][0] - 4 <= (r.y0 + r.y1) / 2 <= row_bands[row][1] + 4]
            if not cell:
                continue
            x0 = min(r.x0 for r in cell); y0 = min(r.y0 for r in cell)
            x1 = max(r.x1 for r in cell); y1 = max(r.y1 for r in cell)
            out.append(VectorSymbol(i, (x0, y0, x1, y1), f"{src.base()} - {n}"))
    return out


def _bands(values, gap):
    values = sorted(values)
    if not values:
        return []
    bands = [[values[0], values[0]]]
    for v in values[1:]:
        if v - bands[-1][1] > gap:
            bands.append([v, v])
        else:
            bands[-1][1] = v
    return [tuple(b) for b in bands]


def _which_band(bands, v):
    for i, (a, b) in enumerate(bands):
        if a - 6 <= v <= b + 6:
            return i
    return None


# ---------------------------------------------------------------------------
# Eine Kopie erzeugen
# ---------------------------------------------------------------------------
def _png_bytes(img: Image.Image) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def build_copy(master_path: str | Path, plan: MasterPlan, dst: Reference,
               book_index: int | None = None, book_total: int | None = None) -> fitz.Document:
    """Erzeuge eine personalisierte Kopie (als offenes ``fitz.Document``)."""
    doc = fitz.open(master_path)

    # 1) Bild-Symbole ersetzen. Zweistufig, damit das Ergebnis sowohl
    #    druckkorrekt als auch PDF/A-tauglich ist:
    #    (a) replace_image: tauscht die Pixel des geteilten XObjects –
    #        löscht die alte Nummer überall (auch in den Bytes).
    #    (b) insert_image-Overlay je Platzierung: legt das neue Symbol als
    #        sauberes, opakes Bild oben drauf. Anders als ein per replace_image
    #        ersetztes Bild übersteht ein eingefügtes Bild die PDF/A-Konvertierung
    #        (Ghostscript verwirft sonst die ersetzten Objekte). Identische
    #        Symbole werden über ihren xref wiederverwendet (kein Aufblähen).
    done = set()
    overlay_xref: dict[tuple, int] = {}
    for sym in plan.image_symbols:
        new_str = transform_symbol(sym.master_string, plan.src, dst)
        if sym.xref not in done:
            done.add(sym.xref)
            if sym.kind == "QRCODE":
                base = qr_util.make_image(new_str, box_pixels=600)
            else:
                base = barcode_util.make_image_for_box(new_str, sym.aspect)
            doc[sym.page].replace_image(sym.xref, stream=_png_bytes(base))
        for pi, bbox in sym.placements:
            rect = fitz.Rect(bbox)
            rotated = sym.kind == "CODE128" and rect.height > rect.width
            key = (sym.kind, new_str, rotated)
            if key in overlay_xref:
                doc[pi].insert_image(rect, xref=overlay_xref[key], keep_proportion=False)
            else:
                if sym.kind == "QRCODE":
                    img = qr_util.make_image(new_str, box_pixels=600)
                else:
                    img = barcode_util.make_image_for_box(new_str, sym.aspect)
                    if rotated:
                        img = img.rotate(-90, expand=True)
                overlay_xref[key] = doc[pi].insert_image(
                    rect, stream=_png_bytes(img), keep_proportion=False)

    # 2) je Seite: Text + Vektor-QRs (Redaktion, danach Neuzeichnen)
    vec_by_page: dict[int, list[VectorSymbol]] = {}
    for v in plan.vector_symbols:
        vec_by_page.setdefault(v.page, []).append(v)

    for i, page in enumerate(doc):
        text_ops = []   # (origin, new_text, size)
        # 2a) Referenz-Textfelder einsammeln
        for b in page.get_text("dict")["blocks"]:
            if b["type"] != 0:
                continue
            for l in b["lines"]:
                for s in l["spans"]:
                    new = transform_text(s["text"], plan.src, dst)
                    if new != s["text"]:
                        page.add_redact_annot(fitz.Rect(s["bbox"]), fill=(1, 1, 1))
                        text_ops.append((s["origin"], new, s["size"]))
        # 2b) Vektor-QR-Zellen zum Entfernen markieren
        qr_ops = []
        for v in vec_by_page.get(i, []):
            page.add_redact_annot(fitz.Rect(v.bbox), fill=(1, 1, 1))
            qr_ops.append((v.bbox, transform_symbol(v.master_string, plan.src, dst)))

        if text_ops or qr_ops:
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
        for origin, new, size in text_ops:
            page.insert_text(origin, new, fontname=FONT_BOLD, fontsize=size, color=INK)
        for bbox, new_str in qr_ops:
            r = fitz.Rect(bbox)
            page.insert_image(r, stream=_png_bytes(qr_util.make_image(new_str, box_pixels=400)),
                              keep_proportion=False)

    # 3) "Book No: __ of __" auf der Titelseite füllen
    if book_index is not None:
        _fill_book_no(doc[0], book_index, book_total)

    return doc


def _fill_book_no(page, index: int, total: int | None):
    found = page.search_for("Book No:")
    if not found:
        return
    label = found[0]
    of = page.search_for("of", clip=fitz.Rect(label.x1, label.y0 - 4, page.rect.width, label.y1 + 6))
    baseline = label.y1 - 2
    size = 12
    if of:
        of_r = of[0]
        x_index = (label.x1 + of_r.x0) / 2 - 6
        x_total = of_r.x1 + 6
    else:
        x_index = label.x1 + 30
        x_total = label.x1 + 90
    page.insert_text((x_index, baseline), str(index), fontname=FONT_BOLD, fontsize=size, color=INK)
    if total:
        page.insert_text((x_total, baseline), str(total), fontname=FONT_BOLD, fontsize=size, color=INK)


# ---------------------------------------------------------------------------
# Verifikation
# ---------------------------------------------------------------------------
def verify_copy(doc, plan: MasterPlan, dst: Reference, thorough: bool = False) -> list[str]:
    """Prüfe eine erzeugte Kopie 100%ig. Liefert eine Liste von Fehlern (leer = ok).

    Bild-Symbole werden zentral (XObject-Ebene) ersetzt; alle Platzierungen
    teilen sich dieselben Pixel. Daher genügt es, je XObject **eine**
    Platzierung neu zu scannen (gleiche Garantie). ``thorough=True`` prüft
    stattdessen jede einzelne Platzierung."""
    errors: list[str] = []
    src = plan.src

    # 1) Textlayer: alte Ref-Nummer / alter Basis-String dürfen nicht mehr vorkommen
    if dst.ref != src.ref:
        old_ref_re = re.compile(rf"(?<!\d){re.escape(src.ref)}(?!\d)")
        for i, page in enumerate(doc):
            if old_ref_re.search(page.get_text()):
                errors.append(f"Seite {i}: alte Referenznummer {src.ref!r} noch im Text vorhanden.")
    if dst.country != src.country:
        old_c_re = re.compile(rf"(?<!\d){re.escape(src.country)}(?!\d)")
        for i, page in enumerate(doc):
            if old_c_re.search(page.get_text()):
                errors.append(f"Seite {i}: alter Country-Code {src.country!r} noch im Text vorhanden.")

    # 2) Jedes bekannte Symbol gezielt neu scannen – über die stabilen
    # Platzierungs-Bboxes (xref-Nummern können sich beim Ersetzen ändern).
    # 2a) Bild-Symbole (je XObject eine bzw. – thorough – jede Platzierung)
    for sym in plan.image_symbols:
        expected = transform_symbol(sym.master_string, src, dst)
        places = sym.placements if thorough else sym.placements[:1]
        if not places:
            errors.append(f"{sym.kind} (xref {sym.xref}): keine Platzierung zum Prüfen vorhanden.")
        for (i, bbox) in places:
            got = {d for _, d in _decode_region(doc[i], bbox, zoom=8)}
            if expected not in got:
                errors.append(f"Seite {i}: {sym.kind} erwartet {expected!r}, "
                              f"gelesen {sorted(got) or 'nichts'}.")
    # 2b) Vektor-Symbole
    for v in plan.vector_symbols:
        expected = transform_symbol(v.master_string, src, dst)
        page = doc[v.page]
        pad = fitz.Rect(v.bbox) + (-2, -2, 2, 2)
        got = {d for _, d in _decode_region(page, pad, zoom=12)}
        if expected not in got:
            errors.append(f"Seite {v.page}: Vektor-QR erwartet {expected!r}, "
                          f"gelesen {sorted(got) or 'nichts'}.")
    return errors


# ---------------------------------------------------------------------------
# Referenznummern-Folge
# ---------------------------------------------------------------------------
def make_refs(start: int | None, count: int | None, width: int,
              explicit: list[int] | None = None, skip: set[int] | None = None) -> list[str]:
    """Erzeuge die Liste der Unique Reference Numbers (als nullgefüllte Strings)."""
    skip = skip or set()
    if explicit:
        nums = list(explicit)
    else:
        if start is None or count is None:
            raise ValueError("Bitte --start und --count angeben oder --refs verwenden.")
        nums, n = [], start
        while len(nums) < count:
            if n not in skip:
                nums.append(n)
            n += 1
    return [str(n).zfill(width) for n in nums]


# ---------------------------------------------------------------------------
# Gesamter Produktionslauf
# ---------------------------------------------------------------------------
def _produce_one(master_path, plan, dst, idx, book_total, path, verify, thorough):
    """Baue, verifiziere und speichere eine einzelne Kopie. Modulweit (damit
    sie an einen ProcessPoolExecutor übergeben werden kann)."""
    doc = build_copy(master_path, plan, dst, book_index=idx, book_total=book_total)
    if verify:
        errs = verify_copy(doc, plan, dst, thorough=thorough)
        if errs:
            doc.close()
            raise RuntimeError(
                f"Verifikation fehlgeschlagen für Kopie {dst.ref} (Stopp vor dem Druck):\n  "
                + "\n  ".join(errs[:20])
                + ("" if len(errs) <= 20 else f"\n  … (+{len(errs)-20} weitere)"))
    doc.save(str(path), garbage=4, deflate=True)
    doc.close()
    return str(path)


def produce(master_path: str | Path, refs: list[str], out_dir: str | Path, *,
            team: str | None = None, country: str | None = None,
            combined: bool = True, individual: bool = True,
            book_total: int | None = None, verify: bool = True,
            thorough: bool = False, workers: int = 1, on_progress=None) -> dict:
    """Erzeuge alle Kopien, verifiziere sie und schreibe die Ausgaben.

    ``workers`` > 1 baut und verifiziert mehrere Kopien parallel (Threads;
    PyMuPDF/pyzbar geben das GIL frei). Die kombinierte Druck-PDF wird danach in
    Referenz-Reihenfolge zusammengesetzt. Liefert ein Ergebnis-Dict mit Pfaden.
    """
    master_path = Path(master_path)
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    plan = analyze_master(master_path)
    src = plan.src
    team = team or src.team
    country = country or src.country
    if book_total is None:
        book_total = len(refs)
    stem = master_path.stem

    # Einzel-PDFs in das Zielverzeichnis (falls gewünscht), sonst in ein Temp,
    # das nach dem Zusammensetzen der Druck-PDF wieder entfernt wird.
    tmp_dir = None
    if individual:
        ind_dir = out_dir
    else:
        tmp_dir = Path(tempfile.mkdtemp(prefix="booklet_", dir=out_dir))
        ind_dir = tmp_dir

    jobs = []
    for idx, ref in enumerate(refs, start=1):
        dst = Reference(team, country, ref)
        path = ind_dir / f"{stem}__{team}_{country}_{ref}.pdf"
        jobs.append((idx, ref, dst, path))

    total = len(jobs)
    done = 0
    workers = max(1, int(workers))
    if workers == 1:
        for idx, ref, dst, path in jobs:
            _produce_one(master_path, plan, dst, idx, book_total, path, verify, thorough)
            done += 1
            if on_progress:
                on_progress(done, total, ref)
    else:
        with _cf.ProcessPoolExecutor(max_workers=workers) as ex:
            futures = {ex.submit(_produce_one, master_path, plan, dst, idx,
                                 book_total, path, verify, thorough): ref
                       for idx, ref, dst, path in jobs}
            try:
                for fut in _cf.as_completed(futures):
                    fut.result()  # löst eine etwaige RuntimeError aus
                    done += 1
                    if on_progress:
                        on_progress(done, total, futures[fut])
            except Exception:
                for f in futures:
                    f.cancel()
                if tmp_dir:
                    shutil.rmtree(tmp_dir, ignore_errors=True)
                raise

    individual_paths = [j[3] for j in jobs] if individual else []
    result = {"plan": plan, "count": total, "individual": individual_paths,
              "combined": None, "zip": None, "verified": verify}

    if combined:
        cdoc = fitz.open()
        for job in jobs:                       # in Referenz-Reihenfolge
            sub = fitz.open(job[3])
            cdoc.insert_pdf(sub)
            sub.close()
        cpath = out_dir / f"{stem}__DRUCK_{team}_{country}_{refs[0]}-{refs[-1]}_x{total}.pdf"
        cdoc.save(cpath, garbage=4, deflate=True)
        cdoc.close()
        result["combined"] = cpath

    if individual and individual_paths:
        zpath = out_dir / f"{stem}__EINZEL_{team}_{country}_x{total}.zip"
        with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
            for p in individual_paths:
                z.write(p, p.name)
        result["zip"] = zpath

    if tmp_dir:
        shutil.rmtree(tmp_dir, ignore_errors=True)
    return result
