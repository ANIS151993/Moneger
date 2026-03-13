"use client";

import Link from "next/link";

import { useI18n } from "@/components/providers/LanguageProvider";
import { buttonClassName } from "@/components/ui/Button";

export function DeveloperSignatureCard() {
  const { t } = useI18n();

  return (
    <div className="developer-ribbon relative overflow-hidden rounded-[24px] border border-slate-900/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(140deg,rgba(255,255,255,0.96),rgba(240,249,255,0.9)_48%,rgba(236,253,245,0.9)_100%)] px-5 py-4 shadow-[0_14px_38px_rgba(15,23,42,0.08)]">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-sky-300/20 blur-3xl" />
      <div className="absolute -left-8 bottom-0 h-16 w-16 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="relative flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {t("developer.eyebrow")}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold tracking-tight text-slate-950">
              MD ANISUR RAHMAN CHOWDHURY
            </h2>
            <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-slate-600 shadow-sm">
              {t("developer.copyright")}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            {t("developer.description")}
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:items-end">
          <Link
            className={buttonClassName({
              className:
                "rounded-full border-sky-300/30 bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.3),_transparent_40%),linear-gradient(135deg,#0f172a_0%,#0f766e_58%,#38bdf8_100%)] px-4 py-2.5 text-sm shadow-[0_14px_30px_rgba(14,116,144,0.22)] hover:border-sky-200/40 hover:shadow-[0_18px_38px_rgba(14,116,144,0.28)]",
              variant: "secondary"
            })}
            href="https://marcbd.site"
            rel="noreferrer"
            target="_blank"
          >
            marcbd.site
          </Link>
          <p className="text-xs leading-5 text-slate-500 lg:text-right">
            {t("developer.portfolioDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
