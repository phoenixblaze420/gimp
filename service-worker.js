importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log(`✅ Workbox is loaded`);

  // Precache core assets
  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  // Cache static files - CSS, JS, Fonts
  workbox.routing.registerRoute(
    ({request}) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'font',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'static-resources',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );

  // Cache images (limit size)
  workbox.routing.registerRoute(
    ({request}) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 75,
          maxAgeSeconds: 15 * 24 * 60 * 60, // 15 Days
        }),
      ],
    })
  );

  // Cache API responses (AI tools, data, cannabis store data)
  workbox.routing.registerRoute(
    ({url}) => url.pathname.startsWith('/api/'),
    new workbox.strategies.NetworkFirst({
      cacheName: 'api-cache',
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 5 * 60, // 5 minutes
        }),
      ],
    })
  );

  // HTML pages (SPA support)
  workbox.routing.registerRoute(
    ({request}) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'pages',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        }),
      ],
    })
  );

  // Fallback offline page
  const FALLBACK_HTML = '/offline.html';
  workbox.precaching.precacheAndRoute([{ url: FALLBACK_HTML, revision: 'v1' }]);

  self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => caches.match(FALLBACK_HTML))
      );
    }
  });

} else {
  console.log(`❌ Workbox didn't load`);
}
