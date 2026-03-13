"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ProfileForm } from "@/components/forms/ProfileForm";
import { useI18n } from "@/components/providers/LanguageProvider";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUserSettings } from "@/lib/hooks/use-user-settings";

const onboardingSteps = [
  {
    step: "01",
    titleKey: "onboarding.stepProfileTitle",
    descriptionKey: "onboarding.stepProfileDescription"
  },
  {
    step: "02",
    titleKey: "onboarding.stepGuideTitle",
    descriptionKey: "onboarding.stepGuideDescription"
  },
  {
    step: "03",
    titleKey: "onboarding.stepWorkspaceTitle",
    descriptionKey: "onboarding.stepWorkspaceDescription"
  }
] as const;

export default function WelcomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const settings = useUserSettings(user?.uid);
  const { t } = useI18n();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("onboarding.eyebrow")}
        title={t("onboarding.title")}
        description={t("onboarding.description")}
        actions={
          <Card className="w-full rounded-[28px] border-emerald-100 bg-emerald-50 p-4 md:max-w-[320px]">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">
              {t("onboarding.unlockTitle")}
            </p>
            <p className="mt-3 text-sm leading-6 text-emerald-900">
              {t("onboarding.unlockDescription")}
            </p>
            <Link
              className={buttonClassName({
                className: "mt-4",
                variant: "ghost"
              })}
              href="/guide"
            >
              {t("onboarding.readGuide")}
            </Link>
          </Card>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ProfileForm
          email={user.email}
          mode="onboarding"
          settings={settings}
          userId={user.uid}
          onSaved={() => {
            router.push("/guide");
          }}
        />

        <div className="grid h-fit gap-6 xl:sticky xl:top-6">
          <Card className="rounded-[30px] border border-slate-900 bg-slate-950 text-white shadow-[0_24px_80px_rgba(2,6,23,0.32)]">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
              {t("onboarding.stepsTitle")}
            </p>
            <div className="mt-5 grid gap-3">
              {onboardingSteps.map((item) => (
                <div key={item.step} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{item.step}</p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight text-white">{t(item.titleKey)}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{t(item.descriptionKey)}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-[30px] border border-sky-100 bg-sky-50">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
              {t("onboarding.guidePreviewTitle")}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {t("onboarding.guidePreviewDescription")}
            </p>
            <Link
              className={buttonClassName({
                className: "mt-5 w-full",
                variant: "secondary"
              })}
              href="/guide"
            >
              {t("onboarding.openGuide")}
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
