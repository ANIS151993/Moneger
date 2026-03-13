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
import { debtStatuses, supportedCurrencies } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { debtSchema, type DebtFormValues, type DebtInput } from "@/lib/validators/finance";
import type { CurrencyCode } from "@/types/finance";

export function DebtForm({ userId, defaultCurrency = "USD" }: { userId: string; defaultCurrency?: CurrencyCode }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<DebtFormValues, unknown, DebtInput>({
    resolver: zodResolver(debtSchema),
    defaultValues: {
      creditorName: "",
      creditorEmail: "",
      creditorPhone: "",
      amount: 0,
      currency: defaultCurrency,
      note: "",
      createdDate: new Date().toISOString().slice(0, 10),
      settlementDate: new Date().toISOString().slice(0, 10),
      status: "unpaid"
    }
  });

  function onSubmit(values: DebtInput) {
    setMessage("");

    startTransition(async () => {
      await ledgerService.createDebt(userId, values);
      setMessage(t("debtForm.saved"));
      reset({
        ...values,
        creditorName: "",
        creditorEmail: "",
        creditorPhone: "",
        amount: 0,
        note: ""
      });
    });
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">{t("debtForm.title")}</h2>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("debtForm.creditorName")} error={errors.creditorName?.message}>
            <Input placeholder={t("debtForm.creditorPlaceholder")} {...register("creditorName")} />
          </FormField>
          <FormField label={t("debtForm.creditorEmail")} error={errors.creditorEmail?.message}>
            <Input placeholder={t("common.optionalEmail")} type="email" {...register("creditorEmail")} />
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("debtForm.creditorPhone")} error={errors.creditorPhone?.message}>
            <Input placeholder={t("common.optionalPhone")} {...register("creditorPhone")} />
          </FormField>
          <FormField label={t("common.status")} error={errors.status?.message}>
            <Select {...register("status")}>
              {debtStatuses.map((status) => (
                <option key={status} value={status}>
                  {t(`options.debtStatus.${status}`)}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("common.amount")} error={errors.amount?.message}>
            <Input step="0.01" type="number" {...register("amount")} />
          </FormField>
          <FormField label={t("common.currency")} error={errors.currency?.message}>
            <Select {...register("currency")}>
              {supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("debtForm.createdDate")} error={errors.createdDate?.message}>
            <Input type="date" {...register("createdDate")} />
          </FormField>
          <FormField label={t("debtForm.settlementDate")} error={errors.settlementDate?.message}>
            <Input type="date" {...register("settlementDate")} />
          </FormField>
        </div>
        <FormField label={t("common.note")} error={errors.note?.message}>
          <Textarea placeholder={t("common.optionalNote")} {...register("note")} />
        </FormField>
        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("common.saving") : t("debtForm.save")}
        </Button>
      </form>
    </Card>
  );
}
