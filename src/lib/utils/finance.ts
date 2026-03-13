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

  if (from === "USD" && to === "BDT") {
    return amount * rates.usdToBdt;
  }

  if (from === "BDT" && to === "USD") {
    return amount * rates.bdtToUsd;
  }

  return amount;
}

export function roundCurrency(amount: number) {
  return Number(amount.toFixed(2));
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
