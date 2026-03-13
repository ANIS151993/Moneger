const CACHE_NAME = "moneger-offline-v1";
const OFFLINE_URL = "/offline.html";
const PRECACHE_URLS = [OFFLINE_URL, "/icons/icon.svg", "/icons/maskable-icon.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).catch(() => undefined)
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));

      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable().catch(() => undefined);
      }

      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode !== "navigate") {
    return;
  }

  event.respondWith(
    (async () => {
      const preloadResponse = await event.preloadResponse;

      if (preloadResponse) {
        return preloadResponse;
      }

      try {
        return await fetch(event.request);
      } catch {
        return (await caches.match(OFFLINE_URL)) || Response.error();
      }
    })()
  );
});
