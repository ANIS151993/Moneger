"use client";

import { Badge } from "@/components/ui/Badge";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/finance";
import type { ActivityItem, CurrencyCode } from "@/types/finance";

const toneBadge = {
  income: "success",
  expense: "warning",
  debt: "danger",
  owed: "info"
} as const;

export function RecentActivityList({
  items,
  baseCurrency
}: {
  items: ActivityItem[];
  baseCurrency: CurrencyCode;
}) {
  const { t } = useI18n();

  return (
    <Card className="border-slate-200/80 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.1),_transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t("dashboard.recentActivityEyebrow")}</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{t("dashboard.recentActivityTitle")}</h2>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
            {t("dashboard.recentActivityEmpty")}
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 rounded-3xl border border-white/80 bg-white/90 px-4 py-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
            >
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <Badge tone={toneBadge[item.tone]}>{t(`options.activityTone.${item.tone}`)}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {item.tone === "income"
                    ? t(`options.incomeCategory.${item.description}`)
                    : item.tone === "expense"
                      ? t(`options.expenseCategory.${item.description}`)
                      : item.tone === "debt"
                        ? t(`options.debtStatus.${item.description}`)
                        : t(`options.owedStatus.${item.description}`)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{formatCurrency(item.amount, item.currency)}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(item.date)} · {t("common.display")} {baseCurrency}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
