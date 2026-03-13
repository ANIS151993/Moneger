"use client";

import { useEffect } from "react";

import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { CurrencyComparisonCard } from "@/components/dashboard/CurrencyComparisonCard";
import { DebtOwedChart } from "@/components/charts/DebtOwedChart";
import { IncomeExpenseLineChart } from "@/components/charts/IncomeExpenseLineChart";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { RemindersPanel } from "@/components/dashboard/RemindersPanel";
import { useI18n } from "@/components/providers/LanguageProvider";
import { LoadingCard } from "@/components/shared/LoadingCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/ui/StatCard";
import { useAuth } from "@/lib/hooks/use-auth";
import { useDashboardData } from "@/lib/hooks/use-dashboard-data";
import { pushReminderNotifications } from "@/lib/services/notification-service";
import { convertFromCoreCurrency, formatCurrency } from "@/lib/utils/finance";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const { snapshot, dataset, baseCurrency, comparisonCurrency, loading, rateHistory, rates, settings } = useDashboardData(
    user?.uid
  );
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
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
        <Card className="fx-card-sheen relative overflow-hidden border-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.26),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.2),_transparent_38%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#064e3b_100%)] p-0 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
          <div className="absolute -left-10 top-8 h-36 w-36 rounded-full bg-emerald-400/15 blur-3xl" />
          <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-400/12 blur-3xl" />
          <div className="relative p-5 sm:p-6">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-white/10 bg-white/10 text-white ring-0">{t("nav.overview")}</Badge>
                <Badge className="border-emerald-300/20 bg-emerald-400/10 text-emerald-100 ring-0">
                  {t("common.baseCurrency")}: {baseCurrency}
                </Badge>
                {comparisonCurrency ? (
                  <Badge className="border-sky-300/20 bg-sky-400/10 text-sky-100 ring-0">
                    {t("common.comparisonCurrency")}: {comparisonCurrency}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-emerald-200">
                  {t("dashboard.netBalance")}
                </p>
                <h1 className="mt-3 break-words text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {formatSummaryValue(snapshot.netBalance, baseCurrency)}
                </h1>
                {comparisonCurrency && comparisonCurrency !== baseCurrency ? (
                  <div className="mt-4 inline-flex rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-[0_14px_36px_rgba(15,23,42,0.18)] backdrop-blur">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-slate-300">
                        {t("dashboard.comparisonValue", { currency: comparisonCurrency })}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {getComparisonValue(snapshot.netBalance)}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        <CurrencyComparisonCard
          baseCurrency={baseCurrency}
          comparisonCurrency={comparisonCurrency}
          rates={rates}
          history={rateHistory}
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
          tone="emerald"
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
          tone="sky"
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
          tone="rose"
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
          tone="amber"
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
