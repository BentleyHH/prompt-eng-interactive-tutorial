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
from . import barcode_util, qr_util, symbols

INK = (35 / 255, 31 / 255, 32 / 255)   # #231F20  Schriftfarbe der Referenzfelder
FONT_BOLD = "hebo"                       # Helvetica-Bold (eingebauter ReportLab/MuPDF-Font)

# Schreibrichtung einer Textzeile (PyMuPDF 'dir') -> insert_text rotate-Winkel,
# damit gedrehte (hochkant gesetzte) Referenznummern wieder hochkant erscheinen.
_DIR_ROTATE = {(1, 0): 0, (0, -1): 90, (-1, 0): 180, (0, 1): 270}


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
    spot_colors: list = field(default_factory=list)   # Sonderfarben (Stanze/Perfo/Nut/Passer)
    draw_marks: dict = field(default_factory=dict)     # Seite -> Menge der Vektor-Pfad-Signaturen
    vector_pages: set = field(default_factory=set)     # Seiten mit ersetzten Vektor-Symbolen
    notes: list = field(default_factory=list)          # Hinweise (z.B. korrigierte Barcode-Inkonsistenz)

    def summary(self) -> str:
        nqr = sum(1 for s in self.image_symbols if s.kind == "QRCODE")
        nbc = sum(1 for s in self.image_symbols if s.kind == "CODE128")
        spots = ", ".join(self.spot_colors) if self.spot_colors else "keine"
        return (f"Quell-Referenz: {self.src.base()!r} (Ref-Breite {self.ref_width})\n"
                f"  Bild-Symbole: {len(self.image_symbols)}  (QR={nqr}, Barcode={nbc})\n"
                f"  Vektor-Symbole: {len(self.vector_symbols)} (z.B. Asservaten-Labels)\n"
                f"  Sonderfarben (Druckvorstufe): {spots}")


# ---------------------------------------------------------------------------
# String-Transformation
# ---------------------------------------------------------------------------
def _num_sub(old: str, new: str, text: str) -> str:
    """Ersetze die Zahl ``old`` durch ``new``, aber nur als ganzes Zahl-Token
    (keine Treffer innerhalb längerer Ziffernfolgen)."""
    return re.sub(rf"(?<!\d){re.escape(old)}(?!\d)", new, text)


def _replace_ref_numbers(text: str, src: Reference, dst: Reference) -> str:
    """Ersetze Country/Ref-Ziffern – auch wenn sie **zusammengeschrieben** sind
    (``EX 9717408``) oder in **umgekehrter** (arabischer) Reihenfolge stehen
    (``7408 971``). Das Trennzeichen (Leerzeichen oder keines) bleibt erhalten,
    damit das Layout des Feldes unverändert bleibt."""
    c, r = re.escape(src.country), re.escape(src.ref)
    # Country+Ref (Vorwärts), Trennzeichen erhalten
    text = re.sub(rf"(?<!\d){c}(\s*){r}(?!\d)",
                  lambda m: f"{dst.country}{m.group(1)}{dst.ref}", text)
    # Ref+Country (umgekehrt, z.B. arabischer Lesefluss)
    text = re.sub(rf"(?<!\d){r}(\s*){c}(?!\d)",
                  lambda m: f"{dst.ref}{m.group(1)}{dst.country}", text)
    # Ref allein (großes Einzelfeld)
    text = _num_sub(src.ref, dst.ref, text)
    # Country allein – nur wenn er sich ändert
    if dst.country != src.country:
        text = _num_sub(src.country, dst.country, text)
    return text


def transform_symbol(text: str, src: Reference, dst: Reference) -> str:
    """Transformiere den in einem Symbol kodierten String (Team/Country/Ref)."""
    s = _replace_ref_numbers(text, src, dst)
    if dst.team != src.team:
        s = re.sub(rf"(?<![A-Za-z0-9]){re.escape(src.team)}(?![A-Za-z0-9])", dst.team, s)
    return s


def transform_text(text: str, src: Reference, dst: Reference) -> str:
    """Wie :func:`transform_symbol`, aber für sichtbaren Text.

    Der Team-Code wird nur in eindeutigen Referenz-Kontexten ersetzt (großes
    Einzelfeld oder kombinierte Beschriftung), damit Produkttitel
    (``CBRN RED ZONE``) und Dokumentcode im Fuß (``ETAF_CBRN_REDZONE_BOOKLET_…``)
    unangetastet bleiben."""
    s = _replace_ref_numbers(text, src, dst)
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
    return [(s.type, s.data.decode(errors="replace")) for s in symbols.decode(img)]


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
    for s in symbols.decode(img):
        ratio = (s.rect.width * s.rect.height) / area
        if best is None or ratio > best[2]:
            best = (s.type, s.data.decode(errors="replace"), ratio)
    return best


_REF_RE = re.compile(r"^(\S+)\s+(\d{2,4})\s+(\d{2,6})$")

# Referenz im sichtbaren Text: "<TEAM> <COUNTRY> <REF>" (z.B. "PM 971 7408",
# "EX 971 7408", "CBRN 971 0035"). Dient als Grundwahrheit für die Quell-
# Referenz – auch bei Booklets, deren Barcode (fälschlich) einen anderen
# Team-Code trägt oder die gar kein scanbares Symbol enthalten.
_REF_TEXT_RE = re.compile(r"\b([A-Z]{2,6})\s+(\d{2,4})\s+(\d{2,6})\b")


def _detect_reference_text(doc) -> "Reference | None":
    """Bestimme die Quell-Referenz aus dem sichtbaren Text. Maßgeblich ist, auf
    wie vielen **verschiedenen Seiten** eine Referenz vorkommt (die echte
    Booklet-Referenz durchzieht das ganze Heft), dann Häufigkeit, dann
    Schriftgröße. So gewinnt z.B. ``CBRN 971 0035`` (auf vielen Seiten) gegen
    ein seltenes, groß gesetztes ``CBRN PM 971 0035`` auf einer Einzelseite und
    gegen eine lokal gehäufte Querverweis-Liste (``AM 971 7408`` auf 2 Seiten)."""
    from collections import Counter
    counts: Counter = Counter()
    sizes: dict = {}
    page_set: dict = {}
    for i, page in enumerate(doc):
        for b in page.get_text("dict")["blocks"]:
            if b["type"] != 0:
                continue
            for l in b["lines"]:
                txt = "".join(s["text"] for s in l["spans"])
                sz = max((s["size"] for s in l["spans"]), default=0.0)
                for m in _REF_TEXT_RE.finditer(txt):
                    g = m.groups()
                    counts[g] += 1
                    sizes[g] = max(sizes.get(g, 0.0), sz)
                    page_set.setdefault(g, set()).add(i)
    if not counts:
        return None
    team, country, ref = max(
        counts, key=lambda g: (len(page_set[g]), counts[g], sizes[g]))
    return Reference(team, country, ref)


def _symbol_payload(sym: "ImageSymbol", src: "Reference", dst: "Reference") -> str:
    """Neuer Inhalt eines Bild-Symbols in der Ziel-Kopie: **immer** exakt die
    sichtbare Booklet-Referenz ``dst.base()`` (z.B. ``PM 49 0042``).

    Damit tragen **Barcode UND QR-Code** dieselbe eindeutige Nummer wie der
    Aufdruck – keine URL, kein Zusatz. Das korrigiert auch Master, deren
    Barcode einen abweichenden Team-Code trug (z.B. ``PM`` statt ``EX``)."""
    return dst.base()


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
            # Alle echten Symbole übernehmen: Referenz-Barcodes UND QR-Codes
            # (auch statische URL-QRs – sie tragen künftig die Referenz mit).
            if kind in ("QRCODE", "CODE128") and ratio >= 0.5:
                image_symbols.append(ImageSymbol(xref, kind, data, pi, px_aspect,
                                                 placements.get(xref, [])))
                if _REF_RE.match(data.strip()):
                    ref_strings.append(data.strip())

        # 2) Quell-Referenz bestimmen. Grundwahrheit ist das größte sichtbare
        #    Referenz-Textfeld (Cover); nur wenn gar kein Referenz-Text gefunden
        #    wird, dient der häufigste decodierte Barcode als Rückfallebene.
        src = _detect_reference_text(doc)
        if src is None:
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

        # 4) Druckvorstufe: Sonderfarben + Vektor-Marken je Seite erfassen
        spot_colors = sorted(_spot_names(doc))
        vector_pages = {v.page for v in vector_symbols}
        draw_marks = {i: _page_draw_marks(page) for i, page in enumerate(doc)
                      if i not in vector_pages}

        # 5) Hinweise: Barcodes, deren Team-Code von der sichtbaren Referenz
        #    abweicht (Master-Inkonsistenz), werden bei der Produktion auf die
        #    sichtbare Booklet-Referenz angeglichen – das hier transparent melden.
        notes = []
        bad_teams = set()
        for sym in image_symbols:
            m = _REF_RE.match(sym.master_string.strip())
            if m and m.group(1) != src.team:
                bad_teams.add(m.group(1))
        if bad_teams:
            notes.append(
                f"Hinweis: Im Master kodierte der Barcode den Team-Code "
                f"{', '.join(sorted(bad_teams))} statt {src.team!r}. Bei der "
                f"Produktion wird der Barcode automatisch auf die sichtbare "
                f"Booklet-Referenz ({src.team} …) angeglichen und geprüft.")
        if any(s.kind == "QRCODE" and not _REF_RE.match(s.master_string.strip())
               for s in image_symbols):
            notes.append(
                "QR-Codes tragen jetzt die eindeutige Referenznummer "
                "(z.B. PM 49 0042), keine URL mehr.")

        return MasterPlan(src=src, ref_width=len(src.ref),
                          image_symbols=image_symbols, vector_symbols=vector_symbols,
                          spot_colors=spot_colors, draw_marks=draw_marks,
                          vector_pages=vector_pages, notes=notes)
    finally:
        doc.close()


# ---------------------------------------------------------------------------
# Druckvorstufe: Sonderfarben (Stanze/Perfo/Nut/Passer) und Marken-Geometrie
# ---------------------------------------------------------------------------
def _spot_names(doc) -> set:
    """Alle Separation-/Vollton-Sonderfarbennamen im Dokument (außer 'All')."""
    names = set()
    for x in range(1, doc.xref_length()):
        try:
            obj = doc.xref_object(x, compressed=True)
        except Exception:  # noqa: BLE001
            continue
        if "/Separation" in obj:
            for m in re.findall(r"/Separation\s*/([^\s/\[\]]+)", obj):
                names.add(m)
    return names


def _page_draw_marks(page) -> set:
    """Menge kompakter Signaturen **jedes** Vektor-Pfads (Stanze/Perfo/Nut/Rahmen)
    einer Seite – Geometrie + Farbe. Eine verschobene, angeschnittene, entfernte
    oder umgefärbte Marke fällt damit aus der Menge heraus."""
    import hashlib

    marks = set()
    for dr in page.get_drawings():
        pts = []
        for it in dr["items"]:
            for p in it[1:]:
                if isinstance(p, fitz.Point):
                    pts.append((round(p.x, 1), round(p.y, 1)))
                elif isinstance(p, fitz.Rect):
                    pts.append((round(p.x0, 1), round(p.y0, 1),
                                round(p.x1, 1), round(p.y1, 1)))
        fill = tuple(round(c, 3) for c in (dr.get("fill") or ())) or None
        stroke = tuple(round(c, 3) for c in (dr.get("stroke") or ())) or None
        key = str((dr["type"], fill, stroke, tuple(pts)))
        marks.add(hashlib.blake2b(key.encode(), digest_size=10).hexdigest())
    return marks


def detect_type(path: str | Path) -> str:
    """Erkenne den Booklet-Typ: ``"officer"`` (Officer-ID-Booklet mit Rollen,
    Personalisierung per Excel) oder ``"cbrn"`` (Referenznummer-Massenware)."""
    doc = fitz.open(path)
    try:
        full = "\n".join(doc[i].get_text() for i in range(doc.page_count))
    finally:
        doc.close()
    if re.search(r"Officer\s*ID", full, re.I) and len(set(re.findall(r"\b74\d{3}\b", full))) >= 3:
        return "officer"
    return "cbrn"


_OFFICER_BOILER = {
    "OFFICER", "MANAGEMENT", "BOOKLET", "OFFICER ID", "FILL OUT + SCAN",
    "ATTACH TO LOGBOOK", "NAME:", "RANK:", "AGENCY:", "PHONE:", "DATE:", "TIME:",
    "TEAM:", "SITE:", "SIGNATURE:", "SITE", "NAME",
}


def officer_roster(path: str | Path) -> list[dict]:
    """Lies aus dem Officer-Booklet je Rollen-Seite die Officer-ID samt einer
    lesbaren Rollen-/Team-Bezeichnung aus – Grundlage der vorbefüllten Maske."""
    from . import overlay
    doc = fitz.open(path)
    roster: list[dict] = []
    try:
        for page in doc:
            txt = page.get_text()
            ids = sorted(set(re.findall(r"\b(74\d{3})\b", txt)))
            if not ids:
                continue
            lines = [l.strip() for l in txt.splitlines() if l.strip()]
            caps = [l for l in lines if l.upper() == l and len(l) > 3
                    and l not in _OFFICER_BOILER and not l.isdigit()
                    and "OFFICER ID" not in l]
            role = caps[0] if caps else ""
            team = caps[1] if len(caps) > 1 and caps[1] != role else ""
            # Farbe der Seitenleiste ("Aufkleber" rechts) auslesen.
            info = overlay.sidebar_info(page)
            color = overlay.color_hex(info[1]) if info else ""
            roster.append({"officer_id": ids[0], "role": role, "team": team,
                           "color": color})
    finally:
        doc.close()
    return roster


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
def _rect_area(r) -> float:
    return abs(r.width) * abs(r.height)


def _white_boxes(page) -> list:
    """Weiße/sehr helle gefüllte Rechtecke der Seite – die Referenz-Felder, in
    die eine neue Nummer mittig eingepasst wird. Klein zuerst (engstes Feld)."""
    boxes = []
    for d in page.get_drawings():
        f = d.get("fill")
        if not f or len(f) < 3 or sum(f[:3]) / 3 < 0.92:
            continue
        r = fitz.Rect(d["rect"])
        if r.width > 6 and r.height > 6:
            boxes.append(r)
    boxes.sort(key=_rect_area)
    return boxes


def _enclosing_box(boxes, bbox):
    """Engstes weißes Feld, dessen Mitte den Span enthält und das breit genug
    ist, um die Nummer aufzunehmen – oder ``None``."""
    cx, cy = (bbox.x0 + bbox.x1) / 2, (bbox.y0 + bbox.y1) / 2
    for r in boxes:  # kleinste zuerst
        if (r.x0 - 1 <= cx <= r.x1 + 1 and r.y0 - 1 <= cy <= r.y1 + 1
                and r.width >= 0.6 * bbox.width):
            return r
    return None


def _insert_ref_text(page, c) -> None:
    """Setze die neue Referenznummer – in ihr weißes Feld **mittig eingepasst**
    (waagerecht zentriert, bei Bedarf verkleinert, damit nichts übersteht oder
    Trennlinien verdeckt). Gedrehte (hochkant) Felder werden längs der Drehung
    eingepasst, Position bleibt erhalten."""
    text, size, rot = c["new"], c["size"], c["rot"]
    bbox, box, origin = c["bbox"], c["box"], c["origin"]

    def width(sz):
        return fitz.get_text_length(text, fontname=FONT_BOLD, fontsize=sz)

    if rot == 0:
        # Senkrechte Position (Grundlinie) bleibt wie im Original – nur
        # waagerecht im Feld zentrieren und ggf. verkleinern. So rutscht die
        # Nummer nie über andere Inhalte (z.B. das Schädel-Bild auf der HEAD-Seite).
        if box is not None:
            avail = box.width * 0.88            # etwas Rand im Feld lassen
            cx = (box.x0 + box.x1) / 2
            # Niemals höher als das Feld: Ziffernhöhe (~0.72·Schriftgröße)
            # muss in die Feldhöhe passen, sonst wird oben angeschnitten.
            h_cap = box.height * 0.92 / 0.72
            if size > h_cap:
                size = h_cap
        else:
            avail = bbox.width
            cx = (bbox.x0 + bbox.x1) / 2
        w = width(size)
        if w > avail and w > 0:
            size = size * avail / w
            w = width(size)
        page.insert_text((cx - w / 2, origin[1]), text, fontname=FONT_BOLD,
                         fontsize=size, color=INK, rotate=0)
    else:
        # Hochkant/gedreht: nur längs der Schreibrichtung einpassen (verkleinern),
        # Ursprung beibehalten – das sind kleine Rand-Labels.
        avail = bbox.height if rot in (90, 270) else bbox.width
        w = width(size)
        if w > avail and w > 0:
            size = size * avail / w
        page.insert_text(origin, text, fontname=FONT_BOLD, fontsize=size,
                         color=INK, rotate=rot)


def _png_bytes(img: Image.Image) -> bytes:
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def build_copy(master_path: str | Path, plan: MasterPlan, dst: Reference,
               book_index: int | None = None, book_total: int | None = None) -> fitz.Document:
    """Erzeuge eine personalisierte Kopie (als offenes ``fitz.Document``)."""
    doc = fitz.open(master_path)

    # Reihenfolge ist wichtig:
    #   1) replace_image scrubbt die Pixel jedes geteilten XObjects (löscht die
    #      alte Nummer auch in den Bytes – nötig für PDF/A).
    #   2) Text-/Vektor-QR-Redaktion (apply_redactions) entfernt die alte Nummer
    #      sauber aus dem Textlayer.
    #   3) ERST DANACH werden die frischen Symbol-Bilder als opakes Overlay
    #      eingesetzt. apply_redactions bereinigt den Seiteninhalt und würde ein
    #      vorher eingesetztes Overlay sonst beschädigen (führte zu unlesbaren
    #      "Geister"-QR-Codes auf manchen Seiten).

    # 1) replace_image: Pixel der geteilten Symbol-XObjects austauschen
    done = set()
    for sym in plan.image_symbols:
        if sym.xref in done:
            continue
        done.add(sym.xref)
        new_str = _symbol_payload(sym, plan.src, dst)
        if sym.kind == "QRCODE":
            base = qr_util.make_image(new_str, box_pixels=600)
        else:
            base = barcode_util.make_image_for_box(new_str, sym.aspect)
        doc[sym.page].replace_image(sym.xref, stream=_png_bytes(base))

    # 2) je Seite: Text + Vektor-QRs (Redaktion, danach Neuzeichnen)
    vec_by_page: dict[int, list[VectorSymbol]] = {}
    for v in plan.vector_symbols:
        vec_by_page.setdefault(v.page, []).append(v)

    for i, page in enumerate(doc):
        white_boxes = _white_boxes(page)
        # 2a) Referenz-Textfelder einsammeln (mit Zeilen-/Feldkontext)
        cands = []   # je Treffer: bbox, new, size, rot, origin, country?, box
        for b in page.get_text("dict")["blocks"]:
            if b["type"] != 0:
                continue
            for l in b["lines"]:
                rot = _DIR_ROTATE.get((round(l.get("dir", (1, 0))[0]),
                                       round(l.get("dir", (1, 0))[1])), 0)
                line_text = "".join(s["text"] for s in l["spans"])
                has_country = plan.src.country in line_text
                for s in l["spans"]:
                    new = transform_text(s["text"], plan.src, dst)
                    if new != s["text"]:
                        bbox = fitz.Rect(s["bbox"])
                        cands.append({"bbox": bbox, "new": new, "size": s["size"],
                                      "rot": rot, "origin": s["origin"],
                                      "country": has_country,
                                      "box": _enclosing_box(white_boxes, bbox)})
        # 2a') Verdeckte Doubletten überspringen: ein Treffer ohne Country-Kontext,
        #      der einen Treffer MIT Country-Kontext überlappt, ist eine im Master
        #      hinter einem weißen Feld liegende Alt-Referenz (sonst Doppeldruck).
        keep = []
        for c in cands:
            if not c["country"]:
                covered = any(
                    o is not c and o["country"]
                    and not (c["bbox"] & o["bbox"]).is_empty
                    and _rect_area(c["bbox"] & o["bbox"]) > 0.3 * _rect_area(c["bbox"])
                    for o in cands)
                if covered:
                    continue
            keep.append(c)

        # 2b) Vektor-QR-Zellen zum Entfernen markieren
        qr_ops = []
        for v in vec_by_page.get(i, []):
            page.add_redact_annot(fitz.Rect(v.bbox), fill=(1, 1, 1))
            qr_ops.append((v.bbox, transform_symbol(v.master_string, plan.src, dst)))

        for c in keep:
            page.add_redact_annot(c["bbox"], fill=(1, 1, 1))
        if keep or qr_ops:
            page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
        for c in keep:
            _insert_ref_text(page, c)
        for bbox, new_str in qr_ops:
            r = fitz.Rect(bbox)
            page.insert_image(r, stream=_png_bytes(qr_util.make_image(new_str, box_pixels=400)),
                              keep_proportion=False)

    # 3) Symbol-Overlays je Platzierung – NACH der Redaktion. Untergrund (das
    #    per replace_image getauschte Bild) erst weiß abdecken, dann das frische
    #    Symbol opak darüberlegen. Identische Bilder werden per ``stream``
    #    eingesetzt (PyMuPDF dedupliziert gleiche Streams – kein Aufblähen).
    overlay_png: dict[tuple, bytes] = {}
    for sym in plan.image_symbols:
        new_str = _symbol_payload(sym, plan.src, dst)
        for pi, bbox in sym.placements:
            rect = fitz.Rect(bbox)
            rotated = sym.kind == "CODE128" and rect.height > rect.width
            doc[pi].draw_rect(rect + (-1, -1, 1, 1), color=None, fill=(1, 1, 1))
            key = (sym.kind, new_str, rotated)
            png = overlay_png.get(key)
            if png is None:
                if sym.kind == "QRCODE":
                    img = qr_util.make_image(new_str, box_pixels=600)
                else:
                    img = barcode_util.make_image_for_box(new_str, sym.aspect)
                    if rotated:
                        img = img.rotate(-90, expand=True)
                png = _png_bytes(img)
                overlay_png[key] = png
            doc[pi].insert_image(rect, stream=png, keep_proportion=False)

    # 4) "Book No: __ of __" auf der Titelseite füllen
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

    # 1) Textlayer: alte Ref-Nummer darf nicht mehr vorkommen – weder als
    #    Einzel-Token (``7408``) noch mit dem Country zusammengeschrieben
    #    (``9717408``) oder in umgekehrter Reihenfolge (``7408971``).
    if dst.ref != src.ref:
        c, r = re.escape(src.country), re.escape(src.ref)
        old_ref_re = re.compile(rf"(?<!\d)(?:{c}\s*{r}|{r}\s*{c}|{r})(?!\d)")
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
        expected = _symbol_payload(sym, src, dst)
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

    # 3) Druckvorstufen-Check: Sonderfarben + Schneide-/Falzmarken (immer)
    errors.extend(verify_prepress(doc, plan))
    return errors


def verify_prepress(doc, plan: MasterPlan) -> list[str]:
    """Prüfe, dass die Druckvorstufe unangetastet ist: alle Sonderfarben
    (Stanze/Perfo/Nut/Passer) noch als Reinfarbe vorhanden **und** die
    Vektor-Marken jeder Seite unverändert (nichts angeschnitten/verschoben/
    umgefärbt). Läuft günstig (~0,2 s) und daher immer mit. Liefert Fehler."""
    errors: list[str] = []
    if plan.spot_colors:
        present = _spot_names(doc)
        for name in plan.spot_colors:
            if name not in present:
                errors.append(f"Druckvorstufe: Sonderfarbe {name!r} fehlt in der Kopie "
                              f"(Reinfarbe verloren oder in Prozessfarbe umgewandelt?).")
    for i, master_marks in plan.draw_marks.items():
        if i >= doc.page_count:
            continue
        # Jeder Original-Marken-Pfad muss erhalten sein. Hinzugefügte weiße
        # Abdeck-Rechtecke der Redaktion sind erlaubt (Teilmengen-Prüfung).
        missing = master_marks - _page_draw_marks(doc[i])
        if missing:
            errors.append(f"Druckvorstufe: {len(missing)} Marke(n) auf Seite {i} "
                          f"fehlen/verändert (Stanze/Perfo/Nut/Rahmen?).")
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
