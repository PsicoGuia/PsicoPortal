importScripts('workbox-sw.prod.v2.1.2.js');

const workboxSW = new self.WorkboxSW();
workboxSW.precache([]);

workboxSW.router.registerRoute(
  /\.(?:png|gif|jpg)$/, 
  workboxSW.strategies.cacheFirst({
    cacheName: 'images',
    cacheExpiration: {
      maxEntries: 50,
      maxAgeSeconds: 7 * 24 * 60 * 60,
    },
    cacheableResponse: {statuses: [0, 200]},
  })
); 

workboxSW.router.registerRoute(
  '/assets/(.*)', 
  workboxSW.strategies.cacheFirst({
    cacheName: 'assets',
  })
);