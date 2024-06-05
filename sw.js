// This is the "Offline page" service worker

importScripts(
  "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);

const CACHE = "my-site-cache-v3";

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
  "./js/settings_lang_index",
  "./js/settings_lang_instructions",
  "./pages/offline.html",
  "./pages/instructions.html",
  "./pages/instructions.css",
  "./favicon.ico",
];

// Enable navigation preload if supported
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

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

// Fetch event to serve the offline page for navigation requests
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          // Try to use the preloaded response, if it's there
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) {
            return preloadResponse;
          }

          // Try the network first
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          // Network request failed, serve offline page from cache
          const cache = await caches.open(CACHE);
          const cachedResponse = await cache.match(offlineFallbackPage);
          return cachedResponse;
        }
      })()
    );
  }
});
