if (typeof importScripts === 'function') {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/5.1.3/workbox-sw.js'
  );
  console.log('Workbox loaded');
  workbox.core.skipWaiting();
  workbox.precaching.addRoute((self as any).__WB_MANIFEST);

  // картинки
  workbox.routing.registerRoute(
    /\.(png|svg|jpeg|ico)$/,
    new workbox.strategies.CacheFirst({
      cacheName: 'ci-images-cache-v1',
    })
  );

  // шрифты
  workbox.routing.registerRoute(
    /.*yastatic\.net\/s3\/home\/fonts.*/,
    new workbox.strategies.CacheFirst({
      cacheName: 'ci-font-cache-v1',
    })
  );

  // статика
  workbox.routing.registerRoute(
    /\.(js|html|css)$/,
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'ci-static-cache-v1',
    })
  );
} else {
  console.log('Workbox could not be loaded. No offline support');
}
