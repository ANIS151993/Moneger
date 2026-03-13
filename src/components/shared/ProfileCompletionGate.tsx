"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { usePathname, useRouter } from "next/navigation";

import { useI18n } from "@/components/providers/LanguageProvider";
import { LoadingCard } from "@/components/shared/LoadingCard";
import { settingsRepository } from "@/lib/repositories/finance-repositories";
import { isProfileComplete } from "@/lib/utils/profile";
import type { SettingsRecord } from "@/types/finance";

const onboardingRoutes = new Set(["/welcome", "/guide"]);

function normalizePathname(pathname?: string | null) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) || "/" : pathname;
}

export function ProfileCompletionGate({
  children,
  userId
}: {
  children: ReactNode;
  userId: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const settings = useLiveQuery(
    async () => settingsRepository.get(userId),
    [userId],
    null as SettingsRecord | undefined | null
  );
  const profileComplete = settings === null ? false : isProfileComplete(settings);
  const currentPath = normalizePathname(pathname) || "/dashboard";
  const currentPathAllowed = onboardingRoutes.has(currentPath);

  useEffect(() => {
    if (settings === null) {
      return;
    }

    if (!profileComplete && !currentPathAllowed) {
      router.replace("/welcome");
      return;
    }

    if (profileComplete && currentPath === "/welcome") {
      router.replace("/guide");
    }
  }, [currentPath, currentPathAllowed, profileComplete, router, settings]);

  if (settings === null) {
    return <LoadingCard title={t("onboarding.loadingProfileGate")} />;
  }

  if (!profileComplete && !currentPathAllowed) {
    return <LoadingCard title={t("onboarding.redirectingProfileGate")} />;
  }

  if (profileComplete && currentPath === "/welcome") {
    return <LoadingCard title={t("onboarding.redirectingGuide")} />;
  }

  return <>{children}</>;
}
