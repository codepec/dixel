const cacheName = "cache_v14";
const filesToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/style.css",
  "./img/icon_blue.png",
  "./img/icon_trans.png",
  "./js/darkmode.js",
  "./js/main.js",
  "./js/script.js",
  "./js/lang_index.js",
  "./js/lang_instructions.js",
  "./js/lang_nav.js",
  "./js/lang_settings.js",
  "./js/offline.js",
  "./pages/offline.html",
  "./pages/instructions.html",
  "./pages/instructions.css",
  "./pages/settings.html",
  "./pages/settings.css",
  "./favicon.ico",
];

let deferredPrompt;

self.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
});

/*
console.log("[ServiceWorker] - Files to be cached:");

filesToCache.forEach((file) => {
  console.log(file);
});
*/
self.addEventListener("install", (e) => {
  //console.log("[ServiceWorker] - Install event fired");
  e.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(cacheName);
        //console.log("[ServiceWorker] - Caching app shell");
        await cache.addAll(filesToCache);
        //console.log("[ServiceWorker] - All files cached successfully:");
        /*filesToCache.forEach((file) =>
          console.log(`[ServiceWorker] - Cached file: ${file}`)
        );*/
        self.skipWaiting(); // Forces the waiting service worker to become the active service worker
      } catch (error) {
        console.error("[ServiceWorker] - Failed to cache", error);
      }
    })()
  );
});

self.addEventListener("activate", (e) => {
  //console.log("[ServiceWorker] - Activate event fired");
  e.waitUntil(
    (async () => {
      try {
        const keyList = await caches.keys();
        await Promise.all(
          keyList.map((key) => {
            if (key !== cacheName) {
              //console.log("[ServiceWorker] - Removing old cache", key);
              return caches.delete(key);
            }
          })
        );
        await self.clients.claim();
        //console.log("[ServiceWorker] - Activated and old caches removed");
      } catch (error) {
        console.error("[ServiceWorker] - Activation failed", error);
      }
    })()
  );
});

self.addEventListener("fetch", (e) => {
  //console.log("[ServiceWorker] - Fetch event fired for ", e.request.url);
  e.respondWith(
    (async () => {
      const response = await caches.match(e.request);
      if (response) {
        //console.log("[ServiceWorker] - Returning cached response for ", e.request.url);
        return response;
      }
      //console.log("[ServiceWorker] - Fetching from network ", e.request.url);
      return fetch(e.request);
    })()
  );
});
