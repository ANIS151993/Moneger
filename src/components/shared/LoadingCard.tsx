"use client";

import { Card } from "@/components/ui/Card";
import { useI18n } from "@/components/providers/LanguageProvider";

export function LoadingCard({ title }: { title?: string }) {
  const { t } = useI18n();

  return (
    <Card className="animate-pulse">
      <div className="h-3 w-32 rounded-full bg-slate-200" />
      <div className="mt-4 h-8 w-64 rounded-full bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
      <p className="mt-6 text-sm text-slate-400">{title || t("common.loadingWorkspace")}</p>
    </Card>
  );
}
