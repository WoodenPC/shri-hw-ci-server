const STATIC_CACHE_NAME = 'ci-static-cache-v1';
const RUNTIME_CACHE_NAME = 'ci-cache-runtime';

function onInstall() {
  // непонятно как нормально получить список файлов для прекэша
  return caches.open(STATIC_CACHE_NAME).then((cache) => cache.addAll([]));
}

self.addEventListener('install', (event: any): void => {
  event.waitUntil(onInstall().then(() => (self as any).skipWaiting()));
});

function onActivate() {
  return caches.keys().then((cacheKeys) => {
    const oldCache = cacheKeys.filter((key) => key.indexOf('v1') !== 0);
    const deletePromises = oldCache.map((oldKey) => caches.delete(oldKey));
    return Promise.all(deletePromises);
  });
}

self.addEventListener('activate', (event: any): void => {
  event.waitUntil(onActivate().then(() => (self as any).clients.claim()));
});

function addToCache(cacheKey: any, request: any, response: any) {
  if (response.ok) {
    var copy = response.clone();
    caches.open(cacheKey).then((cache) => {
      cache.put(request, copy);
    });
  }
  return response;
}

function fetchFromCache(event: any) {
  return caches.match(event.request).then((response) => {
    if (!response) {
      throw Error(`${event.request.url} not found in cache`);
    }
    return response;
  });
}

function onFetch(event: any) {
  const { request } = event;
  const { url } = request;
  if (
    /.*yastatic\.net\/s3\/home\/fonts.*/.test(url) ||
    /\.(js|html|css|png|svg)$/.test(url)
  ) {
    // CACHE_FIRST
    event.respondWith(
      fetchFromCache(event).catch(() => {
        return fetch(request).then((response) =>
          addToCache(RUNTIME_CACHE_NAME, request, response)
        );
      })
    );
  }
}

self.addEventListener('fetch', (event: any): void => {
  onFetch(event);
});
