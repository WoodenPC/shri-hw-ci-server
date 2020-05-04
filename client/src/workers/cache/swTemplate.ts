// @ts-ignore
if (typeof importScripts === 'function') {
  // @ts-ignore
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js'
  );
  console.log('Workbox loaded');
  workbox.core.skipWaiting();

  workbox.precaching.precacheAndRoute((self as any).__WB_MANIFEST);

  workbox.routing.registerRoute(
    new RegExp('yastatic.net/s3/home/fonts/(.*)'),
    new workbox.strategies.CacheFirst({
      cacheName: 'ci-font-cache-v1',
      plugins: [],
    })
  );
} else {
  console.log('Workbox could not be loaded. No offline support');
}

export {};
