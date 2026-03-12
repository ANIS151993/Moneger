"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { ProfileForm } from "@/components/forms/ProfileForm";
import { SettingsForm } from "@/components/forms/SettingsForm";
import { SimpleTable } from "@/components/shared/SimpleTable";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { formatDateTime, relativeFromNow } from "@/lib/utils/date";

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
        description="Manage your personal profile, workspace preferences, and local sync queue without turning cloud storage into the default."
      />

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <ProfileForm email={user.email} settings={settings} userId={user.uid} />
        <div className="grid gap-6">
          <SettingsForm userId={user.uid} settings={settings} />
          {syncQueue.length === 0 ? (
            <EmptyState
              title="Sync queue is empty"
              description="Queued local changes will appear here if you later choose to prepare encrypted sync uploads."
            />
          ) : (
            <SimpleTable
              title="Sync queue"
              description="Queued local changes waiting for optional encrypted sync handling."
              rows={syncQueue}
              columns={[
                {
                  key: "entity",
                  header: "Entity",
                  render: (item) => item.entityType
                },
                {
                  key: "action",
                  header: "Action",
                  render: (item) => item.action
                },
                {
                  key: "status",
                  header: "Status",
                  render: (item) => (
                    <Badge tone={item.status === "uploaded" ? "success" : item.status === "failed" ? "danger" : "info"}>
                      {item.status}
                    </Badge>
                  )
                },
                {
                  key: "createdAt",
                  header: "Queued",
                  render: (item) => (
                    <div>
                      <p>{relativeFromNow(item.createdAt)}</p>
                      <p className="text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
                    </div>
                  )
                }
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
