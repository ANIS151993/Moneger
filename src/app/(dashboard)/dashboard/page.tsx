"use client";

import { useEffect } from "react";

import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { DebtOwedChart } from "@/components/charts/DebtOwedChart";
import { IncomeExpenseLineChart } from "@/components/charts/IncomeExpenseLineChart";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { RemindersPanel } from "@/components/dashboard/RemindersPanel";
import { useI18n } from "@/components/providers/LanguageProvider";
import { LoadingCard } from "@/components/shared/LoadingCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { pushReminderNotifications } from "@/lib/services/notification-service";
import { convertFromCoreCurrency, formatCurrency } from "@/lib/utils/finance";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { snapshot, dataset, baseCurrency, comparisonCurrency, loading, rates, settings } = useDashboardData(user?.uid);
  const hasWorkspaceData = Boolean(
    dataset &&
      (dataset.incomes.length > 0 ||
        dataset.expenses.length > 0 ||
        dataset.debts.length > 0 ||
        dataset.owed.length > 0 ||
        dataset.banks.length > 0)
  );

  useEffect(() => {
    if (settings?.notificationsEnabled && snapshot?.reminders.length) {
      pushReminderNotifications(snapshot.reminders);
    }
  }, [settings?.notificationsEnabled, snapshot?.reminders]);

  if (!user || loading || !snapshot) {
    return <LoadingCard title={t("dashboard.loading")} />;
  }

  function formatSummaryValue(amountInUsd: number, currency: typeof baseCurrency) {
    return formatCurrency(convertFromCoreCurrency(amountInUsd, currency, rates), currency);
  }

  function getComparisonValue(amountInUsd: number) {
    if (!comparisonCurrency || comparisonCurrency === baseCurrency) {
      return undefined;
    }

    return formatSummaryValue(amountInUsd, comparisonCurrency);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("dashboard.eyebrow")}
        title={t("dashboard.title")}
        description={t("dashboard.description")}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label={t("dashboard.totalIncome")}
          value={formatSummaryValue(snapshot.totalIncome, baseCurrency)}
          comparisonLabel={
            comparisonCurrency && comparisonCurrency !== baseCurrency
              ? t("dashboard.comparisonValue", { currency: comparisonCurrency })
              : undefined
          }
          comparisonValue={getComparisonValue(snapshot.totalIncome)}
          detail={t("dashboard.totalIncomeDetail", { currency: baseCurrency })}
        />
        <StatCard
          label={t("dashboard.totalExpenses")}
          value={formatSummaryValue(snapshot.totalExpenses, baseCurrency)}
          comparisonLabel={
            comparisonCurrency && comparisonCurrency !== baseCurrency
              ? t("dashboard.comparisonValue", { currency: comparisonCurrency })
              : undefined
          }
          comparisonValue={getComparisonValue(snapshot.totalExpenses)}
          detail={t("dashboard.totalExpensesDetail")}
        />
        <StatCard
          label={t("dashboard.totalDebt")}
          value={formatSummaryValue(snapshot.totalDebt, baseCurrency)}
          comparisonLabel={
            comparisonCurrency && comparisonCurrency !== baseCurrency
              ? t("dashboard.comparisonValue", { currency: comparisonCurrency })
              : undefined
          }
          comparisonValue={getComparisonValue(snapshot.totalDebt)}
          detail={t("dashboard.totalDebtDetail")}
        />
        <StatCard
          label={t("dashboard.moneyOwed")}
          value={formatSummaryValue(snapshot.totalOwed, baseCurrency)}
          comparisonLabel={
            comparisonCurrency && comparisonCurrency !== baseCurrency
              ? t("dashboard.comparisonValue", { currency: comparisonCurrency })
              : undefined
          }
          comparisonValue={getComparisonValue(snapshot.totalOwed)}
          detail={t("dashboard.moneyOwedDetail")}
        />
        <StatCard
          label={t("dashboard.netBalance")}
          value={formatSummaryValue(snapshot.netBalance, baseCurrency)}
          comparisonLabel={
            comparisonCurrency && comparisonCurrency !== baseCurrency
              ? t("dashboard.comparisonValue", { currency: comparisonCurrency })
              : undefined
          }
          comparisonValue={getComparisonValue(snapshot.netBalance)}
          detail={t("dashboard.netBalanceDetail")}
        />
      </section>

      {!hasWorkspaceData ? (
        <EmptyState
          title={t("dashboard.emptyTitle")}
          description={t("dashboard.emptyDescription")}
          ctaLabel={t("dashboard.emptyAction")}
          ctaHref="/income"
        />
      ) : (
        <>
          <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <IncomeExpenseLineChart points={snapshot.monthlyTrends} />
            <RemindersPanel reminders={snapshot.reminders} />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <CategoryBreakdownChart items={snapshot.categoryTotals} />
            <DebtOwedChart debt={snapshot.debtVsOwed.debt} owed={snapshot.debtVsOwed.owed} />
          </section>

          <RecentActivityList items={snapshot.recentActivity} baseCurrency={baseCurrency} />
        </>
      )}
    </div>
  );
}
