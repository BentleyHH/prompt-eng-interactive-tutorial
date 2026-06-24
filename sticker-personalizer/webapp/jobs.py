"""Hintergrund-Jobs: Master-Analyse und Produktionsläufe.

Läuft in einfachen Threads (Einzelplatz-App). Der Status wird in der DB
gepflegt und treibt die Ampel im Dashboard:
``laeuft`` = orange, ``fehler`` = rot, ``sauber`` = grün.
"""

from __future__ import annotations

import sys
import traceback
from pathlib import Path

# Elternpaket 'sticker' importierbar machen
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sticker import booklet, excel_io, overlay  # noqa: E402
from . import db, ftp_util, pdfa, seal  # noqa: E402


# ---------------------------------------------------------------------------
# Referenz-Bereiche
# ---------------------------------------------------------------------------
def parse_int_list(text) -> list[int]:
    """'35,40,100-105' -> [35,40,100,101,102,103,104,105]."""
    out: list[int] = []
    for part in str(text or "").replace(";", ",").split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            out.extend(range(int(a), int(b) + 1))
        else:
            out.append(int(part))
    return out


def expand_refs(*, start=None, end=None, count=None, refs=None, skip=None, width=4) -> list[str]:
    """Erzeuge die Liste der Unique-Nummern (nullgefüllt) aus Bereich/Menge/Liste."""
    skipset = set(parse_int_list(skip)) if skip else set()
    if refs:
        nums = parse_int_list(refs)
    elif start is not None and end is not None:
        nums = list(range(int(start), int(end) + 1))
    elif start is not None and count is not None:
        nums, n = [], int(start)
        while len(nums) < int(count):
            if n not in skipset:
                nums.append(n)
            n += 1
        return [str(n).zfill(width) for n in nums]
    else:
        raise ValueError("Bitte Von/Bis, Von+Anzahl oder eine Nummern-Liste angeben.")
    nums = [n for n in nums if n not in skipset]
    return [str(n).zfill(width) for n in nums]


# ---------------------------------------------------------------------------
# Doppel-/Lücken-Analyse (Grundlage des Schutzes vor Mehrfachvergabe)
# ---------------------------------------------------------------------------
def plan_check(protocol_id, country, want_refs: list[str]) -> dict:
    """Teile gewünschte Nummern in 'neu' und 'bereits produziert' und liefere
    eine kurze Bewertung samt Vorschlag des nächsten freien Bereichs."""
    already = db.produced_refs(protocol_id, country)
    new = [r for r in want_refs if r not in already]
    dup = [r for r in want_refs if r in already]
    nxt = None
    if already:
        mx = max(int(r) for r in already)
        width = len(want_refs[0]) if want_refs else 4
        nxt = str(mx + 1).zfill(width)
    return {
        "want": want_refs,
        "neu": new,
        "bereits_produziert": dup,
        "n_want": len(want_refs),
        "n_neu": len(new),
        "n_dup": len(dup),
        "naechste_freie": nxt,
    }


def coverage(protocol_id, country) -> dict:
    """Lückenanalyse aller bisher produzierten Nummern für (Protokoll, Country)."""
    refs = sorted(db.produced_refs(protocol_id, country), key=lambda r: int(r))
    if not refs:
        return {"count": 0, "min": None, "max": None, "gaps": [], "width": 4}
    width = len(refs[0])
    nums = [int(r) for r in refs]
    have = set(nums)
    gaps = []
    a, b = min(nums), max(nums)
    g0 = None
    for n in range(a, b + 1):
        if n not in have:
            g0 = n if g0 is None else g0
        elif g0 is not None:
            gaps.append(f"{str(g0).zfill(width)}–{str(n-1).zfill(width)}" if n - 1 > g0
                        else str(g0).zfill(width))
            g0 = None
    return {"count": len(refs), "min": str(a).zfill(width),
            "max": str(b).zfill(width), "gaps": gaps, "width": width}


# ---------------------------------------------------------------------------
# Worker: Analyse
# ---------------------------------------------------------------------------
def analyze_protocol(pid: int) -> None:
    db.set_protocol_status(pid, "laeuft")
    try:
        p = db.get_protocol(pid)
        if booklet.detect_type(p["master_path"]) == "officer":
            roster = booklet.officer_roster(p["master_path"])
            db.set_protocol_officer(pid, n_roles=len(roster))
            return
        plan = booklet.analyze_master(p["master_path"])
        db.set_protocol_analysis(
            pid, plan.src.team, plan.src.country, plan.src.ref, plan.ref_width,
            len(plan.image_symbols), len(plan.vector_symbols),
            spots=", ".join(plan.spot_colors) if plan.spot_colors else None)
    except Exception as e:  # noqa: BLE001
        db.set_protocol_status(pid, "fehler", f"{e}\n{traceback.format_exc()}")


def officer_run(rid: int, roster_path: str, *, base_url=None, include_cover=True,
                write_name=True, username=None) -> None:
    """Erzeuge ein personalisiertes Officer-Booklet aus der hochgeladenen Excel."""
    run = db.get_run(rid)
    p = db.get_protocol(run["protocol_id"])
    out_dir = db.OUTPUT_DIR / f"run_{rid}"
    out_dir.mkdir(parents=True, exist_ok=True)
    try:
        people = excel_io.read_people(roster_path)
        out_pdf = out_dir / f"{p['slug']}__personalisiert_x{len(people)}.pdf"
        overlay.build(p["master_path"], people, out_pdf, base_url=base_url,
                      include_cover=include_cover, write_name=write_name)
        db.set_run_progress(rid, 100)
        db.finish_run(rid, "sauber", combined_path=out_pdf)
        db.log_audit(username, "officer-produce", f"{p['name']}: {len(people)} Officer")
    except Exception as e:  # noqa: BLE001
        db.finish_run(rid, "fehler", error=f"{e}")
        db.log_audit(username, "fehler", f"Officer-Lauf #{rid}: {e}")


def officer_renumber_run(rid: int, start: int, *, base_url=None, include_cover=True,
                         username=None) -> None:
    """Officer-Booklet mit neu vergebenen, fortlaufenden Officer-IDs ab ``start``
    erzeugen (Design/Rollen gleich, nur Nummern + QR-Codes ändern sich)."""
    run = db.get_run(rid)
    p = db.get_protocol(run["protocol_id"])
    out_dir = db.OUTPUT_DIR / f"run_{rid}"
    out_dir.mkdir(parents=True, exist_ok=True)
    try:
        out_pdf = out_dir / f"{p['slug']}__nummern_ab_{start}.pdf"
        res = overlay.renumber_build(p["master_path"], int(start), out_pdf,
                                     base_url=base_url, include_cover=include_cover)
        db.set_run_progress(rid, 100)
        db.finish_run(rid, "sauber", combined_path=res["path"])
        db.log_audit(username, "officer-renumber",
                     f"{p['name']}: {res['count']} IDs {res['first']}–{res['last']}")
    except Exception as e:  # noqa: BLE001
        db.finish_run(rid, "fehler", error=f"{e}")
        db.log_audit(username, "fehler", f"Officer-Nummern #{rid}: {e}")


# ---------------------------------------------------------------------------
# Worker: Produktion
# ---------------------------------------------------------------------------
def produce_run(rid: int, refs: list[str], *, team=None, country=None,
                book_total=None, thorough=False, workers=1, username=None,
                make_pdfa=False, ftp_after=False) -> None:
    run = db.get_run(rid)
    p = db.get_protocol(run["protocol_id"])
    team = team or p["team"]
    country = country or p["country"]
    out_dir = db.OUTPUT_DIR / f"run_{rid}"
    already = db.produced_refs(p["id"], country)
    reprints = {r for r in refs if r in already}
    try:
        def prog(i, n, ref):
            db.set_run_progress(rid, int(i * 100 / n))

        res = booklet.produce(
            p["master_path"], refs, out_dir,
            team=team, country=country,
            combined=True, individual=True,
            book_total=book_total or len(refs),
            verify=True, thorough=thorough, workers=workers, on_progress=prog,
        )
        # Integritäts-Siegel je Nummer berechnen und im Ledger ablegen
        secret = db.ensure_secret()
        seals = {r: seal.compute(secret, p["slug"], team, country, r) for r in refs}
        db.record_produced(p["id"], rid, team, country, refs,
                           reprints=reprints, seals=seals, username=username)
        db.finish_run(rid, "sauber",
                      combined_path=res.get("combined"), zip_path=res.get("zip"))
        db.log_audit(username, "produce",
                     f"{p['name']} {country} {refs[0]}–{refs[-1]} ({len(refs)} St., "
                     f"{len(reprints)} Nachdruck)")

        # PDF/A-Archivkopien (optional) – pro Booklet, parallel, als ZIP
        if make_pdfa:
            try:
                make_pdfa_bundle(rid, p, username, workers=workers,
                                 individual_paths=res.get("individual"))
            except Exception as e:  # noqa: BLE001
                db.set_run_file(rid, ftp_status=f"PDF/A fehlgeschlagen: {e}")
                db.log_audit(username, "pdfa-fehler", f"Lauf #{rid}: {e}")

        # FTP-Upload (optional)
        if ftp_after:
            _ftp_upload_run(rid, p, username)
    except Exception as e:  # noqa: BLE001
        db.finish_run(rid, "fehler", error=f"{e}")
        db.log_audit(username, "fehler", f"Lauf #{rid}: {e}")


def make_pdfa_bundle(rid, protocol, username, workers=4, individual_paths=None) -> Path:
    """Erzeuge je Booklet eine PDF/A-Archivkopie (parallel) und bündle sie als ZIP.

    Skaliert deutlich besser als eine einzige riesige PDF/A: viele kleine
    32-Seiten-Konvertierungen laufen gleichzeitig statt einer langen seriellen.
    """
    import zipfile

    out_dir = db.OUTPUT_DIR / f"run_{rid}"
    if individual_paths:
        inds = [Path(x) for x in individual_paths]
    else:  # für den manuellen Knopf: Einzel-PDFs im Lauf-Ordner finden
        inds = sorted(x for x in out_dir.glob("*.pdf")
                      if "__DRUCK_" not in x.name and "__PDFA" not in x.name)
    if not inds:
        raise RuntimeError("Keine Einzel-PDFs für die PDF/A-Erzeugung gefunden.")

    pairs = [(str(x), str(out_dir / (x.stem + "__PDFA.pdf"))) for x in inds]
    results = pdfa.to_pdfa_many(pairs, workers=max(1, int(workers)))
    made = [r[1] for r in results if r[1]]
    errors = [(r[0], r[2]) for r in results if r[2]]
    if not made:
        raise RuntimeError(
            f"alle {len(errors)} PDF/A-Konvertierungen fehlgeschlagen: "
            f"{errors[0][1] if errors else ''}")

    zpath = out_dir / f"{protocol['slug']}__PDFA_x{len(made)}.zip"
    with zipfile.ZipFile(zpath, "w", zipfile.ZIP_DEFLATED) as z:
        for f in made:
            z.write(f, Path(f).name)
    for f in made:                       # Einzel-PDF/A nach dem Zippen entfernen
        Path(f).unlink(missing_ok=True)

    db.set_run_file(rid, pdfa_path=zpath)
    msg = f"Lauf #{rid}: {len(made)} PDF/A erstellt"
    if errors:
        msg += f", {len(errors)} fehlgeschlagen"
        db.set_run_file(rid, ftp_status=f"PDF/A: {len(errors)} fehlgeschlagen")
    db.log_audit(username, "pdfa", msg)
    return zpath


def _ftp_upload_run(rid, protocol, username) -> None:
    run = db.get_run(rid)
    s = db.all_settings()
    files = [f for f in [run.get("combined_path"), run.get("zip_path"), run.get("pdfa_path")] if f]
    try:
        remote = ftp_util.upload(
            files, host=s.get("ftp_host", ""), user=s.get("ftp_user", ""),
            password=s.get("ftp_pass", ""), directory=s.get("ftp_dir", ""),
            port=int(s.get("ftp_port", 21) or 21), tls=(s.get("ftp_tls") == "1"))
        db.set_run_file(rid, ftp_status=f"hochgeladen: {len(remote)} Datei(en)")
        db.log_audit(username, "ftp", f"Lauf #{rid}: {len(remote)} Datei(en) hochgeladen")
    except Exception as e:  # noqa: BLE001
        db.set_run_file(rid, ftp_status=f"FTP fehlgeschlagen: {e}")
        db.log_audit(username, "ftp-fehler", f"Lauf #{rid}: {e}")


# ---------------------------------------------------------------------------
# KI-Plausibilitätscheck (deterministische Klartext-Zusammenfassung)
# ---------------------------------------------------------------------------
def insight(protocol_id) -> dict:
    """Erzeuge eine verständliche Übersicht über den Produktionsstand je Country,
    inkl. Lücken, nächster freier Nummer, Nachdrucken und Auffälligkeiten."""
    p = db.get_protocol(protocol_id)
    rows = db.produced_list(protocol_id)
    by_country: dict[str, list[dict]] = {}
    for r in rows:
        by_country.setdefault(r["country"], []).append(r)

    lines: list[str] = []
    warnings: list[str] = []
    if not rows:
        return {"text": "Für dieses Protokoll wurde noch nichts produziert.", "warnings": []}

    for country in sorted(by_country):
        cov = coverage(protocol_id, country)
        reprints = sum(1 for r in by_country[country] if r["is_reprint"])
        line = (f"Country {country}: {cov['count']} Nummern, Bereich "
                f"{cov['min']}–{cov['max']}, "
                + ("lückenlos" if not cov["gaps"] else f"Lücken: {', '.join(cov['gaps'])}")
                + f". Nächste freie Nummer: {str(int(cov['max'])+1).zfill(cov['width'])}.")
        if reprints:
            line += f" {reprints} Nachdruck(e)."
        lines.append(line)
        if cov["gaps"]:
            warnings.append(f"Country {country}: {len(cov['gaps'])} Lücke(n) – evtl. fehlende Auflage prüfen.")
        if reprints:
            warnings.append(f"Country {country}: {reprints} Nachdruck(e) im Ledger – doppelte Nummern wurden bewusst erneut erzeugt.")

    header = f"Protokoll „{p['name']}“ – Stand der Unique-Nummern:"
    text = header + "\n• " + "\n• ".join(lines)
    if warnings:
        text += "\n\nHinweise:\n• " + "\n• ".join(warnings)
    else:
        text += "\n\nKeine Auffälligkeiten – alles konsistent."
    return {"text": text, "warnings": warnings, "countries": list(by_country)}
