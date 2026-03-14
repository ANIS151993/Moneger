"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useI18n } from "@/components/providers/LanguageProvider";
import { LoadingCard } from "@/components/shared/LoadingCard";
import { useUserSettingsState } from "@/lib/hooks/use-user-settings";
import { isProfileComplete } from "@/lib/utils/profile";

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
  const { settings, hydrating } = useUserSettingsState(userId);
  const profileComplete = isProfileComplete(settings);
  const currentPath = normalizePathname(pathname) || "/dashboard";
  const currentPathAllowed = onboardingRoutes.has(currentPath);
  const waitingForSettings = hydrating && settings === undefined;

  useEffect(() => {
    if (waitingForSettings) {
      return;
    }

    if (!profileComplete && !currentPathAllowed) {
      router.replace("/welcome");
      return;
    }

    if (profileComplete && currentPath === "/welcome") {
      router.replace("/guide");
    }
  }, [currentPath, currentPathAllowed, profileComplete, router, waitingForSettings]);

  if (waitingForSettings) {
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
