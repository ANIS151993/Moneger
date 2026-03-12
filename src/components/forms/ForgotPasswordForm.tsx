"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/hooks/use-auth";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validators/auth";

export function ForgotPasswordForm() {
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { resetPassword } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" }
  });

  function onSubmit(values: ForgotPasswordInput) {
    setFormError("");
    setMessage("");

    startTransition(async () => {
      try {
        await resetPassword(values.email);
        setMessage("Password reset flow triggered. Check your email or local demo note.");
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Unable to send reset email");
      }
    });
  }

  return (
    <Card className="rounded-[32px] p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Recover access</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Reset your password</h1>
      <p className="mt-3 text-sm text-slate-500">
        Request a reset link without exposing any financial records to the server.
      </p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Email" error={errors.email?.message}>
          <Input placeholder="you@example.com" type="email" {...register("email")} />
        </FormField>
        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        {formError ? <p className="text-sm font-medium text-rose-600">{formError}</p> : null}
        <Button className="mt-2 w-full" type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send reset link"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-slate-500">
        Remembered your password?{" "}
        <Link className="font-medium text-slate-900" href="/login">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
