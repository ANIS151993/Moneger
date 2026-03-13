"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { relativeFromNow } from "@/lib/utils/date";
import {
  formatExchangeRate,
  getCurrencyComparisonRate
} from "@/lib/utils/finance";
import type {
  CurrencyCode,
  CurrencyRateMap,
} from "@/types/finance";

export function CurrencyComparisonCard({
  baseCurrency,
  comparisonCurrency,
  rates,
}: {
  baseCurrency: CurrencyCode;
  comparisonCurrency: CurrencyCode | "";
  rates: CurrencyRateMap;
  history: unknown[];
}) {
  const { t } = useI18n();

  if (!comparisonCurrency) {
    return (
      <Card className="fx-card-sheen group relative w-full overflow-hidden rounded-full border border-emerald-100 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_34%),linear-gradient(135deg,#ffffff_0%,#f0fdf4_58%,#dcfce7_100%)] px-4 py-2 shadow-[0_14px_34px_rgba(22,163,74,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(22,163,74,0.18)]">
        <div className="absolute inset-y-0 right-0 w-24 bg-[radial-gradient(circle_at_left,_rgba(16,185,129,0.12),_transparent_68%)]" />
        <div className="relative flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              <span className="fx-live-dot h-2 w-2 rounded-full bg-emerald-500" />
              {t("dashboard.ratePanelLive")}
            </span>
            <span className="rounded-full border border-slate-200 bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-900">
              USD/FX
            </span>
          </div>
          <div className="min-w-0 flex-1 sm:text-right">
            <p className="truncate text-sm font-semibold tracking-tight text-slate-950">{t("dashboard.ratePanelPromptTitle")}</p>
          </div>
        </div>
      </Card>
    );
  }

  const currentRate = getCurrencyComparisonRate(baseCurrency, comparisonCurrency, rates);

  return (
    <Card className="fx-card-sheen group relative w-full overflow-hidden rounded-full border border-cyan-400/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.14),_transparent_36%),linear-gradient(135deg,#020617_0%,#0f172a_56%,#062c2c_100%)] px-4 py-2 text-white shadow-[0_16px_40px_rgba(15,23,42,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(15,23,42,0.3)]">
      <div className="absolute -left-6 top-1/2 h-16 w-16 -translate-y-1/2 rounded-full bg-emerald-400/12 blur-3xl transition duration-300 group-hover:scale-110" />
      <div className="absolute -right-8 top-0 h-18 w-18 rounded-full bg-sky-400/12 blur-3xl transition duration-300 group-hover:scale-110" />
      <div className="relative flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
            <span className="fx-live-dot h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
            {t("dashboard.ratePanelLive")}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold tracking-tight text-white">
            1 {baseCurrency} = {formatExchangeRate(currentRate)} {comparisonCurrency}
          </p>
        </div>

        <div className="ml-auto text-[10px] font-medium text-slate-300">
          {rates.updatedAt
            ? t("dashboard.ratePanelUpdated", { time: relativeFromNow(rates.updatedAt) })
            : t("dashboard.ratePanelLive")}
        </div>
      </div>
    </Card>
  );
}
