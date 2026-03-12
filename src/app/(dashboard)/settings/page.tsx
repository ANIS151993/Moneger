"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { SettingsForm } from "@/components/forms/SettingsForm";
import { SimpleTable } from "@/components/shared/SimpleTable";
import { Badge } from "@/components/ui/Badge";
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
        title="Control privacy, currency, and sync posture"
        description="Configure how Moneger displays money, handles reminders, and prepares encrypted sync work without making remote storage the default."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SettingsForm userId={user.uid} settings={settings} />
        <SimpleTable
          title="Sync queue scaffolding"
          description="These are local placeholder jobs showing how record changes can be prepared for optional encrypted sync."
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
      </div>
    </div>
  );
}
