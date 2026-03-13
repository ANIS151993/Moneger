"use client";

import Link from "next/link";

import { useI18n } from "@/components/providers/LanguageProvider";
import { BrandLogo } from "@/components/branding/BrandLogo";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { brand } from "@/lib/branding/brand";

export default function LandingPage() {
  const { t } = useI18n();
  const highlights = [t("landing.highlight1"), t("landing.highlight2"), t("landing.highlight3")];
  const heroTitle = t("landing.heroTitle", { brand: brand.name });
  const heroTitleStartsWithBrand = heroTitle.startsWith(brand.name);
  const heroTitleRemainder = heroTitleStartsWithBrand ? heroTitle.slice(brand.name.length).trimStart() : heroTitle;

  return (
    <main className="px-4 py-4">
      <div className="mx-auto max-w-7xl">
        <header className="glass flex items-center justify-between rounded-[30px] border border-white/80 px-6 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <Link className={buttonClassName({ variant: "ghost" })} href="/login">
              {t("landing.login")}
            </Link>
            <Link className={buttonClassName({})} href="/signup">
              {t("landing.createAccount")}
            </Link>
          </div>
        </header>

        <section className="grid gap-8 px-2 py-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
              {t("landing.privacyTag")}
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
              {heroTitleStartsWithBrand ? (
                <>
                  <span className="gradient-text">{brand.name}</span>{" "}
                  {heroTitleRemainder}
                </>
              ) : (
                heroTitle
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              {t("landing.heroDescription")}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link className={buttonClassName({ className: "px-6 py-4 text-base" })} href="/signup">
                {t("landing.startUsing")}
              </Link>
              <Link className={buttonClassName({ className: "px-6 py-4 text-base", variant: "ghost" })} href="/dashboard">
                {t("landing.openDashboard")}
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <Card key={item} className="rounded-[24px] p-5">
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden rounded-[34px] bg-slate-950 p-0 text-white">
            <div className="border-b border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">{t("landing.previewEyebrow")}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">{t("landing.previewTitle")}</h2>
            </div>
            <div className="grid gap-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  [t("landing.previewNetBalance"), "$4,260"],
                  [t("landing.previewDebtDue"), "$148"],
                  [t("landing.previewMoneyOwed"), "$240"],
                  [t("landing.previewOfflineReady"), t("landing.yes")]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{t("landing.localFirstLedger")}</p>
                    <p className="mt-1 text-sm text-slate-400">{t("landing.perUserStore")}</p>
                  </div>
                  <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    {t("landing.active")}
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    [t("landing.incomeTrackingTitle"), t("landing.incomeTrackingCopy")],
                    [t("landing.expenseAnalysisTitle"), t("landing.expenseAnalysisCopy")],
                    [t("landing.debtRemindersTitle"), t("landing.debtRemindersCopy")]
                  ].map(([title, copy]) => (
                    <div key={title} className="rounded-2xl bg-white/5 px-4 py-3">
                      <p className="font-medium text-white">{title}</p>
                      <p className="mt-1 text-sm text-slate-400">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 pb-16 lg:grid-cols-3">
          <Card>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">{t("landing.whyLocalFirstEyebrow")}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("landing.whyLocalFirstTitle")}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{t("landing.whyLocalFirstDescription")}</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-600">{t("landing.offlineEyebrow")}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("landing.offlineTitle")}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{t("landing.offlineDescription")}</p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-600">{t("landing.syncEyebrow")}</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">{t("landing.syncTitle")}</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">{t("landing.syncDescription")}</p>
          </Card>
        </section>
      </div>
    </main>
  );
}
