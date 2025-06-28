self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('sennin-browser-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        '/public/style.css',
        '/scripts/main.js',
        '/public/manifest.json',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
