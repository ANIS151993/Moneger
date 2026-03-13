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
      <Card className="group relative w-full overflow-hidden rounded-[28px] border border-emerald-100 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.28),_transparent_42%),linear-gradient(145deg,#ffffff_0%,#ecfdf5_58%,#dcfce7_100%)] p-5 shadow-[0_20px_70px_rgba(22,163,74,0.12)] transition hover:-translate-y-0.5 md:max-w-[380px]">
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-300/30 blur-2xl" />
        <p className="relative text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
          {t("dashboard.ratePanelTitle")}
        </p>
        <h3 className="relative mt-3 text-xl font-semibold tracking-tight text-slate-950">
          {t("dashboard.ratePanelPromptTitle")}
        </h3>
        <p className="relative mt-2 text-sm leading-6 text-slate-600">
          {t("dashboard.ratePanelPromptDescription")}
        </p>
      </Card>
    );
  }

  const currentRate = getCurrencyComparisonRate(baseCurrency, comparisonCurrency, rates);
  const values = pairHistory.map((point) => point.rate);
  const { line, area } = buildSparkline(values, 300, 92);
  const high = Math.max(...values);
  const low = Math.min(...values);

  return (
    <Card className="group relative w-full overflow-hidden rounded-[28px] border border-slate-900/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.28),_transparent_38%),radial-gradient(circle_at_bottom_left,_rgba(22,163,74,0.18),_transparent_42%),linear-gradient(155deg,#0f172a_0%,#111827_54%,#052e16_100%)] p-5 text-white shadow-[0_24px_80px_rgba(15,23,42,0.24)] transition hover:-translate-y-0.5 md:max-w-[420px]">
      <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-emerald-400/20 blur-3xl transition group-hover:scale-110" />
      <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-sky-400/15 blur-3xl transition group-hover:scale-110" />
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
              {t("dashboard.ratePanelTitle")}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                {baseCurrency}
              </span>
              <span className="text-slate-400">/</span>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                {comparisonCurrency}
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
            {t("dashboard.ratePanelLive")}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-slate-300">
            1 {baseCurrency} = {formatExchangeRate(currentRate)} {comparisonCurrency}
          </p>
          <p className="mt-2 text-xs text-slate-400">
            {rates.updatedAt ? t("dashboard.ratePanelUpdated", { time: relativeFromNow(rates.updatedAt) }) : t("dashboard.ratePanelSource")}
          </p>
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-3 backdrop-blur">
          <svg className="h-[110px] w-full" viewBox="0 0 300 92" preserveAspectRatio="none" aria-hidden="true">
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
                strokeWidth="4"
              />
            ) : null}
          </svg>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {t("dashboard.ratePanelHigh")}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{formatExchangeRate(high)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {t("dashboard.ratePanelLow")}
            </p>
            <p className="mt-2 text-sm font-semibold text-white">{formatExchangeRate(low)}</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
          <p>{t("dashboard.ratePanelSource")}</p>
          {rates.updatedAt ? <p>{formatDateTime(rates.updatedAt)}</p> : null}
        </div>
      </div>
    </Card>
  );
}
