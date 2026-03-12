"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/lib/hooks/use-auth";
import { signupSchema, type SignupInput } from "@/lib/validators/auth";

export function SignupForm() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { signup, authMode, isConfigured } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  function onSubmit(values: SignupInput) {
    setFormError("");

    startTransition(async () => {
      try {
        await signup(values.email, values.password);
        router.push("/dashboard");
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Unable to create account");
      }
    });
  }

  return (
    <Card className="rounded-[32px] p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Create your workspace</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Open your Moneger account</h1>
      <p className="mt-3 text-sm text-slate-500">
        {isConfigured
          ? "Create a Firebase-backed sign-in while keeping your finance data local."
          : `Firebase env is missing, so account creation uses ${authMode} fallback storage for local testing.`}
      </p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Email" error={errors.email?.message}>
          <Input placeholder="you@example.com" type="email" {...register("email")} />
        </FormField>
        <FormField label="Password" error={errors.password?.message} hint="Use at least 6 characters.">
          <Input placeholder="Choose a secure password" type="password" {...register("password")} />
        </FormField>
        {formError ? <p className="text-sm font-medium text-rose-600">{formError}</p> : null}
        <Button className="mt-2 w-full" type="submit" disabled={isPending}>
          {isPending ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="mt-6 text-sm text-slate-500">
        Already have an account?{" "}
        <Link className="font-medium text-slate-900" href="/login">
          Sign in
        </Link>
      </div>
    </Card>
  );
}
