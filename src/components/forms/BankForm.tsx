"use client";

import { useEffect, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BankNameAutocomplete } from "@/components/forms/BankNameAutocomplete";
import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  bankCountryCatalog,
  inferBankCountry,
  supportedBankCountries
} from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { bankSchema, type BankFormValues, type BankInput } from "@/lib/validators/finance";
import type { CurrencyCode } from "@/types/finance";

export function BankForm({ userId, defaultCurrency = "USD" }: { userId: string; defaultCurrency?: CurrencyCode }) {
  const defaultCountry = inferBankCountry("", defaultCurrency);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { t } = useI18n();
  const {
    control,
    register,
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<BankFormValues, unknown, BankInput>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      country: defaultCountry,
      bankName: "",
      nickname: "",
      last4: "",
      currency: bankCountryCatalog[defaultCountry].currency,
      note: ""
    }
  });
  const selectedCountry = watch("country") || defaultCountry;
  const selectedCountryMeta = bankCountryCatalog[selectedCountry];

  useEffect(() => {
    setValue("currency", selectedCountryMeta.currency);
    setValue("bankName", "");
  }, [selectedCountry, selectedCountryMeta.currency, setValue]);

  function onSubmit(values: BankInput) {
    setMessage("");

    startTransition(async () => {
      await ledgerService.createBank(userId, values);
      setMessage(t("bankForm.saved"));
      reset({
        country: values.country,
        bankName: "",
        nickname: "",
        last4: "",
        currency: values.currency,
        note: ""
      });
    });
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">{t("bankForm.title")}</h2>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label={t("common.country")}
            error={errors.country?.message}
            hint={t("bankForm.countryHint")}
          >
            <Select {...register("country")}>
              {supportedBankCountries.map((country) => (
                <option key={country} value={country}>
                  {bankCountryCatalog[country].label}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label={t("bankForm.bankName")} error={errors.bankName?.message}>
            <Controller
              control={control}
              name="bankName"
              render={({ field }) => (
                <BankNameAutocomplete
                  country={selectedCountry}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                />
              )}
            />
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            label={t("common.currency")}
            error={errors.currency?.message}
            hint={t("bankForm.currencyHint", {
              country: selectedCountryMeta.label,
              currency: selectedCountryMeta.currency
            })}
          >
            <Select disabled value={selectedCountryMeta.currency}>
              <option value={selectedCountryMeta.currency}>{selectedCountryMeta.currency}</option>
            </Select>
            <input type="hidden" {...register("currency")} />
          </FormField>
          <FormField label={t("bankForm.nickname")} error={errors.nickname?.message}>
            <Input placeholder={t("bankForm.nicknamePlaceholder")} {...register("nickname")} />
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("bankForm.last4")} error={errors.last4?.message}>
            <Input maxLength={4} placeholder={t("bankForm.last4Placeholder")} {...register("last4")} />
          </FormField>
          <div />
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
