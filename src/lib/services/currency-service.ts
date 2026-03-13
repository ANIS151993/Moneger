"use client";

import { supportedCurrencies } from "@/lib/constants/options";
import {
  exchangeRateRepository,
  exchangeRateSnapshotRepository
} from "@/lib/repositories/finance-repositories";
import type {
  CurrencyCode,
  CurrencyRateMap,
  ExchangeRateSnapshotRecord
} from "@/types/finance";
import { convertAmount, CORE_CURRENCY, roundCurrency, roundRate } from "@/lib/utils/finance";

const FALLBACK_USD_RATES: Record<CurrencyCode, number> = {
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
};

function toRateMap(
  rawRates: Partial<Record<CurrencyCode, number>> | undefined,
  updatedAt: string | null
): CurrencyRateMap {
  const rates = Object.fromEntries(
    supportedCurrencies.map((currency) => [
      currency,
      roundRate(rawRates?.[currency] || FALLBACK_USD_RATES[currency])
    ])
  ) as Record<CurrencyCode, number>;

  rates.USD = 1;

  return {
    base: CORE_CURRENCY,
    rates,
    updatedAt
  };
}

function snapshotToRateMap(snapshot?: ExchangeRateSnapshotRecord | null): CurrencyRateMap {
  return toRateMap(snapshot?.rates, snapshot?.fetchedAt || null);
}

export async function getCachedRates(userId: string): Promise<CurrencyRateMap> {
  const latestSnapshot = await exchangeRateSnapshotRepository.getLatest(userId);

  if (latestSnapshot) {
    return snapshotToRateMap(latestSnapshot);
  }

  const legacyBdtRate = await exchangeRateRepository.getRate(userId, "USD_BDT");

  return toRateMap(
    legacyBdtRate ? { BDT: legacyBdtRate.rate } : undefined,
    legacyBdtRate?.fetchedAt || legacyBdtRate?.updatedAt || null
  );
}

export async function getRecentRateSnapshots(userId: string, limit = 12) {
  const snapshots = await exchangeRateSnapshotRepository.listRecent(userId, limit);

  return snapshots.reverse();
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

    const providerRates = payload.rates;

    if (!providerRates) {
      throw new Error("Rate payload missing from provider response");
    }

    const nextRates = toRateMap(
      Object.fromEntries(
        supportedCurrencies.map((currency) => {
          if (currency === CORE_CURRENCY) {
            return [currency, 1];
          }

          const rate = providerRates[currency];

          if (!rate) {
            throw new Error(`${currency} rate missing from provider response`);
          }

          return [currency, rate];
        })
      ) as Partial<Record<CurrencyCode, number>>,
      payload.time_last_update_utc || new Date().toISOString()
    );

    const fetchedAt = payload.time_last_update_utc || new Date().toISOString();

    await Promise.all(
      supportedCurrencies
        .filter((currency) => currency !== CORE_CURRENCY)
        .map((currency) =>
          exchangeRateRepository.saveRate(userId, {
            pair: `${CORE_CURRENCY}_${currency}`,
            base: CORE_CURRENCY,
            quote: currency,
            rate: nextRates.rates[currency],
            fetchedAt,
            source: "open.er-api.com"
          })
        )
    );

    await exchangeRateSnapshotRepository.saveSnapshot(userId, {
      base: CORE_CURRENCY,
      fetchedAt,
      source: "open.er-api.com",
      rates: nextRates.rates
    });

    return nextRates;
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
  return roundCurrency(convertAmount(amount, from, to, rates));
}
