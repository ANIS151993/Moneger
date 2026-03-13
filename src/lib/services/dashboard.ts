import type {
  ActivityItem,
  BankRecord,
  CurrencyCode,
  CurrencyRateMap,
  DashboardSnapshot,
  DebtRecord,
  ExpenseRecord,
  IncomeRecord,
  OwedRecord
} from "@/types/finance";
import { convertFromCoreCurrency, normalizeToCoreCurrency, roundCurrency } from "@/lib/utils/finance";
import { formatMonthLabel } from "@/lib/utils/date";
import { buildReminders } from "@/lib/services/reminders";

function sumRecordsInUsd(items: Array<{ amount: number; currency: CurrencyCode }>, rates: CurrencyRateMap) {
  return roundCurrency(
    items.reduce((total, item) => total + normalizeToCoreCurrency(item.amount, item.currency, rates), 0)
  );
}

function buildActivity(
  incomes: IncomeRecord[],
  expenses: ExpenseRecord[],
  debts: DebtRecord[],
  owed: OwedRecord[]
) {
  const items: ActivityItem[] = [
    ...incomes.map((item) => ({
      id: item.id,
      title: item.source,
      description: item.category,
      amount: item.amount,
      currency: item.currency,
      date: item.date,
      tone: "income" as const
    })),
    ...expenses.map((item) => ({
      id: item.id,
      title: item.source,
      description: item.category,
      amount: item.amount,
      currency: item.currency,
      date: item.date,
      tone: "expense" as const
    })),
    ...debts.map((item) => ({
      id: item.id,
      title: item.creditorName,
      description: item.status,
      amount: item.amount,
      currency: item.currency,
      date: item.settlementDate,
      tone: "debt" as const
    })),
    ...owed.map((item) => ({
      id: item.id,
      title: item.debtorName,
      description: item.status,
      amount: item.amount,
      currency: item.currency,
      date: item.settlementDate,
      tone: "owed" as const
    }))
  ];

  return items.sort((left, right) => new Date(right.date).getTime() - new Date(left.date).getTime());
}

function buildMonthlyTrends(
  incomes: IncomeRecord[],
  expenses: ExpenseRecord[],
  currency: CurrencyCode,
  rates: CurrencyRateMap
) {
  const buckets = new Map<string, { incomeUsd: number; expensesUsd: number }>();

  for (const item of incomes) {
    const key = formatMonthLabel(item.date);
    const current = buckets.get(key) || { incomeUsd: 0, expensesUsd: 0 };
    current.incomeUsd += normalizeToCoreCurrency(item.amount, item.currency, rates);
    buckets.set(key, current);
  }

  for (const item of expenses) {
    const key = formatMonthLabel(item.date);
    const current = buckets.get(key) || { incomeUsd: 0, expensesUsd: 0 };
    current.expensesUsd += normalizeToCoreCurrency(item.amount, item.currency, rates);
    buckets.set(key, current);
  }

  return Array.from(buckets.entries()).map(([label, values]) => ({
    label,
    income: convertFromCoreCurrency(values.incomeUsd, currency, rates),
    expenses: convertFromCoreCurrency(values.expensesUsd, currency, rates)
  }));
}

function buildCategoryTotals(
  expenses: ExpenseRecord[],
  currency: CurrencyCode,
  rates: CurrencyRateMap
) {
  const totals = new Map<string, number>();

  for (const item of expenses) {
    const current = totals.get(item.category) || 0;
    totals.set(item.category, current + normalizeToCoreCurrency(item.amount, item.currency, rates));
  }

  return Array.from(totals.entries())
    .map(([category, amount]) => ({
      category,
      amount: convertFromCoreCurrency(amount, currency, rates)
    }))
    .sort((left, right) => right.amount - left.amount);
}

export function createDashboardSnapshot(params: {
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  debts: DebtRecord[];
  owed: OwedRecord[];
  banks: BankRecord[];
  baseCurrency: CurrencyCode;
  rates: CurrencyRateMap;
}): DashboardSnapshot {
  const { incomes, expenses, debts, owed, baseCurrency, rates } = params;
  const totalIncome = sumRecordsInUsd(incomes, rates);
  const totalExpenses = sumRecordsInUsd(expenses, rates);
  const totalDebt = sumRecordsInUsd(debts, rates);
  const totalOwed = sumRecordsInUsd(owed, rates);

  return {
    totalIncome,
    totalExpenses,
    totalDebt,
    totalOwed,
    netBalance: roundCurrency(totalIncome - totalExpenses - totalDebt + totalOwed),
    recentActivity: buildActivity(incomes, expenses, debts, owed).slice(0, 8),
    monthlyTrends: buildMonthlyTrends(incomes, expenses, baseCurrency, rates),
    categoryTotals: buildCategoryTotals(expenses, baseCurrency, rates),
    reminders: buildReminders(debts, owed),
    debtVsOwed: {
      debt: convertFromCoreCurrency(totalDebt, baseCurrency, rates),
      owed: convertFromCoreCurrency(totalOwed, baseCurrency, rates)
    }
  };
}
