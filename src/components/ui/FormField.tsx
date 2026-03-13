"use client";

import type { ReactNode } from "react";

import { useI18n } from "@/components/providers/LanguageProvider";
import { translateValidationMessage } from "@/lib/i18n/validation";

export function FormField({
  label,
  error,
  hint,
  children
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  const { language } = useI18n();
  const translatedError = translateValidationMessage(language, error);

  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      {translatedError ? <span className="text-xs font-semibold text-rose-600">{translatedError}</span> : null}
    </label>
  );
}
