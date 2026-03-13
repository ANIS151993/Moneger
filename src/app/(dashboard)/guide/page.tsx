"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { useI18n } from "@/components/providers/LanguageProvider";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { Select } from "@/components/ui/Select";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { languageDefinitions } from "@/lib/i18n/config";
import { getUserGuideContent } from "@/lib/content/user-guide";
import { ledgerService } from "@/lib/services/ledger-service";
import { cn } from "@/lib/utils/cn";
import { isProfileComplete } from "@/lib/utils/profile";
import type { LanguagePreference } from "@/types/finance";

const sectionThemes = [
  "border-emerald-100 bg-emerald-50/80",
  "border-sky-100 bg-sky-50/80",
  "border-amber-100 bg-amber-50/80",
  "border-rose-100 bg-rose-50/80",
  "border-violet-100 bg-violet-50/80"
] as const;

export default function GuidePage() {
  const { user } = useAuth();
  const settings = useUserSettings(user?.uid);
  const { language, setLanguagePreference } = useI18n();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!user) {
    return null;
  }

  const userId = user.uid;
  const content = getUserGuideContent(language);
  const profileComplete = isProfileComplete(settings);

  function handleLanguageChange(nextLanguage: LanguagePreference) {
    setMessage("");
    setLanguagePreference(nextLanguage);
    const languageLabel =
      languageDefinitions.find((definition) => definition.code === nextLanguage)?.nativeLabel ||
      nextLanguage.toUpperCase();

    startTransition(async () => {
      try {
        await ledgerService.saveLanguagePreference(userId, nextLanguage);
        setMessage(language === nextLanguage ? "" : `${languageLabel} saved`);
      } catch {
        setMessage("Unable to save guide language.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
        actions={
          <Card className="w-full rounded-[24px] border-slate-200 bg-white/90 p-4 md:max-w-[280px] md:rounded-[28px]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              {content.languageLabel}
            </p>
            <Select
              className="mt-3"
              disabled={isPending}
              value={language}
              onChange={(event) => handleLanguageChange(event.target.value as LanguagePreference)}
            >
              {languageDefinitions.map((definition) => (
                <option key={definition.code} value={definition.code}>
                  {definition.nativeLabel}
                </option>
              ))}
            </Select>
            <p className="mt-3 text-xs text-slate-500">
              {message || (profileComplete ? content.checklistDescription : content.lockedDescription)}
            </p>
          </Card>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-5">
          {content.sections.map((section, index) => (
            <Card
              key={section.id}
              className={cn(
                "relative overflow-hidden border p-0",
                sectionThemes[index % sectionThemes.length]
              )}
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/40 blur-3xl" />
              <div className="relative grid gap-5 p-4 sm:p-6 lg:grid-cols-[92px_minmax(0,1fr)_180px] lg:items-start">
                <div className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-4 text-center shadow-sm sm:rounded-[26px] sm:py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {section.stage}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{index + 1}</p>
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{section.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{section.summary}</p>
                  <div className="mt-5 grid gap-3">
                    {section.steps.map((step, stepIndex) => (
                      <div
                        key={`${section.id}_${stepIndex + 1}`}
                        className="rounded-[22px] border border-white/80 bg-white/75 px-4 py-4 shadow-sm"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                          {section.stage} . {stepIndex + 1}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[24px] border border-slate-900/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_34%),linear-gradient(160deg,#020617_0%,#0f172a_55%,#064e3b_100%)] px-4 py-5 text-white shadow-[0_18px_50px_rgba(15,23,42,0.2)] sm:rounded-[26px] sm:px-5">
                  <div className="absolute -right-6 top-0 h-20 w-20 rounded-full bg-sky-300/15 blur-3xl" />
                  <div className="relative">
                    <p className="inline-flex rounded-full border border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                    {content.progressLabel}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{section.summary}</p>
                    <Link
                      className={buttonClassName({
                        className:
                          "mt-5 w-full rounded-[18px] border-emerald-300/30 bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.24),_transparent_42%),linear-gradient(135deg,#16a34a_0%,#14b8a6_58%,#38bdf8_100%)] text-white shadow-[0_16px_34px_rgba(22,163,74,0.24)] hover:shadow-[0_20px_42px_rgba(22,163,74,0.3)]",
                        variant: "primary"
                      })}
                      href={section.ctaHref}
                    >
                      {section.ctaLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid h-fit gap-6 xl:sticky xl:top-6">
          <Card className="rounded-[30px] border border-slate-900 bg-slate-950 text-white shadow-[0_24px_80px_rgba(2,6,23,0.32)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              {content.checklistTitle}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{content.checklistDescription}</p>
            <div className="mt-5 grid gap-3">
              {content.checklistItems.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {content.progressLabel} {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          {!profileComplete ? (
            <Card className="rounded-[30px] border border-amber-200 bg-amber-50">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">Locked workspace</p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{content.lockedTitle}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{content.lockedDescription}</p>
              <Link
                className={buttonClassName({
                  className: "mt-5 w-full",
                  variant: "secondary"
                })}
                href="/welcome"
              >
                Complete profile now
              </Link>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
