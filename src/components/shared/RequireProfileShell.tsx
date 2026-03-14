"use client";

import type { ReactNode } from "react";

import { ProfileCompletionGate } from "@/components/shared/ProfileCompletionGate";
import { SharedCollaborationSync } from "@/components/shared/SharedCollaborationSync";
import { LoadingCard } from "@/components/shared/LoadingCard";
import { useI18n } from "@/components/providers/LanguageProvider";
import { useAuth } from "@/lib/hooks/use-auth";

export function RequireProfileShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { t } = useI18n();

  if (!user) {
    return <LoadingCard title={t("dashboard.loadingSession")} />;
  }

  return (
    <ProfileCompletionGate userId={user.uid}>
      <SharedCollaborationSync />
      {children}
    </ProfileCompletionGate>
  );
}
