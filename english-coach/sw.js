// Minimaler Service-Worker: cached die App-Hülle, damit sie als PWA startet.
// API-Aufrufe (api/) werden NIE gecached — die brauchen immer das Netz.
const CACHE = 'english-coach-v1';
const SHELL = [
  './', './index.html',
  './css/styles.css',
  './js/api.js', './js/speech.js', './js/app.js',
  './manifest.webmanifest', './icons/icon.svg',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('/api/') || e.request.method !== 'GET') return; // immer Netz
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => hit))
  );
});
