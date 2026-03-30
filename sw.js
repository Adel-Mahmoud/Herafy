const CACHE_NAME = "herafy-v1";

const urlsToCache = [
  "./",
  "index.html",
  "offline.html",
  "logo.png",
  "bg.png",
  "hero-image.jpeg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
