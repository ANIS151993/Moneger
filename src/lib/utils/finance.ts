import type { CurrencyCode, CurrencyRateMap } from "@/types/finance";
import { getLanguageDefinition } from "@/lib/i18n/config";
import { getRuntimeLanguage } from "@/lib/i18n/messages";

export const CORE_CURRENCY: CurrencyCode = "USD";

export function formatCurrency(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat(getLanguageDefinition(getRuntimeLanguage()).locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(amount);
}

export function convertAmount(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: CurrencyRateMap
) {
  if (from === to) {
    return amount;
  }

  const fromRate = rates.rates[from];
  const toRate = rates.rates[to];

  if (!fromRate || !toRate) {
    return amount;
  }

  const amountInUsd = from === CORE_CURRENCY ? amount : amount / fromRate;

  if (to === CORE_CURRENCY) {
    return amountInUsd;
  }

  return amountInUsd * toRate;
}

export function roundCurrency(amount: number) {
  return Number(amount.toFixed(2));
}

export function roundRate(amount: number) {
  return Number(amount.toFixed(6));
}

export function normalizeToCoreCurrency(
  amount: number,
  from: CurrencyCode,
  rates: CurrencyRateMap
) {
  return roundCurrency(convertAmount(amount, from, CORE_CURRENCY, rates));
}

export function convertFromCoreCurrency(
  amount: number,
  to: CurrencyCode,
  rates: CurrencyRateMap
) {
  return roundCurrency(convertAmount(amount, CORE_CURRENCY, to, rates));
}

export function getCurrencyComparisonRate(
  baseCurrency: CurrencyCode,
  comparisonCurrency: CurrencyCode,
  rates: CurrencyRateMap
) {
  return roundRate(convertAmount(1, baseCurrency, comparisonCurrency, rates));
}

export function formatExchangeRate(rate: number) {
  return new Intl.NumberFormat(getLanguageDefinition(getRuntimeLanguage()).locale, {
    minimumFractionDigits: rate >= 100 ? 2 : rate >= 1 ? 3 : 4,
    maximumFractionDigits: rate >= 100 ? 4 : 6
  }).format(rate);
}
