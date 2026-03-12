"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppIconPreview } from "@/components/branding/AppIconPreview";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { ledgerService } from "@/lib/services/ledger-service";
import {
  browserNotificationSupported,
  notificationArchitectureNote,
  requestBrowserNotificationPermission
} from "@/lib/services/notification-service";
import { settingsSchema, type SettingsFormValues, type SettingsInput } from "@/lib/validators/finance";
import type { SettingsRecord } from "@/types/finance";

export function SettingsForm({
  userId,
  settings
}: {
  userId: string;
  settings?: SettingsRecord;
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
      notificationsEnabled: settings?.notificationsEnabled ?? true,
      optionalEncryptedSyncEnabled: settings?.optionalEncryptedSyncEnabled ?? false,
      themePreference: settings?.themePreference || "system"
    }
  });

  useEffect(() => {
    if (settings) {
      reset({
        displayCurrency: settings.displayCurrency,
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
    <div className="grid gap-6">
      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Preferences</h2>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Display currency" error={errors.displayCurrency?.message}>
            <Select {...register("displayCurrency")}>
              <option value="USD">USD</option>
              <option value="BDT">BDT</option>
            </Select>
          </FormField>
          <FormField label="Theme" error={errors.themePreference?.message}>
            <Select {...register("themePreference")}>
              <option value="system">System</option>
              <option value="light">Light</option>
            </Select>
          </FormField>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            Enable in-app reminders
            <input type="checkbox" {...register("notificationsEnabled")} />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            Optional encrypted sync scaffolding
            <input type="checkbox" {...register("optionalEncryptedSyncEnabled")} />
          </label>
          {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save settings"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void handleRequestPermission()}
              disabled={!browserNotificationSupported()}
            >
              Request notification permission
            </Button>
            <Button type="button" variant="danger" onClick={() => void handleClearWorkspace()}>
              Clear local records
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Branding and install</h2>
        <p className="mt-3 text-sm text-slate-500">
          Moneger is ready for a PWA install surface and portable domain setup across
          <span className="font-medium text-slate-700"> moneger.marcbd.site</span>,
          <span className="font-medium text-slate-700"> moneger.app</span>,
          <span className="font-medium text-slate-700"> moneger.io</span>, and
          <span className="font-medium text-slate-700"> moneger.com</span>.
        </p>
        <div className="mt-6">
          <AppIconPreview />
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">Notification architecture note</h2>
        <p className="mt-3 text-sm text-slate-500">{notificationArchitectureNote}</p>
      </Card>
    </div>
  );
}
