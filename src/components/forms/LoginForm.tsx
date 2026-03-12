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
import { type LoginInput, loginSchema } from "@/lib/validators/auth";

export function LoginForm() {
  const router = useRouter();
  const [formError, setFormError] = useState("");
  const [isPending, startTransition] = useTransition();
  const { login, authMode, isConfigured } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  function onSubmit(values: LoginInput) {
    setFormError("");

    startTransition(async () => {
      try {
        await login(values.email, values.password);
        const nextPath =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("next")
            : null;
        router.push(nextPath || "/dashboard");
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Unable to sign in");
      }
    });
  }

  return (
    <Card className="rounded-[32px] p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Welcome back</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Sign in to Moneger</h1>
      <p className="mt-3 text-sm text-slate-500">
        {isConfigured
          ? "Authenticate with Firebase email and password."
          : `Firebase env is missing, so the app is running in ${authMode} fallback mode for local testing.`}
      </p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label="Email" error={errors.email?.message}>
          <Input placeholder="you@example.com" type="email" {...register("email")} />
        </FormField>
        <FormField label="Password" error={errors.password?.message}>
          <Input placeholder="••••••••" type="password" {...register("password")} />
        </FormField>
        {formError ? <p className="text-sm font-medium text-rose-600">{formError}</p> : null}
        <Button className="mt-2 w-full" type="submit" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
        <Link className="font-medium text-emerald-600" href="/forgot-password">
          Forgot password?
        </Link>
        <Link className="font-medium text-slate-900" href="/signup">
          Create account
        </Link>
      </div>
    </Card>
  );
}
