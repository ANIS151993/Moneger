"use client";

import { exchangeRateRepository } from "@/lib/repositories/finance-repositories";
import type { CurrencyCode, CurrencyRateMap } from "@/types/finance";
import { roundCurrency } from "@/lib/utils/finance";

const FALLBACK_USD_TO_BDT = 121.5;

function toRateMap(rate: number, updatedAt: string | null): CurrencyRateMap {
  return {
    usdToBdt: roundCurrency(rate),
    bdtToUsd: roundCurrency(1 / rate),
    updatedAt
  };
}

export async function getCachedRates(userId: string): Promise<CurrencyRateMap> {
  const cached = await exchangeRateRepository.getRate(userId, "USD_BDT");
  return toRateMap(cached?.rate || FALLBACK_USD_TO_BDT, cached?.updatedAt || null);
}

export async function refreshRates(userId: string): Promise<CurrencyRateMap> {
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to fetch exchange rates");
    }

    const payload = (await response.json()) as {
      rates?: Record<string, number>;
      time_last_update_utc?: string;
    };

    const usdToBdt = payload.rates?.BDT;
    if (!usdToBdt) {
      throw new Error("BDT rate missing from provider response");
    }

    const record = await exchangeRateRepository.saveRate(userId, {
      pair: "USD_BDT",
      base: "USD",
      quote: "BDT",
      rate: usdToBdt,
      fetchedAt: payload.time_last_update_utc || new Date().toISOString(),
      source: "open.er-api.com"
    });

    return toRateMap(record.rate, record.updatedAt);
  } catch {
    return getCachedRates(userId);
  }
}

export async function convertWithCache(
  userId: string,
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
) {
  const rates = await getCachedRates(userId);

  if (from === to) {
    return amount;
  }

  if (from === "USD" && to === "BDT") {
    return roundCurrency(amount * rates.usdToBdt);
  }

  if (from === "BDT" && to === "USD") {
    return roundCurrency(amount * rates.bdtToUsd);
  }

  return amount;
}
