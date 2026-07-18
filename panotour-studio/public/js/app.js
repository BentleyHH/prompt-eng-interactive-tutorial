import { PanoViewer, INFO_ICONS } from './viewer.js';

// --------------------------------------------------------------- API-Layer ---
const api = {
  async get(url) { return this._json(await fetch(url)); },
  async send(url, method, body) {
    return this._json(await fetch(url, {
      method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }));
  },
  async form(url, formData) { return this._json(await fetch(url, { method: 'POST', body: formData })); },
  async del(url) { return this._json(await fetch(url, { method: 'DELETE' })); },
  async _json(r) { if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || r.statusText); return r.json(); },
};

// ------------------------------------------------------------------ State ---
const state = { tours: [], tour: null, scene: null, mode: 'explore' };
let viewer = null;
let draggingSceneId = null;
const $ = (s) => document.querySelector(s);
const icon = (id, cls = 'ico') => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
const infoIcon = (k) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" ` +
  `stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${INFO_ICONS[k] || INFO_ICONS.info}</svg>`;

const toast = (msg, err = false) => {
  const t = $('#toast'); t.className = 'toast' + (err ? ' err' : '');
  t.innerHTML = `${icon(err ? 'x' : 'check')}<span></span>`;
  t.querySelector('span').textContent = msg;
  t.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(() => (t.hidden = true), 2600);
};
const saveHint = (txt) => { $('#save-hint').textContent = txt; if (txt) setTimeout(() => ($('#save-hint').textContent = ''), 1500); };
const deg = (rad) => Math.round((rad * 180) / Math.PI);

// ------------------------------------------------------------- Tour-Liste ---
async function loadTours() {
  state.tours = await api.get('/api/tours');
  const ul = $('#tour-list'); ul.innerHTML = '';
  if (!state.tours.length) ul.innerHTML = '<li class="empty-note">Noch keine Rundgänge.</li>';
  for (const t of state.tours) {
    const li = document.createElement('li');
    li.className = state.tour?.id === t.id ? 'active' : '';
    li.innerHTML = `<span class="title">${escapeHtml(t.name)}</span>
      <span class="meta"><span class="m">${icon('photo', 'ico sm')}${t.scene_count}</span></span>
      <button class="row-edit" title="Umbenennen">${icon('edit', 'ico sm')}</button>
      <button class="row-del" title="Löschen">${icon('trash', 'ico sm')}</button>`;
    li.querySelector('.title').onclick = () => openTour(t.id);
    li.querySelector('.meta').onclick = () => openTour(t.id);
    const startRename = (e) => { e.stopPropagation(); renameTour(t, li); };
    li.querySelector('.row-edit').onclick = startRename;
    li.querySelector('.title').ondblclick = startRename;
    li.querySelector('.row-del').onclick = async (e) => {
      e.stopPropagation();
      if (!confirm(`Rundgang „${t.name}" löschen?`)) return;
      await api.del(`/api/tours/${t.id}`);
      if (state.tour?.id === t.id) { state.tour = null; state.scene = null; showEmpty(); $('#btn-export').disabled = true; $('#btn-save-project').disabled = true; $('#scenes-panel').hidden = true; }
      loadTours();
    };
    ul.appendChild(li);
  }
}

async function openTour(id) {
  state.tour = await api.get(`/api/tours/${id}`);
  attachLogoUrls();
  await loadTours();
  renderScenes();
  $('#scenes-panel').hidden = false;
  $('#btn-export').disabled = false;
  $('#btn-save-project').disabled = false;
  if (state.tour.scenes.length) selectScene(state.tour.scenes[0].id);
  else { state.scene = null; showEmpty(); renderInspector(); }
}

function attachLogoUrls() {
  for (const sc of state.tour.scenes) sc._logo_url = state.tour.logo_path || null;
}

// Projekt (Rundgang) direkt in der Liste umbenennen
function renameTour(t, li) {
  const titleEl = li.querySelector('.title');
  const input = document.createElement('input');
  input.type = 'text'; input.className = 'inline-edit'; input.value = t.name;
  titleEl.replaceWith(input);
  input.focus(); input.select();
  let done = false;
  const finish = async (save) => {
    if (done) return; done = true;
    const name = input.value.trim();
    if (save && name && name !== t.name) {
      await api.send(`/api/tours/${t.id}`, 'PUT', { name });
      if (state.tour?.id === t.id) state.tour.name = name;
      saveHint('Umbenannt');
    }
    await loadTours();
  };
  input.onclick = (ev) => ev.stopPropagation();
  input.onkeydown = (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); finish(true); }
    else if (ev.key === 'Escape') { ev.preventDefault(); finish(false); }
  };
  input.onblur = () => finish(true);
}

// Szene direkt in der Liste umbenennen
function renameScene(sc, li) {
  const titleEl = li.querySelector('.title');
  const input = document.createElement('input');
  input.type = 'text'; input.className = 'inline-edit'; input.value = sc.name;
  titleEl.replaceWith(input);
  input.focus(); input.select();
  let done = false;
  const finish = async (save) => {
    if (done) return; done = true;
    const name = input.value.trim();
    if (save && name && name !== sc.name) {
      sc.name = name;
      await api.send(`/api/scenes/${sc.id}`, 'PUT', { name });
      saveHint('Umbenannt');
    }
    renderScenes(); if (state.scene?.id === sc.id) renderInspector();
  };
  input.onclick = (ev) => ev.stopPropagation();
  input.onkeydown = (ev) => {
    if (ev.key === 'Enter') { ev.preventDefault(); finish(true); }
    else if (ev.key === 'Escape') { ev.preventDefault(); finish(false); }
  };
  input.onblur = () => finish(true);
}

// ------------------------------------------------------------ Szenen-Liste --
function renderScenes() {
  const ul = $('#scene-list'); ul.innerHTML = '';
  state.tour.scenes.forEach((sc, i) => {
    const li = document.createElement('li');
    li.className = state.scene?.id === sc.id ? 'active' : '';
    li.draggable = true; li.dataset.id = sc.id;
    li.title = `${sc.name} — auf das Bild ziehen, um von der aktuellen Szene hierher zu verknüpfen`;
    li.innerHTML = `<img class="scene-thumb" src="${sc.image_path}" alt="">
      <span class="title">${escapeHtml(sc.name)}</span>
      <span class="meta"><span class="m">${icon('pin', 'ico sm')}${sc.hotspots?.length || 0}</span>
        <span class="m">${icon('film', 'ico sm')}${sc.keyframes?.length || 0}</span></span>
      <button class="row-edit" title="Umbenennen">${icon('edit', 'ico sm')}</button>
      <button class="row-del" title="Löschen">${icon('trash', 'ico sm')}</button>`;
    li.onclick = () => selectScene(sc.id);
    const startRename = (e) => { e.stopPropagation(); renameScene(sc, li); };
    li.querySelector('.row-edit').onclick = startRename;
    li.querySelector('.title').ondblclick = startRename;
    li.querySelector('.row-del').onclick = async (e) => {
      e.stopPropagation();
      if (!confirm(`Szene „${sc.name}" löschen?`)) return;
      await api.del(`/api/scenes/${sc.id}`);
      reloadTour(sc.id === state.scene?.id);
    };
    // Drag & Drop: Reihenfolge (auf Liste) ODER Verknüpfen (aufs Bild)
    li.ondragstart = (e) => { draggingSceneId = sc.id; e.dataTransfer.setData('id', sc.id); e.dataTransfer.effectAllowed = 'copyMove'; li.classList.add('drag-over'); };
    li.ondragend = () => { draggingSceneId = null; li.classList.remove('drag-over'); };
    li.ondragover = (e) => { e.preventDefault(); };
    li.ondrop = async (e) => {
      e.preventDefault();
      const from = Number(e.dataTransfer.getData('id'));
      if (from === sc.id) return;
      await reorderScenes(from, i);
    };
    ul.appendChild(li);
  });
}

async function reorderScenes(dragId, toIndex) {
  const arr = state.tour.scenes.slice();
  const fromIdx = arr.findIndex((s) => s.id === dragId);
  const [moved] = arr.splice(fromIdx, 1);
  arr.splice(toIndex, 0, moved);
  await Promise.all(arr.map((s, i) => api.send(`/api/scenes/${s.id}`, 'PUT', { position: i })));
  const keep = state.scene?.id;
  await reloadTour(false);
  if (keep) selectScene(keep, false);
  saveHint('Reihenfolge gespeichert');
}

async function reloadTour(resetScene) {
  const tid = state.tour.id, sid = state.scene?.id;
  state.tour = await api.get(`/api/tours/${tid}`);
  attachLogoUrls();
  renderScenes(); loadTours();
  if (resetScene || !sid) { if (state.tour.scenes[0]) selectScene(state.tour.scenes[0].id); else { state.scene = null; showEmpty(); renderInspector(); } }
  else { state.scene = state.tour.scenes.find((s) => s.id === sid) || null; renderInspector(); if (viewer && state.scene) viewer.renderMarkers(state.scene); }
}

// ---------------------------------------------------------------- Viewer ----
function ensureViewer() {
  if (viewer) return;
  $('#viewer-empty').hidden = true;
  viewer = new PanoViewer($('#viewer'));
  window.panoViewer = viewer; // Debug-/Automations-Hook
  viewer.onClick((pos) => handleViewerClick(pos));
  viewer.onHotspot((data) => { if (state.mode === 'explore' && data.target_scene_id) navigateTravel(data); });
  viewer.onMarkerSelect((data) => {
    if (state.mode === 'hotspot') { openHotspotEdit(data); return true; }
    return false;
  });
}

// Navigation mit Bewegungs-Übergang (Kamera „fährt" zum nächsten Punkt)
async function navigateTravel(hotspotData) {
  const target = state.tour.scenes.find((s) => s.id === hotspotData.target_scene_id);
  if (!target) return;
  state.scene = target;
  renderScenes();
  await viewer.travelTo(target, { towardYaw: hotspotData.yaw });
  renderInspector();
}
function showEmpty() {
  $('#viewer-toolbar').hidden = true;
  if (viewer) { viewer.destroy(); viewer = null; }
  $('#viewer-empty').hidden = false;
}

async function selectScene(id, reload = true) {
  state.scene = state.tour.scenes.find((s) => s.id === id);
  if (!state.scene) return;
  ensureViewer();
  $('#viewer-toolbar').hidden = false;
  renderScenes();
  await viewer.loadScene(state.scene);
  renderInspector();
}

function handleViewerClick(pos) {
  if (state.mode === 'hotspot') {
    pendingHotspot = pos;
    if (!hsDraft) hsDraft = { id: null, kind: 'nav', target_scene_id: '', label: '', title: '', text: '', icon: 'info', display: 'panel' };
    renderInspector();
  }
  else if (state.mode === 'logo' && state.scene) {
    state.scene.logo_yaw = pos.yaw; state.scene.logo_pitch = pos.pitch;
    viewer.renderLogo(state.scene); saveScene(); renderInspector();
  }
}

// -------------------------------------------------------------- Inspektor ---
let pendingHotspot = null;
let hsDraft = null;

function setMode(mode) {
  state.mode = mode; pendingHotspot = null; hsDraft = null;
  viewer?.hideInfoPanel?.();
  document.querySelectorAll('.mode-btn').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
  if (viewer) { if (mode === 'path' && state.scene) viewer.showPathPreview(state.scene.keyframes || []); else viewer.clearPathPreview(); }
  renderInspector();
}

function renderInspector() {
  const box = $('#inspector');
  if (!state.scene) { box.innerHTML = '<p class="hint pad">Wähle oder lade eine Szene.</p>'; return; }
  const sc = state.scene;
  if (state.mode === 'explore') box.innerHTML = inspExplore(sc);
  else if (state.mode === 'hotspot') box.innerHTML = inspHotspot(sc);
  else if (state.mode === 'logo') box.innerHTML = inspLogo(sc);
  else if (state.mode === 'path') box.innerHTML = inspPath(sc);
  wireInspector();
}

const inspExplore = (sc) => `
  <h3>${escapeHtml(sc.name)}</h3>
  <p class="sub">Szene bearbeiten</p>
  <div class="field">
    <label>Szenenname</label>
    <input type="text" id="scene-name" value="${escapeAttr(sc.name)}" />
  </div>
  <div class="field">
    <label class="switch"><input type="checkbox" id="tour-autorotate" ${state.tour.autorotate ? 'checked' : ''}/> Auto-Rotation im Rundgang</label>
  </div>
  <p class="hint">Ziehe die Ansicht, wähle dann unten ein Werkzeug: Hotspots verbinden Szenen, der Logo-Patch überdeckt das Stativ, die Kamerafahrt animiert den Blick.</p>
  <div style="margin-top:14px">
    <span class="badge">${icon('pin', 'ico sm')} ${sc.hotspots.length} Hotspots</span>
    <span class="badge">${icon('film', 'ico sm')} ${sc.keyframes.length} Kamerapunkte</span>
  </div>`;

function inspHotspot(sc) {
  const others = state.tour.scenes.filter((s) => s.id !== sc.id);
  let form = `<p class="hint">💡 Zieh eine Szene aus der Liste <b>aufs Bild</b>, um sie zu verknüpfen — oder klicke ins Panorama, um einen Punkt zu setzen. Bestehende Punkte anklicken zum Bearbeiten.</p>`;
  if (pendingHotspot && hsDraft) {
    const d = hsDraft, editing = !!d.id;
    const navFields = `
      <div class="field"><label>Ziel-Szene</label>
        <select id="hs-target"><option value="">— nur Markierung —</option>
          ${others.map((s) => `<option value="${s.id}" ${String(d.target_scene_id) === String(s.id) ? 'selected' : ''}>${escapeHtml(s.name)}</option>`).join('')}
        </select></div>
      <div class="field"><label>Beschriftung</label><input type="text" id="hs-label" value="${escapeAttr(d.label)}" placeholder="z. B. Zum Wohnzimmer"/></div>`;
    const infoFields = `
      <div class="field"><label>Icon</label>
        <div class="icon-picker" id="hs-icons">${Object.keys(INFO_ICONS).map((k) => `<button type="button" data-icon="${k}" class="${d.icon === k ? 'on' : ''}">${infoIcon(k)}</button>`).join('')}</div></div>
      <div class="field"><label>Titel</label><input type="text" id="hs-title" value="${escapeAttr(d.title)}" placeholder="z. B. Kamin"/></div>
      <div class="field"><label>Text</label><textarea id="hs-text" rows="3" placeholder="Beschreibung…">${escapeHtml(d.text)}</textarea></div>
      <div class="field"><label>Anzeige</label>
        <div class="seg" id="hs-display">
          <button type="button" data-display="panel" class="${d.display === 'panel' ? 'on' : ''}">Panel (Klick)</button>
          <button type="button" data-display="hover" class="${d.display === 'hover' ? 'on' : ''}">Tooltip (Hover)</button>
        </div></div>`;
    form = `
      <div class="field"><label>Typ</label>
        <div class="seg" id="hs-kind">
          <button type="button" data-kind="nav" class="${d.kind === 'nav' ? 'on' : ''}">Sprung</button>
          <button type="button" data-kind="info" class="${d.kind === 'info' ? 'on' : ''}">Info-Punkt</button>
        </div></div>
      ${d.kind === 'info' ? infoFields : navFields}
      <div class="btn-row">
        <button class="btn btn-block" id="hs-save">${icon('check')} ${editing ? 'Speichern' : 'Punkt hinzufügen'}</button>
        ${editing ? `<button class="icon-btn btn-ghost" id="hs-delete" title="Punkt löschen" style="border-radius:980px;width:40px"><svg class="ico"><use href="#i-trash"/></svg></button>` : ''}
      </div>
      <p class="hint">${editing ? 'Ins Bild klicken verschiebt den Punkt. ' : ''}Yaw ${deg(pendingHotspot.yaw)}° · Pitch ${deg(pendingHotspot.pitch)}°</p>`;
  }
  const rowLabel = (h) => h.kind === 'info'
    ? escapeHtml(h.title || 'Info')
    : escapeHtml(h.label || 'ohne Ziel') + (h.target_scene_id ? ' → ' + escapeHtml(sceneName(h.target_scene_id)) : '');
  return `<h3>Hotspots &amp; Info</h3><p class="sub">Szenen verbinden oder Text einblenden</p>${form}
    <ul class="kf-list">${(sc.hotspots || []).map((h) => `
      <li data-edit-hs="${h.id}" style="cursor:pointer"><span class="idx">${h.kind === 'info' ? infoIcon(h.icon) : icon('arrow', 'ico sm')}</span>
        <span class="kf-meta">${rowLabel(h)}</span>
        <button class="row-del" data-del-hs="${h.id}">${icon('trash', 'ico sm')}</button></li>`).join('')}</ul>`;
}

function inspLogo(sc) {
  if (!state.tour.logo_path) return `<h3>Logo-Patch</h3>
    <p class="sub">Stativ oder Fotograf überdecken</p>
    <p class="hint">Lade ein Logo (transparentes PNG ideal) hoch. Es wird flach am Boden platziert und überdeckt Stativ oder Fotograf.</p>
    <label class="btn btn-block" for="logo-upload">${icon('plus')} Logo hochladen</label>
    <input id="logo-upload" type="file" accept="image/*" hidden>`;
  return `<h3>Logo-Patch</h3><p class="sub">Stativ oder Fotograf überdecken</p>
    <img src="${state.tour.logo_path}" alt="Logo" class="logo-preview">
    <div class="field" style="margin-top:14px">
      <label class="switch"><input type="checkbox" id="logo-on" ${sc.logo_enabled ? 'checked' : ''}/> Patch in dieser Szene anzeigen</label>
    </div>
    <div class="field"><label>Größe</label>
      <div class="range-row"><input type="range" id="logo-scale" min="6" max="60" step="1" value="${sc.logo_scale}"><output>${sc.logo_scale}°</output></div>
    </div>
    <p class="hint">Nach unten schauen und <b>ins Bild klicken</b>, um das Logo exakt über dem Stativ zu platzieren.</p>
    <label class="btn btn-ghost btn-block" for="logo-upload">Logo ersetzen</label>
    <input id="logo-upload" type="file" accept="image/*" hidden>`;
}

function inspPath(sc) {
  const kf = sc.keyframes || [];
  return `<h3>Kamerafahrt</h3><p class="sub">Dynamischer Blick über gesetzte Punkte</p>
    <button class="btn btn-block" id="kf-add">${icon('plus')} Aktuellen Blick als Punkt</button>
    <ul class="kf-list">${kf.map((k, i) => `
      <li><span class="idx">${i + 1}</span>
        <span class="kf-meta">Yaw ${deg(k.yaw)}° · Pitch ${deg(k.pitch)}°</span>
        <input type="number" data-dur="${i}" value="${k.duration}" min="500" step="250" title="Dauer in ms">
        <button class="row-del" data-del-kf="${i}">${icon('trash', 'ico sm')}</button></li>`).join('') || '<li style="background:none"><span class="idx ghost">–</span><span class="kf-meta">Noch keine Punkte.</span></li>'}</ul>
    <div class="btn-row">
      <button class="btn btn-block" id="kf-play" ${kf.length < 2 ? 'disabled' : ''}>${icon('play')} Abspielen</button>
      <button class="icon-btn btn-ghost" id="kf-stop" title="Stopp" style="border-radius:980px;width:40px"><svg class="ico"><use href="#i-stop"/></svg></button>
    </div>`;
}

// --------------------------------------------------------- Inspektor-Draht --
function wireInspector() {
  const sc = state.scene;
  // Explore
  $('#scene-name')?.addEventListener('change', (e) => { sc.name = e.target.value; saveScene(); renderScenes(); });
  $('#tour-autorotate')?.addEventListener('change', async (e) => {
    await api.send(`/api/tours/${state.tour.id}`, 'PUT', { autorotate: e.target.checked });
    state.tour.autorotate = e.target.checked ? 1 : 0;
  });
  // Hotspot / Info-Punkt
  const syncHsDraft = () => {
    if (!hsDraft) return;
    if ($('#hs-target')) hsDraft.target_scene_id = $('#hs-target').value;
    if ($('#hs-label')) hsDraft.label = $('#hs-label').value;
    if ($('#hs-title')) hsDraft.title = $('#hs-title').value;
    if ($('#hs-text')) hsDraft.text = $('#hs-text').value;
  };
  box().querySelectorAll('#hs-kind button').forEach((b) => b.onclick = () => { syncHsDraft(); hsDraft.kind = b.dataset.kind; renderInspector(); });
  box().querySelectorAll('#hs-icons button').forEach((b) => b.onclick = () => { syncHsDraft(); hsDraft.icon = b.dataset.icon; renderInspector(); });
  box().querySelectorAll('#hs-display button').forEach((b) => b.onclick = () => { syncHsDraft(); hsDraft.display = b.dataset.display; renderInspector(); });
  $('#hs-save')?.addEventListener('click', async () => {
    syncHsDraft();
    const d = hsDraft, payload = { yaw: pendingHotspot.yaw, pitch: pendingHotspot.pitch, kind: d.kind };
    if (d.kind === 'info') {
      if (!d.title.trim() && !d.text.trim()) return toast('Bitte Titel oder Text eingeben', true);
      Object.assign(payload, { title: d.title, text: d.text, icon: d.icon, display: d.display });
    } else {
      Object.assign(payload, { target_scene_id: Number(d.target_scene_id) || null, label: d.label });
    }
    if (d.id) await api.send(`/api/hotspots/${d.id}`, 'PUT', payload);
    else await api.send(`/api/scenes/${sc.id}/hotspots`, 'POST', payload);
    pendingHotspot = null; hsDraft = null; await refreshScene(); saveHint('Gespeichert ✓');
  });
  $('#hs-delete')?.addEventListener('click', async () => {
    if (!hsDraft?.id) return;
    await api.del(`/api/hotspots/${hsDraft.id}`);
    pendingHotspot = null; hsDraft = null; await refreshScene(); saveHint('Gelöscht');
  });
  box().querySelectorAll('[data-edit-hs]').forEach((li) => li.addEventListener('click', (e) => {
    if (e.target.closest('[data-del-hs]')) return;
    const h = (sc.hotspots || []).find((x) => String(x.id) === li.dataset.editHs);
    if (h) openHotspotEdit(h);
  }));
  box().querySelectorAll('[data-del-hs]').forEach((b) => b.onclick = async (e) => {
    e.stopPropagation();
    await api.del(`/api/hotspots/${b.dataset.delHs}`);
    if (hsDraft?.id && String(hsDraft.id) === b.dataset.delHs) { pendingHotspot = null; hsDraft = null; }
    await refreshScene(); saveHint('Gelöscht');
  });
  // Logo
  $('#logo-upload')?.addEventListener('change', async (e) => {
    const f = e.target.files[0]; if (!f) return;
    const fd = new FormData(); fd.append('logo', f);
    state.tour = await api.form(`/api/tours/${state.tour.id}/logo`, fd);
    attachLogoUrls(); sc._logo_url = state.tour.logo_path;
    viewer.renderLogo(sc); renderInspector(); saveHint('Logo gesetzt');
  });
  $('#logo-on')?.addEventListener('change', (e) => { sc.logo_enabled = e.target.checked ? 1 : 0; viewer.renderLogo(sc); saveScene(); });
  $('#logo-scale')?.addEventListener('input', (e) => {
    sc.logo_scale = Number(e.target.value); e.target.nextElementSibling.value = e.target.value;
    viewer.renderLogo(sc);
  });
  $('#logo-scale')?.addEventListener('change', () => saveScene());
  // Path
  $('#kf-add')?.addEventListener('click', async () => {
    const v = viewer.getView();
    sc.keyframes = [...(sc.keyframes || []), { yaw: v.yaw, pitch: v.pitch, zoom: v.zoom, duration: 2500 }];
    await saveKeyframes(); viewer.showPathPreview(sc.keyframes); renderInspector();
  });
  box().querySelectorAll('[data-del-kf]').forEach((b) => b.onclick = async () => {
    sc.keyframes.splice(Number(b.dataset.delKf), 1); await saveKeyframes(); viewer.showPathPreview(sc.keyframes); renderInspector();
  });
  box().querySelectorAll('[data-dur]').forEach((inp) => inp.onchange = async () => {
    sc.keyframes[Number(inp.dataset.dur)].duration = Number(inp.value); await saveKeyframes();
  });
  $('#kf-play')?.addEventListener('click', () => viewer.playPath(sc.keyframes));
  $('#kf-stop')?.addEventListener('click', () => viewer.stopPath());
}
const box = () => $('#inspector');

// ------------------------------------------------------------- Persistenz ---
let saveTimer;
function saveScene() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    const sc = state.scene;
    await api.send(`/api/scenes/${sc.id}`, 'PUT', {
      name: sc.name, default_yaw: sc.default_yaw, default_pitch: sc.default_pitch, default_zoom: sc.default_zoom,
      logo_yaw: sc.logo_yaw, logo_pitch: sc.logo_pitch, logo_scale: sc.logo_scale, logo_enabled: sc.logo_enabled,
    });
    saveHint('Gespeichert ✓');
  }, 250);
}
async function saveKeyframes() {
  await api.send(`/api/scenes/${state.scene.id}/keyframes`, 'PUT', { keyframes: state.scene.keyframes });
  renderScenes(); saveHint('Fahrt gespeichert');
}
async function refreshScene() {
  const sid = state.scene.id;
  state.tour = await api.get(`/api/tours/${state.tour.id}`); attachLogoUrls();
  state.scene = state.tour.scenes.find((s) => s.id === sid);
  renderScenes(); viewer.renderMarkers(state.scene); renderInspector();
}

// ------------------------------------------------------------------ Utils ---
const sceneName = (id) => state.tour.scenes.find((s) => s.id === id)?.name || '?';
function escapeHtml(s = '') { return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function escapeAttr(s = '') { return escapeHtml(s).replace(/'/g, '&#39;'); }

// ------------------------------------------------------- Upload & Dropzone --
const IMG_RE = /\.(jpe?g|png|webp|avif|gif|bmp|tiff?|heic|heif|svg)$/i;
async function uploadFiles(files) {
  const imgs = files.filter((f) => (f.type && f.type.startsWith('image/')) || IMG_RE.test(f.name));
  if (!imgs.length) return toast('Keine Bilddateien gefunden', true);
  // Kein Rundgang offen? Automatisch einen anlegen.
  if (!state.tour) {
    const t = await api.send('/api/tours', 'POST', { name: 'Neuer Rundgang' });
    await loadTours(); await openTour(t.id);
  }
  toast(`${imgs.length} Bild(er) werden hochgeladen…`);
  const wasEmpty = !state.tour.scenes.length;
  for (const f of imgs) {
    const fd = new FormData(); fd.append('image', f); fd.append('name', f.name);
    try { await api.form(`/api/tours/${state.tour.id}/scenes`, fd); }
    catch (err) { toast('Upload fehlgeschlagen: ' + err.message, true); }
  }
  await reloadTour(wasEmpty);
  toast(`${imgs.length} Bild(er) hinzugefügt`);
}

async function linkSceneAt(targetId, clientX, clientY) {
  if (!state.scene || !viewer) return;
  if (targetId === state.scene.id) return toast('Eine Szene kann nicht mit sich selbst verknüpft werden', true);
  const pos = viewer.coordsToPosition(clientX, clientY);
  if (!pos) return toast('Bitte innerhalb des Panoramas ablegen', true);
  const target = state.tour.scenes.find((s) => s.id === targetId);
  await api.send(`/api/scenes/${state.scene.id}/hotspots`, 'POST', {
    kind: 'nav', target_scene_id: targetId, label: target?.name || 'Weiter', yaw: pos.yaw, pitch: pos.pitch,
  });
  await refreshScene();
  toast(`Verknüpft mit „${target?.name || 'Szene'}"`);
}

function setupCanvasDropzone() {
  const zone = document.querySelector('.col-center');
  const hint = $('#drop-hint');
  const show = (txt) => { hint.textContent = txt; hint.hidden = false; zone.classList.add('dragging'); };
  const hide = () => { hint.hidden = true; zone.classList.remove('dragging'); };
  zone.addEventListener('dragenter', (e) => e.preventDefault());
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    const types = Array.from(e.dataTransfer.types || []);
    if (types.includes('Files')) { show('360°-Bilder hier ablegen zum Hochladen'); e.dataTransfer.dropEffect = 'copy'; }
    else if (draggingSceneId != null && state.scene) { show('Ablegen, um von hier aus zu verknüpfen'); e.dataTransfer.dropEffect = 'copy'; }
  });
  zone.addEventListener('dragleave', (e) => { if (!zone.contains(e.relatedTarget)) hide(); });
  zone.addEventListener('drop', async (e) => {
    e.preventDefault(); hide();
    if (e.dataTransfer.files && e.dataTransfer.files.length) return uploadFiles([...e.dataTransfer.files]);
    const sid = Number(e.dataTransfer.getData('id')) || draggingSceneId;
    draggingSceneId = null;
    if (sid) await linkSceneAt(sid, e.clientX, e.clientY);
  });
}

// ------------------------------------------------------------- Shortcuts ----
function stepScene(dir) {
  if (!state.tour?.scenes.length) return;
  const i = state.tour.scenes.findIndex((s) => s.id === state.scene?.id);
  const n = state.tour.scenes[(i + dir + state.tour.scenes.length) % state.tour.scenes.length];
  if (n) selectScene(n.id);
}
function setupShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable) return;
    if (!state.tour) return;
    const map = { e: 'explore', h: 'hotspot', l: 'logo', k: 'path' };
    const k = e.key.toLowerCase();
    if (map[k] && state.scene) { setMode(map[k]); }
    else if (e.key === ']' || e.key === 'PageDown') { e.preventDefault(); stepScene(1); }
    else if (e.key === '[' || e.key === 'PageUp') { e.preventDefault(); stepScene(-1); }
    else if (e.key === 'Escape') { pendingHotspot = null; hsDraft = null; viewer?.hideInfoPanel?.(); renderInspector(); }
  });
}

// --------------------------------------------------------- Hotspot-Editor ---
function openHotspotEdit(data) {
  pendingHotspot = { yaw: data.yaw, pitch: data.pitch };
  hsDraft = {
    id: data.id, kind: data.kind || 'nav', target_scene_id: data.target_scene_id || '',
    label: data.label || '', title: data.title || '', text: data.text || '',
    icon: data.icon || 'info', display: data.display || 'panel',
  };
  renderInspector();
}

// ------------------------------------------------------------- Startsetup ---
function bind() {
  $('#btn-new-tour').onclick = () => $('#tour-dialog').showModal();
  $('#tour-dialog').addEventListener('close', async function () {
    if (this.returnValue !== 'ok') return this.querySelector('form').reset();
    const fd = new FormData(this.querySelector('form'));
    const name = fd.get('name'); if (!name?.trim()) return;
    const t = await api.send('/api/tours', 'POST', { name, description: fd.get('description') });
    this.querySelector('form').reset(); await loadTours(); openTour(t.id); toast('Rundgang angelegt');
  });

  $('#scene-upload').addEventListener('change', (e) => { uploadFiles([...e.target.files]); e.target.value = ''; });
  $('#empty-upload')?.addEventListener('change', (e) => { uploadFiles([...e.target.files]); e.target.value = ''; });

  setupCanvasDropzone();
  setupShortcuts();

  document.querySelectorAll('.mode-btn').forEach((b) => b.onclick = () => setMode(b.dataset.mode));

  $('#btn-set-start').onclick = () => {
    if (!state.scene || !viewer) return;
    const v = viewer.getView();
    Object.assign(state.scene, { default_yaw: v.yaw, default_pitch: v.pitch, default_zoom: v.zoom });
    saveScene(); toast('Startblick gespeichert');
  };

  $('#btn-export').onclick = () => {
    if (!state.tour) return;
    if (!state.tour.scenes.length) return toast('Erst mindestens eine Szene hinzufügen', true);
    $('#export-dialog').showModal();
  };
  $('#export-dialog').addEventListener('close', async function () {
    if (this.returnValue !== 'ok' || !state.tour) return;
    const mode = this.querySelector('input[name=exmode]:checked')?.value || 'classic';
    const btn = $('#btn-export'), old = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = `${icon('share')} Exportiere…`;
    try {
      const res = await fetch(`/api/tours/${state.tour.id}/export?mode=${mode}`);
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (state.tour.name || 'rundgang').replace(/[^\w\-]+/g, '_').toLowerCase() + (mode === 'scroll' ? '-scroll' : '') + '.html';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast(mode === 'scroll' ? 'Scroll-Rundgang exportiert' : 'HTML-Datei exportiert');
    } catch (e) { toast('Export fehlgeschlagen: ' + e.message, true); }
    finally { btn.disabled = false; btn.innerHTML = old; }
  });

  $('#btn-save-project').onclick = async () => {
    if (!state.tour) return;
    const btn = $('#btn-save-project'), old = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = `${icon('save')} Sichere…`;
    try {
      const res = await fetch(`/api/tours/${state.tour.id}/project`);
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || res.statusText);
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (state.tour.name || 'rundgang').replace(/[^\w\-]+/g, '_').toLowerCase() + '.panotour.zip';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast('Projekt gesichert');
    } catch (e) { toast('Sichern fehlgeschlagen: ' + e.message, true); }
    finally { btn.disabled = false; btn.innerHTML = old; }
  };

  $('#btn-load-project').onclick = () => $('#project-import').click();
  $('#project-import').addEventListener('change', async (e) => {
    const files = [...e.target.files]; e.target.value = '';
    if (!files.length) return;
    toast(files.length > 1 ? `${files.length} Projekte werden geladen…` : 'Projekt wird geladen…');
    let lastId = null, ok = 0;
    for (const f of files) {
      try {
        const fd = new FormData(); fd.append('project', f);
        const tour = await api.form('/api/projects/import', fd);
        lastId = tour.id; ok++;
      } catch (err) { toast(`„${f.name}" fehlgeschlagen: ${err.message}`, true); }
    }
    await loadTours();
    if (lastId) await openTour(lastId);
    if (ok) toast(ok > 1 ? `${ok} Projekte geladen` : 'Projekt geladen');
  });

  $('#btn-present').onclick = () => {
    document.body.classList.toggle('present');
    const on = document.body.classList.contains('present');
    if (on) { document.documentElement.requestFullscreen?.(); viewer?.setAutorotate(!!state.tour?.autorotate); }
    else { document.exitFullscreen?.().catch(() => {}); viewer?.setAutorotate(false); }
  };
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) document.body.classList.remove('present');
  });
}

bind();
loadTours();
