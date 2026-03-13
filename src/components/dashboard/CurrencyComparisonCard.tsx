"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { relativeFromNow } from "@/lib/utils/date";
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
          "group relative flex flex-wrap items-center gap-3 overflow-hidden rounded-full border border-white/12 px-3 py-2 text-white/90 transition duration-300 hover:border-white/20",
          className
        )}
      >
        <div className="absolute inset-y-0 left-0 w-24 bg-[radial-gradient(circle_at_left,_rgba(56,189,248,0.12),_transparent_70%)]" />
        <span className="relative inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
          <span className="fx-live-dot h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
          {t("dashboard.ratePanelLive")}
        </span>
        <p className="relative min-w-0 flex-1 truncate text-sm font-medium text-slate-200">
          {t("dashboard.ratePanelPromptTitle")}
        </p>
      </div>
    );
  }

  const currentRate = getCurrencyComparisonRate(baseCurrency, comparisonCurrency, rates);

  return (
    <div
      className={cn(
        "group relative flex flex-wrap items-center gap-3 overflow-hidden rounded-full border border-white/12 px-3 py-2 text-white transition duration-300 hover:border-white/20",
        className
      )}
    >
      <div className="absolute inset-y-0 left-0 w-24 bg-[radial-gradient(circle_at_left,_rgba(52,211,153,0.14),_transparent_70%)]" />
      <div className="absolute inset-y-0 right-0 w-24 bg-[radial-gradient(circle_at_right,_rgba(56,189,248,0.14),_transparent_70%)]" />
      <span className="relative inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
        <span className="fx-live-dot h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
        {t("dashboard.ratePanelLive")}
      </span>
      <p className="relative min-w-0 flex-1 truncate text-sm font-semibold tracking-tight text-white">
        1 {baseCurrency} = {formatExchangeRate(currentRate)} {comparisonCurrency}
      </p>
      <div className="relative text-[10px] font-medium text-slate-300">
        {rates.updatedAt
          ? t("dashboard.ratePanelUpdated", { time: relativeFromNow(rates.updatedAt) })
          : t("dashboard.ratePanelLive")}
      </div>
    </div>
  );
}
