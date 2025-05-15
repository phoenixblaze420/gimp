module.exports = {
  globDirectory: 'public/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,webp,woff2,json}'
  ],
  swDest: 'public/service-worker.js',
  swSrc: 'src/sw-template.js',
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5 MB
  cleanupOutdatedCaches: true,
  runtimeCaching: [
    {
      urlPattern: /\/api\/.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 300
        }
      }
    }
  ]
};
