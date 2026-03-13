"use client";

import type { ReactNode } from "react";

import { BrandLogo } from "@/components/branding/BrandLogo";
import { useI18n } from "@/components/providers/LanguageProvider";

export function AuthShell({ children }: { children: ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="safe-shell min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.18),_transparent_26rem),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_28rem),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)] px-3 pb-8 pt-4 sm:px-4 sm:pb-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-5 sm:gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
        <div className="rounded-[28px] border border-white/70 bg-slate-950 px-5 py-5 text-white shadow-2xl lg:hidden">
          <BrandLogo compact className="text-white [&_span:last-child]:text-slate-300" />
          <h1 className="mt-5 text-3xl font-semibold tracking-tight">{t("authShell.heroTitle")}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">{t("authShell.heroDescription")}</p>
        </div>
        <div className="hidden rounded-[36px] border border-white/70 bg-slate-950 p-10 text-white shadow-2xl lg:block">
          <BrandLogo compact className="text-white [&_span:last-child]:text-slate-300" />
          <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight">
            {t("authShell.heroTitle")}
          </h1>
          <p className="mt-5 max-w-lg text-base text-slate-300">
            {t("authShell.heroDescription")}
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-emerald-300">{t("authShell.localFirstTitle")}</p>
              <p className="mt-2 text-sm text-slate-300">{t("authShell.localFirstDescription")}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-sky-300">{t("authShell.offlineReadyTitle")}</p>
              <p className="mt-2 text-sm text-slate-300">{t("authShell.offlineReadyDescription")}</p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
