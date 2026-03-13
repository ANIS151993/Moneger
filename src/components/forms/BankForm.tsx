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
import { banks, supportedCurrencies } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { bankSchema, type BankFormValues, type BankInput } from "@/lib/validators/finance";
import type { CurrencyCode } from "@/types/finance";

export function BankForm({ userId, defaultCurrency = "USD" }: { userId: string; defaultCurrency?: CurrencyCode }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<BankFormValues, unknown, BankInput>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bankName: banks[0],
      nickname: "",
      last4: "",
      currency: defaultCurrency,
      note: ""
    }
  });

  function onSubmit(values: BankInput) {
    setMessage("");

    startTransition(async () => {
      await ledgerService.createBank(userId, values);
      setMessage(t("bankForm.saved"));
      reset({
        ...values,
        nickname: "",
        last4: "",
        note: ""
      });
    });
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">{t("bankForm.title")}</h2>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("bankForm.bankName")} error={errors.bankName?.message}>
            <Select {...register("bankName")}>
              {banks.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label={t("bankForm.nickname")} error={errors.nickname?.message}>
            <Input placeholder={t("bankForm.nicknamePlaceholder")} {...register("nickname")} />
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("bankForm.last4")} error={errors.last4?.message}>
            <Input maxLength={4} placeholder={t("bankForm.last4Placeholder")} {...register("last4")} />
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
        <FormField label={t("common.note")} error={errors.note?.message}>
          <Textarea placeholder={t("common.optionalNote")} {...register("note")} />
        </FormField>
        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? t("common.saving") : t("bankForm.save")}
        </Button>
      </form>
    </Card>
  );
}
