"use client";

import { useState, useTransition } from "react";
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
import type { CurrencyCode } from "@/types/finance";

export function IncomeForm({ userId, defaultCurrency = "USD" }: { userId: string; defaultCurrency?: CurrencyCode }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<IncomeFormValues, unknown, IncomeInput>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: 0,
      currency: defaultCurrency,
      source: "",
      category: "Salary",
      frequency: "monthly",
      note: "",
      date: new Date().toISOString().slice(0, 10)
    }
  });

  function onSubmit(values: IncomeInput) {
    setMessage("");

    startTransition(async () => {
      await ledgerService.createIncome(userId, values);
      setMessage(t("incomeForm.saved"));
      reset({
        ...values,
        amount: 0,
        source: "",
        note: ""
      });
    });
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">{t("incomeForm.title")}</h2>
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
          {isPending ? t("common.saving") : t("incomeForm.save")}
        </Button>
      </form>
    </Card>
  );
}
