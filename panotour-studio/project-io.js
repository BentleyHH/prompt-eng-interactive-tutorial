// Projekt speichern & laden: bündelt einen kompletten Rundgang (Szenen,
// Hotspots, Kamerafahrten, Logo + alle Bilder) in eine portable .panotour.zip
// und importiert sie wieder als neuen, bearbeitbaren Rundgang.
import AdmZip from 'adm-zip';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, basename } from 'node:path';
import db from './db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOADS = join(__dirname, 'data', 'uploads');

const PROJECT_VERSION = 1;
const uploadPathToFile = (webPath) => join(UPLOADS, basename(webPath));

// ------------------------------------------------------------ Speichern -----
export function buildProjectZip(tour) {
  const zip = new AdmZip();
  const used = new Set();

  const addAsset = (webPath) => {
    if (!webPath) return null;
    const file = uploadPathToFile(webPath);
    if (!fs.existsSync(file)) return null;
    const name = basename(webPath);
    if (!used.has(name)) { zip.addLocalFile(file, 'assets'); used.add(name); }
    return `assets/${name}`;
  };

  const manifest = {
    app: 'PanoTour Studio',
    version: PROJECT_VERSION,
    exportedAt: new Date().toISOString(),
    tour: {
      name: tour.name,
      description: tour.description || '',
      autorotate: !!tour.autorotate,
      logo: addAsset(tour.logo_path),
    },
    scenes: tour.scenes.map((s, i) => ({
      name: s.name,
      image: addAsset(s.image_path),
      position: i,
      default_yaw: s.default_yaw, default_pitch: s.default_pitch, default_zoom: s.default_zoom,
      logo_enabled: !!s.logo_enabled, logo_yaw: s.logo_yaw, logo_pitch: s.logo_pitch, logo_scale: s.logo_scale,
      hotspots: (s.hotspots || []).map((h) => ({
        label: h.label || '', yaw: h.yaw, pitch: h.pitch,
        target: sceneIndexById(tour, h.target_scene_id),
      })),
      keyframes: (s.keyframes || []).map((k) => ({ yaw: k.yaw, pitch: k.pitch, zoom: k.zoom, duration: k.duration })),
    })),
  };

  zip.addFile('project.json', Buffer.from(JSON.stringify(manifest, null, 2), 'utf8'));
  return zip.toBuffer();
}

const sceneIndexById = (tour, id) => {
  if (id == null) return null;
  const idx = tour.scenes.findIndex((s) => s.id === id);
  return idx < 0 ? null : idx;
};

// -------------------------------------------------------------- Laden -------
export function importProjectZip(buffer) {
  let zip;
  try { zip = new AdmZip(buffer); } catch { throw new Error('Datei ist kein gültiges Projekt (kein ZIP).'); }

  const manifestEntry = zip.getEntry('project.json');
  if (!manifestEntry) throw new Error('Keine project.json im Archiv gefunden.');
  let manifest;
  try { manifest = JSON.parse(zip.readAsText(manifestEntry)); }
  catch { throw new Error('project.json ist beschädigt.'); }
  if (!manifest || !Array.isArray(manifest.scenes)) throw new Error('Projektdatei hat kein gültiges Format.');

  // Assets sicher entpacken: eigene, neue Dateinamen vergeben (kein Zip-Slip).
  const assetMap = new Map(); // "assets/foo.png" -> "/uploads/<neu>.png"
  for (const e of zip.getEntries()) {
    if (e.isDirectory || !e.entryName.startsWith('assets/')) continue;
    const ext = extname(e.entryName).toLowerCase() || '.jpg';
    const safe = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
    fs.writeFileSync(join(UPLOADS, safe), e.getData());
    assetMap.set(e.entryName, `/uploads/${safe}`);
  }
  const resolve = (assetPath) => (assetPath && assetMap.get(assetPath)) || null;

  const insertTour = db.prepare('INSERT INTO tours (name, description, logo_path, autorotate) VALUES (?, ?, ?, ?)');
  const insertScene = db.prepare(`INSERT INTO scenes
    (tour_id, name, image_path, position, default_yaw, default_pitch, default_zoom,
     logo_enabled, logo_yaw, logo_pitch, logo_scale)
    VALUES (@tour_id, @name, @image_path, @position, @default_yaw, @default_pitch, @default_zoom,
     @logo_enabled, @logo_yaw, @logo_pitch, @logo_scale)`);
  const insertHotspot = db.prepare('INSERT INTO hotspots (scene_id, target_scene_id, label, yaw, pitch) VALUES (?, ?, ?, ?, ?)');
  const insertKeyframe = db.prepare('INSERT INTO keyframes (scene_id, position, yaw, pitch, zoom, duration) VALUES (?, ?, ?, ?, ?, ?)');

  const t = manifest.tour || {};
  const tx = db.transaction(() => {
    const tourId = insertTour.run(
      (t.name || 'Importierter Rundgang') + '', t.description || '', resolve(t.logo), t.autorotate ? 1 : 0
    ).lastInsertRowid;

    const sceneIds = [];
    manifest.scenes.forEach((s, i) => {
      const img = resolve(s.image);
      if (!img) throw new Error(`Bild für Szene "${s.name || i + 1}" fehlt im Archiv.`);
      const id = insertScene.run({
        tour_id: tourId, name: (s.name || `Szene ${i + 1}`) + '', image_path: img, position: s.position ?? i,
        default_yaw: num(s.default_yaw), default_pitch: num(s.default_pitch), default_zoom: num(s.default_zoom, 50),
        logo_enabled: s.logo_enabled ? 1 : 0, logo_yaw: num(s.logo_yaw), logo_pitch: num(s.logo_pitch, -1.5707963),
        logo_scale: num(s.logo_scale, 22),
      }).lastInsertRowid;
      sceneIds.push(id);
    });

    manifest.scenes.forEach((s, i) => {
      for (const h of s.hotspots || []) {
        const target = (h.target != null && sceneIds[h.target] != null) ? sceneIds[h.target] : null;
        insertHotspot.run(sceneIds[i], target, (h.label || '') + '', num(h.yaw), num(h.pitch));
      }
      (s.keyframes || []).forEach((k, ki) =>
        insertKeyframe.run(sceneIds[i], ki, num(k.yaw), num(k.pitch), num(k.zoom, 50), num(k.duration, 2500)));
    });

    return tourId;
  });

  return tx();
}

const num = (v, dflt = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : dflt);
