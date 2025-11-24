const CACHE_NAME = 'loanpay-cache-v1';
const urlsToCache = ['/', '/index.html', '/styles.css', '/app.js', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Try cache first, then network
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request).then(netRes => {
        // cache GET requests (optional)
        if (e.request.method === 'GET') {
          caches.open(CACHE_NAME).then(cache => { cache.put(e.request, netRes.clone()).catch(()=>{}); });
        }
        return netRes;
      }).catch(()=>response);
    })
  );
});
