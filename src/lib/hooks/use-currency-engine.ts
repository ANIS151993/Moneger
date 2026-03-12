"use client";

import { useEffect, useState } from "react";

import { getCachedRates, refreshRates } from "@/lib/services/currency-service";
import type { CurrencyRateMap } from "@/types/finance";

const initialRates: CurrencyRateMap = {
  usdToBdt: 121.5,
  bdtToUsd: Number((1 / 121.5).toFixed(4)),
  updatedAt: null
};

export function useCurrencyEngine(userId?: string) {
  const [rates, setRates] = useState<CurrencyRateMap>(initialRates);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const currentUserId = userId;
    let cancelled = false;

    async function load() {
      setLoading(true);
      const cached = await getCachedRates(currentUserId);
      if (!cancelled) {
        setRates(cached);
      }

      const fresh = await refreshRates(currentUserId);
      if (!cancelled) {
        setRates(fresh);
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { rates, loading };
}
