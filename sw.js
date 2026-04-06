const CACHE_NAME = "herafy-v3";

const urlsToCache = [
  "/",
  "/Herafy/index.html",
  "/Herafy/offline.html",
  "/Herafy/logo.png",
  "/Herafy/bg.png",
  "/Herafy/hero-image.jpeg"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {

      return fetch(event.request).then(networkRes => {

        if (!networkRes || networkRes.status !== 200 || networkRes.type !== "basic") {
          return networkRes;
        }

        const clone = networkRes.clone();

        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clone);
        });

        return networkRes;

      }).catch(() => cached);
    })
  );
});

self.addEventListener("message", event => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});