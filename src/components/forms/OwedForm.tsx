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
import { owedStatuses, supportedCurrencies } from "@/lib/constants/options";
import { ledgerService } from "@/lib/services/ledger-service";
import { owedSchema, type OwedFormValues, type OwedInput } from "@/lib/validators/finance";

export function OwedForm({ userId }: { userId: string }) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm<OwedFormValues, unknown, OwedInput>({
    resolver: zodResolver(owedSchema),
    defaultValues: {
      debtorName: "",
      debtorEmail: "",
      debtorPhone: "",
      amount: 0,
      currency: "USD",
      note: "",
      createdDate: new Date().toISOString().slice(0, 10),
      settlementDate: new Date().toISOString().slice(0, 10),
      status: "pending"
    }
  });

  function onSubmit(values: OwedInput) {
    setMessage("");

    startTransition(async () => {
      await ledgerService.createOwed(userId, values);
      setMessage("Money owed record saved locally.");
      reset({
        ...values,
        debtorName: "",
        debtorEmail: "",
        debtorPhone: "",
        amount: 0,
        note: ""
      });
    });
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold tracking-tight text-slate-950">Track money owed to you</h2>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Debtor name" error={errors.debtorName?.message}>
            <Input placeholder="Debtor" {...register("debtorName")} />
          </FormField>
          <FormField label="Debtor email" error={errors.debtorEmail?.message}>
            <Input placeholder="Optional email" type="email" {...register("debtorEmail")} />
          </FormField>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Debtor phone" error={errors.debtorPhone?.message}>
            <Input placeholder="Optional phone" {...register("debtorPhone")} />
          </FormField>
          <FormField label="Status" error={errors.status?.message}>
            <Select {...register("status")}>
              {owedStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
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
          <FormField label="Created date" error={errors.createdDate?.message}>
            <Input type="date" {...register("createdDate")} />
          </FormField>
          <FormField label="Settlement date" error={errors.settlementDate?.message}>
            <Input type="date" {...register("settlementDate")} />
          </FormField>
        </div>
        <FormField label="Note" error={errors.note?.message}>
          <Textarea placeholder="Optional note" {...register("note")} />
        </FormField>
        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save money owed"}
        </Button>
      </form>
    </Card>
  );
}
