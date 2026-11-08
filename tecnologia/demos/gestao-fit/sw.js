const CACHE_NAME = 'gestao-fit-cache-v22';
const ASSETS = [
  './','./index.html','./lock.js','./manifest.json',
  './assets/css/styles.css','./assets/css/security.css?v=3','./assets/css/routine.css?v=1','./assets/css/students.css?v=1','./assets/css/crm.css?v=2','./assets/css/student-overview.css?v=1','./assets/css/filters.css?v=1','./assets/css/clock.css?v=1','./assets/css/commerce.css?v=1','./assets/css/schedule.css?v=5','./assets/css/training.css?v=2','./assets/css/premium.css?v=2','./assets/css/navigation.css?v=2','./assets/css/day.css?v=3',
  './assets/fonts/inter.woff2',
  './assets/libs/tailwindcss.js','./assets/libs/lucide.js',
  './assets/js/navigation.js?v=1','./assets/js/clock.js?v=1','./assets/js/day-view.js?v=3','./assets/js/tailwind_config.js','./assets/js/data.js?v=11',
  './assets/js/validation-session.js?v=1','./assets/js/routine-rules.js?v=8','./assets/js/routine.js?v=10','./assets/js/student-rules.js?v=2','./assets/js/crm-rules.js?v=2','./assets/js/crm.js?v=3','./assets/js/commerce-rules.js?v=2','./assets/js/schedule-rules.js?v=3','./assets/js/schedule.js?v=5','./assets/js/attendance-rules.js?v=1','./assets/js/attendance.js?v=1','./assets/js/training-rules.js?v=2','./assets/js/training.js?v=3','./assets/js/training-log-rules.js?v=1','./assets/js/training-log.js?v=1','./assets/js/commerce.js?v=6','./assets/js/student-overview.js?v=1','./assets/js/students.js?v=9',
  './assets/js/vault-store.js?v=2','./assets/js/security.js?v=13','./assets/js/finance-rules.js?v=2','./assets/js/finance.js?v=3','./assets/js/assistant-rules.js?v=3','./assets/js/assistant.js?v=3','./assets/js/personalization-rules.js?v=2','./assets/js/personalization.js?v=2','./assets/js/help.js?v=1',
  './assets/js/activation.js?v=1',
  './assets/img/icons/icon-192.png','./assets/img/icons/icon-512.png'
];
const PATHS = new Set(ASSETS.map(asset => new URL(asset,self.registration.scope).pathname));
self.addEventListener('install',event => event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('gestao-fit-cache-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event => {
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.includes('/api_')||!PATHS.has(url.pathname))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).catch(()=>caches.open(CACHE_NAME).then(cache=>cache.match('./index.html'))));return;
  }
  event.respondWith(caches.open(CACHE_NAME).then(async cache=>(await cache.match(request))||fetch(request)));
});
