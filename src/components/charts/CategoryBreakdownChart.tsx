"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Card } from "@/components/ui/Card";
import type { CategoryTotal } from "@/types/finance";

ChartJS.register(ArcElement, Tooltip, Legend);

const palette = ["#16A34A", "#38BDF8", "#0F172A", "#22C55E", "#0EA5E9", "#475569"];

export function CategoryBreakdownChart({ items }: { items: CategoryTotal[] }) {
  const { t } = useI18n();

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t("dashboard.chartCategoryEyebrow")}</p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{t("dashboard.chartCategoryTitle")}</h2>
      <div className="mt-6 h-[320px]">
        {items.length === 0 ? (
          <div className="grid h-full place-items-center rounded-3xl bg-slate-50 px-6 text-center text-sm text-slate-500">
            {t("dashboard.chartCategoryEmpty")}
          </div>
        ) : (
          <Doughnut
            data={{
              labels: items.map((item) => t(`options.expenseCategory.${item.category}`)),
              datasets: [
                {
                  data: items.map((item) => item.amount),
                  backgroundColor: palette
                }
              ]
            }}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom"
                }
              }
            }}
          />
        )}
      </div>
    </Card>
  );
}
