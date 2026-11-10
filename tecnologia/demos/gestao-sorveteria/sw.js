const CACHE_NAME = 'gestao-sorveteria-cache-v12';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './lock.js?v=11',
  './assets/css/styles.css?v=11',
  './assets/css/theme.css?v=11',
  './assets/css/workspace.css?v=11',
  './assets/css/modules.css?v=11',
  './assets/js/theme.js?v=11',
  './assets/fonts/inter.woff2?v=11',
  './assets/js/app.js?v=11',
  './assets/js/db.js?v=11',
  './assets/js/operations.js?v=11',
  './assets/js/router.js?v=12',
  './assets/js/tailwind_config.js?v=11',
  './assets/js/modules/dashboard.js?v=11',
  './assets/js/modules/inventory.js?v=11',
  './assets/js/modules/pdv.js?v=11',
  './assets/js/modules/pdv_ux.js?v=11',
  './assets/js/modules/loyalty.js?v=11',
  './assets/js/modules/management.js?v=11',
  './assets/js/modules/product_ux.js?v=11',
  './assets/js/modules/production.js?v=11',
  './assets/js/modules/products.js?v=11',
  './assets/js/modules/reports.js?v=11',
  './assets/js/modules/temperature.js?v=11',
  './assets/js/notif_logic.js?v=11',
  './assets/libs/lucide.js?v=11',
  './assets/libs/tailwindcss.js?v=11',
  './assets/img/icons/icon-192.png',
  './assets/img/icons/icon-512.png'
];

const APP_PATHS = new Set(ASSETS_TO_CACHE.map(asset => new URL(asset, self.registration.scope).pathname));
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith('gestao-sorveteria-cache-') && k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // As APIs de licença e notificações nunca são interceptadas ou armazenadas.
  if (e.request.method !== 'GET' || url.origin !== self.location.origin || !APP_PATHS.has(url.pathname)) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.open(CACHE_NAME).then(cache => cache.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.open(CACHE_NAME).then(async cache => (await cache.match(e.request)) || fetch(e.request))
  );
});
