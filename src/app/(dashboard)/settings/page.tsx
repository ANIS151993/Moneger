"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { ProfileForm } from "@/components/forms/ProfileForm";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { useUserSettings } from "@/lib/hooks/use-user-settings";

const settingsSections = [
  { id: "profile-settings", label: "Profile Settings", description: "Personal identity and photo" },
  { id: "currency-settings", label: "Currency Settings", description: "Money display defaults" },
  { id: "language-settings", label: "Language Settings", description: "Preferred interface language" },
  { id: "app-settings", label: "App Settings", description: "Theme and reminder behavior" },
  { id: "privacy-sync-settings", label: "Privacy & Sync", description: "Local-first sync posture" },
  { id: "workspace-settings", label: "Workspace Settings", description: "Reset local data safely" }
] as const;

export default function SettingsPage() {
  const { user } = useAuth();
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
        eyebrow="Settings"
        title="Profile, privacy, and sync controls"
        description="Use clear subsections to manage your profile, currency, language, app behavior, privacy posture, and workspace actions."
      />

      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <Card className="h-fit xl:sticky xl:top-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Settings Menu</p>
          <div className="mt-5 grid gap-2">
            {settingsSections.map((section) => (
              <a
                key={section.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition hover:border-emerald-300 hover:bg-emerald-50"
                href={`#${section.id}`}
              >
                <p className="text-sm font-semibold text-slate-900">{section.label}</p>
                <p className="mt-1 text-xs text-slate-500">{section.description}</p>
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-slate-500">
            All settings remain isolated per signed-in account and stored locally on this device by default.
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
