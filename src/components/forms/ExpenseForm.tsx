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
import { expenseCategories, supportedCurrencies } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { expenseSchema, type ExpenseFormValues, type ExpenseInput } from "@/lib/validators/finance";

export function ExpenseForm({ userId }: { userId: string }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<ExpenseFormValues, unknown, ExpenseInput>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      currency: "USD",
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
      setMessage("Expense record saved locally.");
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
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Add expense</h2>
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
          <FormField label="Merchant or source" error={errors.source?.message}>
            <Input placeholder="Rent, Groceries, Uber" {...register("source")} />
          </FormField>
          <FormField label="Category" error={errors.category?.message}>
            <Select {...register("category")}>
              {expenseCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        <FormField label="Date" error={errors.date?.message}>
          <Input type="date" {...register("date")} />
        </FormField>
        <FormField label="Note" error={errors.note?.message}>
          <Textarea placeholder="Optional note" {...register("note")} />
        </FormField>
        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save expense"}
        </Button>
      </form>
    </Card>
  );
}
