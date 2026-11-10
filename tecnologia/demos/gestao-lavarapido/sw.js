const CACHE = 'lava-rapido-v20';
const FILES = ['./', './index.html', './style.css', './checkin.css', './app.js', './operational-store.js', './lock.js', './online.js', './operational-ui.js', './lucide.min.js', './manifest.json', './icon.svg', './inter.woff2'];
const STATIC_PATHS = new Set(FILES.map(file => new URL(file, self.registration.scope).pathname));
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('lava-rapido-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Não armazenar respostas autenticadas, nem URLs arbitrárias.
  if (event.request.method !== 'GET' || url.origin !== location.origin || !STATIC_PATHS.has(url.pathname) || url.pathname.includes('/api/')) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok) { const clone = response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put(url.pathname, clone))); }
    return response;
  }).catch(() => caches.match(url.pathname).then(response => response || Response.error())));
});
