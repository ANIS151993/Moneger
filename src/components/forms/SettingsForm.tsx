"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "@/components/providers/LanguageProvider";
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
  const { setLanguagePreference, t } = useI18n();
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<SettingsFormValues, unknown, SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      baseCurrency: settings?.baseCurrency || "USD",
      comparisonCurrency: settings?.comparisonCurrency || "",
      languagePreference: settings?.languagePreference || "en",
      notificationsEnabled: settings?.notificationsEnabled ?? true,
      optionalEncryptedSyncEnabled: settings?.optionalEncryptedSyncEnabled ?? false,
      themePreference: settings?.themePreference || "system"
    }
  });

  useEffect(() => {
    if (settings) {
      reset({
        baseCurrency: settings.baseCurrency,
        comparisonCurrency: settings.comparisonCurrency,
        languagePreference: settings.languagePreference,
        notificationsEnabled: settings.notificationsEnabled,
        optionalEncryptedSyncEnabled: settings.optionalEncryptedSyncEnabled,
        themePreference: settings.themePreference
      });
    }
  }, [reset, settings]);

  const selectedLanguage = watch("languagePreference");
  const selectedBaseCurrency = watch("baseCurrency");
  const selectedComparisonCurrency = watch("comparisonCurrency");

  useEffect(() => {
    if (selectedLanguage) {
      setLanguagePreference(selectedLanguage);
    }
  }, [selectedLanguage, setLanguagePreference]);

  useEffect(() => {
    if (selectedComparisonCurrency && selectedComparisonCurrency === selectedBaseCurrency) {
      setValue("comparisonCurrency", "", { shouldDirty: true, shouldValidate: true });
    }
  }, [selectedBaseCurrency, selectedComparisonCurrency, setValue]);

  function onSubmit(values: SettingsInput) {
    setMessage("");

    startTransition(async () => {
      await ledgerService.saveSettings(userId, {
        ...values,
        browserNotificationsPermission:
          typeof Notification === "undefined" ? "unsupported" : Notification.permission
      });
      setMessage(t("settings.saved"));
    });
  }

  async function handleRequestPermission() {
    const permission = await requestBrowserNotificationPermission();
    const currentValues = getValues();
    await ledgerService.saveSettings(userId, {
      ...currentValues,
      browserNotificationsPermission: permission
    });
    setMessage(
      t("settings.notificationPermissionMessage", {
        permission: t(`permission.${permission}`)
      })
    );
  }

  async function handleClearWorkspace() {
    const confirmed = window.confirm(t("settings.clearLocalRecordsConfirmation"));

    if (!confirmed) {
      return;
    }

    await ledgerService.clearWorkspace(userId);
    setMessage(t("settings.clearLocalRecordsSuccess"));
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="border-slate-900 bg-slate-950 text-white shadow-[0_24px_80px_rgba(2,6,23,0.42)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">{t("settings.controlCenter")}</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">{t("settings.controlCenterTitle")}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              {t("settings.controlCenterDescription")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? t("common.saving") : t("settings.saveAll")}
            </Button>
            {message ? <p className="text-sm font-medium text-emerald-300">{message}</p> : null}
          </div>
        </div>
      </Card>

      <Card id="currency-settings">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{t("settings.currencySection")}</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{t("settings.currencyTitle")}</h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("settings.currencyDescription")}
        </p>
        <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {t("settings.currencyCoreRule")}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FormField
            label={t("common.baseCurrency")}
            error={errors.baseCurrency?.message}
            hint={t("settings.baseCurrencyDescription")}
          >
            <Select {...register("baseCurrency")}>
              <option value="USD">USD</option>
              <option value="BDT">BDT</option>
            </Select>
          </FormField>
          <FormField
            label={t("common.comparisonCurrency")}
            error={errors.comparisonCurrency?.message}
            hint={t("settings.comparisonCurrencyDescription")}
          >
            <Select {...register("comparisonCurrency")}>
              <option value="">{t("settings.comparisonCurrencyNone")}</option>
              <option value="USD" disabled={selectedBaseCurrency === "USD"}>
                USD
              </option>
              <option value="BDT" disabled={selectedBaseCurrency === "BDT"}>
                BDT
              </option>
            </Select>
          </FormField>
        </div>
      </Card>

      <Card id="language-settings">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-600">{t("settings.languageSection")}</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{t("settings.languageTitle")}</h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("settings.languageDescription")}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <FormField label={t("settings.language")} error={errors.languagePreference?.message}>
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
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">{t("settings.appSection")}</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{t("settings.appTitle")}</h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("settings.appDescription")}
        </p>
        <div className="mt-6 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label={t("settings.theme")} error={errors.themePreference?.message}>
              <Select {...register("themePreference")}>
                <option value="system">{t("settings.theme.system")}</option>
                <option value="light">{t("settings.theme.light")}</option>
              </Select>
            </FormField>
          </div>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {t("settings.enableReminders")}
            <input type="checkbox" {...register("notificationsEnabled")} />
          </label>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-sm font-medium text-slate-900">{t("settings.notificationPermissionTitle")}</p>
            <p className="mt-1 text-sm text-slate-500">
              {t("settings.notificationPermissionDescription")}
            </p>
            <div className="mt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => void handleRequestPermission()}
                disabled={!browserNotificationSupported()}
              >
                {t("settings.requestPermission")}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card id="privacy-sync-settings">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">{t("settings.privacySection")}</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{t("settings.privacyTitle")}</h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("settings.privacyDescription")}
        </p>
        <div className="mt-6 grid gap-4">
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            {t("settings.syncToggle")}
            <input type="checkbox" {...register("optionalEncryptedSyncEnabled")} />
          </label>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <p className="text-sm font-medium text-slate-900">{t("settings.architectureTitle")}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {t("settings.architectureDescription")}
            </p>
          </div>
          {syncQueue.length === 0 ? (
            <EmptyState
              title={t("settings.syncQueueEmptyTitle")}
              description={t("settings.syncQueueEmptyDescription")}
            />
          ) : (
            <SimpleTable
              title={t("settings.syncQueueTitle")}
              description={t("settings.syncQueueDescription")}
              rows={syncQueue}
              columns={[
                {
                  key: "entity",
                  header: t("common.entity"),
                  render: (item) => t(`options.syncEntity.${item.entityType}`)
                },
                {
                  key: "action",
                  header: t("common.action"),
                  render: (item) => t(`options.syncAction.${item.action}`)
                },
                {
                  key: "status",
                  header: t("common.status"),
                  render: (item) => (
                    <Badge tone={item.status === "uploaded" ? "success" : item.status === "failed" ? "danger" : "info"}>
                      {t(`options.syncStatus.${item.status}`)}
                    </Badge>
                  )
                },
                {
                  key: "createdAt",
                  header: t("common.queued"),
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
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-600">{t("settings.workspaceSection")}</p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{t("settings.workspaceTitle")}</h2>
        <p className="mt-2 text-sm text-slate-500">
          {t("settings.workspaceDescription")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="danger" onClick={() => void handleClearWorkspace()}>
            {t("settings.clearLocalRecords")}
          </Button>
        </div>
      </Card>
    </form>
  );
}
