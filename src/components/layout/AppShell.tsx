"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { DeveloperSignatureCard } from "@/components/branding/DeveloperSignatureCard";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Button, buttonClassName } from "@/components/ui/Button";
import { useI18n } from "@/components/providers/LanguageProvider";
import { dashboardNavigation, onboardingNavigation } from "@/lib/constants/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { cn } from "@/lib/utils/cn";
import { getCompactProfileMeta, getProfileDisplayName, isProfileComplete } from "@/lib/utils/profile";

function normalizePathname(pathname?: string | null) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) || "/" : pathname;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = normalizePathname(usePathname());
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const profile = useUserSettings(user?.uid);
  const displayName = getProfileDisplayName(profile, user?.email);
  const compactMeta = getCompactProfileMeta(profile, user?.email);
  const profileComplete = isProfileComplete(profile);
  const navigation = profileComplete ? dashboardNavigation : onboardingNavigation;
  const profileHref = profileComplete ? "/settings" : "/welcome";
  const guideActive = pathname === "/guide";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.12),_transparent_24rem),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="w-full shrink-0 rounded-[32px] border border-white/70 bg-slate-950 px-5 py-6 text-slate-100 shadow-2xl lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-[280px]">
          <Link
            className="group relative block overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_36%),linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-4 shadow-[0_18px_54px_rgba(2,6,23,0.34)] transition hover:-translate-y-0.5 hover:bg-white/10"
            href={profileHref}
          >
            <div className="absolute -left-6 -top-4 h-20 w-20 rounded-full bg-emerald-300/15 blur-2xl transition duration-300 group-hover:scale-110" />
            <div className="relative flex items-center gap-4">
              <ProfileAvatar imageUrl={profile?.avatarDataUrl} name={displayName} size="md" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  {profileComplete ? t("layout.profile") : t("layout.profileSetup")}
                </p>
                <p className="mt-1 truncate text-lg font-semibold tracking-tight text-white">{displayName}</p>
                <p className="mt-1 truncate text-sm text-slate-400">{compactMeta}</p>
              </div>
            </div>
          </Link>
          <nav className="mt-6 grid gap-2">
            {navigation.map((item, index) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative overflow-hidden rounded-[24px] border px-4 py-3 text-sm font-medium transition duration-300",
                    active
                      ? "border-emerald-300/[0.35] bg-[radial-gradient(circle_at_right,_rgba(56,189,248,0.3),_transparent_38%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(5,150,105,0.9))] text-white shadow-[0_16px_42px_rgba(8,47,73,0.3)]"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:-translate-y-0.5 hover:border-sky-300/[0.25] hover:bg-white/[0.09] hover:text-white"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-y-2 left-2 w-1 rounded-full transition duration-300",
                      active ? "bg-[linear-gradient(180deg,#86efac_0%,#38bdf8_100%)]" : "bg-transparent group-hover:bg-emerald-300/60"
                    )}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 transition duration-300",
                      active ? "opacity-100" : "group-hover:opacity-100"
                    )}
                  >
                    <div className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-white/[0.08] blur-xl" />
                  </div>
                  <div className="relative flex items-center justify-between gap-3 pl-3">
                    <span>{t(item.labelKey)}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-1 text-[10px] font-semibold tracking-[0.18em]",
                        active ? "bg-white/[0.12] text-white" : "bg-white/[0.08] text-slate-400 group-hover:text-slate-200"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <Link
            className={cn(
              "group relative mt-4 block overflow-hidden rounded-[26px] border p-4 shadow-[0_18px_54px_rgba(2,6,23,0.24)] transition duration-300 hover:-translate-y-0.5",
              guideActive
                ? "border-sky-300/[0.35] bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.3),_transparent_34%),linear-gradient(150deg,rgba(14,116,144,0.92),rgba(15,23,42,0.96))]"
                : "border-emerald-300/20 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_32%),linear-gradient(150deg,rgba(16,185,129,0.2),rgba(15,23,42,0.18))] hover:border-sky-300/[0.25]"
            )}
            href="/guide"
          >
            <div className="absolute -right-4 top-0 h-16 w-16 rounded-full bg-sky-300/20 blur-2xl transition duration-300 group-hover:scale-110" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200">
                  {t("layout.guideSpotlightEyebrow")}
                </p>
                <h2 className="mt-2 text-sm font-semibold tracking-tight text-white">
                  {t("layout.guideSpotlightTitle")}
                </h2>
                <p className="mt-2 text-xs leading-5 text-slate-200">
                  {profileComplete
                    ? t("layout.guideSpotlightDescription")
                    : t("layout.guideSpotlightOnboardingDescription")}
                </p>
              </div>
              <span className="rounded-full border border-white/[0.12] bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                {t("layout.guideSpotlightAction")}
              </span>
            </div>
          </Link>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{t("layout.privacyMode")}</p>
            <p className="mt-3 text-sm text-slate-300">
              {t("layout.privacyDescription")}
            </p>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4">
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="mt-1 truncate text-xs text-slate-400">{compactMeta}</p>
            <p className="mt-3 text-xs text-slate-400">{t("layout.dataStoreIsolated")}</p>
            <Button
              className="mt-4 w-full border-white/[0.15] bg-white/[0.07] text-white hover:border-rose-300/[0.25] hover:bg-rose-400/10 hover:text-rose-100"
              variant="ghost"
              onClick={() => void logout()}
            >
              {t("layout.signOut")}
            </Button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-[32px] border border-white/80 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_28%),linear-gradient(145deg,rgba(255,255,255,0.82),rgba(241,245,249,0.74))] px-6 py-5 shadow-[0_18px_52px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">
                {profileComplete ? t("layout.workspaceTag") : t("layout.onboardingTag")}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {profileComplete ? t("layout.workspaceTitle") : t("layout.onboardingTitle")}
              </h2>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {profileComplete ? t("layout.workspaceBanner") : t("layout.onboardingBanner")}
            </div>
          </header>
          <main className="pb-8">
            <div className="space-y-6 rounded-[34px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.42),_transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02))] p-1">
              {children}
              <DeveloperSignatureCard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
