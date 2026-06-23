"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const api = async (url, opts) => {
  const r = await fetch(url, opts);
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
    const src = p.team ? `${p.team} ${p.country || ""} ${p.src_ref || ""}` : "—";
    li.innerHTML = `<i class="dot ${COLOR[p.status] || "grau"}"></i>
      <div class="meta"><b>${escapeHtml(p.name)}</b>
      <small>${escapeHtml(src.trim())}${p.n_image != null ? ` · ${p.n_image} QR/Barcode-Objekte · ${p.n_vector} Vektor` : ""}</small></div>`;
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
  $("#d-analysis").innerHTML = p.team
    ? `Quelle: <b>${p.team} ${p.country} ${p.src_ref}</b> · Ref-Breite <b>${p.ref_width}</b>
       · <b>${p.n_image}</b> Bild-Symbole · <b>${p.n_vector}</b> Vektor-Symbole`
    : `<span class="muted">Analyse ${p.status === "laeuft" ? "läuft…" : "ausstehend"}</span>`;
  const err = $("#d-error");
  if (p.status === "fehler" && p.error) { err.textContent = p.error; err.classList.remove("hidden"); }
  else err.classList.add("hidden");

  // Vorbelegung
  if (!$("#f-team").value) $("#f-team").value = p.team || "";
  if (!$("#f-country").value && p.country) $("#f-country").value = p.country;
  $("#tpl-link").href = `/api/protocols/${p.id}/template.xlsx`;

  renderCoverage(p.coverage, country);
  renderRuns(p.runs);
}

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
    }
    const bar = r.status === "laeuft"
      ? `<div class="bar"><i style="width:${r.progress || 0}%"></i></div>` : "";
    li.innerHTML = `<i class="dot ${COLOR[r.status]}"></i> <b>#${r.id}</b> ${escapeHtml(r.spec || "")}
      ${bar}${r.status === "fehler" ? `<div class="error">${escapeHtml(r.error || "")}</div>` : dl}`;
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

// ------------------------------------------------------------------- Helper
function jsonPost(body) { return { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }; }
function numOrNull(v) { v = (v || "").toString().trim(); return v === "" ? null : Number(v); }
function escapeHtml(s) { return (s ?? "").toString().replace(/[&<>"]/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])); }
$("#f-country").addEventListener("change", refreshDetail);

// Start
loadProtocols();
setInterval(loadProtocols, 5000);
