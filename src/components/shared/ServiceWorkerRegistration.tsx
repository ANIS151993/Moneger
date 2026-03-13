"use client";

import { useEffect } from "react";

const ACTIVE_CACHE_PREFIX = "moneger-offline";
const LEGACY_CACHE_PREFIX = "moneger-shell";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }

    let cancelled = false;

    async function registerServiceWorker() {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        return;
      }

      if (!("caches" in window) || cancelled) {
        return;
      }

      const cacheKeys = await caches.keys();

      await Promise.all(
        cacheKeys
          .filter(
            (key) =>
              key.startsWith(LEGACY_CACHE_PREFIX) ||
              (key.startsWith("moneger-") && !key.startsWith(ACTIVE_CACHE_PREFIX))
          )
          .map((key) => caches.delete(key))
      );
    }

    if (document.readyState === "complete") {
      void registerServiceWorker();
    } else {
      const handleLoad = () => {
        void registerServiceWorker();
      };

      window.addEventListener("load", handleLoad, { once: true });

      return () => {
        cancelled = true;
        window.removeEventListener("load", handleLoad);
      };
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
