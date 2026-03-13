"use client";

import Link from "next/link";

import { useI18n } from "@/components/providers/LanguageProvider";

export function DeveloperSignatureCard() {
  const { t } = useI18n();

  return (
    <div className="relative overflow-hidden rounded-[30px] border border-slate-900/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_32%),radial-gradient(circle_at_bottom_left,_rgba(22,163,74,0.18),_transparent_36%),linear-gradient(140deg,#ffffff_0%,#f8fafc_50%,#ecfeff_100%)] px-6 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-300/30 blur-3xl transition duration-300 hover:scale-110" />
      <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {t("developer.eyebrow")}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            MD ANISUR RAHMAN CHOWDHURY
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {t("developer.description")}
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {t("developer.copyright")} MD ANISUR RAHMAN CHOWDHURY
          </p>
        </div>

        <div className="rounded-[26px] border border-white/70 bg-white/80 px-5 py-5 shadow-lg backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            {t("developer.portfolioLabel")}
          </p>
          <Link
            className="mt-3 inline-flex items-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            href="https://marcbd.site"
            rel="noreferrer"
            target="_blank"
          >
            marcbd.site
          </Link>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {t("developer.portfolioDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
