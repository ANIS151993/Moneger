"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { currencyCatalog, incomeCategories, incomeFrequencies, supportedCurrencies } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { incomeSchema, type IncomeFormValues, type IncomeInput } from "@/lib/validators/finance";
import type { CurrencyCode, IncomeRecord } from "@/types/finance";

function getDefaultValues(defaultCurrency: CurrencyCode, record?: IncomeRecord): IncomeInput {
  return {
    amount: record?.amount || 0,
    currency: record?.currency || defaultCurrency,
    source: record?.source || "",
    category: record?.category || "Salary",
    frequency: record?.frequency || "monthly",
    note: record?.note || "",
    date: record?.date || new Date().toISOString().slice(0, 10)
  };
}

export function IncomeForm({
  userId,
  defaultCurrency = "USD",
  record,
  onSaved,
  onCancel
}: {
  userId: string;
  defaultCurrency?: CurrencyCode;
  record?: IncomeRecord;
  onSaved?: () => void;
  onCancel?: () => void;
}) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const isEditing = Boolean(record);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<IncomeFormValues, unknown, IncomeInput>({
    resolver: zodResolver(incomeSchema),
    defaultValues: getDefaultValues(defaultCurrency, record)
  });

  useEffect(() => {
    setMessage("");
    reset(getDefaultValues(defaultCurrency, record));
  }, [defaultCurrency, record, reset]);

  function onSubmit(values: IncomeInput) {
    setMessage("");

    startTransition(async () => {
      if (record) {
        await ledgerService.updateIncome(userId, record.id, values);
        setMessage(t("incomeForm.updated"));
        onSaved?.();
        return;
      }

      await ledgerService.createIncome(userId, values);
      setMessage(t("incomeForm.saved"));
      reset(getDefaultValues(defaultCurrency));
    });
  }

  return (
    <Card>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">
          {t(isEditing ? "incomeForm.editTitle" : "incomeForm.title")}
        </h2>
        {isEditing && onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t("common.cancel")}
          </Button>
        ) : null}
      </div>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
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
          <FormField label={t("common.source")} error={errors.source?.message}>
            <Input placeholder={t("incomeForm.sourcePlaceholder")} {...register("source")} />
          </FormField>
          <FormField label={t("common.category")} error={errors.category?.message}>
            <Select {...register("category")}>
              {incomeCategories.map((category) => (
                <option key={category} value={category}>
                  {t(`options.incomeCategory.${category}`)}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("common.frequency")} error={errors.frequency?.message}>
            <Select {...register("frequency")}>
              {incomeFrequencies.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {t(`options.incomeFrequency.${frequency}`)}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label={t("common.date")} error={errors.date?.message}>
            <Input type="date" {...register("date")} />
          </FormField>
        </div>
        <FormField label={t("common.note")} error={errors.note?.message}>
          <Textarea placeholder={t("common.optionalNote")} {...register("note")} />
        </FormField>
        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("common.saving") : t(isEditing ? "incomeForm.update" : "incomeForm.save")}
        </Button>
      </form>
    </Card>
  );
}
