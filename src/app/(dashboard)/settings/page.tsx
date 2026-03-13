"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { useI18n } from "@/components/providers/LanguageProvider";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { useUserSettings } from "@/lib/hooks/use-user-settings";

const settingsSections = [
  { id: "profile-settings", labelKey: "settingsPage.profileSettings", descriptionKey: "settingsPage.profileSettingsDescription" },
  { id: "currency-settings", labelKey: "settingsPage.currencySettings", descriptionKey: "settingsPage.currencySettingsDescription" },
  { id: "language-settings", labelKey: "settingsPage.languageSettings", descriptionKey: "settingsPage.languageSettingsDescription" },
  { id: "app-settings", labelKey: "settingsPage.appSettings", descriptionKey: "settingsPage.appSettingsDescription" },
  { id: "privacy-sync-settings", labelKey: "settingsPage.privacySync", descriptionKey: "settingsPage.privacySyncDescription" },
  { id: "workspace-settings", labelKey: "settingsPage.workspaceSettings", descriptionKey: "settingsPage.workspaceSettingsDescription" }
] as const;

export default function SettingsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const settings = useUserSettings(user?.uid);
  const syncQueue = useLiveQuery(
    async () => {
      if (!user) {
        return [];
      }

      return getUserDatabase(user.uid).syncQueue.orderBy("createdAt").reverse().limit(10).toArray();
    },
    [user?.uid],
    []
  );

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("settingsPage.eyebrow")}
        title={t("settingsPage.title")}
        description={t("settingsPage.description")}
      />

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="h-fit xl:sticky xl:top-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{t("settingsPage.menuTitle")}</p>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1 xl:grid">
            {settingsSections.map((section) => (
              <a
                key={section.id}
                className="min-w-[220px] rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50 xl:min-w-0"
                href={`#${section.id}`}
              >
                <p className="text-sm font-semibold text-slate-900">{t(section.labelKey)}</p>
                <p className="mt-1 text-xs text-slate-500">{t(section.descriptionKey)}</p>
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-slate-500">
            {t("settingsPage.menuDescription")}
          </p>
        </Card>

        <div className="grid gap-6">
          <section id="profile-settings">
            <ProfileForm email={user.email} settings={settings} userId={user.uid} />
          </section>
          <SettingsForm syncQueue={syncQueue} userId={user.uid} settings={settings} />
        </div>
      </div>
    </div>
  );
}
