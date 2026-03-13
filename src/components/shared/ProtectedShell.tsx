"use client";

import type { ReactNode } from "react";

import { useI18n } from "@/components/providers/LanguageProvider";
import { LoadingCard } from "@/components/shared/LoadingCard";
import { useRequireAuth } from "@/lib/hooks/use-require-auth";

export function ProtectedShell({ children }: { children: ReactNode }) {
  const { loading, user } = useRequireAuth();
  const { t } = useI18n();

  if (loading || !user) {
    return <LoadingCard title={t("dashboard.loadingSession")} />;
  }

  return <>{children}</>;
}
