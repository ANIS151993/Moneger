"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { getUserDatabase } from "@/lib/db/moneger-db";
import { createDashboardSnapshot } from "@/lib/services/dashboard";
import { useCurrencyEngine } from "@/lib/hooks/use-currency-engine";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import type { CurrencyCode } from "@/types/finance";

export function useDashboardData(userId?: string) {
  const settings = useUserSettings(userId);
  const baseCurrency: CurrencyCode = settings?.baseCurrency || "USD";
  const comparisonCurrency: "" | CurrencyCode = settings?.comparisonCurrency || "";
  const { rates, history, loading: ratesLoading } = useCurrencyEngine(userId);
  const db = userId ? getUserDatabase(userId) : null;

  const dataset = useLiveQuery(
    async () => {
      if (!db) {
        return null;
      }

      const [incomes, expenses, debts, owed, banks] = await Promise.all([
        db.incomes.toArray(),
        db.expenses.toArray(),
        db.debts.toArray(),
        db.owed.toArray(),
        db.banks.toArray()
      ]);

      return { incomes, expenses, debts, owed, banks };
    },
    [db],
    null
  );

  const snapshot = dataset
    ? createDashboardSnapshot({
        ...dataset,
        baseCurrency,
        rates
      })
    : null;

  return {
    settings,
    baseCurrency,
    comparisonCurrency,
    rates,
    rateHistory: history,
    ratesLoading,
    dataset,
    snapshot,
    loading: !dataset || ratesLoading
  };
}
