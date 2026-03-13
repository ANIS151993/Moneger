"use client";

import { useEffect, useState } from "react";

import {
  getCachedRates,
  getRecentRateSnapshots,
  refreshRates
} from "@/lib/services/currency-service";
import type { CurrencyRateMap, ExchangeRateSnapshotRecord } from "@/types/finance";

const initialRates: CurrencyRateMap = {
  base: "USD",
  rates: {
    USD: 1,
    BDT: 121.5,
    INR: 83.15,
    PKR: 278.4,
    SAR: 3.75,
    RUB: 91.8,
    KGS: 89.1,
    EUR: 0.92,
    NPR: 133.04,
    CAD: 1.35,
    AUD: 1.53
  },
  updatedAt: null
};

const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function useCurrencyEngine(userId?: string) {
  const [rates, setRates] = useState<CurrencyRateMap>(initialRates);
  const [history, setHistory] = useState<ExchangeRateSnapshotRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setRates(initialRates);
      setHistory([]);
      setLoading(false);
      return;
    }

    const currentUserId = userId;
    let cancelled = false;

    async function hydrateFromCache() {
      const [cached, cachedHistory] = await Promise.all([
        getCachedRates(currentUserId),
        getRecentRateSnapshots(currentUserId)
      ]);

      if (cancelled) {
        return;
      }

      setRates(cached);
      setHistory(cachedHistory);
      setLoading(false);
    }

    async function refreshInBackground() {
      const fresh = await refreshRates(currentUserId);
      const freshHistory = await getRecentRateSnapshots(currentUserId);

      if (cancelled) {
        return;
      }

      setRates(fresh);
      setHistory(freshHistory);
      setLoading(false);
    }

    void hydrateFromCache();
    void refreshInBackground();

    const intervalId = window.setInterval(() => {
      void refreshInBackground();
    }, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [userId]);

  return { rates, history, loading };
}
