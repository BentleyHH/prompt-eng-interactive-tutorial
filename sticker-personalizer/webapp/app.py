"""Booklet-Dashboard – lokale Flask-App.

Start:
    cd sticker-personalizer
    python -m webapp.app          # oder:  python webapp/app.py
    -> http://127.0.0.1:5000

Funktionen: Master-Booklets importieren und analysieren (Ampel-Status),
Mengen/Bereiche festlegen oder per Excel importieren, produzieren (mit
100%-Verifikation), Verlauf + Doppel-Schutz, Downloads. Datenbank und Ausgaben
liegen unter ``webapp/data`` und lassen sich per FTP sichern.
"""

from __future__ import annotations

import re
import sys
import threading
from pathlib import Path

from flask import (Flask, jsonify, request, render_template,
                   send_file, send_from_directory, abort)

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from webapp import db, jobs, orders  # noqa: E402

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 200 * 1024 * 1024  # 200 MB Upload


def _slugify(text: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    return s or "protokoll"


def _unique_slug(base: str) -> str:
    slug, i = base, 2
    while db.slug_exists(slug):
        slug = f"{base}-{i}"; i += 1
    return slug


# ---------------------------------------------------------------------------
# Seiten
# ---------------------------------------------------------------------------
@app.route("/")
def index():
    return render_template("index.html")


# ---------------------------------------------------------------------------
# Protokolle
# ---------------------------------------------------------------------------
@app.get("/api/protocols")
def api_protocols():
    return jsonify(db.list_protocols())


@app.post("/api/protocols")
def api_protocol_upload():
    f = request.files.get("master")
    if not f or not f.filename.lower().endswith(".pdf"):
        abort(400, "Bitte eine Master-PDF hochladen.")
    name = (request.form.get("name") or Path(f.filename).stem).strip()
    slug = _unique_slug(_slugify(name))
    dest = db.MASTERS_DIR / f"{slug}.pdf"
    dest.parent.mkdir(parents=True, exist_ok=True)
    f.save(dest)
    pid = db.add_protocol(name, slug, dest)
    threading.Thread(target=jobs.analyze_protocol, args=(pid,), daemon=True).start()
    return jsonify({"id": pid, "status": "laeuft"})


@app.post("/api/protocols/<int:pid>/reanalyze")
def api_protocol_reanalyze(pid):
    if not db.get_protocol(pid):
        abort(404)
    threading.Thread(target=jobs.analyze_protocol, args=(pid,), daemon=True).start()
    return jsonify({"id": pid, "status": "laeuft"})


@app.get("/api/protocols/<int:pid>")
def api_protocol_detail(pid):
    p = db.get_protocol(pid)
    if not p:
        abort(404)
    country = request.args.get("country") or p.get("country")
    p["runs"] = db.list_runs(pid)
    p["coverage"] = jobs.coverage(pid, country) if country else None
    p["produced"] = db.produced_list(pid, country)
    return jsonify(p)


@app.get("/api/protocols/<int:pid>/template.xlsx")
def api_protocol_template(pid):
    p = db.get_protocol(pid)
    if not p:
        abort(404)
    data = orders.build_template(p)
    return send_file(__import__("io").BytesIO(data), as_attachment=True,
                     download_name=f"Auftragsvorlage_{p['slug']}.xlsx",
                     mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


# ---------------------------------------------------------------------------
# Planung / Prüfung (Doppel-Schutz)
# ---------------------------------------------------------------------------
def _expand_and_check(pid, country, body) -> dict:
    width = body.get("width") or (db.get_protocol(pid) or {}).get("ref_width") or 4
    refs = jobs.expand_refs(
        start=body.get("von"), end=body.get("bis"), count=body.get("anzahl"),
        refs=body.get("refs"), skip=body.get("auslassen"), width=int(width))
    check = jobs.plan_check(pid, country, refs)
    check["mode"] = (body.get("modus") or "neu").lower()
    # effektiv zu produzierende Nummern je nach Modus
    if check["mode"] == "nachdruck":
        check["produzieren"] = refs
    else:
        check["produzieren"] = check["neu"]
    return check


@app.post("/api/protocols/<int:pid>/check")
def api_check(pid):
    if not db.get_protocol(pid):
        abort(404)
    body = request.get_json(force=True)
    country = str(body.get("country") or "").strip()
    if not country:
        abort(400, "Country-Code fehlt.")
    try:
        return jsonify(_expand_and_check(pid, country, body))
    except ValueError as e:
        abort(400, str(e))


@app.post("/api/protocols/<int:pid>/orders/preview")
def api_orders_preview(pid):
    if not db.get_protocol(pid):
        abort(404)
    f = request.files.get("orders")
    if not f:
        abort(400, "Bitte die ausgefüllte Auftrags-Excel hochladen.")
    try:
        parsed = orders.parse_orders(f.read())
    except Exception as e:  # noqa: BLE001
        abort(400, f"Excel konnte nicht gelesen werden: {e}")
    out = []
    for o in parsed:
        body = {"von": o["von"], "bis": o["bis"], "anzahl": o["anzahl"],
                "auslassen": o["auslassen"], "modus": o["modus"]}
        check = _expand_and_check(pid, o["country"], body)
        out.append({"order": o, "check": check})
    return jsonify({"orders": out})


# ---------------------------------------------------------------------------
# Produktion
# ---------------------------------------------------------------------------
@app.post("/api/protocols/<int:pid>/produce")
def api_produce(pid):
    p = db.get_protocol(pid)
    if not p:
        abort(404)
    if p["status"] != "sauber":
        abort(400, "Protokoll ist noch nicht sauber analysiert.")
    body = request.get_json(force=True)
    country = str(body.get("country") or "").strip()
    team = (body.get("team") or p["team"])
    if not country:
        abort(400, "Country-Code fehlt.")
    try:
        check = _expand_and_check(pid, country, body)
    except ValueError as e:
        abort(400, str(e))
    refs = check["produzieren"]
    if not refs:
        abort(400, "Keine zu produzierenden Nummern (alle bereits vorhanden? Modus 'nachdruck' wählen).")
    spec = (f"{country} {refs[0]}–{refs[-1]} ({len(refs)} St., Modus {check['mode']})")
    rid = db.add_run(pid, team, country, spec, refs, check["mode"])
    threading.Thread(
        target=jobs.produce_run, args=(rid, refs),
        kwargs={"team": team, "country": country,
                "book_total": body.get("book_total"),
                "thorough": bool(body.get("thorough"))},
        daemon=True).start()
    return jsonify({"run_id": rid, "spec": spec, "count": len(refs)})


@app.get("/api/runs")
def api_runs():
    return jsonify(db.list_runs(limit=200))


@app.get("/api/runs/<int:rid>")
def api_run(rid):
    r = db.get_run(rid)
    if not r:
        abort(404)
    return jsonify(r)


@app.get("/api/runs/<int:rid>/download/<which>")
def api_run_download(rid, which):
    r = db.get_run(rid)
    if not r:
        abort(404)
    path = r.get("combined_path") if which == "combined" else r.get("zip_path")
    if not path or not Path(path).exists():
        abort(404, "Datei nicht vorhanden.")
    return send_file(path, as_attachment=True, download_name=Path(path).name)


# ---------------------------------------------------------------------------
# Ledger
# ---------------------------------------------------------------------------
@app.get("/api/produced")
def api_produced():
    pid = request.args.get("protocol", type=int)
    country = request.args.get("country")
    return jsonify({
        "produced": db.produced_list(pid, country),
        "coverage": jobs.coverage(pid, country) if (pid and country) else None,
    })


def main():
    db.init_db()
    print("Booklet-Dashboard läuft auf  http://127.0.0.1:5000")
    app.run(host="127.0.0.1", port=5000, debug=False, threaded=True)


if __name__ == "__main__":
    main()
