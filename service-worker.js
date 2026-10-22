// Network-first first-party assets keep releases fresh; the shared shell is an offline route fallback.
const CACHE_NAME = 'onlinecalmaster-v17-site-icons';
const CORE = ['/', '/index.html', '/styles.css', '/script.js', '/manifest.json', '/favicon.ico', '/favicon-32x32.png', '/apple-touch-icon.png', '/Logo.png', '/icon-48x48.png', '/icon-192x192.png', '/icon-512x512.png'];
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
    // An uncached article is not a calculator route. Never substitute the calculator shell.
    if (url.pathname === '/blog' || url.pathname.startsWith('/blog/')) {
     return new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Article unavailable offline | OnlineCalMaster</title><main><h1>This guide is not saved offline yet</h1><p>Reconnect and reload to read it. Previously opened guides remain available offline.</p><p><a href="/">Open the calculators</a></p></main></html>', {status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
    }
    const shell = await cache.match('/index.html');
    if (shell) return new Response((await shell.text()).replace('<head>','<head><base href="/">'),{headers:{'Content-Type':'text/html; charset=utf-8'}});
   }
   return Response.error();
  }
 })());
});
