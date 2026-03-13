"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import {
  formatExchangeRate,
  getCurrencyComparisonRate
} from "@/lib/utils/finance";
import { cn } from "@/lib/utils/cn";
import type {
  CurrencyCode,
  CurrencyRateMap,
} from "@/types/finance";

export function CurrencyComparisonCard({
  baseCurrency,
  comparisonCurrency,
  rates,
  className,
}: {
  baseCurrency: CurrencyCode;
  comparisonCurrency: CurrencyCode | "";
  rates: CurrencyRateMap;
  className?: string;
}) {
  const { t } = useI18n();

  if (!comparisonCurrency) {
    return (
      <div
        className={cn(
          "fx-card-sheen group relative flex flex-wrap items-center gap-3 overflow-hidden rounded-[22px] border border-emerald-200/70 bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.24),_transparent_30%),linear-gradient(135deg,#f8fffe_0%,#ecfdf5_48%,#dcfce7_100%)] px-3 py-2.5 text-slate-900 shadow-[0_14px_34px_rgba(16,185,129,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_44px_rgba(16,185,129,0.18)]",
          className
        )}
      >
        <div className="absolute inset-y-0 left-0 w-24 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.18),_transparent_70%)]" />
        <span className="relative inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
          <span className="fx-live-dot h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_14px_rgba(16,185,129,0.55)]" />
          {t("dashboard.ratePanelLive")}
        </span>
        <p className="relative min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
          {t("dashboard.ratePanelPromptTitle")}
        </p>
      </div>
    );
  }

  const currentRate = getCurrencyComparisonRate(baseCurrency, comparisonCurrency, rates);

  return (
    <div
      className={cn(
        "fx-card-sheen group relative flex flex-wrap items-center gap-3 overflow-hidden rounded-[22px] border border-slate-900/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.16),_transparent_38%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#0f766e_100%)] px-3 py-2.5 text-white shadow-[0_18px_46px_rgba(15,23,42,0.18)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(15,23,42,0.24)]",
        className
      )}
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-[radial-gradient(circle_at_left,_rgba(52,211,153,0.18),_transparent_70%)]" />
      <div className="absolute inset-y-0 right-0 w-24 bg-[radial-gradient(circle_at_right,_rgba(56,189,248,0.18),_transparent_70%)]" />
      <span className="relative inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
        <span className="fx-live-dot h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
        {t("dashboard.ratePanelLive")}
      </span>
      <p className="relative min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-white sm:text-[15px]">
        1 {baseCurrency} = {formatExchangeRate(currentRate)} {comparisonCurrency}
      </p>
    </div>
  );
}
