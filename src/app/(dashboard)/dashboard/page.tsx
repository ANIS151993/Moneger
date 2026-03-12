"use client";

import { useEffect } from "react";

import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { DebtOwedChart } from "@/components/charts/DebtOwedChart";
import { IncomeExpenseLineChart } from "@/components/charts/IncomeExpenseLineChart";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { RemindersPanel } from "@/components/dashboard/RemindersPanel";
import { LoadingCard } from "@/components/shared/LoadingCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { pushReminderNotifications } from "@/lib/services/notification-service";
import { formatCurrency } from "@/lib/utils/finance";

export default function DashboardPage() {
  const { user } = useAuth();
  const { snapshot, displayCurrency, loading, settings } = useDashboardData(user?.uid);

  useEffect(() => {
    if (settings?.notificationsEnabled && snapshot?.reminders.length) {
      pushReminderNotifications(snapshot.reminders);
    }
  }, [settings?.notificationsEnabled, snapshot?.reminders]);

  if (!user || loading || !snapshot) {
    return <LoadingCard title="Loading dashboard aggregates and cached exchange rates..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Your local-first finance command center"
        description="Track the full money picture across income, expenses, debt, money owed, and bank accounts with mixed-currency totals."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Total income"
          value={formatCurrency(snapshot.totalIncome, displayCurrency)}
          detail={`Across all income records in ${displayCurrency}`}
        />
        <StatCard
          label="Total expenses"
          value={formatCurrency(snapshot.totalExpenses, displayCurrency)}
          detail="Mixed-currency expenses converted using cached rates"
        />
        <StatCard
          label="Total debt"
          value={formatCurrency(snapshot.totalDebt, displayCurrency)}
          detail="Open and partial debt positions"
        />
        <StatCard
          label="Money owed"
          value={formatCurrency(snapshot.totalOwed, displayCurrency)}
          detail="Amounts expected back to you"
        />
        <StatCard
          label="Net balance"
          value={formatCurrency(snapshot.netBalance, displayCurrency)}
          detail="Income minus expenses and liabilities plus owed funds"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <IncomeExpenseLineChart points={snapshot.monthlyTrends} />
        <RemindersPanel reminders={snapshot.reminders} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <CategoryBreakdownChart items={snapshot.categoryTotals} />
        <DebtOwedChart debt={snapshot.debtVsOwed.debt} owed={snapshot.debtVsOwed.owed} />
      </section>

      <RecentActivityList items={snapshot.recentActivity} displayCurrency={displayCurrency} />
    </div>
  );
}
