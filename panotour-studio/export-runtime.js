/* Eigenständige Viewer-Laufzeit für den HTML-Export.
 * Liest die Rundgang-Daten aus window.__TOUR__ (Bilder als Data-URIs), die
 * Bibliotheken aus dem eingebetteten Bundle (window.PSV). Braucht kein Internet.
 * Unterstützt zwei Modi: 'classic' (Klick/Play) und 'scroll' (Scroll steuert
 * die Kamera). Info-Punkte (Icon + Text) mit Hover- oder Panel-Anzeige,
 * Bewegungs-Übergänge zwischen Szenen.                                       */
const { Viewer, MarkersPlugin, AutorotatePlugin } = window.PSV;
const TOUR = window.__TOUR__;
const MODE = TOUR.mode === 'scroll' ? 'scroll' : 'classic';

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const wrapPi = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const PIN = 'data:image/svg+xml;base64,' + btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38">' +
  '<defs><filter id="s" x="-60%" y="-60%" width="220%" height="220%">' +
  '<feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#000" flood-opacity=".3"/></filter></defs>' +
  '<path filter="url(#s)" d="M15 2C8.9 2 4 6.9 4 13c0 8 11 21 11 21s11-13 11-21C26 6.9 21.1 2 15 2z" fill="#0071e3"/>' +
  '<circle cx="15" cy="13" r="4.4" fill="#fff"/></svg>');

const INFO_ICONS = {
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11.5v5"/><circle cx="12" cy="7.6" r=".7" fill="currentColor" stroke="none"/>',
  star: '<path d="M12 3l2.6 5.6 6.1.9-4.4 4.3 1 6.1L12 17.1 6.7 20l1-6.1L3.3 9.5l6.1-.9z"/>',
  door: '<path d="M6 21V4a1 1 0 011-1h8a1 1 0 011 1v17M5 21h14M14 12h.6"/>',
  home: '<path d="M4 11l8-7 8 7M6 10v9h12v-9"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.4"/><path d="M4 17l5-5 4 4 3-2 4 4"/>',
  cart: '<circle cx="9" cy="20" r="1.3"/><circle cx="18" cy="20" r="1.3"/><path d="M2.5 3H5l2.4 11.5h10L20 7H6"/>',
  pin: '<path d="M12 21s-6.5-5.7-6.5-10.5a6.5 6.5 0 1113 0C18.5 15.3 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.2"/>',
  warn: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 16.8h.01"/>',
};
const infoBadge = (k) => {
  const p = INFO_ICONS[k] || INFO_ICONS.info;
  return '<div class="pano-info-badge" style="width:30px;height:30px;border-radius:50%;background:#fff;' +
    'border:2px solid #0071e3;color:#0071e3;display:grid;place-items:center;box-shadow:0 1px 5px rgba(0,0,0,.28);cursor:pointer">' +
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" stroke-linejoin="round">' + p + '</svg></div>';
};

function patchQuad(yawC, pitchC, halfDeg) {
  const h = Math.min((halfDeg * Math.PI) / 180, 1.2), t = Math.tan(h);
  const cp = Math.cos(pitchC), sp = Math.sin(pitchC), cy = Math.cos(yawC), sy = Math.sin(yawC);
  const C = { x: cp * sy, y: sp, z: cp * cy };
  const east = { x: cy, y: 0, z: -sy }, north = { x: -sp * sy, y: cp, z: -sp * cy };
  const toYP = (v) => { const n = Math.hypot(v.x, v.y, v.z);
    return { yaw: Math.atan2(v.x / n, v.z / n), pitch: Math.asin(clamp(v.y / n, -1, 1)) }; };
  const corner = (a, b) => toYP({
    x: C.x + a * t * east.x + b * t * north.x, y: C.y + a * t * east.y + b * t * north.y,
    z: C.z + a * t * east.z + b * t * north.z });
  return [corner(-1, -1), corner(-1, 1), corner(1, 1), corner(1, -1)];
}

// ------------------------------------------------------------------ Viewer ---
const viewer = new Viewer({
  container: document.getElementById('viewer'),
  panorama: TOUR.scenes[0].image,
  navbar: MODE === 'scroll' ? false : ['zoom', 'fullscreen'],
  defaultZoomLvl: TOUR.scenes[0].default_zoom ?? 45,
  mousemove: MODE !== 'scroll',   // im Scroll-Modus steuert nur der Scroll
  mousewheel: false,
  plugins: [MarkersPlugin, [AutorotatePlugin, { autostartDelay: null, autostartOnIdle: false, autorotateSpeed: '0.8rpm' }]],
});
const markers = viewer.getPlugin(MarkersPlugin);
const autorotate = viewer.getPlugin(AutorotatePlugin);
let current = 0, playing = false, autoOn = false, transitioning = false;

markers.addEventListener('select-marker', ({ marker }) => {
  const d = marker?.data;
  if (!d) return;
  if (d.type === 'nav' && typeof d.target === 'number') { stopTour(); goTo(d.target, { travel: true, towardYaw: d.yaw }); }
  else if (d.type === 'info' && d.display === 'panel') showPanel(d);
});

function renderMarkers(sc) {
  markers.clearMarkers();
  (sc.hotspots || []).forEach((h, k) => {
    try {
      if (h.kind === 'info') {
        const short = h.display === 'hover'
          ? (h.title ? '<b>' + esc(h.title) + '</b>' : '') + (h.text ? '<br>' + esc(h.text) : '')
          : (h.title || 'Info');
        markers.addMarker({ id: 'hs-' + k, position: { yaw: h.yaw, pitch: h.pitch },
          html: infoBadge(h.icon), anchor: 'center center', tooltip: short || 'Info',
          data: { type: 'info', ...h } });
      } else {
        markers.addMarker({ id: 'hs-' + k, position: { yaw: h.yaw, pitch: h.pitch }, image: PIN,
          size: { width: 30, height: 38 }, anchor: 'bottom center',
          tooltip: h.label || (typeof h.target === 'number' ? TOUR.scenes[h.target].name : ''),
          data: { type: 'nav', target: h.target, yaw: h.yaw } });
      }
    } catch (e) { /* ignore */ }
  });
  if (sc.logo_enabled && TOUR.logo) {
    try { markers.addMarker({ id: 'logo', imageLayer: TOUR.logo,
      position: patchQuad(sc.logo_yaw || 0, sc.logo_pitch ?? -Math.PI / 2, sc.logo_scale || 22) }); } catch (e) { /* */ }
  }
}

// ------------------------------------------------------------- Info-Panel ---
function showPanel(d) {
  let el = document.getElementById('info-panel');
  if (!el) {
    el = document.createElement('div'); el.id = 'info-panel'; el.className = 'info-panel';
    el.innerHTML = '<button class="info-close" aria-label="Schließen">×</button><h4></h4><p></p>';
    document.body.appendChild(el);
    el.querySelector('.info-close').onclick = () => { el.style.display = 'none'; };
  }
  el.querySelector('h4').textContent = d.title || 'Info';
  el.querySelector('p').textContent = d.text || '';
  el.style.display = 'block';
}
const hidePanel = () => { const el = document.getElementById('info-panel'); if (el) el.style.display = 'none'; };

// ---------------------------------------------------------- Kamera-Tweens ---
function tween(from, to, duration) {
  return new Promise((resolve) => {
    const dYaw = wrapPi(to.yaw - from.yaw), dPitch = (to.pitch ?? from.pitch) - from.pitch;
    const z0 = from.zoom ?? 45, dZoom = (to.zoom ?? 45) - z0, t0 = performance.now();
    const step = (now) => {
      const e = easeInOut(Math.min(1, (now - t0) / duration));
      viewer.rotate({ yaw: from.yaw + dYaw * e, pitch: from.pitch + dPitch * e });
      viewer.zoom(z0 + dZoom * e);
      (now - t0) < duration ? requestAnimationFrame(step) : resolve();
    };
    requestAnimationFrame(step);
  });
}
const viewOf = () => ({ yaw: viewer.getPosition().yaw, pitch: viewer.getPosition().pitch, zoom: viewer.getZoomLevel() });

async function goTo(i, { travel = false, towardYaw = null } = {}) {
  if (i < 0 || i >= TOUR.scenes.length) return;
  const sc = TOUR.scenes[i];
  transitioning = true;
  hidePanel();
  if (travel) {
    const cur = viewOf();
    await tween(cur, { yaw: towardYaw == null ? cur.yaw : towardYaw, pitch: cur.pitch, zoom: 100 }, 480);
    await viewer.setPanorama(sc.image, { position: { yaw: sc.default_yaw || 0, pitch: sc.default_pitch || 0 }, zoom: sc.default_zoom ?? 45, transition: true });
  }
  current = i;
  renderMarkers(sc);
  updateTitle(sc, i);
  transitioning = false;
  if (autoOn) autorotate.start();
}

function updateTitle(sc, i) {
  const n = document.getElementById('scene-name'); if (n) n.textContent = sc.name;
  const pos = document.getElementById('scene-pos'); if (pos) pos.textContent = (i + 1) + ' / ' + TOUR.scenes.length;
}
const yawTo = (from, to) => {
  const h = (TOUR.scenes[from]?.hotspots || []).find((x) => x.kind !== 'info' && x.target === to);
  return h ? h.yaw : null;
};

// Startzustand (Panorama 0 ist schon geladen)
renderMarkers(TOUR.scenes[0]);
updateTitle(TOUR.scenes[0], 0);

// ============================================================ KLASSIK-MODUS ==
function stopTour() { playing = false; document.body.classList.remove('playing'); }
async function playSceneKeyframes(sc) {
  const kf = sc.keyframes || [];
  if (!kf.length) { autorotate.start(); await sleep(3500); if (!autoOn) autorotate.stop(); return; }
  let from = viewOf();
  for (const to of kf) { if (!playing) return; await tween(from, to, to.duration || 2500); from = { ...to }; await sleep(200); }
}
async function playTour() {
  if (playing) return stopTour();
  playing = true; document.body.classList.add('playing');
  for (let i = current; i < TOUR.scenes.length && playing; i++) {
    if (i !== current) await goTo(i, { travel: true, towardYaw: yawTo(current, i) });
    await playSceneKeyframes(TOUR.scenes[i]);
    if (playing && i < TOUR.scenes.length - 1) await sleep(250);
  }
  stopTour();
}
function toggleAuto() {
  autoOn = !autoOn;
  document.getElementById('btn-auto')?.classList.toggle('on', autoOn);
  autoOn ? autorotate.start() : autorotate.stop();
}
function setupClassic() {
  document.getElementById('btn-play').onclick = playTour;
  document.getElementById('btn-auto').onclick = toggleAuto;
  document.getElementById('btn-prev').onclick = () => { stopTour(); goTo((current - 1 + TOUR.scenes.length) % TOUR.scenes.length, { travel: true }); };
  document.getElementById('btn-next').onclick = () => { stopTour(); goTo((current + 1) % TOUR.scenes.length, { travel: true, towardYaw: yawTo(current, current + 1) }); };
  viewer.addEventListener('click', () => stopTour());
}

// ============================================================= SCROLL-MODUS ==
// Kamera-Ansicht innerhalb einer Szene anhand des Fortschritts 0..1
function viewAt(sc, local) {
  const pts = [{ yaw: sc.default_yaw || 0, pitch: sc.default_pitch || 0, zoom: sc.default_zoom ?? 45 }, ...(sc.keyframes || [])];
  if (pts.length === 1) return pts[0];
  const seg = clamp(local, 0, 1) * (pts.length - 1);
  const i = Math.min(Math.floor(seg), pts.length - 2), f = easeInOut(seg - i);
  const a = pts[i], b = pts[i + 1];
  return { yaw: a.yaw + wrapPi(b.yaw - a.yaw) * f, pitch: a.pitch + ((b.pitch ?? a.pitch) - a.pitch) * f, zoom: (a.zoom ?? 45) + ((b.zoom ?? 45) - (a.zoom ?? 45)) * f };
}
function applyLocal(idx, local) {
  const v = viewAt(TOUR.scenes[idx], local);
  viewer.rotate({ yaw: v.yaw, pitch: v.pitch }); viewer.zoom(v.zoom);
}
function setupScroll() {
  const spacer = document.getElementById('scroll-spacer');
  spacer.style.height = (TOUR.scenes.length * 100) + 'vh';
  const bar = document.getElementById('progress-bar');
  const hint = document.getElementById('scroll-hint');
  let pending = null;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const prog = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    if (bar) bar.style.width = (prog * 100) + '%';
    if (hint && window.scrollY > 30) hint.classList.add('hidden');

    const sp = prog * TOUR.scenes.length;
    const idx = clamp(Math.floor(sp), 0, TOUR.scenes.length - 1);
    const local = clamp(sp - idx, 0, 1);
    if (transitioning) { pending = { idx, local }; return; }
    if (idx !== current) {
      goTo(idx, { travel: true, towardYaw: yawTo(current, idx) }).then(() => {
        const pp = pending; pending = null;
        applyLocal(current, pp ? pp.local : local);
      });
    } else {
      applyLocal(idx, local);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  applyLocal(0, 0);
}

// ----------------------------------------------------------------- Start -----
window.tourViewer = viewer; // Hook für Automatisierung/Debug
if (MODE === 'scroll') setupScroll(); else setupClassic();
