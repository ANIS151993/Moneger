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
      <Card className="fx-card-sheen group relative w-full overflow-hidden rounded-[24px] border border-emerald-100 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.14),_transparent_36%),linear-gradient(135deg,#ffffff_0%,#f0fdf4_58%,#dcfce7_100%)] px-4 py-2.5 shadow-[0_14px_36px_rgba(22,163,74,0.12)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(22,163,74,0.18)] md:max-w-[500px]">
        <div className="absolute inset-y-0 right-0 w-24 bg-[radial-gradient(circle_at_left,_rgba(16,185,129,0.12),_transparent_68%)]" />
        <div className="relative flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
              <span className="fx-live-dot h-2 w-2 rounded-full bg-emerald-500" />
              {t("dashboard.ratePanelLive")}
            </span>
            <span className="rounded-full border border-slate-200 bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-900">
              USD/FX
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold tracking-tight text-slate-950">
              {t("dashboard.ratePanelPromptTitle")}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-slate-600">
              {t("dashboard.ratePanelPromptDescription")}
            </p>
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
      ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-100"
      : "border-rose-300/30 bg-rose-400/10 text-rose-100";
  const trendLabel = `${rateTrend >= 0 ? "+" : ""}${formatExchangeRate(Math.abs(rateTrend))}`;

  return (
    <Card className="fx-card-sheen group relative w-full overflow-hidden rounded-[24px] border border-cyan-400/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.14),_transparent_40%),linear-gradient(135deg,#020617_0%,#0f172a_52%,#062c2c_100%)] px-4 py-2.5 text-white shadow-[0_16px_44px_rgba(15,23,42,0.26)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_54px_rgba(15,23,42,0.32)] md:max-w-[540px]">
      <div className="absolute -left-6 top-1/2 h-18 w-18 -translate-y-1/2 rounded-full bg-emerald-400/12 blur-3xl transition duration-300 group-hover:scale-110" />
      <div className="absolute -right-8 top-0 h-20 w-20 rounded-full bg-sky-400/12 blur-3xl transition duration-300 group-hover:scale-110" />
      <div className="relative flex flex-col gap-2.5 md:flex-row md:items-center md:gap-3">
        <div className="flex flex-wrap items-center gap-2 md:min-w-fit">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
            <span className="fx-live-dot h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.9)]" />
            {t("dashboard.ratePanelLive")}
          </span>
          <span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white">
            {baseCurrency}/{comparisonCurrency}
          </span>
          <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${trendTone}`}>
            {trendLabel}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold tracking-tight text-white">
            1 {baseCurrency} = {formatExchangeRate(currentRate)} {comparisonCurrency}
          </p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-300">
            <span>
              {rates.updatedAt
                ? t("dashboard.ratePanelUpdated", { time: relativeFromNow(rates.updatedAt) })
                : t("dashboard.ratePanelLive")}
            </span>
            {rates.updatedAt ? <span className="text-slate-400">{formatDateTime(rates.updatedAt)}</span> : null}
          </div>
        </div>

        <div className="fx-sparkline-panel min-w-[108px] rounded-[18px] border border-white/10 bg-white/[0.06] p-1.5 shadow-inner shadow-black/10 backdrop-blur md:ml-auto">
          <svg className="h-[38px] w-[108px]" viewBox="0 0 132 56" preserveAspectRatio="none" aria-hidden="true">
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
        </div>
      </div>
    </Card>
  );
}
