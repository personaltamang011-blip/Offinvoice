const CACHE_NAME = "invoice-app-cache-v1";
const urlsToCache = [
  "./index.html",
  "./manifest.json",
  "./js/jspdf.umd.min.js",
  "./js/jspdf.plugin.autotable.min.js",
  "./assets/INVOICE.png"
];

// Install SW and cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate SW and clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if(key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch request: respond with cached version or network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match("./index.html"))
  );
});
