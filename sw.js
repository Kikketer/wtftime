const CACHE_NAME = 'wtftime-v1';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/dist/bundle.js',
  '/dist/bundle.css',
  '/assets/favicon.ico',
  '/assets/favicon-16x16.png',
  '/assets/favicon-32x32.png',
  '/assets/wtftime.svg',
  '/manifest.json'
];

function isAssetRequest(request) {
  return ASSETS_TO_CACHE.some(asset => request.url.includes(asset));
}

function isCacheValid(cachedResponse) {
  if (!cachedResponse) return false;
  
  const cachedTime = cachedResponse.headers.get('sw-cache-timestamp');
  if (!cachedTime) return false;
  
  const age = Date.now() - parseInt(cachedTime);
  return age < CACHE_TTL;
}

async function cacheWithTimestamp(request, response) {
  const cache = await caches.open(CACHE_NAME);
  const responseToCache = response.clone();
  
  // Create new response with timestamp
  const headers = new Headers(responseToCache.headers);
  headers.append('sw-cache-timestamp', Date.now().toString());
  
  const timestampedResponse = new Response(await responseToCache.blob(), {
    status: responseToCache.status,
    statusText: responseToCache.statusText,
    headers: headers
  });
  
  await cache.put(request, timestampedResponse);
  return response;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.all(
          ASSETS_TO_CACHE.map(async (url) => {
            const request = new Request(url);
            const response = await fetch(request);
            return cacheWithTimestamp(request, response);
          })
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (!isAssetRequest(event.request)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(async (cachedResponse) => {
      // If we have a valid cached response, use it
      if (isCacheValid(cachedResponse)) {
        // Revalidate in the background
        event.waitUntil(
          fetch(event.request)
            .then(response => cacheWithTimestamp(event.request, response))
            .catch(() => {/* ignore */})
        );
        return cachedResponse;
      }

      // If cache is invalid or missing, fetch new response
      try {
        const response = await fetch(event.request);
        event.waitUntil(cacheWithTimestamp(event.request, response.clone()));
        return response;
      } catch (error) {
        // If offline and we have any cached response, use it
        return cachedResponse || new Response('Offline');
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
