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
import { currencyCatalog, expenseCategories, supportedCurrencies } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { expenseSchema, type ExpenseFormValues, type ExpenseInput } from "@/lib/validators/finance";
import type { CurrencyCode } from "@/types/finance";

export function ExpenseForm({ userId, defaultCurrency = "USD" }: { userId: string; defaultCurrency?: CurrencyCode }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ExpenseFormValues, unknown, ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      currency: defaultCurrency,
      source: "",
      category: "Food",
      note: "",
      date: new Date().toISOString().slice(0, 10)
    }
  });

  function onSubmit(values: ExpenseInput) {
    setMessage("");

    startTransition(async () => {
      await ledgerService.createExpense(userId, values);
      setMessage(t("expenseForm.saved"));
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
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">{t("expenseForm.title")}</h2>
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
          <FormField label={t("expenseForm.sourceLabel")} error={errors.source?.message}>
            <Input placeholder={t("expenseForm.sourcePlaceholder")} {...register("source")} />
          </FormField>
          <FormField label={t("common.category")} error={errors.category?.message}>
            <Select {...register("category")}>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {t(`options.expenseCategory.${category}`)}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <FormField label={t("common.date")} error={errors.date?.message}>
          <Input type="date" {...register("date")} />
        </FormField>
        <FormField label={t("common.note")} error={errors.note?.message}>
          <Textarea placeholder={t("common.optionalNote")} {...register("note")} />
        </FormField>
        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("common.saving") : t("expenseForm.save")}
        </Button>
      </form>
    </Card>
  );
}
