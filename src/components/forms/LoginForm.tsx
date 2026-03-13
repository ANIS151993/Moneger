"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useI18n } from "@/components/providers/LanguageProvider";
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
  const { t } = useI18n();
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
        setFormError(error instanceof Error ? error.message : t("auth.errorSignIn"));
      }
    });
  }

  return (
    <Card className="rounded-[28px] p-5 sm:p-8 lg:rounded-[32px]">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">{t("auth.welcomeBack")}</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{t("auth.signInTitle")}</h1>
      <p className="mt-3 text-sm text-slate-500">
        {isConfigured
          ? t("auth.signInFirebaseDescription")
          : t("auth.signInFallbackDescription", { mode: t(`auth.mode.${authMode}`) })}
      </p>

      <form className="mt-8 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <FormField label={t("common.email")} error={errors.email?.message}>
          <Input placeholder="you@example.com" type="email" {...register("email")} />
        </FormField>
        <FormField label={t("common.password")} error={errors.password?.message}>
          <Input placeholder="••••••••" type="password" {...register("password")} />
        </FormField>
        {formError ? <p className="text-sm font-medium text-rose-600">{formError}</p> : null}
        <Button className="mt-2 w-full" type="submit" disabled={isPending}>
          {isPending ? t("auth.signingIn") : t("auth.signIn")}
        </Button>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <Link className="font-medium text-emerald-600" href="/forgot-password">
          {t("auth.forgotPassword")}
        </Link>
        <Link className="font-medium text-slate-900" href="/signup">
          {t("landing.createAccount")}
        </Link>
      </div>
    </Card>
  );
}
