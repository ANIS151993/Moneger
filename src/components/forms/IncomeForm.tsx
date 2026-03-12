"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { incomeCategories, incomeFrequencies, supportedCurrencies } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { incomeSchema, type IncomeFormValues, type IncomeInput } from "@/lib/validators/finance";

export function IncomeForm({ userId }: { userId: string }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<IncomeFormValues, unknown, IncomeInput>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      amount: 0,
      currency: "USD",
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
      setMessage("Income record saved locally.");
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
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Add income</h2>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Amount" error={errors.amount?.message}>
            <Input step="0.01" type="number" {...register("amount")} />
          </FormField>
          <FormField label="Currency" error={errors.currency?.message}>
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
          <FormField label="Source" error={errors.source?.message}>
            <Input placeholder="Primary salary" {...register("source")} />
          </FormField>
          <FormField label="Category" error={errors.category?.message}>
            <Select {...register("category")}>
              {incomeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Frequency" error={errors.frequency?.message}>
            <Select {...register("frequency")}>
              {incomeFrequencies.map((frequency) => (
                <option key={frequency} value={frequency}>
                  {frequency}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Date" error={errors.date?.message}>
            <Input type="date" {...register("date")} />
          </FormField>
        </div>
        <FormField label="Note" error={errors.note?.message}>
          <Textarea placeholder="Optional note" {...register("note")} />
        </FormField>
        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save income"}
        </Button>
      </form>
    </Card>
  );
}
