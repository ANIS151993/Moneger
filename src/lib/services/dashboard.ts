import { format } from "date-fns";

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
import { convertAmount, roundCurrency } from "@/lib/utils/finance";
import { buildReminders } from "@/lib/services/reminders";

function sumRecords(
  items: Array<{ amount: number; currency: CurrencyCode }>,
  currency: CurrencyCode,
  rates: CurrencyRateMap
) {
  return roundCurrency(
    items.reduce((total, item) => total + convertAmount(item.amount, item.currency, currency, rates), 0)
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
  const buckets = new Map<string, { income: number; expenses: number }>();

  for (const item of incomes) {
    const key = format(new Date(item.date), "MMM");
    const current = buckets.get(key) || { income: 0, expenses: 0 };
    current.income += convertAmount(item.amount, item.currency, currency, rates);
    buckets.set(key, current);
  }

  for (const item of expenses) {
    const key = format(new Date(item.date), "MMM");
    const current = buckets.get(key) || { income: 0, expenses: 0 };
    current.expenses += convertAmount(item.amount, item.currency, currency, rates);
    buckets.set(key, current);
  }

  return Array.from(buckets.entries()).map(([label, values]) => ({
    label,
    income: roundCurrency(values.income),
    expenses: roundCurrency(values.expenses)
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
    totals.set(
      item.category,
      current + convertAmount(item.amount, item.currency, currency, rates)
    );
  }

  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount: roundCurrency(amount) }))
    .sort((left, right) => right.amount - left.amount);
}

export function createDashboardSnapshot(params: {
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  debts: DebtRecord[];
  owed: OwedRecord[];
  banks: BankRecord[];
  displayCurrency: CurrencyCode;
  rates: CurrencyRateMap;
}): DashboardSnapshot {
  const { incomes, expenses, debts, owed, displayCurrency, rates } = params;
  const totalIncome = sumRecords(incomes, displayCurrency, rates);
  const totalExpenses = sumRecords(expenses, displayCurrency, rates);
  const totalDebt = sumRecords(debts, displayCurrency, rates);
  const totalOwed = sumRecords(owed, displayCurrency, rates);

  return {
    totalIncome,
    totalExpenses,
    totalDebt,
    totalOwed,
    netBalance: roundCurrency(totalIncome - totalExpenses - totalDebt + totalOwed),
    recentActivity: buildActivity(incomes, expenses, debts, owed).slice(0, 8),
    monthlyTrends: buildMonthlyTrends(incomes, expenses, displayCurrency, rates),
    categoryTotals: buildCategoryTotals(expenses, displayCurrency, rates),
    reminders: buildReminders(debts, owed),
    debtVsOwed: {
      debt: totalDebt,
      owed: totalOwed
    }
  };
}
