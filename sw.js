const CACHE_NAME = "herafy-v3";

const urlsToCache = [
  "/",
  "./index.html",
  "./offline.html",
  "./logo.png",
  "./bg.png",
  "./hero-image.jpeg"
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
  event.respondWith(
    caches.match(event.request).then(cached => {
      const fetchPromise = fetch(event.request).then(networkRes => {
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkRes.clone());
        });
        return networkRes;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});

self.addEventListener("message", event => {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});