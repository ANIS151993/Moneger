"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SimpleTable } from "@/components/shared/SimpleTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { languagePreferences } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import {
  browserNotificationSupported,
  requestBrowserNotificationPermission
} from "@/lib/services/notification-service";
import { formatDateTime, relativeFromNow } from "@/lib/utils/date";
import { settingsSchema, type SettingsFormValues, type SettingsInput } from "@/lib/validators/finance";
import type { SettingsRecord, SyncQueueRecord } from "@/types/finance";

export function SettingsForm({
  userId,
  settings,
  syncQueue
}: {
  userId: string;
  settings?: SettingsRecord;
  syncQueue: SyncQueueRecord[];
}) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors }
  } = useForm<SettingsFormValues, unknown, SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayCurrency: settings?.displayCurrency || "USD",
      languagePreference: settings?.languagePreference || "en",
      notificationsEnabled: settings?.notificationsEnabled ?? true,
      optionalEncryptedSyncEnabled: settings?.optionalEncryptedSyncEnabled ?? false,
      themePreference: settings?.themePreference || "system"
    }
  });

  useEffect(() => {
    if (settings) {
      reset({
        displayCurrency: settings.displayCurrency,
        languagePreference: settings.languagePreference,
        notificationsEnabled: settings.notificationsEnabled,
        optionalEncryptedSyncEnabled: settings.optionalEncryptedSyncEnabled,
        themePreference: settings.themePreference
      });
    }
  }, [reset, settings]);

  function onSubmit(values: SettingsInput) {
    setMessage("");

    startTransition(async () => {
      await ledgerService.saveSettings(userId, {
        ...values,
        browserNotificationsPermission:
          typeof Notification === "undefined" ? "unsupported" : Notification.permission
      });
      setMessage("Settings saved locally.");
    });
  }

  async function handleRequestPermission() {
    const permission = await requestBrowserNotificationPermission();
    const currentValues = getValues();
    await ledgerService.saveSettings(userId, {
      ...currentValues,
      browserNotificationsPermission: permission
    });
    setMessage(`Browser notification permission: ${permission}`);
  }

  async function handleClearWorkspace() {
    const confirmed = window.confirm(
      "This will permanently remove all local income, expense, debt, owed, bank, and queued sync records on this device."
    );

    if (!confirmed) {
      return;
    }

    await ledgerService.clearWorkspace(userId);
    setMessage("Local finance records cleared.");
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-slate-900 bg-slate-950 text-white shadow-[0_24px_80px_rgba(2,6,23,0.42)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Settings Control Center</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">Manage app-level preferences</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Organize your workspace by category, save once, and keep all app-level settings local to this account.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save all settings"}
            </Button>
            {message ? <p className="text-sm font-medium text-emerald-300">{message}</p> : null}
          </div>
        </div>
      </Card>

      <Card id="currency-settings">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Currency Settings</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Money display rules</h2>
        <p className="mt-2 text-sm text-slate-500">
          Choose the base currency used in totals, trends, and summary cards across the workspace.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FormField label="Display currency" error={errors.displayCurrency?.message}>
            <Select {...register("displayCurrency")}>
              <option value="USD">USD</option>
              <option value="BDT">BDT</option>
            </Select>
          </FormField>
        </div>
      </Card>

      <Card id="language-settings">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">Language Settings</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Interface language preference</h2>
        <p className="mt-2 text-sm text-slate-500">
          Save your preferred workspace language. This currently stores the preference locally for your account.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FormField label="Language" error={errors.languagePreference?.message}>
            <Select {...register("languagePreference")}>
              {languagePreferences.map((language) => (
                <option key={language.value} value={language.value}>
                  {language.label}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
      </Card>

      <Card id="app-settings">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">App Settings</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Theme, reminders, and notifications</h2>
        <p className="mt-2 text-sm text-slate-500">
          Configure how the app behaves on this device without sending your data to a backend.
        </p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Theme" error={errors.themePreference?.message}>
              <Select {...register("themePreference")}>
                <option value="system">System</option>
                <option value="light">Light</option>
              </Select>
            </FormField>
          </div>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            Enable in-app reminders
            <input type="checkbox" {...register("notificationsEnabled")} />
          </label>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-sm font-medium text-slate-900">Browser notification permission</p>
            <p className="mt-1 text-sm text-slate-500">
              Grant permission if you want reminder alerts from this device.
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => void handleRequestPermission()}
                disabled={!browserNotificationSupported()}
              >
                Request notification permission
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card id="privacy-sync-settings">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">Privacy & Sync</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Local-first data controls</h2>
        <p className="mt-2 text-sm text-slate-500">
          Keep remote storage optional and review the local queue used for future encrypted sync workflows.
        </p>
        <div className="mt-6 grid gap-4">
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            Optional encrypted sync scaffolding
            <input type="checkbox" {...register("optionalEncryptedSyncEnabled")} />
          </label>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-sm font-medium text-slate-900">Architecture note</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Your finance records stay local by default. This queue is only here to support future encrypted sync if you choose to enable it.
            </p>
          </div>
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
      </Card>

      <Card id="workspace-settings">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">Workspace Settings</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Device-level reset actions</h2>
        <p className="mt-2 text-sm text-slate-500">
          Use this only when you want to clear the local records stored for this account on this device.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="danger" onClick={() => void handleClearWorkspace()}>
            Clear local records
          </Button>
        </div>
      </Card>
    </form>
  );
}
