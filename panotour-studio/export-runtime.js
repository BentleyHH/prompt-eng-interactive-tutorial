/* Eigenständige Viewer-Laufzeit für den HTML-Export.
 * Wird beim Export in die Datei eingebettet; liest die Rundgang-Daten aus
 * window.__TOUR__ (Bilder als Data-URIs). Die Bibliotheken kommen aus dem
 * eingebetteten Bundle (window.PSV). Braucht kein Internet.             */
const { Viewer, MarkersPlugin, AutorotatePlugin } = window.PSV;
const TOUR = window.__TOUR__;
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const wrapPi = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };

const PIN = 'data:image/svg+xml;base64,' + btoa(
  '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38">' +
  '<defs><filter id="s" x="-60%" y="-60%" width="220%" height="220%">' +
  '<feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#000" flood-opacity=".3"/></filter></defs>' +
  '<path filter="url(#s)" d="M15 2C8.9 2 4 6.9 4 13c0 8 11 21 11 21s11-13 11-21C26 6.9 21.1 2 15 2z" fill="#0071e3"/>' +
  '<circle cx="15" cy="13" r="4.4" fill="#fff"/></svg>');

function patchQuad(yawC, pitchC, halfDeg) {
  const h = Math.min((halfDeg * Math.PI) / 180, 1.2), t = Math.tan(h);
  const cp = Math.cos(pitchC), sp = Math.sin(pitchC), cy = Math.cos(yawC), sy = Math.sin(yawC);
  const C = { x: cp * sy, y: sp, z: cp * cy };
  const east = { x: cy, y: 0, z: -sy }, north = { x: -sp * sy, y: cp, z: -sp * cy };
  const toYP = (v) => { const n = Math.hypot(v.x, v.y, v.z);
    return { yaw: Math.atan2(v.x / n, v.z / n), pitch: Math.asin(Math.max(-1, Math.min(1, v.y / n))) }; };
  const corner = (a, b) => toYP({
    x: C.x + a * t * east.x + b * t * north.x, y: C.y + a * t * east.y + b * t * north.y,
    z: C.z + a * t * east.z + b * t * north.z });
  return [corner(-1, -1), corner(-1, 1), corner(1, 1), corner(1, -1)];
}

const viewer = new Viewer({
  container: document.getElementById('viewer'),
  panorama: TOUR.scenes[0].image,
  navbar: ['zoom', 'fullscreen'],
  defaultZoomLvl: TOUR.scenes[0].default_zoom ?? 45,
  plugins: [MarkersPlugin, [AutorotatePlugin, { autostartDelay: null, autostartOnIdle: false, autorotateSpeed: '0.8rpm' }]],
});
const markers = viewer.getPlugin(MarkersPlugin);
const autorotate = viewer.getPlugin(AutorotatePlugin);
let current = 0, playing = false, autoOn = false;

markers.addEventListener('select-marker', ({ marker }) => {
  const tgt = marker?.data?.target;
  if (typeof tgt === 'number') { stopTour(); goto(tgt); }
});

async function goto(i, initial) {
  current = i;
  const sc = TOUR.scenes[i];
  if (!initial) {
    await viewer.setPanorama(sc.image, {
      position: { yaw: sc.default_yaw || 0, pitch: sc.default_pitch || 0 },
      zoom: sc.default_zoom ?? 45, transition: true, showLoader: true });
  }
  renderMarkers(sc);
  document.getElementById('scene-name').textContent = sc.name;
  document.getElementById('scene-pos').textContent = (i + 1) + ' / ' + TOUR.scenes.length;
  if (autoOn) autorotate.start();
}

function renderMarkers(sc) {
  markers.clearMarkers();
  for (let k = 0; k < (sc.hotspots || []).length; k++) {
    const h = sc.hotspots[k];
    markers.addMarker({ id: 'hs-' + k, position: { yaw: h.yaw, pitch: h.pitch }, image: PIN,
      size: { width: 30, height: 38 }, anchor: 'bottom center',
      tooltip: h.label || (typeof h.target === 'number' ? TOUR.scenes[h.target].name : ''),
      data: { target: h.target } });
  }
  if (sc.logo_enabled && TOUR.logo) {
    try {
      markers.addMarker({ id: 'logo', imageLayer: TOUR.logo,
        position: patchQuad(sc.logo_yaw || 0, sc.logo_pitch ?? -Math.PI / 2, sc.logo_scale || 22) });
    } catch (e) { /* ignore */ }
  }
}

function tween(from, to, duration) {
  return new Promise((resolve) => {
    const dYaw = wrapPi(to.yaw - from.yaw), dPitch = (to.pitch ?? from.pitch) - from.pitch;
    const z0 = from.zoom ?? 45, dZoom = (to.zoom ?? 45) - z0, t0 = performance.now();
    const step = (now) => {
      if (!playing) return resolve();
      const e = easeInOut(Math.min(1, (now - t0) / duration));
      viewer.rotate({ yaw: from.yaw + dYaw * e, pitch: from.pitch + dPitch * e });
      viewer.zoom(z0 + dZoom * e);
      (now - t0) < duration ? requestAnimationFrame(step) : resolve();
    };
    requestAnimationFrame(step);
  });
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function playScene(sc) {
  const kf = sc.keyframes || [];
  if (kf.length < 1) { autorotate.start(); await sleep(4000); autorotate.stop(); return; }
  let from = { yaw: viewer.getPosition().yaw, pitch: viewer.getPosition().pitch, zoom: viewer.getZoomLevel() };
  for (const to of kf) { if (!playing) return; await tween(from, to, to.duration || 2500); from = { ...to }; await sleep(250); }
}

async function playTour() {
  if (playing) return stopTour();
  playing = true; document.body.classList.add('playing');
  for (let i = current; i < TOUR.scenes.length && playing; i++) {
    await goto(i); await sleep(400);
    await playScene(TOUR.scenes[i]);
    if (!playing) break;
    if (i < TOUR.scenes.length - 1) await sleep(300);
  }
  stopTour();
}
function stopTour() { playing = false; document.body.classList.remove('playing'); }

function toggleAuto() {
  autoOn = !autoOn;
  document.getElementById('btn-auto').classList.toggle('on', autoOn);
  autoOn ? autorotate.start() : autorotate.stop();
}

// Steuerung verdrahten
document.getElementById('btn-play').onclick = playTour;
document.getElementById('btn-auto').onclick = toggleAuto;
document.getElementById('btn-prev').onclick = () => { stopTour(); goto((current - 1 + TOUR.scenes.length) % TOUR.scenes.length); };
document.getElementById('btn-next').onclick = () => { stopTour(); goto((current + 1) % TOUR.scenes.length); };
viewer.addEventListener('click', () => stopTour());

goto(0, true);
