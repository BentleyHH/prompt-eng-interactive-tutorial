"""Layout-, Farb- und Maßkonstanten.

Alle Werte sind aus der Original-PDF
``OM_BOOKLET_260209_Booklet_1_74401_74445.pdf`` (Adobe InDesign 21.2)
vermessen. Koordinaten verstehen sich – sofern nicht anders angegeben – im
PDF-/ReportLab-Koordinatensystem mit Ursprung unten links und Einheit Punkt
(1 pt = 1/72 inch).
"""

from pathlib import Path

# --- Pfade -----------------------------------------------------------------
PKG_DIR = Path(__file__).resolve().parent
ROOT_DIR = PKG_DIR.parent
ASSETS_DIR = ROOT_DIR / "assets"
LOGO_PATH = ASSETS_DIR / "etaf_logo.png"

# --- Seitenmaße (Original) -------------------------------------------------
# 642.28 x 888.90 pt  ==  226.6 x 313.6 mm (inkl. Beschnitt / Crop-Marks).
PAGE_W = 642.2830
PAGE_H = 888.8980

# --- Farben (gemessen) -----------------------------------------------------
TEAL = (4 / 255, 91 / 255, 116 / 255)      # #045B74  Seitenleiste
INK = (35 / 255, 31 / 255, 32 / 255)       # #231F20  Schrift/Linien (fast schwarz)
WHITE = (1, 1, 1)
GREY = (0.6, 0.6, 0.6)                       # "FILL OUT + SCAN" Hinweis

# --- Schrift ---------------------------------------------------------------
# Original verwendet Arial-BoldMT. Helvetica-Bold ist die metrisch nahe,
# überall verfügbare Standard-Entsprechung in ReportLab.
FONT_BOLD = "Helvetica-Bold"
FONT_REG = "Helvetica"

# ---------------------------------------------------------------------------
# Positionen der Elemente, die im OVERLAY-Modus verändert werden.
# Quelle: vermessene Bounding-Boxes der Original-Seite (Koordinaten hier in
# ReportLab-Konvention: y von unten). PDF-oben-Wert  ->  PAGE_H - y.
# ---------------------------------------------------------------------------

# Großer QR-Code auf dem Badge (oben). PDF-top-left Rect (209.8,94,288.8,173).
QR_BIG = dict(x=209.8, y=PAGE_H - 173.0, size=79.0)

# Kleiner QR-Code auf dem Logbuch-Label (unten).
# PDF-top-left Rect (230.0,558.5,273.75,602.25).
QR_SMALL = dict(x=230.0, y=PAGE_H - 602.25, size=43.75)

# "Name:"-Feld auf dem Badge. Schreibfläche oberhalb des Labels.
# PDF-top-left Zelle ~ x[135..305], y[246..280].
NAME_FIELD = dict(x0=137.0, x1=304.0, y_top=PAGE_H - 248.0, y_bot=PAGE_H - 281.0)

# Officer-ID-Nummer auf dem Badge (zum optionalen Überstempeln).
# PDF-top-left "74401" bei (56.8,547.3) Größe 50.
ID_FIELD = dict(x=56.8, y=PAGE_H - 542.0, size=50.0)
