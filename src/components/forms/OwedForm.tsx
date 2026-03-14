"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { firebaseClientConfigured } from "@/lib/firebase/client";
import { currencyCatalog, installmentFrequencies, owedStatuses, supportedCurrencies } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { getFinalInstallmentDate, normalizeInstallments, sumInstallments } from "@/lib/utils/installments";
import { owedSchema, type OwedFormValues, type OwedInput } from "@/lib/validators/finance";
import type { CurrencyCode, InstallmentScheduleItem, OwedRecord } from "@/types/finance";

function createEmptyInstallment(defaultDueDate: string, amount = 0): InstallmentScheduleItem {
  return {
    dueDate: defaultDueDate,
    amount,
    settled: false,
    note: "",
    frequency: "custom"
  };
}

function getDefaultValues(defaultCurrency: CurrencyCode, record?: OwedRecord): OwedInput {
  return {
    debtorName: record?.debtorName || "",
    debtorEmail: record?.debtorEmail || "",
    debtorPhone: record?.debtorPhone || "",
    amount: record?.amount || 0,
    currency: record?.currency || defaultCurrency,
    note: record?.note || "",
    createdDate: record?.createdDate || new Date().toISOString().slice(0, 10),
    settlementDate: record?.settlementDate || new Date().toISOString().slice(0, 10),
    status: record?.status || "pending",
    installments: record?.installments || []
  };
}

export function OwedForm({
  userId,
  defaultCurrency = "USD",
  record,
  onSaved,
  onCancel
}: {
  userId: string;
  defaultCurrency?: CurrencyCode;
  record?: OwedRecord;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const isEditing = Boolean(record);
  const {
    register,
    reset,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<OwedFormValues, unknown, OwedInput>({
    resolver: zodResolver(owedSchema),
    defaultValues: getDefaultValues(defaultCurrency, record)
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "installments"
  });

  const watchedAmount = watch("amount");
  const watchedSettlementDate = watch("settlementDate");
  const watchedInstallments = watch("installments");
  const normalizedInstallments = useMemo(() => normalizeInstallments(watchedInstallments), [watchedInstallments]);
  const scheduledAmount = useMemo(() => sumInstallments(normalizedInstallments), [normalizedInstallments]);
  const installmentError =
    errors.installments && !Array.isArray(errors.installments) ? errors.installments.message : undefined;

  useEffect(() => {
    setMessage("");
    setWarningMessage("");
    setFormError("");
    reset(getDefaultValues(defaultCurrency, record));
  }, [defaultCurrency, record, reset]);

  useEffect(() => {
    const finalInstallmentDate = getFinalInstallmentDate(normalizedInstallments);

    if (finalInstallmentDate && finalInstallmentDate !== watchedSettlementDate) {
      setValue("settlementDate", finalInstallmentDate, { shouldDirty: true, shouldValidate: true });
    }
  }, [normalizedInstallments, setValue, watchedSettlementDate]);

  function onSubmit(values: OwedInput) {
    setMessage("");
    setWarningMessage("");
    setFormError("");
    const normalizedInstallments = normalizeInstallments(values.installments);
    const normalizedValues: OwedInput = {
      ...values,
      settlementDate: getFinalInstallmentDate(normalizedInstallments) || values.settlementDate,
      installments: normalizedInstallments
    };

    startTransition(async () => {
      try {
        if (record) {
          const result = await ledgerService.updateOwed(userId, record.id, normalizedValues);
          setMessage(t("owedForm.updated"));
          setWarningMessage(result.collaborationWarning ? t("collaboration.localSaveWarning") : "");
          onSaved?.();
          return;
        }

        const result = await ledgerService.createOwed(userId, normalizedValues);
        setMessage(t("owedForm.saved"));
        setWarningMessage(result.collaborationWarning ? t("collaboration.localSaveWarning") : "");
        reset(getDefaultValues(defaultCurrency));
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Unable to save money owed right now.");
      }
    });
  }

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          {t(isEditing ? "owedForm.editTitle" : "owedForm.title")}
        </h2>
        {isEditing && onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        ) : null}
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("owedForm.debtorName")} error={errors.debtorName?.message}>
            <Input placeholder={t("owedForm.debtorPlaceholder")} {...register("debtorName")} />
          </FormField>
          <FormField label={t("owedForm.debtorEmail")} error={errors.debtorEmail?.message}>
            <Input placeholder={t("common.optionalEmail")} type="email" {...register("debtorEmail")} />
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("owedForm.debtorPhone")} error={errors.debtorPhone?.message}>
            <Input placeholder={t("common.optionalPhone")} {...register("debtorPhone")} />
          </FormField>
          <FormField label={t("common.status")} error={errors.status?.message}>
            <Select {...register("status")}>
              {owedStatuses.map((status) => (
                <option key={status} value={status}>
                  {t(`options.owedStatus.${status}`)}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        {firebaseClientConfigured ? (
          <p className="text-sm leading-6 text-slate-500">{t("owedForm.collaborationHint")}</p>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("common.amount")} error={errors.amount?.message}>
            <Input step="0.01" type="number" {...register("amount")} />
          </FormField>
          <FormField label={t("common.currency")} error={errors.currency?.message}>
            <Select {...register("currency")}>
              {supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currencyCatalog[currency].label}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("owedForm.createdDate")} error={errors.createdDate?.message}>
            <Input type="date" {...register("createdDate")} />
          </FormField>
          <FormField label={t("owedForm.settlementDate")} error={errors.settlementDate?.message}>
            <Input type="date" {...register("settlementDate")} />
          </FormField>
        </div>

        <Card className="border border-slate-200 bg-slate-50/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-600">
                {t("owedForm.installmentSectionTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">{t("owedForm.installmentSectionDescription")}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              onClick={() =>
                append(
                  createEmptyInstallment(
                    watchedSettlementDate || new Date().toISOString().slice(0, 10),
                    Math.max(0, Number((Number(watchedAmount || 0) - scheduledAmount).toFixed(2)))
                  )
                )
              }
            >
              {t("owedForm.addInstallment")}
            </Button>
          </div>

          {fields.length > 0 ? (
            <div className="mt-5 grid gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
                    <FormField
                      label={t("installments.dueDate")}
                      error={errors.installments?.[index]?.dueDate?.message}
                    >
                      <Input type="date" {...register(`installments.${index}.dueDate`)} />
                    </FormField>
                    <FormField
                      label={t("common.amount")}
                      error={errors.installments?.[index]?.amount?.message}
                    >
                      <Input step="0.01" type="number" {...register(`installments.${index}.amount`)} />
                    </FormField>
                    <FormField
                      label={t("installments.frequency")}
                      error={errors.installments?.[index]?.frequency?.message}
                    >
                      <Select {...register(`installments.${index}.frequency`)}>
                        {installmentFrequencies.map((frequency) => (
                          <option key={frequency} value={frequency}>
                            {t(`options.installmentFrequency.${frequency}`)}
                          </option>
                        ))}
                      </Select>
                    </FormField>
                    <div className="flex items-end">
                      <Button type="button" variant="ghost" onClick={() => remove(index)}>
                        {t("common.remove")}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_auto]">
                    <FormField
                      label={t("installments.note")}
                      error={errors.installments?.[index]?.note?.message}
                    >
                      <Input placeholder={t("common.optionalNote")} {...register(`installments.${index}.note`)} />
                    </FormField>
                    <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                      {t("owedForm.installmentSettled")}
                      <input type="checkbox" {...register(`installments.${index}.settled`)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">{t("installments.none")}</p>
          )}

          <div className="mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <p>
              {t("installments.summary", {
                settled: normalizedInstallments.filter((item) => item.settled).length,
                total: normalizedInstallments.length
              })}
            </p>
            <p className="mt-1">
              {currencyCatalog[watch("currency") || defaultCurrency].code}: {scheduledAmount.toFixed(2)} /{" "}
              {Number(watchedAmount || 0).toFixed(2)}
            </p>
            {installmentError ? <p className="mt-2 font-semibold text-rose-600">{installmentError}</p> : null}
          </div>
        </Card>

        <FormField label={t("common.note")} error={errors.note?.message}>
          <Textarea placeholder={t("common.optionalNote")} {...register("note")} />
        </FormField>

        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        {warningMessage ? <p className="text-sm font-medium text-amber-600">{warningMessage}</p> : null}
        {formError ? <p className="text-sm font-medium text-rose-600">{formError}</p> : null}

        <Button type="submit" disabled={isPending}>
          {isPending ? t("common.saving") : t(isEditing ? "owedForm.update" : "owedForm.save")}
        </Button>
      </form>
    </Card>
  );
}
