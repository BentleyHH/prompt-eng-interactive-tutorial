// Baut aus einem Rundgang eine EIGENSTÄNDIGE HTML-Datei: Viewer-Bibliotheken,
// Bilder (als Data-URIs) und Laufzeit werden eingebettet — kein Server, kein
// Internet nötig. Einfach die .html-Datei irgendwo ablegen und öffnen/teilen.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const VENDOR = join(__dirname, 'public', 'vendor');
const UPLOADS = join(__dirname, 'data', 'uploads');

const MIME = {
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.gif': 'image/gif', '.avif': 'image/avif', '.bmp': 'image/bmp', '.svg': 'image/svg+xml',
  '.tif': 'image/tiff', '.tiff': 'image/tiff',
};

const read = (p) => fs.readFileSync(p);

function assetToDataUri(webPath) {
  // webPath z.B. "/uploads/1699-abc.png"
  const name = webPath.replace(/^\/uploads\//, '');
  const file = join(UPLOADS, name);
  const mime = MIME[extname(name).toLowerCase()] || 'application/octet-stream';
  return `data:${mime};base64,${read(file).toString('base64')}`;
}

function buildTourData(tour) {
  const idToIndex = new Map(tour.scenes.map((s, i) => [s.id, i]));
  const logoUri = tour.logo_path ? assetToDataUri(tour.logo_path) : null;
  return {
    name: tour.name,
    description: tour.description || '',
    autorotate: !!tour.autorotate,
    logo: logoUri,
    scenes: tour.scenes.map((s) => ({
      name: s.name,
      image: assetToDataUri(s.image_path),
      default_yaw: s.default_yaw, default_pitch: s.default_pitch, default_zoom: s.default_zoom,
      logo_enabled: !!s.logo_enabled, logo_yaw: s.logo_yaw, logo_pitch: s.logo_pitch, logo_scale: s.logo_scale,
      hotspots: (s.hotspots || []).map((h) => ({
        label: h.label || '', yaw: h.yaw, pitch: h.pitch,
        target: h.target_scene_id != null && idToIndex.has(h.target_scene_id) ? idToIndex.get(h.target_scene_id) : null,
        kind: h.kind || 'nav', title: h.title || '', text: h.text || '',
        icon: h.icon || 'info', display: h.display || 'panel',
      })),
      keyframes: (s.keyframes || []).map((k) => ({ yaw: k.yaw, pitch: k.pitch, zoom: k.zoom, duration: k.duration })),
    })),
  };
}

const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// JSON sicher in <script> einbetten: '<' escapen (verhindert </script>).
const jsonInline = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
// Daten doppelt kodieren -> im Browser via JSON.parse zurueck.
const jsonLiteral = (o) => JSON.stringify(JSON.stringify(o)).replace(/</g, '\\u003c');

export function buildTourHtml(tour, { mode = 'classic' } = {}) {
  const data = buildTourData(tour);
  data.mode = mode === 'scroll' ? 'scroll' : 'classic';
  const psvCss = read(join(VENDOR, 'psv-core.css')) + '\n' + read(join(VENDOR, 'psv-markers.css'));
  const bundle = fs.readFileSync(join(VENDOR, 'psv-export-bundle.js'), 'utf8'); // three + PSV (IIFE -> window.PSV)
  const runtime = fs.readFileSync(join(__dirname, 'export-runtime.js'), 'utf8');

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>${esc(tour.name)} — 360° Rundgang</title>
<style>${psvCss}</style>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100%;
    font: 14px/1.5 -apple-system, "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif;
    color: #1d1d1f; background: #f5f5f7; }
  body.mode-classic { height: 100%; overflow: hidden; }
  body.mode-classic #viewer { position: absolute; inset: 0; }
  body.mode-scroll { overflow-x: hidden; }
  body.mode-scroll #viewer { position: fixed; inset: 0; }
  .scroll-ui { display: none; }
  body.mode-scroll .controls { display: none; }
  body.mode-scroll #progress-track { display: block; }
  body.mode-scroll #scroll-hint { display: inline-flex; }
  body.mode-scroll #scroll-spacer { display: block; }
  .psv-container { --psv-navbar-background: rgba(255,255,255,.82); --psv-navbar-height: 40px; background: #f5f5f7 !important; }
  .psv-button { color: #1d1d1f !important; }
  .ico { width: 20px; height: 20px; stroke: currentColor; stroke-width: 1.7;
    stroke-linecap: round; stroke-linejoin: round; fill: none; }
  .ico.fill { fill: currentColor; stroke: none; }
  .title-card { position: fixed; top: 18px; left: 18px; z-index: 10;
    background: rgba(255,255,255,.82); backdrop-filter: saturate(180%) blur(20px);
    border: 1px solid #e3e3e6; border-radius: 14px; padding: 10px 16px; box-shadow: 0 6px 24px rgba(0,0,0,.1); }
  .title-card h1 { margin: 0; font-size: 15px; font-weight: 600; letter-spacing: -.01em; }
  .title-card p { margin: 2px 0 0; font-size: 12px; color: #6e6e73; }
  .controls { position: fixed; left: 50%; bottom: 22px; transform: translateX(-50%); z-index: 10;
    display: flex; align-items: center; gap: 4px; padding: 6px;
    background: rgba(255,255,255,.82); backdrop-filter: saturate(180%) blur(20px);
    border: 1px solid #e3e3e6; border-radius: 18px; box-shadow: 0 8px 30px rgba(0,0,0,.14); }
  .cbtn { display: inline-flex; align-items: center; justify-content: center; gap: 7px;
    height: 40px; min-width: 40px; padding: 0 12px; border: none; background: transparent;
    color: #1d1d1f; border-radius: 13px; cursor: pointer; font: inherit; transition: .12s; }
  .cbtn:hover { background: #f0f0f2; }
  .cbtn.primary { background: #0071e3; color: #fff; padding: 0 18px; }
  .cbtn.primary:hover { background: #0064c8; }
  .cbtn.on { background: #eef4ff; color: #0071e3; }
  .cpos { min-width: 44px; text-align: center; color: #6e6e73; font-size: 12px; font-variant-numeric: tabular-nums; }
  .sep { width: 1px; height: 22px; background: #d2d2d7; margin: 0 4px; }
  body.playing .cbtn#btn-play .lbl::after { content: 'Stopp'; }
  body.playing .cbtn#btn-play .lbl .txt { display: none; }
  .lbl { display: inline-flex; align-items: center; }
  /* Scroll-Modus */
  #scroll-spacer { position: relative; z-index: 0; pointer-events: none; }
  #progress-track { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: rgba(0,0,0,.07); z-index: 12; }
  #progress-bar { height: 100%; width: 0; background: #0071e3; }
  #scroll-hint { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 11;
    align-items: center; gap: 8px; padding: 9px 16px; border-radius: 999px;
    background: rgba(255,255,255,.82); backdrop-filter: saturate(180%) blur(20px); border: 1px solid #e3e3e6;
    box-shadow: 0 8px 30px rgba(0,0,0,.14); font-size: 13px; color: #1d1d1f; transition: opacity .4s; }
  #scroll-hint.hidden { opacity: 0; pointer-events: none; }
  @keyframes bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
  #scroll-hint .ico { width: 18px; height: 18px; animation: bob 1.4s ease-in-out infinite; }
  /* Info-Panel */
  .info-panel { position: fixed; left: 20px; bottom: 24px; max-width: 340px; z-index: 15;
    background: rgba(255,255,255,.96); backdrop-filter: saturate(180%) blur(20px); border: 1px solid #e3e3e6;
    border-radius: 14px; padding: 15px 18px; box-shadow: 0 10px 34px rgba(0,0,0,.16); }
  .info-panel h4 { margin: 0 0 6px; font-size: 15px; }
  .info-panel p { margin: 0; font-size: 13px; color: #6e6e73; white-space: pre-wrap; line-height: 1.5; }
  .info-close { position: absolute; top: 6px; right: 10px; border: none; background: none; font-size: 20px;
    line-height: 1; cursor: pointer; color: #a1a1a6; }
</style>
</head>
<body class="mode-${data.mode}">
<div id="viewer"></div>
<div id="progress-track" class="scroll-ui"><div id="progress-bar"></div></div>
<div class="title-card">
  <h1 id="scene-name">${esc(data.scenes[0].name)}</h1>
  <p><span id="scene-pos">1 / ${data.scenes.length}</span> · ${esc(tour.name)}</p>
</div>
<div id="scroll-hint" class="scroll-ui">
  <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg>
  Scrollen zum Entdecken
</div>
<div class="controls">
  <button class="cbtn" id="btn-prev" title="Vorige Szene" aria-label="Vorige Szene">
    <svg class="ico" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>
  <span class="cpos" id="scene-pos2"></span>
  <button class="cbtn" id="btn-next" title="Nächste Szene" aria-label="Nächste Szene">
    <svg class="ico" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
  <span class="sep"></span>
  <button class="cbtn primary" id="btn-play" title="Rundgang abspielen">
    <svg class="ico fill" viewBox="0 0 24 24"><path d="M7 4.5l12.5 7.5L7 19.5z"/></svg>
    <span class="lbl"><span class="txt">Rundgang</span></span></button>
  <button class="cbtn" id="btn-auto" title="Auto-Rotation">
    <svg class="ico" viewBox="0 0 24 24"><path d="M3 12a9 9 0 019-9 9 9 0 018 5M21 12a9 9 0 01-9 9 9 9 0 01-8-5"/><path d="M17 8h4V4M7 16H3v4"/></svg></button>
</div>
<div id="scroll-spacer" class="scroll-ui"></div>
<script>window.__TOUR__ = JSON.parse(${jsonLiteral(data)});</script>
<script>${bundle}</script>
<script>${runtime}</script>
</body>
</html>`;
}
