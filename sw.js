const cacheName = "cache_v3";
const filesToCache = [
  "/",
  "index.html",
  "/manifest.json",
  "./css/style.css",
  "./img/icon_ki.JPG",
  "./js/darkmode.js",
  "./js/main.js",
  "./js/script.js",
  "./js/settings_lang_index.js",
  "./js/settings_lang_instructions.js",
  "./pages/offline.html",
  "./pages/instructions.html",
  "./pages/instructions.css",
  "favicon.ico",
];

self.addEventListener("install", (e) => {
  console.log("[ServiceWorker] - Install event fired");
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        console.log("[ServiceWorker] - Caching app shell");
        await cache.addAll(filesToCache);
        console.log("[ServiceWorker] - All files cached successfully:");
        filesToCache.forEach((file) =>
          console.log(`[ServiceWorker] - Cached file: ${file}`)
        );
        self.skipWaiting(); // Forces the waiting service worker to become the active service worker
      } catch (error) {
        console.error("[ServiceWorker] - Failed to cache", error);
      }
    })()
  );
});

self.addEventListener("activate", (e) => {
  console.log("[ServiceWorker] - Activate event fired");
  e.waitUntil(
    (async () => {
      try {
        const keyList = await caches.keys();
        await Promise.all(
          keyList.map((key) => {
            if (key !== cacheName) {
              console.log("[ServiceWorker] - Removing old cache", key);
              return caches.delete(key);
            }
          })
        );
        await self.clients.claim();
        console.log("[ServiceWorker] - Activated and old caches removed");
      } catch (error) {
        console.error("[ServiceWorker] - Activation failed", error);
      }
    })()
  );
});

self.addEventListener("fetch", (e) => {
  console.log("[ServiceWorker] - Fetch event fired for ", e.request.url);
  e.respondWith(
    (async () => {
      const response = await caches.match(e.request);
      if (response) {
        console.log(
          "[ServiceWorker] - Returning cached response for ",
          e.request.url
        );
        return response;
      }
      console.log("[ServiceWorker] - Fetching from network ", e.request.url);
      return fetch(e.request);
    })()
  );
});
