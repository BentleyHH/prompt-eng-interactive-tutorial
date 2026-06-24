"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const api = async (url, opts) => {
  const r = await fetch(url, opts);
  if (r.status === 401) { location.href = "/login"; throw new Error("nicht angemeldet"); }
  if (!r.ok) throw new Error((await r.text()) || r.status);
  return r.headers.get("content-type")?.includes("json") ? r.json() : r;
};
const COLOR = { neu: "grau", laeuft: "orange", fehler: "rot", sauber: "gruen" };
const LABEL = { neu: "neu", laeuft: "läuft", fehler: "Fehler", sauber: "sauber" };

let selectedId = null;

// ---------------------------------------------------------------- Protokolle
async function loadProtocols() {
  const list = await api("/api/protocols");
  const ul = $("#protocols");
  ul.innerHTML = "";
  for (const p of list) {
    const li = document.createElement("li");
    if (p.id === selectedId) li.classList.add("active");
    let sub;
    if (p.ptype === "officer") {
      sub = p.n_image != null ? `Officer-Booklet · ${p.n_image} Rollen` : "Officer-Booklet";
    } else {
      const src = p.team ? `${p.team} ${p.country || ""} ${p.src_ref || ""}` : "—";
      sub = escapeHtml(src.trim()) + (p.n_image != null ? ` · ${p.n_image} QR/Barcode-Objekte · ${p.n_vector} Vektor` : "");
    }
    li.innerHTML = `<i class="dot ${COLOR[p.status] || "grau"}"></i>
      <div class="meta"><b>${escapeHtml(p.name)}</b><small>${sub}</small></div>`;
    li.onclick = () => selectProtocol(p.id);
    ul.appendChild(li);
  }
}

async function selectProtocol(id) {
  selectedId = id;
  await loadProtocols();
  await refreshDetail();
  $("#empty").classList.add("hidden");
  $("#detail").classList.remove("hidden");
}

async function refreshDetail() {
  if (!selectedId) return;
  const country = $("#f-country").value.trim();
  const p = await api(`/api/protocols/${selectedId}` + (country ? `?country=${encodeURIComponent(country)}` : ""));
  $("#d-name").textContent = p.name;
  const badge = $("#d-status");
  badge.textContent = LABEL[p.status] || p.status;
  badge.className = "badge " + (COLOR[p.status] || "grau");
  const officer = p.ptype === "officer";

  // Panels je nach Booklet-Typ umschalten
  $("#officer-card").classList.toggle("hidden", !officer);
  $("#prod-card").classList.toggle("hidden", officer);
  $("#cbrn-cov").classList.toggle("hidden", officer);

  if (officer) {
    officerRoles = p.n_image || 0;
    $("#d-analysis").innerHTML = p.status === "sauber"
      ? `Officer-Booklet · <b>${p.n_image}</b> Rollen-Seiten · Personalisierung per Excel (Name + QR + Aufkleberfarbe)`
      : `<span class="muted">Analyse ${p.status === "laeuft" ? "läuft…" : "ausstehend"}</span>`;
    $("#off-tpl").href = `/api/protocols/${p.id}/officer-template.xlsx`;
    updateNumRange();
  } else {
    $("#d-analysis").innerHTML = p.team
      ? `Quelle: <b>${p.team} ${p.country} ${p.src_ref}</b> · Ref-Breite <b>${p.ref_width}</b>
         · <b>${p.n_image}</b> Bild-Symbole · <b>${p.n_vector}</b> Vektor-Symbole`
         + (p.spots ? `<br>Sonderfarben (Druckvorstufe): <b>${escapeHtml(p.spots)}</b> – werden mitgeprüft` : "")
         + (p.notes ? `<br><span class="note">⚑ ${escapeHtml(p.notes).replace(/\n/g, "<br>⚑ ")}</span>` : "")
      : `<span class="muted">Analyse ${p.status === "laeuft" ? "läuft…" : "ausstehend"}</span>`;
    if (!$("#f-team").value) $("#f-team").value = p.team || "";
    if (!$("#f-country").value && p.country) $("#f-country").value = p.country;
    $("#tpl-link").href = `/api/protocols/${p.id}/template.xlsx`;
    const cq = `protocol=${p.id}${country ? `&country=${encodeURIComponent(country)}` : ""}`;
    $("#exp-csv").href = `/api/produced/export.csv?${cq}`;
    $("#exp-cert").href = `/api/produced/certificate.pdf?${cq}`;
    renderCoverage(p.coverage, country);
  }
  const err = $("#d-error");
  if (p.status === "fehler" && p.error) { err.textContent = p.error; err.classList.remove("hidden"); }
  else err.classList.add("hidden");

  renderRuns(p.runs);
}

// Officer-Sub-Tabs (Nur Nummern / Excel-Maske)
$$("[data-otab]").forEach(tab => tab.onclick = () => {
  $$("[data-otab]").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  $$(".otab-body").forEach(b => b.classList.toggle("hidden", b.dataset.obody !== tab.dataset.otab));
});

// Variante A: nur Nummern fortlaufend neu vergeben (Von–Bis)
let officerRoles = 0;
function updateNumRange() {
  const box = $("#num-range"); if (!box) return;
  const start = numOrNull($("#num-start").value);
  const end = numOrNull($("#num-end").value);
  if (!start || !officerRoles) { box.classList.add("hidden"); return; }
  box.classList.remove("hidden");
  const last = start + officerRoles - 1;
  let html = `Ergibt <b>${officerRoles}</b> Nummern: <b>${start}–${last}</b> (eine je Rollen-Seite).`;
  if (end) {
    const want = end - start + 1;
    if (want === officerRoles) html += ` <span class="ok">✓ passt zu „bis ${end}".</span>`;
    else html += ` <span class="warn">⚠ „bis ${end}" wären ${want} Nummern – das Booklet hat ${officerRoles} Rollen-Seiten.</span>`;
  }
  box.innerHTML = html;
}
$("#num-start").addEventListener("input", updateNumRange);
$("#num-end").addEventListener("input", updateNumRange);

$("#num-go").onclick = async () => {
  const start = numOrNull($("#num-start").value);
  const end = numOrNull($("#num-end").value);
  if (!start) { $("#num-status").innerHTML = '<span class="error">Bitte eine Startnummer angeben.</span>'; return; }
  if (end && officerRoles && (end - start + 1) !== officerRoles) {
    if (!confirm(`„Von ${start} bis ${end}" sind ${end - start + 1} Nummern, das Booklet hat aber ${officerRoles} Rollen-Seiten.\n\nEs werden ${officerRoles} Nummern ab ${start} vergeben (${start}–${start + officerRoles - 1}). Fortfahren?`)) return;
  }
  $("#num-status").textContent = "Erzeuge Booklet mit neuen Nummern …";
  try {
    const res = await api(`/api/protocols/${selectedId}/officer-renumber`, jsonPost({
      start, end, qr_base_url: $("#num-url").value.trim(), cover: $("#num-cover").checked,
    }));
    $("#num-status").textContent = "Lauf gestartet …";
    await refreshDetail();
    pollRun(res.run_id);
  } catch (err) { $("#num-status").innerHTML = `<span class="error">Fehler: ${escapeHtml(err.message)}</span>`; }
};

// Variante B: Excel prüfen (grün/rot) → danach Start-Knopf freigeben
let officerFile = null;
$("#off-file").addEventListener("change", async () => {
  officerFile = $("#off-file").files[0] || null;
  const chk = $("#off-check"), go = $("#off-go");
  go.disabled = true;
  if (!officerFile) { chk.classList.add("hidden"); return; }
  chk.classList.remove("hidden");
  chk.innerHTML = '<span class="muted">Prüfe Excel-Datei …</span>';
  const fd = new FormData(); fd.append("roster", officerFile);
  try {
    const r = await api(`/api/protocols/${selectedId}/officer-preview`, { method: "POST", body: fd });
    if (r.ok) {
      chk.innerHTML = `<div class="ok">✓ Die hochgeladene Excel-Datei funktioniert – grün.</div>
        <div class="muted">${r.count} Officer erkannt (${r.named} mit Namen). Klicke „Booklet erzeugen“.</div>`;
      go.disabled = false;
    } else {
      chk.innerHTML = `<div class="warn">✗ Datei nicht verwendbar: ${escapeHtml(r.error)}</div>`;
      officerFile = null;
    }
  } catch (err) {
    chk.innerHTML = `<div class="warn">✗ Fehler: ${escapeHtml(err.message)}</div>`;
    officerFile = null;
  }
});

// Start-Knopf: geprüfte Excel personalisieren
$("#off-go").onclick = async () => {
  if (!officerFile) return;
  const fd = new FormData();
  fd.append("roster", officerFile);
  fd.append("qr_base_url", $("#off-url").value.trim());
  fd.append("cover", $("#off-cover").checked ? "1" : "0");
  fd.append("name", $("#off-name").checked ? "1" : "0");
  $("#off-status").textContent = "Erzeuge personalisiertes Booklet …";
  $("#off-go").disabled = true;
  try {
    const res = await api(`/api/protocols/${selectedId}/officer-produce`, { method: "POST", body: fd });
    $("#off-status").textContent = "Lauf gestartet …";
    $("#off-file").value = ""; officerFile = null;
    $("#off-check").classList.add("hidden");
    await refreshDetail();
    pollRun(res.run_id);
  } catch (err) { $("#off-status").textContent = "Fehler: " + err.message; }
};

function renderCoverage(cov, country) {
  $("#cov-country").textContent = country ? `· Country ${country}` : "";
  const el = $("#coverage");
  if (!cov || !cov.count) { el.innerHTML = '<span class="muted">Noch nichts produziert.</span>'; return; }
  el.innerHTML = `<span class="big">${cov.count}</span> Nummern · Bereich <b>${cov.min}–${cov.max}</b>` +
    (cov.gaps.length ? `<br>Lücken: ${cov.gaps.map(g => `<span class="pill">${g}</span>`).join(" ")}`
                     : `<br><span class="ok" style="color:#84e29c">lückenlos</span>`);
}

function renderRuns(runs) {
  const ul = $("#runs");
  ul.innerHTML = "";
  if (!runs || !runs.length) { ul.innerHTML = '<li class="muted">noch keine Läufe</li>'; return; }
  for (const r of runs) {
    const li = document.createElement("li");
    let dl = "";
    if (r.status === "sauber") {
      if (r.combined_path) dl += `<a href="/api/runs/${r.id}/download/combined">Druck-PDF</a>`;
      if (r.zip_path) dl += `<a href="/api/runs/${r.id}/download/zip">ZIP</a>`;
      if (r.pdfa_path) dl += `<a href="/api/runs/${r.id}/download/pdfa">PDF/A-ZIP</a>`;
      else dl += `<a href="#" data-pdfa="${r.id}">PDF/A erstellen</a>`;
      dl += `<a href="#" data-ftp="${r.id}">FTP-Upload</a>`;
      if (r.ftp_status) dl += `<span class="muted"> · ${escapeHtml(r.ftp_status)}</span>`;
    }
    const bar = r.status === "laeuft"
      ? `<div class="bar"><i style="width:${r.progress || 0}%"></i></div>` : "";
    const del = r.status !== "laeuft"
      ? `<a href="#" class="del" data-del="${r.id}" title="Lauf löschen">✕ löschen</a>` : "";
    li.innerHTML = `<i class="dot ${COLOR[r.status]}"></i> <b>#${r.id}</b> ${escapeHtml(r.spec || "")}
      ${bar}${r.status === "fehler" ? `<div class="error">${escapeHtml(r.error || "")}</div>` : dl}${del}`;
    ul.appendChild(li);
    if (r.status === "laeuft") pollRun(r.id);
  }
}

const polling = new Set();
function pollRun(rid) {
  if (polling.has(rid)) return;
  polling.add(rid);
  const t = setInterval(async () => {
    const r = await api(`/api/runs/${rid}`);
    if (r.status !== "laeuft") { clearInterval(t); polling.delete(rid); await refreshDetail(); await loadProtocols(); }
    else { const bar = $(`#runs .bar > i`); if (bar) bar.style.width = (r.progress || 0) + "%"; await refreshDetailRunsOnly(); }
  }, 1500);
}
async function refreshDetailRunsOnly() {
  const p = await api(`/api/protocols/${selectedId}`);
  renderRuns(p.runs);
}

// ----------------------------------------------------------------- Aktionen
$("#upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = $("#master-file").files[0];
  if (!file) { setUploadStatus("Bitte eine PDF wählen."); return; }
  const fd = new FormData();
  fd.append("master", file);
  fd.append("name", $("#master-name").value);
  setUploadStatus("Lade hoch und analysiere…");
  try {
    const res = await api("/api/protocols", { method: "POST", body: fd });
    setUploadStatus("");
    $("#master-file").value = ""; $("#master-name").value = "";
    await loadProtocols();
    selectProtocol(res.id);
  } catch (err) { setUploadStatus("Fehler: " + err.message); }
});
$("#master-file").addEventListener("change", () => {
  const f = $("#master-file").files[0];
  $(".file-btn").firstChild && ($(".file-btn").childNodes[2].nodeValue = f ? " " + f.name : " Master-PDF wählen…");
});
function setUploadStatus(t) { $("#upload-status").textContent = t; }

$("#d-reanalyze").onclick = async () => {
  await api(`/api/protocols/${selectedId}/reanalyze`, { method: "POST" });
  await loadProtocols(); await refreshDetail(); pollProtocol();
};
function pollProtocol() {
  const t = setInterval(async () => {
    const list = await api("/api/protocols");
    const p = list.find(x => x.id === selectedId);
    await loadProtocols();
    if (p && p.status !== "laeuft") { clearInterval(t); await refreshDetail(); }
  }, 1500);
}

// Tabs
$$(".tab").forEach(tab => tab.onclick = () => {
  $$(".tab").forEach(t => t.classList.remove("active"));
  tab.classList.add("active");
  $$(".tab-body").forEach(b => b.classList.toggle("hidden", b.dataset.body !== tab.dataset.tab));
});

function currentBody() {
  return {
    country: $("#f-country").value.trim(),
    team: $("#f-team").value.trim(),
    von: numOrNull($("#f-von").value),
    bis: numOrNull($("#f-bis").value),
    anzahl: numOrNull($("#f-anzahl").value),
    auslassen: $("#f-skip").value.trim() || null,
    modus: $("#f-mode").value,
    thorough: $("#f-thorough").checked,
    workers: numOrNull($("#f-workers").value) || 1,
    pdfa: $("#f-pdfa").checked,
    ftp: $("#f-ftp").checked,
  };
}

$("#btn-check").onclick = async () => {
  try {
    const c = await api(`/api/protocols/${selectedId}/check`, jsonPost(currentBody()));
    renderCheck(c);
  } catch (err) { renderCheckError(err.message); }
};

$("#btn-produce").onclick = async () => {
  const body = currentBody();
  try {
    const c = await api(`/api/protocols/${selectedId}/check`, jsonPost(body));
    let msg = `Es werden ${c.produzieren.length} Nummern produziert`;
    if (c.mode === "neu" && c.n_dup) msg += `\n(${c.n_dup} bereits vorhandene werden übersprungen)`;
    if (c.mode === "nachdruck" && c.n_dup) msg += `\n(davon ${c.n_dup} als Nachdruck)`;
    if (!c.produzieren.length) { renderCheck(c); return; }
    if (!confirm(msg + "\n\nJetzt produzieren?")) return;
    const res = await api(`/api/protocols/${selectedId}/produce`, jsonPost(body));
    await refreshDetail();
    pollRun(res.run_id);
  } catch (err) { renderCheckError(err.message); }
};

function renderCheck(c) {
  const el = $("#check-result");
  el.classList.remove("hidden");
  const dupHtml = c.n_dup
    ? `<div class="warn">⚠ ${c.n_dup} bereits produziert: ${c.bereits_produziert.slice(0, 12).map(r => `<span class="pill">${r}</span>`).join(" ")}${c.n_dup > 12 ? " …" : ""}</div>`
    : `<div class="ok">✓ keine Doppelten</div>`;
  el.innerHTML = `Angefragt: <b>${c.n_want}</b> · neu: <b>${c.n_neu}</b> · doppelt: <b>${c.n_dup}</b>
    · Modus <b>${c.mode}</b> → produziert: <b>${c.produzieren.length}</b>
    ${dupHtml}${c.naechste_freie ? `<div class="muted">nächste freie Nummer: <b>${c.naechste_freie}</b></div>` : ""}`;
}
function renderCheckError(m) {
  const el = $("#check-result"); el.classList.remove("hidden");
  el.innerHTML = `<div class="warn">Fehler: ${escapeHtml(m)}</div>`;
}

// Excel-Import
$("#orders-file").addEventListener("change", async () => {
  const f = $("#orders-file").files[0];
  if (!f) return;
  const fd = new FormData(); fd.append("orders", f);
  try {
    const res = await api(`/api/protocols/${selectedId}/orders/preview`, { method: "POST", body: fd });
    renderOrders(res.orders);
  } catch (err) { $("#orders-preview").innerHTML = `<div class="warn">Fehler: ${escapeHtml(err.message)}</div>`; }
});

function renderOrders(orders) {
  const box = $("#orders-preview");
  if (!orders.length) { box.innerHTML = '<div class="muted">keine Aufträge gefunden</div>'; return; }
  let html = `<table class="orders-table"><tr><th>Country</th><th>Team</th><th>Bereich</th>
    <th>neu</th><th>doppelt</th><th>Modus</th><th>produziert</th><th></th></tr>`;
  orders.forEach((o, i) => {
    const c = o.check, ord = o.order;
    const range = ord.bis ? `${ord.von}–${ord.bis}` : `ab ${ord.von} ×${ord.anzahl}`;
    html += `<tr><td>${ord.country}</td><td>${ord.team || ""}</td><td>${range}</td>
      <td>${c.n_neu}</td><td>${c.n_dup}</td><td>${ord.modus}</td><td>${c.produzieren.length}</td>
      <td><button class="ghost" data-order="${i}">Produzieren</button></td></tr>`;
  });
  html += `</table>`;
  box.innerHTML = html;
  $$("#orders-preview button[data-order]").forEach(btn => btn.onclick = async () => {
    const o = orders[+btn.dataset.order].order;
    const body = { country: o.country, team: o.team, von: o.von, bis: o.bis,
                   anzahl: o.anzahl, auslassen: o.auslassen, modus: o.modus };
    btn.disabled = true; btn.textContent = "…";
    try { const res = await api(`/api/protocols/${selectedId}/produce`, jsonPost(body));
      await refreshDetail(); pollRun(res.run_id); btn.textContent = `Lauf #${res.run_id}`; }
    catch (err) { btn.disabled = false; btn.textContent = "Fehler"; alert(err.message); }
  });
}

// KI-Check
$("#btn-insight").onclick = async () => {
  const el = $("#insight");
  el.classList.remove("hidden"); el.textContent = "…";
  try { const r = await api(`/api/protocols/${selectedId}/insight`); el.textContent = r.text; }
  catch (err) { el.textContent = "Fehler: " + err.message; }
};

// PDF/A & FTP je Lauf (Event-Delegation)
$("#runs").addEventListener("click", async (e) => {
  const a = e.target.closest("a"); if (!a) return;
  if (a.dataset.del) {
    e.preventDefault();
    if (!confirm(`Lauf #${a.dataset.del} endgültig löschen? Die Ledger-Einträge dieses Laufs werden entfernt.`)) return;
    try { await api(`/api/runs/${a.dataset.del}`, { method: "DELETE" }); await refreshDetail(); }
    catch (err) { alert(err.message); }
  } else if (a.dataset.pdfa) {
    e.preventDefault(); a.textContent = "PDF/A…";
    try { await api(`/api/runs/${a.dataset.pdfa}/pdfa`, { method: "POST" }); await refreshDetail(); }
    catch (err) { a.textContent = "Fehler"; alert(err.message); }
  } else if (a.dataset.ftp) {
    e.preventDefault(); a.textContent = "FTP…";
    try { await api(`/api/runs/${a.dataset.ftp}/ftp`, { method: "POST" }); await refreshDetail(); }
    catch (err) { a.textContent = "Fehler"; alert(err.message); }
  }
});

// ----------------------------------------------------------------- Modals
const modal = $("#modal"), modalBody = $("#modal-body");
function openModal(html) { modalBody.innerHTML = html; modal.classList.remove("hidden"); }
$("#modal-close").onclick = () => modal.classList.add("hidden");
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });

$("#nav-audit").onclick = async () => {
  const rows = await api("/api/audit");
  let h = `<h2>Audit-Log</h2><table class="orders-table"><tr><th>Zeit</th><th>Benutzer</th><th>Aktion</th><th>Detail</th></tr>`;
  for (const r of rows) h += `<tr><td>${(r.ts || "").slice(0, 19)}</td><td>${escapeHtml(r.username || "")}</td><td>${escapeHtml(r.action)}</td><td>${escapeHtml(r.detail || "")}</td></tr>`;
  openModal(h + "</table>");
};

$("#nav-pw") && ($("#nav-pw").onclick = () => {
  openModal(`<h2>Passwort ändern</h2>
    <label>Neues Passwort<input type="password" id="pw-new"></label>
    <button id="pw-save">Speichern</button> <span id="pw-msg" class="muted"></span>`);
  $("#pw-save").onclick = async () => {
    try { await api("/api/users/password", jsonPost({ password: $("#pw-new").value })); $("#pw-msg").textContent = "gespeichert ✓"; }
    catch (err) { $("#pw-msg").textContent = err.message; }
  };
});

const navSettings = $("#nav-settings");
if (navSettings) navSettings.onclick = async () => {
  const s = await api("/api/settings");
  const users = await api("/api/users");
  openModal(`<h2>Einstellungen</h2>
    <h3>FTP-Upload</h3>
    <div class="row"><label>Host<input id="s-host" value="${s.ftp_host || ""}"></label>
      <label>Port<input id="s-port" value="${s.ftp_port || "21"}"></label>
      <label class="chk"><input type="checkbox" id="s-tls" ${s.ftp_tls === "1" ? "checked" : ""}> TLS</label></div>
    <div class="row"><label>Benutzer<input id="s-user" value="${s.ftp_user || ""}"></label>
      <label>Passwort<input type="password" id="s-pass" value="${s.ftp_pass || ""}"></label>
      <label>Verzeichnis<input id="s-dir" value="${s.ftp_dir || ""}"></label></div>
    <div class="row actions"><button id="s-save">Speichern</button>
      <button id="s-test" class="ghost">Verbindung testen</button><span id="s-msg" class="muted"></span></div>
    <h3>Benutzer</h3>
    <ul class="runs">${users.map(u => `<li>${escapeHtml(u.username)} <span class="muted">(${u.role})</span></li>`).join("")}</ul>
    <div class="row"><label>Neuer Benutzer<input id="u-name"></label>
      <label>Passwort<input type="password" id="u-pass"></label>
      <label>Rolle<select id="u-role"><option value="operator">operator</option><option value="admin">admin</option></select></label></div>
    <div class="row actions"><button id="u-add" class="ghost">Benutzer anlegen</button><span id="u-msg" class="muted"></span></div>`);
  $("#s-save").onclick = async () => {
    try {
      await api("/api/settings", jsonPost({
        ftp_host: $("#s-host").value, ftp_port: $("#s-port").value, ftp_user: $("#s-user").value,
        ftp_pass: $("#s-pass").value, ftp_dir: $("#s-dir").value, ftp_tls: $("#s-tls").checked ? "1" : "0",
      }));
      $("#s-msg").textContent = "gespeichert ✓";
    } catch (err) { $("#s-msg").textContent = err.message; }
  };
  $("#s-test").onclick = async () => {
    $("#s-msg").textContent = "teste…";
    try { const r = await api("/api/settings/ftp-test", { method: "POST" }); $("#s-msg").textContent = r.ok ? `OK (${r.pwd})` : r.error; }
    catch (err) { $("#s-msg").textContent = err.message; }
  };
  $("#u-add").onclick = async () => {
    try { await api("/api/users", jsonPost({ username: $("#u-name").value, password: $("#u-pass").value, role: $("#u-role").value })); $("#u-msg").textContent = "angelegt ✓"; }
    catch (err) { $("#u-msg").textContent = err.message; }
  };
};

// ------------------------------------------------------------------- Helper
function jsonPost(body) { return { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }; }
function numOrNull(v) { v = (v || "").toString().trim(); return v === "" ? null : Number(v); }
function escapeHtml(s) { return (s ?? "").toString().replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])); }
$("#f-country").addEventListener("change", refreshDetail);

// Start
loadProtocols();
setInterval(loadProtocols, 5000);
// Lauf-Liste regelmäßig aktualisieren, damit PDF/A-/FTP-Ergebnisse (die nach
// dem grünen Lauf im Hintergrund entstehen) ohne Neuauswahl erscheinen.
setInterval(() => { if (selectedId && modal.classList.contains("hidden")) refreshDetailRunsOnly(); }, 5000);
