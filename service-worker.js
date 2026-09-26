// Network-first first-party assets keep releases fresh; the shared shell is an offline route fallback.
const CACHE_NAME = 'onlinecalmaster-v10-redesign';
const CORE = ['/', '/index.html', '/styles.css', '/script.js', '/manifest.json', '/Logo.png'];
self.addEventListener('install', event => {
 event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
 event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME && (key.startsWith('calculator-cache-') || key.startsWith('onlinecalmaster-'))).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
 const request = event.request;
 const url = new URL(request.url);
 if (request.method !== 'GET' || url.origin !== self.location.origin) return;
 if (!['document','style','script','image','manifest'].includes(request.destination)) return;
 event.respondWith((async () => {
  const cache = await caches.open(CACHE_NAME);
  try {
   const response = await fetch(request, { cache: 'no-cache' });
   if (response.ok) await cache.put(request,response.clone());
   return response;
  } catch (error) {
   const cached = await cache.match(request);
   if (cached) return cached;
   // The base URL keeps assets at the site root when the shell serves an uncached route offline.
   if (request.mode === 'navigate') {
    const shell = await cache.match('/index.html');
    if (shell) return new Response((await shell.text()).replace('<head>','<head><base href="/">'),{headers:{'Content-Type':'text/html; charset=utf-8'}});
   }
   return Response.error();
  }
 })());
});
