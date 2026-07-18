import express from 'express';
import multer from 'multer';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import db from './db.js';
import { buildTourHtml } from './export-template.js';
import { buildProjectZip, importProjectZip } from './project-io.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, 'data', 'uploads');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOAD_DIR, { maxAge: '1d' }));

// ---------------------------------------------------------------- Uploads ----
// Gaengige 360-Formate + Logos. HEIC/HEIF/TIFF werden angenommen, aber im
// Browser evtl. nicht dargestellt -> Hinweis im UI.
const ALLOWED = new Set([
  '.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp',
  '.tif', '.tiff', '.heic', '.heif', '.avif', '.svg'
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 60 * 1024 * 1024 }, // 60 MB pro Bild
  fileFilter: (_req, file, cb) => {
    const ext = extname(file.originalname).toLowerCase();
    cb(null, ALLOWED.has(ext));
  }
});

const wrap = (fn) => (req, res) => {
  try { fn(req, res); }
  catch (err) { console.error(err); res.status(500).json({ error: err.message }); }
};

// -------------------------------------------------------------- Assembler ----
function tourWithGraph(id) {
  const tour = db.prepare('SELECT * FROM tours WHERE id = ?').get(id);
  if (!tour) return null;
  const scenes = db.prepare('SELECT * FROM scenes WHERE tour_id = ? ORDER BY position, id').all(id);
  const hs = db.prepare(`SELECT h.* FROM hotspots h JOIN scenes s ON s.id = h.scene_id WHERE s.tour_id = ?`).all(id);
  const kf = db.prepare(`SELECT k.* FROM keyframes k JOIN scenes s ON s.id = k.scene_id WHERE s.tour_id = ? ORDER BY k.position, k.id`).all(id);
  for (const sc of scenes) {
    sc.hotspots = hs.filter((h) => h.scene_id === sc.id);
    sc.keyframes = kf.filter((k) => k.scene_id === sc.id);
  }
  tour.scenes = scenes;
  return tour;
}

const touch = (tourId) =>
  db.prepare("UPDATE tours SET updated_at = datetime('now') WHERE id = ?").run(tourId);

// ------------------------------------------------------------------ Tours ----
app.get('/api/tours', wrap((_req, res) => {
  const rows = db.prepare(`
    SELECT t.*, (SELECT COUNT(*) FROM scenes WHERE tour_id = t.id) AS scene_count
    FROM tours t ORDER BY t.updated_at DESC`).all();
  res.json(rows);
}));

app.get('/api/tours/:id', wrap((req, res) => {
  const tour = tourWithGraph(Number(req.params.id));
  if (!tour) return res.status(404).json({ error: 'Rundgang nicht gefunden' });
  res.json(tour);
}));

app.post('/api/tours', wrap((req, res) => {
  const { name, description = '' } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name fehlt' });
  const { lastInsertRowid } = db.prepare('INSERT INTO tours (name, description) VALUES (?, ?)')
    .run(name.trim(), description);
  res.status(201).json(tourWithGraph(lastInsertRowid));
}));

app.put('/api/tours/:id', wrap((req, res) => {
  const id = Number(req.params.id);
  const cur = db.prepare('SELECT * FROM tours WHERE id = ?').get(id);
  if (!cur) return res.status(404).json({ error: 'Rundgang nicht gefunden' });
  const { name = cur.name, description = cur.description, autorotate = cur.autorotate } = req.body;
  db.prepare("UPDATE tours SET name = ?, description = ?, autorotate = ?, updated_at = datetime('now') WHERE id = ?")
    .run(name, description, autorotate ? 1 : 0, id);
  res.json(tourWithGraph(id));
}));

app.delete('/api/tours/:id', wrap((req, res) => {
  db.prepare('DELETE FROM tours WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
}));

app.post('/api/tours/:id/logo', upload.single('logo'), wrap((req, res) => {
  const id = Number(req.params.id);
  if (!req.file) return res.status(400).json({ error: 'Kein Logo hochgeladen' });
  db.prepare('UPDATE tours SET logo_path = ? WHERE id = ?').run(`/uploads/${req.file.filename}`, id);
  touch(id);
  res.json(tourWithGraph(id));
}));

// ----------------------------------------------------------------- Scenes ----
app.post('/api/tours/:id/scenes', upload.single('image'), wrap((req, res) => {
  const tourId = Number(req.params.id);
  if (!req.file) return res.status(400).json({ error: 'Kein Bild (oder Format nicht erlaubt)' });
  const name = (req.body.name || req.file.originalname || 'Szene').replace(/\.[^.]+$/, '');
  const maxPos = db.prepare('SELECT COALESCE(MAX(position), -1) AS m FROM scenes WHERE tour_id = ?').get(tourId).m;
  const { lastInsertRowid } = db.prepare(
    'INSERT INTO scenes (tour_id, name, image_path, position) VALUES (?, ?, ?, ?)'
  ).run(tourId, name, `/uploads/${req.file.filename}`, maxPos + 1);
  touch(tourId);
  res.status(201).json(db.prepare('SELECT * FROM scenes WHERE id = ?').get(lastInsertRowid));
}));

const SCENE_FIELDS = ['name', 'position', 'default_yaw', 'default_pitch', 'default_zoom',
  'logo_yaw', 'logo_pitch', 'logo_scale', 'logo_enabled'];

app.put('/api/scenes/:id', wrap((req, res) => {
  const id = Number(req.params.id);
  const cur = db.prepare('SELECT * FROM scenes WHERE id = ?').get(id);
  if (!cur) return res.status(404).json({ error: 'Szene nicht gefunden' });
  const next = { ...cur, ...req.body };
  db.prepare(`UPDATE scenes SET ${SCENE_FIELDS.map((f) => `${f} = @${f}`).join(', ')} WHERE id = @id`)
    .run({ ...next, logo_enabled: next.logo_enabled ? 1 : 0, id });
  touch(cur.tour_id);
  res.json(db.prepare('SELECT * FROM scenes WHERE id = ?').get(id));
}));

app.delete('/api/scenes/:id', wrap((req, res) => {
  const sc = db.prepare('SELECT tour_id FROM scenes WHERE id = ?').get(Number(req.params.id));
  db.prepare('DELETE FROM scenes WHERE id = ?').run(Number(req.params.id));
  if (sc) touch(sc.tour_id);
  res.json({ ok: true });
}));

// --------------------------------------------------------------- Hotspots ----
app.post('/api/scenes/:id/hotspots', wrap((req, res) => {
  const sceneId = Number(req.params.id);
  const { target_scene_id = null, label = '', yaw, pitch,
    kind = 'nav', title = '', text = '', icon = 'info', display = 'panel' } = req.body;
  if (yaw == null || pitch == null) return res.status(400).json({ error: 'yaw/pitch fehlen' });
  const { lastInsertRowid } = db.prepare(
    `INSERT INTO hotspots (scene_id, target_scene_id, label, yaw, pitch, kind, title, text, icon, display)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(sceneId, kind === 'info' ? null : target_scene_id, label, yaw, pitch, kind, title, text, icon, display);
  res.status(201).json(db.prepare('SELECT * FROM hotspots WHERE id = ?').get(lastInsertRowid));
}));

const HS_FIELDS = ['target_scene_id', 'label', 'yaw', 'pitch', 'kind', 'title', 'text', 'icon', 'display'];
app.put('/api/hotspots/:id', wrap((req, res) => {
  const id = Number(req.params.id);
  const cur = db.prepare('SELECT * FROM hotspots WHERE id = ?').get(id);
  if (!cur) return res.status(404).json({ error: 'Hotspot nicht gefunden' });
  const next = { ...cur, ...req.body, id };
  if (next.kind === 'info') next.target_scene_id = null;
  db.prepare(`UPDATE hotspots SET ${HS_FIELDS.map((f) => `${f} = @${f}`).join(', ')} WHERE id = @id`).run(next);
  res.json(db.prepare('SELECT * FROM hotspots WHERE id = ?').get(id));
}));

app.delete('/api/hotspots/:id', wrap((req, res) => {
  db.prepare('DELETE FROM hotspots WHERE id = ?').run(Number(req.params.id));
  res.json({ ok: true });
}));

// -------------------------------------------------------------- Keyframes ----
// Ganze Kamerafahrt einer Szene ersetzen.
app.put('/api/scenes/:id/keyframes', wrap((req, res) => {
  const sceneId = Number(req.params.id);
  const frames = Array.isArray(req.body.keyframes) ? req.body.keyframes : [];
  const del = db.prepare('DELETE FROM keyframes WHERE scene_id = ?');
  const ins = db.prepare(
    'INSERT INTO keyframes (scene_id, position, yaw, pitch, zoom, duration) VALUES (?, ?, ?, ?, ?, ?)'
  );
  db.transaction(() => {
    del.run(sceneId);
    frames.forEach((f, i) =>
      ins.run(sceneId, i, f.yaw, f.pitch, f.zoom ?? 50, f.duration ?? 2500));
  })();
  res.json(db.prepare('SELECT * FROM keyframes WHERE scene_id = ? ORDER BY position').all(sceneId));
}));

// ------------------------------------------------------------ HTML-Export ----
// Liefert den Rundgang als eigenstaendige, teilbare HTML-Datei (alles inline).
app.get('/api/tours/:id/export', wrap((req, res) => {
  const tour = tourWithGraph(Number(req.params.id));
  if (!tour) return res.status(404).json({ error: 'Rundgang nicht gefunden' });
  if (!tour.scenes.length) return res.status(400).json({ error: 'Rundgang hat keine Szenen' });
  const mode = req.query.mode === 'scroll' ? 'scroll' : 'classic';
  const html = buildTourHtml(tour, { mode });
  const base = (tour.name || 'rundgang').replace(/[^\w\-]+/g, '_').toLowerCase();
  const fname = `${base}${mode === 'scroll' ? '-scroll' : ''}.html`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
  res.send(html);
}));

// ------------------------------------------------ Projekt speichern/laden ----
// Speichern: kompletter Rundgang als portable .panotour.zip (Manifest + Bilder).
app.get('/api/tours/:id/project', wrap((req, res) => {
  const tour = tourWithGraph(Number(req.params.id));
  if (!tour) return res.status(404).json({ error: 'Rundgang nicht gefunden' });
  const buf = buildProjectZip(tour);
  const fname = (tour.name || 'rundgang').replace(/[^\w\-]+/g, '_').toLowerCase() + '.panotour.zip';
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${fname}"`);
  res.send(buf);
}));

// Laden: Projektdatei importieren -> neuer, bearbeitbarer Rundgang.
const uploadZip = multer({ storage: multer.memoryStorage(), limits: { fileSize: 500 * 1024 * 1024 } });
app.post('/api/projects/import', uploadZip.single('project'), wrap((req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Keine Datei hochgeladen' });
  const tourId = importProjectZip(req.file.buffer);
  res.status(201).json(tourWithGraph(tourId));
}));

// ----------------------------------------------------- Fehlerbehandlung ------
// Fängt Upload-/Multer-Fehler ab (z. B. abgebrochene Uploads: „Unexpected end
// of form") und antwortet sauber, statt den Server abstürzen zu lassen.
app.use((err, _req, res, _next) => {
  console.error('Anfrage-Fehler:', err.message);
  if (res.headersSent) return;
  const code = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
  res.status(code).json({ error: err.message || 'Fehler bei der Verarbeitung' });
});

// Letztes Sicherheitsnetz: ein einzelner fehlerhafter Request soll den lokalen
// Server nie beenden.
process.on('uncaughtException', (err) => console.error('Abgefangen (uncaughtException):', err.message));
process.on('unhandledRejection', (err) => console.error('Abgefangen (unhandledRejection):', err?.message || err));

// ------------------------------------------------------------------ Start ----
app.listen(PORT, () => {
  console.log(`\n  PanoTour Studio läuft:  http://localhost:${PORT}\n`);
});
