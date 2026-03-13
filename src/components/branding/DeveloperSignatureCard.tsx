"use client";

import Link from "next/link";

import { useI18n } from "@/components/providers/LanguageProvider";
import { buttonClassName } from "@/components/ui/Button";

export function DeveloperSignatureCard() {
  const { t } = useI18n();

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-slate-900/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(22,163,74,0.16),_transparent_36%),linear-gradient(140deg,#ffffff_0%,#f8fafc_48%,#ecfeff_100%)] px-6 py-5 shadow-[0_18px_54px_rgba(15,23,42,0.08)]">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-300/30 blur-3xl transition duration-300 hover:scale-110" />
      <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-emerald-300/30 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {t("developer.eyebrow")}
          </p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
            MD ANISUR RAHMAN CHOWDHURY
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {t("developer.description")}
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-slate-600 shadow-sm backdrop-blur">
            {t("developer.copyright")} MD ANISUR RAHMAN CHOWDHURY
          </div>
          <Link
            className={buttonClassName({
              className:
                "rounded-full border-sky-300/30 bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.36),_transparent_38%),linear-gradient(135deg,#0f172a_0%,#0f766e_58%,#38bdf8_100%)] px-5 py-3 shadow-[0_16px_40px_rgba(14,116,144,0.26)] hover:border-sky-200/40 hover:shadow-[0_20px_48px_rgba(14,116,144,0.32)]",
              variant: "secondary"
            })}
            href="https://marcbd.site"
            rel="noreferrer"
            target="_blank"
          >
            {t("developer.portfolioLabel")}: marcbd.site
          </Link>
          <p className="max-w-sm text-right text-sm leading-6 text-slate-500">
            {t("developer.portfolioDescription")}
          </p>
        </div>
      </div>
    </div>
  );
}
