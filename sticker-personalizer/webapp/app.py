"""Booklet-Dashboard – lokale Flask-App.

Start:
    cd sticker-personalizer
    python -m webapp.app          # oder:  python webapp/app.py
    -> http://127.0.0.1:8765   (erster Login: admin / admin)

Funktionen: Login + Audit-Log, Master-Booklets importieren/analysieren
(Ampel-Status), Mengen/Bereiche oder Excel-Import, parallele Produktion mit
100%-Verifikation, Integritäts-Siegel je Nummer, Doppel-Schutz-Ledger,
PDF/A-Archivkopien, FTP-Upload, CSV-/Nachweis-Export und KI-Plausibilitätscheck.
Datenbank und Ausgaben liegen unter ``webapp/data`` (FTP-tauglich sicherbar).
"""

from __future__ import annotations

import io
import re
import sys
import threading
from pathlib import Path

from flask import (Flask, abort, jsonify, redirect, render_template, request,
                   send_file, session, url_for)

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from webapp import auth, db, exports, jobs, orders, pdfa, seal  # noqa: E402

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 300 * 1024 * 1024  # 300 MB Upload


# ---------------------------------------------------------------------------
# Auth: alles außer Login + statische Dateien erfordert Anmeldung
# ---------------------------------------------------------------------------
@app.before_request
def _require_login():
    open_paths = {"/login"}
    if request.endpoint == "static" or request.path in open_paths:
        return
    if not session.get("user"):
        if request.path.startswith("/api/"):
            return jsonify({"error": "nicht angemeldet"}), 401
        return redirect(url_for("login_page"))


def _user():
    return session.get("user")


def _slugify(text: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    return s or "protokoll"


def _unique_slug(base: str) -> str:
    slug, i = base, 2
    while db.slug_exists(slug):
        slug = f"{base}-{i}"; i += 1
    return slug


# ---------------------------------------------------------------------------
# Seiten / Login
# ---------------------------------------------------------------------------
@app.get("/")
def index():
    return render_template("index.html", user=_user(), role=session.get("role"))


@app.get("/login")
def login_page():
    if session.get("user"):
        return redirect(url_for("index"))
    return render_template("login.html")


@app.post("/login")
def login_post():
    u = auth.authenticate(request.form.get("username", ""), request.form.get("password", ""))
    if not u:
        return render_template("login.html", error="Anmeldung fehlgeschlagen."), 401
    session["user"] = u["username"]
    session["role"] = u["role"]
    db.log_audit(u["username"], "login", "")
    return redirect(url_for("index"))


@app.get("/logout")
def logout():
    db.log_audit(_user(), "logout", "")
    session.clear()
    return redirect(url_for("login_page"))


@app.get("/api/me")
def api_me():
    return jsonify({"user": _user(), "role": session.get("role"),
                    "pdfa": pdfa.available()})


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
    db.log_audit(_user(), "protokoll-import", name)
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
    return send_file(io.BytesIO(data), as_attachment=True,
                     download_name=f"Auftragsvorlage_{p['slug']}.xlsx",
                     mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


@app.get("/api/protocols/<int:pid>/insight")
def api_protocol_insight(pid):
    if not db.get_protocol(pid):
        abort(404)
    return jsonify(jobs.insight(pid))


# --- Officer-Booklet (Excel-Personalisierung) ------------------------------
@app.get("/api/protocols/<int:pid>/officer-template.xlsx")
def api_officer_template(pid):
    p = db.get_protocol(pid)
    if not p:
        abort(404)
    import tempfile
    from sticker import booklet, excel_io
    roster = booklet.officer_roster(p["master_path"])
    tmp = Path(tempfile.mkstemp(suffix=".xlsx")[1])
    excel_io.write_roster_template(tmp, roster)
    return send_file(tmp, as_attachment=True,
                     download_name=f"Officer_Maske_{p['slug']}.xlsx",
                     mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")


@app.post("/api/protocols/<int:pid>/officer-produce")
def api_officer_produce(pid):
    p = db.get_protocol(pid)
    if not p:
        abort(404)
    if p.get("ptype") != "officer":
        abort(400, "Dieses Protokoll ist kein Officer-Booklet.")
    f = request.files.get("roster")
    if not f:
        abort(400, "Bitte die ausgefüllte Officer-Excel hochladen.")
    import tempfile
    tmp = Path(tempfile.mkstemp(suffix=".xlsx")[1])
    f.save(tmp)
    base_url = (request.form.get("qr_base_url") or "").strip() or None
    include_cover = request.form.get("cover", "1") != "0"
    write_name = request.form.get("name", "1") != "0"
    rid = db.add_run(pid, "OFFICER", "-", "Officer-Personalisierung (Excel)", [], "officer")
    threading.Thread(
        target=jobs.officer_run, args=(rid, str(tmp)),
        kwargs={"base_url": base_url, "include_cover": include_cover,
                "write_name": write_name, "username": _user()},
        daemon=True).start()
    return jsonify({"run_id": rid})


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
    check["produzieren"] = refs if check["mode"] == "nachdruck" else check["neu"]
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
        out.append({"order": o, "check": _expand_and_check(pid, o["country"], body)})
    return jsonify({"orders": out})


# ---------------------------------------------------------------------------
# Produktion
# ---------------------------------------------------------------------------
@app.post("/api/protocols/<int:pid>/produce")
def api_produce(pid):
    p = db.get_protocol(pid)
    if not p:
        abort(404)
    if p.get("ptype") == "officer":
        abort(400, "Officer-Booklet: bitte über die Excel-Maske personalisieren.")
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
    spec = f"{country} {refs[0]}–{refs[-1]} ({len(refs)} St., Modus {check['mode']})"
    rid = db.add_run(pid, team, country, spec, refs, check["mode"])
    threading.Thread(
        target=jobs.produce_run, args=(rid, refs),
        kwargs={"team": team, "country": country,
                "book_total": body.get("book_total"),
                "thorough": bool(body.get("thorough")),
                "workers": int(body.get("workers") or 1),
                "username": _user(),
                "make_pdfa": bool(body.get("pdfa")),
                "ftp_after": bool(body.get("ftp"))},
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
    key = {"combined": "combined_path", "zip": "zip_path", "pdfa": "pdfa_path"}.get(which)
    path = r.get(key) if key else None
    if not path or not Path(path).exists():
        abort(404, "Datei nicht vorhanden.")
    return send_file(path, as_attachment=True, download_name=Path(path).name)


@app.post("/api/runs/<int:rid>/pdfa")
def api_run_pdfa(rid):
    r = db.get_run(rid)
    if not r:
        abort(404)
    p = db.get_protocol(r["protocol_id"])
    try:
        workers = request.args.get("workers", default=4, type=int)
        zpath = jobs.make_pdfa_bundle(rid, p, _user(), workers=workers)
        return jsonify({"ok": True, "pdfa": Path(zpath).name})
    except Exception as e:  # noqa: BLE001
        abort(400, str(e))


@app.post("/api/runs/<int:rid>/ftp")
def api_run_ftp(rid):
    if not db.get_run(rid):
        abort(404)
    p = db.get_protocol(db.get_run(rid)["protocol_id"])
    jobs._ftp_upload_run(rid, p, _user())
    return jsonify(db.get_run(rid))


# ---------------------------------------------------------------------------
# Ledger / Exporte / Verifikation
# ---------------------------------------------------------------------------
@app.get("/api/produced")
def api_produced():
    pid = request.args.get("protocol", type=int)
    country = request.args.get("country")
    return jsonify({
        "produced": db.produced_list(pid, country),
        "coverage": jobs.coverage(pid, country) if (pid and country) else None,
    })


@app.get("/api/produced/export.csv")
def api_export_csv():
    pid = request.args.get("protocol", type=int)
    country = request.args.get("country")
    rows = db.produced_list(pid, country)
    db.log_audit(_user(), "export-csv", f"Protokoll {pid} Country {country}")
    return send_file(io.BytesIO(exports.ledger_csv(rows)), as_attachment=True,
                     download_name=f"Ledger_{pid}_{country or 'alle'}.csv",
                     mimetype="text/csv")


@app.get("/api/produced/certificate.pdf")
def api_certificate():
    pid = request.args.get("protocol", type=int)
    country = request.args.get("country") or ""
    p = db.get_protocol(pid)
    if not p:
        abort(404)
    rows = db.produced_list(pid, country)
    cov = jobs.coverage(pid, country) if country else None
    pdf = exports.certificate_pdf(p, country, rows, cov, _user(), db.now())
    db.log_audit(_user(), "nachweis-pdf", f"Protokoll {pid} Country {country}")
    return send_file(io.BytesIO(pdf), as_attachment=True,
                     download_name=f"Produktionsnachweis_{p['slug']}_{country}.pdf",
                     mimetype="application/pdf")


@app.get("/api/verify")
def api_verify():
    pid = request.args.get("protocol", type=int)
    country = request.args.get("country", "")
    ref = request.args.get("ref", "")
    given = request.args.get("seal", "")
    p = db.get_protocol(pid)
    if not p:
        abort(404)
    expected = seal.compute(db.ensure_secret(), p["slug"], p["team"], country, ref)
    return jsonify({"expected": expected, "match": (given.strip().upper() == expected),
                    "in_ledger": ref in db.produced_refs(pid, country)})


# ---------------------------------------------------------------------------
# Einstellungen / Benutzer / Audit (Admin)
# ---------------------------------------------------------------------------
@app.get("/api/settings")
@auth.admin_required
def api_settings_get():
    s = db.all_settings()
    s.pop("secret_key", None)
    if s.get("ftp_pass"):
        s["ftp_pass"] = "********"
    return jsonify(s)


@app.post("/api/settings")
@auth.admin_required
def api_settings_set():
    body = request.get_json(force=True)
    for k in ("ftp_host", "ftp_port", "ftp_user", "ftp_dir", "ftp_tls",
              "auto_pdfa", "auto_ftp", "default_workers"):
        if k in body and body[k] is not None:
            db.set_setting(k, body[k])
    if body.get("ftp_pass") and body["ftp_pass"] != "********":
        db.set_setting("ftp_pass", body["ftp_pass"])
    db.log_audit(_user(), "settings", "aktualisiert")
    return jsonify({"ok": True})


@app.post("/api/settings/ftp-test")
@auth.admin_required
def api_ftp_test():
    from . import ftp_util
    s = db.all_settings()
    try:
        pwd = ftp_util.test_connection(
            host=s.get("ftp_host", ""), user=s.get("ftp_user", ""),
            password=s.get("ftp_pass", ""), port=int(s.get("ftp_port", 21) or 21),
            tls=(s.get("ftp_tls") == "1"))
        return jsonify({"ok": True, "pwd": pwd})
    except Exception as e:  # noqa: BLE001
        return jsonify({"ok": False, "error": str(e)}), 400


@app.get("/api/users")
@auth.admin_required
def api_users():
    return jsonify(db.list_users())


@app.post("/api/users")
@auth.admin_required
def api_user_create():
    body = request.get_json(force=True)
    username = (body.get("username") or "").strip()
    password = body.get("password") or ""
    role = body.get("role") or "operator"
    if not username or not password:
        abort(400, "Benutzername und Passwort erforderlich.")
    if db.get_user(username):
        abort(400, "Benutzer existiert bereits.")
    db.create_user(username, auth.hash_pw(password), role)
    db.log_audit(_user(), "benutzer-anlegen", username)
    return jsonify({"ok": True})


@app.post("/api/users/password")
def api_user_password():
    body = request.get_json(force=True)
    pw = body.get("password") or ""
    if len(pw) < 4:
        abort(400, "Passwort zu kurz.")
    u = db.get_user(_user())
    if not u:
        abort(404)
    with db._LOCK, db.connect() as con:
        con.execute("UPDATE users SET pw_hash=? WHERE id=?", (auth.hash_pw(pw), u["id"]))
    db.log_audit(_user(), "passwort-aendern", "")
    return jsonify({"ok": True})


@app.get("/api/audit")
def api_audit():
    return jsonify(db.list_audit())


# ---------------------------------------------------------------------------
# Standard-Port 8765 (NICHT 5000 – das belegt macOS für den AirPlay-Empfänger
# und würde eine leere Seite zeigen). Per Umgebungsvariable PORT überschreibbar.
import os

DEFAULT_PORT = int(os.environ.get("PORT", "8765"))


def main():
    db.init_db()
    app.secret_key = db.ensure_secret()
    note = auth.ensure_default_admin()
    if note:
        print("  " + note)
    print(f"Booklet-Dashboard läuft auf  http://127.0.0.1:{DEFAULT_PORT}")
    app.run(host="127.0.0.1", port=DEFAULT_PORT, debug=False, threaded=True)


if __name__ == "__main__":
    main()
