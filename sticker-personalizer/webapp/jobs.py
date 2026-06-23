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

from sticker import booklet  # noqa: E402
from . import db  # noqa: E402


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
        plan = booklet.analyze_master(p["master_path"])
        db.set_protocol_analysis(
            pid, plan.src.team, plan.src.country, plan.src.ref, plan.ref_width,
            len(plan.image_symbols), len(plan.vector_symbols))
    except Exception as e:  # noqa: BLE001
        db.set_protocol_status(pid, "fehler", f"{e}\n{traceback.format_exc()}")


# ---------------------------------------------------------------------------
# Worker: Produktion
# ---------------------------------------------------------------------------
def produce_run(rid: int, refs: list[str], *, team=None, country=None,
                book_total=None, thorough=False) -> None:
    run = db.get_run(rid)
    p = db.get_protocol(run["protocol_id"])
    out_dir = db.OUTPUT_DIR / f"run_{rid}"
    already = db.produced_refs(p["id"], country or p["country"])
    reprints = {r for r in refs if r in already}
    try:
        def prog(i, n, ref):
            db.set_run_progress(rid, int(i * 100 / n))

        res = booklet.produce(
            p["master_path"], refs, out_dir,
            team=team, country=country,
            combined=True, individual=True,
            book_total=book_total or len(refs),
            verify=True, thorough=thorough, on_progress=prog,
        )
        db.record_produced(p["id"], rid, team or p["team"], country or p["country"],
                           refs, reprints=reprints)
        db.finish_run(rid, "sauber",
                      combined_path=res.get("combined"), zip_path=res.get("zip"))
    except Exception as e:  # noqa: BLE001
        db.finish_run(rid, "fehler", error=f"{e}")
