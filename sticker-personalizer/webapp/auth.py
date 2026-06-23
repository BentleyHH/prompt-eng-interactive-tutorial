"""Anmeldung, Benutzer und Zugriffsschutz."""

from __future__ import annotations

from functools import wraps

from flask import jsonify, redirect, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

from . import db


def ensure_default_admin() -> str | None:
    """Lege beim ersten Start einen Admin 'admin' / 'admin' an. Liefert einen
    Hinweis, falls erstellt (Passwort bitte ändern)."""
    if db.count_users() == 0:
        db.create_user("admin", generate_password_hash("admin"), role="admin")
        return "Standard-Login angelegt: admin / admin  – bitte Passwort ändern!"
    return None


def authenticate(username, password):
    u = db.get_user(username)
    if u and check_password_hash(u["pw_hash"], password):
        return u
    return None


def current_user() -> str | None:
    return session.get("user")


def current_role() -> str | None:
    return session.get("role")


def hash_pw(password: str) -> str:
    return generate_password_hash(password)


def login_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not session.get("user"):
            if request.path.startswith("/api/"):
                return jsonify({"error": "nicht angemeldet"}), 401
            return redirect(url_for("login_page"))
        return f(*args, **kwargs)
    return wrapper


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if not session.get("user"):
            return (jsonify({"error": "nicht angemeldet"}), 401) if request.path.startswith("/api/") \
                else redirect(url_for("login_page"))
        if session.get("role") != "admin":
            return jsonify({"error": "nur für Administratoren"}), 403
        return f(*args, **kwargs)
    return wrapper
