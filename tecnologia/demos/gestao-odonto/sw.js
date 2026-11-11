const CACHE_NAME = 'gestao-odonto-cache-v5';
const urlsToCache = [
  './',
  './index.html',
  './lock.js',
  './demo-bypass.js',
  './assets/js/demo-seed.js',
  './assets/js/demo-entry.js',
  './manifest.json',
  './assets/css/styles.css',
  './assets/js/tailwind_config.js',
  './assets/libs/tailwindcss.js',
  './assets/libs/lucide.js',
  './assets/libs/chart.umd.min.js',
  './assets/libs/html2pdf.bundle.min.js',
  './assets/img/icons/icon-192.png',
  './assets/img/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
