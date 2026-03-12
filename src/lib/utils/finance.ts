import type { CurrencyCode, CurrencyRateMap } from "@/types/finance";

export function formatCurrency(amount: number, currency: CurrencyCode) {
  return new Intl.NumberFormat("en-US", {
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
