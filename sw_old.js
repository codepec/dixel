const CACHE = "my-site-cache-v4";

// Offline fallback page and other resources to cache
const offlineFallbackPage = "./pages/offline.html";
const assetsToCache = [
  offlineFallbackPage,
  "./",
  "./index.html",
  "./css/style.css",
  "./img/icon_ki.jpg",
  "./js/darkmode.js",
  "./js/main.js",
  "./js/script.js",
  "./js/settings_lang_index.js",
  "./js/settings_lang_instructions.js",
  "./pages/offline.html",
  "./pages/instructions.html",
  "./pages/instructions.css",
  "./favicon.ico",
];

// Listen for the 'message' event to allow skipping waiting
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Install event to cache the offline page and other assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Fetch event to serve cached assets
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          // Cache the new resource for future use
          return caches.open(CACHE).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
      .catch(() => {
        // If both cache and network fail, show the offline page
        if (event.request.mode === "navigate") {
          return caches.match(offlineFallbackPage);
        }
      })
  );
});
