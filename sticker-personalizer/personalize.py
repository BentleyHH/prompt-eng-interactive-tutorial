#!/usr/bin/env python3
"""ETAF Officer-ID Sticker-Personalisierung – Kommandozeilen-Werkzeug.

Beispiele
---------
Beispiel-Excel erzeugen:
    python personalize.py init-excel teams.xlsx

Booklet aus dem Original personalisieren (druckidentisch):
    python personalize.py overlay teams.xlsx \
        --original OM_BOOKLET_260209_Booklet_1_74401_74445.pdf \
        --out booklet_personalisiert.pdf --qr-base-url https://etaf.example/o

Booklet aus selbst entworfener Vorlage neu erzeugen (frei skalierbar):
    python personalize.py generate teams.xlsx --out booklet_neu.pdf
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from sticker import excel_io, overlay, template


def _load(path: str):
    people = excel_io.read_people(path)
    print(f"  {len(people)} Personen aus '{path}' eingelesen.")
    return people


def cmd_init_excel(args):
    out = excel_io.write_example(args.path)
    print(f"Beispiel-Vorlage geschrieben: {out}")


def cmd_overlay(args):
    people = _load(args.excel)
    out = overlay.build(
        original_pdf=args.original, people=people, out_pdf=args.out,
        base_url=args.qr_base_url, include_cover=not args.no_cover,
        write_name=not args.no_name,
    )
    print(f"Personalisiertes Booklet (Overlay) geschrieben: {out}")


def cmd_generate(args):
    people = _load(args.excel)
    out = template.build(
        people=people, out_pdf=args.out, base_url=args.qr_base_url,
        logo_path=(args.logo or template.cfg.LOGO_PATH),
    )
    print(f"Personalisiertes Booklet (Vorlage) geschrieben: {out}")


def build_parser():
    p = argparse.ArgumentParser(
        description="Personalisiere das ETAF Officer-ID-Booklet aus einer Excel-Tabelle.")
    sub = p.add_subparsers(dest="command", required=True)

    pi = sub.add_parser("init-excel", help="Beispiel-/Blanko-Excel erzeugen.")
    pi.add_argument("path", nargs="?", default="teams.xlsx")
    pi.set_defaults(func=cmd_init_excel)

    common_qr = dict(default=None, help="Basis-URL für QR-Codes, z.B. https://etaf.example/o "
                                        "(QR = URL + OfficerID). Ohne Angabe: 'Officer ID <id>'.")

    po = sub.add_parser("overlay", help="Original-PDF personalisieren (druckidentisch).")
    po.add_argument("excel")
    po.add_argument("--original", required=True, help="Pfad zur Original-Booklet-PDF.")
    po.add_argument("--out", default="booklet_personalisiert.pdf")
    po.add_argument("--qr-base-url", **common_qr)
    po.add_argument("--no-cover", action="store_true", help="Titelseite weglassen.")
    po.add_argument("--no-name", action="store_true", help="Namensfeld nicht füllen.")
    po.set_defaults(func=cmd_overlay)

    pg = sub.add_parser("generate", help="Booklet aus selbst entworfener Vorlage neu erzeugen.")
    pg.add_argument("excel")
    pg.add_argument("--out", default="booklet_neu.pdf")
    pg.add_argument("--qr-base-url", **common_qr)
    pg.add_argument("--logo", default=None, help="Eigenes Logo (PNG). Standard: ETAF-Logo.")
    pg.set_defaults(func=cmd_generate)
    return p


def main(argv=None):
    args = build_parser().parse_args(argv)
    try:
        args.func(args)
    except (FileNotFoundError, ValueError) as e:
        print(f"Fehler: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
