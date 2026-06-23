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

CBRN-Exhibit-Booklet als Massenware mit eindeutiger Referenznummer:
    python personalize.py booklet-info ETAF_CBRN_REDZONE_..._MASTER.pdf
    python personalize.py booklet ETAF_CBRN_REDZONE_..._MASTER.pdf \
        --start 35 --count 100 --out-dir druck/
"""

from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

from sticker import booklet, excel_io, overlay, template


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


def cmd_booklet_info(args):
    plan = booklet.analyze_master(args.master)
    print(plan.summary())


def _parse_int_list(text):
    out = []
    for part in str(text).split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part and not part.startswith("-"):
            a, b = part.split("-", 1)
            out.extend(range(int(a), int(b) + 1))
        else:
            out.append(int(part))
    return out


def cmd_booklet(args):
    plan = booklet.analyze_master(args.master)
    width = args.ref_width or plan.ref_width
    explicit = _parse_int_list(args.refs) if args.refs else None
    skip = set(_parse_int_list(args.skip)) if args.skip else None
    refs = booklet.make_refs(start=args.start, count=args.count, width=width,
                             explicit=explicit, skip=skip)
    print(f"Quelle: {plan.src.base()!r} -> erzeuge {len(refs)} Kopien "
          f"({refs[0]} … {refs[-1]}), Team={args.team or plan.src.team}, "
          f"Country={args.country or plan.src.country}.")
    # Beide Ausgaben standardmäßig; --only-combined / --only-individual schränken ein.
    combined = not args.only_individual
    individual = not args.only_combined

    t0 = time.time()

    def prog(i, n, ref):
        print(f"  [{i:>3}/{n}] Ref {ref}  verifiziert ✓  (+{time.time()-t0:.0f}s)")

    res = booklet.produce(
        args.master, refs, args.out_dir,
        team=args.team, country=args.country,
        combined=combined, individual=individual,
        book_total=(args.book_total if args.book_total is not None else len(refs)),
        verify=not args.no_verify, thorough=args.thorough, on_progress=prog,
    )
    print(f"\nFertig: {res['count']} Kopien in {time.time()-t0:.0f}s "
          f"({'verifiziert' if res['verified'] else 'OHNE Verifikation'}).")
    if res["combined"]:
        print(f"  Kombinierte Druck-PDF: {res['combined']}")
    if res["zip"]:
        print(f"  Einzel-PDFs (ZIP):     {res['zip']}  ({len(res['individual'])} Dateien)")


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

    # --- CBRN-Exhibit-Booklet: Massenproduktion ----------------------------
    bi = sub.add_parser("booklet-info",
                        help="Master analysieren (erkannte Referenz, QR/Barcodes, Vektor-Symbole).")
    bi.add_argument("master", help="Pfad zum Master-Booklet (PDF).")
    bi.set_defaults(func=cmd_booklet_info)

    bk = sub.add_parser("booklet",
                        help="Master als Massenware mit eindeutiger Referenznummer erzeugen "
                             "(QR + Barcode + Text, mit 100%-Verifikation).")
    bk.add_argument("master", help="Pfad zum Master-Booklet (PDF).")
    bk.add_argument("--start", type=int, default=None,
                    help="Start-Referenznummer (fortlaufend), z.B. 35.")
    bk.add_argument("--count", type=int, default=None, help="Anzahl der Kopien, z.B. 100.")
    bk.add_argument("--refs", default=None,
                    help="Explizite Liste/Ranges statt start/count, z.B. '35,40,100-105'.")
    bk.add_argument("--skip", default=None,
                    help="Bei fortlaufend auszulassende Nummern, z.B. '50,51,77'.")
    bk.add_argument("--ref-width", type=int, default=None,
                    help="Stellenzahl der Referenznummer (Standard: wie im Master, z.B. 4).")
    bk.add_argument("--team", default=None, help="Team-Code überschreiben (Standard: wie Master).")
    bk.add_argument("--country", default=None,
                    help="Country-Code überschreiben (Standard: wie Master).")
    bk.add_argument("--out-dir", default="druck", help="Ausgabeverzeichnis.")
    bk.add_argument("--only-combined", action="store_true",
                    help="Nur die kombinierte Druck-PDF erzeugen.")
    bk.add_argument("--only-individual", action="store_true",
                    help="Nur die Einzel-PDFs (+ZIP) erzeugen.")
    bk.add_argument("--book-total", type=int, default=None,
                    help="Gesamtzahl im Feld 'Book No: __ of __' (Standard: Anzahl Kopien).")
    bk.add_argument("--thorough", action="store_true",
                    help="Jede einzelne Symbol-Platzierung prüfen (langsamer, sonst je Objekt eine).")
    bk.add_argument("--no-verify", action="store_true",
                    help="Verifikation überspringen (NICHT für den Druck empfohlen).")
    bk.set_defaults(func=cmd_booklet)
    return p


def main(argv=None):
    args = build_parser().parse_args(argv)
    try:
        args.func(args)
    except (FileNotFoundError, ValueError, RuntimeError) as e:
        print(f"Fehler: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
