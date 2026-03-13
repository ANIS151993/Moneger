"use client";

import { useMemo } from "react";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { formatDateTime, relativeFromNow } from "@/lib/utils/date";
import {
  formatExchangeRate,
  getCurrencyComparisonRate
} from "@/lib/utils/finance";
import type {
  CurrencyCode,
  CurrencyRateMap,
  ExchangeRateSnapshotRecord
} from "@/types/finance";

function buildSparkline(points: number[], width: number, height: number) {
  if (points.length === 0) {
    return { line: "", area: "" };
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const stepX = points.length === 1 ? width : width / (points.length - 1);

  const linePoints = points
    .map((point, index) => {
      const x = index * stepX;
      const y = height - ((point - min) / range) * (height - 12) - 6;

      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `0,${height} ${linePoints} ${width},${height}`;

  return {
    line: linePoints,
    area: areaPoints
  };
}

export function CurrencyComparisonCard({
  baseCurrency,
  comparisonCurrency,
  rates,
  history
}: {
  baseCurrency: CurrencyCode;
  comparisonCurrency: CurrencyCode | "";
  rates: CurrencyRateMap;
  history: ExchangeRateSnapshotRecord[];
}) {
  const { t } = useI18n();

  const pairHistory = useMemo(() => {
    if (!comparisonCurrency) {
      return [];
    }

    const points = history
      .map((snapshot) => ({
        fetchedAt: snapshot.fetchedAt,
        rate: getCurrencyComparisonRate(baseCurrency, comparisonCurrency, {
          base: snapshot.base,
          rates: snapshot.rates,
          updatedAt: snapshot.fetchedAt
        })
      }))
      .slice(-10);

    if (points.length === 0) {
      points.push({
        fetchedAt: rates.updatedAt || new Date().toISOString(),
        rate: getCurrencyComparisonRate(baseCurrency, comparisonCurrency, rates)
      });
    }

    return points;
  }, [baseCurrency, comparisonCurrency, history, rates]);

  if (!comparisonCurrency) {
    return (
      <Card className="group relative w-full overflow-hidden rounded-[28px] border border-emerald-100 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_40%),linear-gradient(145deg,#ffffff_0%,#ecfdf5_55%,#dcfce7_100%)] px-4 py-4 shadow-[0_18px_54px_rgba(22,163,74,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(22,163,74,0.18)] md:max-w-[420px]">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl" />
        <div className="relative flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              {t("dashboard.ratePanelTitle")}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-emerald-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-slate-900">
                USD / FX
              </span>
              <p className="truncate text-sm font-semibold text-slate-950">
                {t("dashboard.ratePanelPromptTitle")}
              </p>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600">
              {t("dashboard.ratePanelPromptDescription")}
            </p>
          </div>

          <div className="rounded-full border border-emerald-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
            {t("dashboard.ratePanelLive")}
          </div>
        </div>
      </Card>
    );
  }

  const currentRate = getCurrencyComparisonRate(baseCurrency, comparisonCurrency, rates);
  const values = pairHistory.map((point) => point.rate);
  const { line, area } = buildSparkline(values, 132, 56);
  const rateTrend = values.at(-1) && values[0] ? values.at(-1)! - values[0]! : 0;
  const trendTone =
    rateTrend >= 0
      ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-200"
      : "border-rose-300/30 bg-rose-400/10 text-rose-200";
  const trendLabel = `${rateTrend >= 0 ? "+" : ""}${formatExchangeRate(Math.abs(rateTrend))}`;

  return (
    <Card className="group relative w-full overflow-hidden rounded-[28px] border border-slate-900/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.26),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(22,163,74,0.18),_transparent_42%),linear-gradient(150deg,#0f172a_0%,#111827_58%,#052e16_100%)] px-4 py-4 text-white shadow-[0_20px_64px_rgba(15,23,42,0.24)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_72px_rgba(15,23,42,0.3)] md:max-w-[520px]">
      <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl transition duration-300 group-hover:scale-110" />
      <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-sky-400/15 blur-3xl transition duration-300 group-hover:scale-110" />
      <div className="relative flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
              {t("dashboard.ratePanelLive")}
            </span>
            <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
              {baseCurrency}/{comparisonCurrency}
            </span>
            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${trendTone}`}>
              {trendLabel}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <p className="truncate text-sm font-semibold text-white/95">
              {t("dashboard.ratePanelTitle")}:
            </p>
            <p className="truncate text-sm text-slate-200">
              1 {baseCurrency} = {formatExchangeRate(currentRate)} {comparisonCurrency}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-300">
            <span>
              {rates.updatedAt
                ? t("dashboard.ratePanelUpdated", { time: relativeFromNow(rates.updatedAt) })
                : t("dashboard.ratePanelSource")}
            </span>
            {rates.updatedAt ? <span>{formatDateTime(rates.updatedAt)}</span> : null}
          </div>
        </div>

        <div className="min-w-[120px] rounded-[22px] border border-white/10 bg-white/[0.06] p-2.5 shadow-inner shadow-black/10 backdrop-blur">
          <svg className="h-[56px] w-[132px]" viewBox="0 0 132 56" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="fx-area-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(52,211,153,0.45)" />
                <stop offset="100%" stopColor="rgba(52,211,153,0.02)" />
              </linearGradient>
              <linearGradient id="fx-line-stroke" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
            </defs>
            {area ? <polygon fill="url(#fx-area-fill)" points={area} /> : null}
            {line ? (
              <polyline
                fill="none"
                points={line}
                stroke="url(#fx-line-stroke)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3.5"
              />
            ) : null}
          </svg>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {t("dashboard.ratePanelSource")}
          </p>
        </div>
      </div>
    </Card>
  );
}
