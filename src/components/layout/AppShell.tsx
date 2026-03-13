"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const profile = useUserSettings(user?.uid);
  const displayName = getProfileDisplayName(profile, user?.email);
  const compactMeta = getCompactProfileMeta(profile, user?.email);
  const profileComplete = isProfileComplete(profile);
  const navigation = profileComplete ? dashboardNavigation : onboardingNavigation;
  const profileHref = profileComplete ? "/settings" : "/welcome";
  const guideActive = pathname === "/guide";
  const showWorkspaceHeader = pathname !== "/dashboard";

  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;

    if (mobileNavOpen) {
      body.style.overflow = "hidden";
    }

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.12),_transparent_24rem),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)]">
      <div className="safe-shell mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 px-3 pb-4 pt-3 sm:px-4 sm:pb-5 lg:flex-row lg:gap-6 lg:px-6 lg:py-4">
        <div className="sticky top-0 z-30 lg:hidden">
          <div className="glass flex items-center justify-between gap-3 rounded-[26px] border border-white/80 px-3 py-3 shadow-[0_16px_40px_rgba(15,23,42,0.1)] backdrop-blur">
            <Link className="flex min-w-0 flex-1 items-center gap-3" href={profileHref}>
              <ProfileAvatar className="origin-left scale-[0.88]" imageUrl={profile?.avatarDataUrl} name={displayName} showBadge={false} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight text-slate-950">{displayName}</p>
                <p className="truncate text-[11px] text-slate-500">{compactMeta}</p>
              </div>
            </Link>
            <button
              aria-label="Toggle menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition active:scale-[0.98]"
              type="button"
              onClick={() => setMobileNavOpen((current) => !current)}
            >
              <span className="flex flex-col gap-1.5">
                <span
                  className={cn(
                    "h-0.5 w-5 rounded-full bg-current transition duration-300",
                    mobileNavOpen ? "translate-y-2 rotate-45" : ""
                  )}
                />
                <span
                  className={cn(
                    "h-0.5 w-5 rounded-full bg-current transition duration-300",
                    mobileNavOpen ? "opacity-0" : ""
                  )}
                />
                <span
                  className={cn(
                    "h-0.5 w-5 rounded-full bg-current transition duration-300",
                    mobileNavOpen ? "-translate-y-2 -rotate-45" : ""
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        <button
          aria-hidden={!mobileNavOpen}
          className={cn(
            "fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition duration-300 lg:hidden",
            mobileNavOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
          type="button"
          onClick={() => setMobileNavOpen(false)}
        />

        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 flex w-[min(86vw,320px)] flex-col overflow-y-auto border border-white/10 bg-slate-950 px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] text-slate-100 shadow-2xl transition-transform duration-300 lg:static lg:z-auto lg:h-[calc(100vh-2rem)] lg:w-[280px] lg:shrink-0 lg:rounded-[32px] lg:border-white/70 lg:px-5 lg:py-6",
            mobileNavOpen ? "translate-x-0" : "-translate-x-[105%] lg:translate-x-0"
          )}
        >
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
                {profileComplete ? t("layout.workspaceTag") : t("layout.onboardingTag")}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {profileComplete ? t("layout.workspaceTitle") : t("layout.onboardingTitle")}
              </p>
            </div>
            <button
              aria-label="Close menu"
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200"
              type="button"
              onClick={() => setMobileNavOpen(false)}
            >
              <span className="text-lg leading-none">×</span>
            </button>
          </div>

          <Link
            className="group relative block overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.22),_transparent_36%),linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] px-4 py-3.5 shadow-[0_18px_54px_rgba(2,6,23,0.34)] transition hover:-translate-y-0.5 hover:bg-white/10 lg:rounded-[30px] lg:px-4 lg:py-4"
            href={profileHref}
          >
            <div className="absolute -left-6 -top-4 h-20 w-20 rounded-full bg-emerald-300/15 blur-2xl transition duration-300 group-hover:scale-110" />
            <div className="relative flex items-center gap-3 lg:gap-4">
              <ProfileAvatar imageUrl={profile?.avatarDataUrl} name={displayName} showBadge={false} size="sm" className="self-start lg:hidden" />
              <ProfileAvatar imageUrl={profile?.avatarDataUrl} name={displayName} showBadge={false} size="md" className="hidden self-start lg:inline-flex" />
              <div className="min-w-0 flex-1 py-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
                  {profileComplete ? t("layout.profile") : t("layout.profileSetup")}
                </p>
                <p className="mt-1 truncate text-base font-semibold tracking-tight text-white sm:text-lg">{displayName}</p>
                <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">{compactMeta}</p>
              </div>
            </div>
          </Link>
          <nav className="mt-5 grid gap-2 lg:mt-6">
            {navigation.map((item) => {
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
                  <div className="relative flex items-center gap-3 pl-3">
                    <span>{t(item.labelKey)}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          <Link
            className={buttonClassName({
              className: cn(
                "group relative mt-4 flex min-h-11 w-full items-center justify-center overflow-hidden rounded-[22px] border px-4 py-3 text-sm shadow-[0_18px_42px_rgba(8,47,73,0.26)] lg:rounded-[24px]",
                guideActive
                  ? "border-sky-200/50 bg-[radial-gradient(circle_at_top_right,_rgba(125,211,252,0.32),_transparent_36%),linear-gradient(135deg,#0f172a_0%,#0f766e_54%,#38bdf8_100%)] text-white"
                  : "border-emerald-300/20 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.2),_transparent_34%),linear-gradient(135deg,#052e16_0%,#0f172a_56%,#0f766e_100%)] text-white hover:border-sky-200/40 hover:shadow-[0_22px_50px_rgba(8,47,73,0.32)]"
              ),
              variant: "secondary"
            })}
            href="/guide"
          >
            <div className="absolute -right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-sky-300/20 blur-2xl transition duration-300 group-hover:scale-125" />
            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-bold text-white">
                G
              </span>
              <span>{t("layout.guideSpotlightTitle")}</span>
            </div>
          </Link>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 lg:mt-8">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{t("layout.privacyMode")}</p>
            <p className="mt-3 text-sm text-slate-300">
              {t("layout.privacyDescription")}
            </p>
          </div>

          <div className="mt-6 border-t border-white/10 pt-4 lg:mt-8">
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

        <div className="flex min-h-0 flex-1 flex-col gap-4 lg:gap-6">
          {showWorkspaceHeader ? (
            <header className="flex flex-col gap-3 rounded-[26px] border border-white/80 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_28%),linear-gradient(145deg,rgba(255,255,255,0.82),rgba(241,245,249,0.74))] px-4 py-4 shadow-[0_18px_52px_rgba(15,23,42,0.08)] backdrop-blur sm:px-5 sm:py-5 md:flex-row md:items-start md:justify-between lg:rounded-[32px] lg:px-6">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">
                  {profileComplete ? t("layout.workspaceTag") : t("layout.onboardingTag")}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
                  {profileComplete ? t("layout.workspaceTitle") : t("layout.onboardingTitle")}
                </h2>
              </div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm leading-6 text-emerald-700">
                {profileComplete ? t("layout.workspaceBanner") : t("layout.onboardingBanner")}
              </div>
            </header>
          ) : null}
          <main className="pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-8">
            <div className="space-y-4 rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.42),_transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02))] p-1 sm:space-y-6 lg:rounded-[34px]">
              {children}
              <DeveloperSignatureCard />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
