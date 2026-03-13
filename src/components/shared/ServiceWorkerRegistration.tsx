"use client";

import { useEffect } from "react";

const MONEGER_CACHE_PREFIX = "moneger-shell";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    async function cleanupStaleServiceWorkers() {
      const registrations = await navigator.serviceWorker.getRegistrations();

      await Promise.all(
        registrations
          .filter((registration) => registration.scope.includes(window.location.origin))
          .map((registration) => registration.unregister())
      );

      if ("caches" in window) {
        const cacheKeys = await caches.keys();

        await Promise.all(
          cacheKeys
            .filter((key) => key.startsWith(MONEGER_CACHE_PREFIX))
            .map((key) => caches.delete(key))
        );
      }
    }

    void cleanupStaleServiceWorkers();
  }, []);

  return null;
}
