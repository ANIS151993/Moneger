"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { DeveloperSignatureCard } from "@/components/branding/DeveloperSignatureCard";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { InstallShortcutPrompt } from "@/components/shared/InstallShortcutPrompt";
import { Button, buttonClassName } from "@/components/ui/Button";
import { useI18n } from "@/components/providers/LanguageProvider";
import { dashboardNavigation, onboardingNavigation } from "@/lib/constants/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { messageNotificationRepository } from "@/lib/repositories/finance-repositories";
import { syncAppBadge } from "@/lib/services/notification-service";
import { cn } from "@/lib/utils/cn";
import { relativeFromNow } from "@/lib/utils/date";
import { getCompactProfileMeta, getProfileDisplayName, isProfileComplete } from "@/lib/utils/profile";

const mobilePrimaryNavigation = [
  { href: "/dashboard", labelKey: "nav.overview", icon: "overview" },
  { href: "/income", labelKey: "nav.income", icon: "income" },
  { href: "/expenses", labelKey: "nav.expenses", icon: "expenses" },
  { href: "/banks", labelKey: "nav.banks", icon: "banks" },
  { href: "/settings", labelKey: "nav.settings", icon: "settings" }
] as const;

const mobileQuickActions = [
  {
    href: "/income",
    labelKey: "nav.income",
    icon: "income",
    surfaceClassName:
      "before:from-emerald-500/[0.18] before:via-emerald-400/[0.08] before:to-transparent"
  },
  {
    href: "/expenses",
    labelKey: "nav.expenses",
    icon: "expenses",
    surfaceClassName:
      "before:from-sky-500/[0.18] before:via-sky-400/[0.08] before:to-transparent"
  },
  {
    href: "/debts",
    labelKey: "nav.debts",
    icon: "debts",
    surfaceClassName:
      "before:from-rose-500/[0.18] before:via-rose-400/[0.08] before:to-transparent"
  },
  {
    href: "/owed",
    labelKey: "nav.moneyOwed",
    icon: "owed",
    surfaceClassName:
      "before:from-amber-500/[0.18] before:via-amber-400/[0.08] before:to-transparent"
  },
  {
    href: "/banks",
    labelKey: "nav.banks",
    icon: "banks",
    surfaceClassName:
      "before:from-cyan-500/[0.18] before:via-cyan-400/[0.08] before:to-transparent"
  },
  {
    href: "/guide",
    labelKey: "nav.guide",
    icon: "guide",
    surfaceClassName:
      "before:from-violet-500/[0.18] before:via-violet-400/[0.08] before:to-transparent"
  }
] as const;

type MobileIconName = (typeof mobilePrimaryNavigation)[number]["icon"] | (typeof mobileQuickActions)[number]["icon"];

function MobileNavIcon({ icon, active = false }: { icon: MobileIconName; active?: boolean }) {
  const strokeClassName = active ? "stroke-white" : "stroke-current";
  const iconClassName = cn("h-[18px] w-[18px]", strokeClassName);

  switch (icon) {
    case "overview":
      return (
        <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path d="M4.75 12.25 12 5.5l7.25 6.75" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M7.25 10.75v7.5h9.5v-7.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </svg>
      );
    case "income":
      return (
        <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path d="M12 18.25v-12.5" strokeLinecap="round" strokeWidth="1.75" />
          <path d="m7.75 10 4.25-4.25L16.25 10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M6 19.25h12" strokeLinecap="round" strokeWidth="1.75" />
        </svg>
      );
    case "expenses":
      return (
        <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path d="M12 5.75v12.5" strokeLinecap="round" strokeWidth="1.75" />
          <path d="m16.25 14-4.25 4.25L7.75 14" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M6 4.75h12" strokeLinecap="round" strokeWidth="1.75" />
        </svg>
      );
    case "debts":
      return (
        <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path d="M6.5 8.75h11" strokeLinecap="round" strokeWidth="1.75" />
          <path d="M6.5 12.25h11" strokeLinecap="round" strokeWidth="1.75" />
          <path d="M6.5 15.75h6.5" strokeLinecap="round" strokeWidth="1.75" />
          <rect height="14" rx="3" strokeWidth="1.75" width="15" x="4.5" y="5" />
        </svg>
      );
    case "owed":
      return (
        <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24">
          <circle cx="8" cy="9" r="2.5" strokeWidth="1.75" />
          <circle cx="16.25" cy="15" r="2.75" strokeWidth="1.75" />
          <path d="M10.5 10.25 13.75 13" strokeLinecap="round" strokeWidth="1.75" />
          <path d="m11.75 15 2-2 1.75 1.75" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
        </svg>
      );
    case "banks":
      return (
        <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path d="M4.75 9 12 5.25 19.25 9" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M6.25 10.75v6.5" strokeLinecap="round" strokeWidth="1.75" />
          <path d="M12 10.75v6.5" strokeLinecap="round" strokeWidth="1.75" />
          <path d="M17.75 10.75v6.5" strokeLinecap="round" strokeWidth="1.75" />
          <path d="M4.75 18.75h14.5" strokeLinecap="round" strokeWidth="1.75" />
        </svg>
      );
    case "settings":
      return (
        <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path
            d="M12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5Zm7 3.75-.94.43a6.96 6.96 0 0 1-.38.92l.53.88a1 1 0 0 1-.15 1.23l-.66.66a1 1 0 0 1-1.23.15l-.88-.53c-.29.15-.6.28-.92.38l-.43.94a1 1 0 0 1-.9.59h-.94a1 1 0 0 1-.91-.59l-.42-.94a6.94 6.94 0 0 1-.93-.38l-.88.53a1 1 0 0 1-1.23-.15l-.66-.66a1 1 0 0 1-.15-1.23l.53-.88a6.96 6.96 0 0 1-.38-.92L5 12a1 1 0 0 1-.59-.9v-.94A1 1 0 0 1 5 9.25l.94-.42c.1-.32.23-.63.38-.93l-.53-.88a1 1 0 0 1 .15-1.23l.66-.66a1 1 0 0 1 1.23-.15l.88.53c.3-.15.61-.28.93-.38l.42-.94A1 1 0 0 1 11.06 3h.94a1 1 0 0 1 .9.59l.43.94c.32.1.63.23.92.38l.88-.53a1 1 0 0 1 1.23.15l.66.66a1 1 0 0 1 .15 1.23l-.53.88c.15.3.28.61.38.93l.94.42a1 1 0 0 1 .59.91v.94a1 1 0 0 1-.59.9Z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.35"
          />
        </svg>
      );
    case "guide":
      return (
        <svg aria-hidden="true" className={iconClassName} fill="none" viewBox="0 0 24 24">
          <path d="M6.75 5.75h8.5a2 2 0 0 1 2 2v10.5h-8.5a2 2 0 0 0-2 2V5.75Z" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M17.25 18.25h-8.5a2 2 0 0 0-2 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" />
          <path d="M10 9.25h4.25" strokeLinecap="round" strokeWidth="1.75" />
          <path d="M10 12.25h4.25" strokeLinecap="round" strokeWidth="1.75" />
        </svg>
      );
  }
}

function normalizePathname(pathname?: string | null) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) || "/" : pathname;
}

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = normalizePathname(usePathname());
  const { logout, user } = useAuth();
  const { t } = useI18n();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileActionOpen, setMobileActionOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profile = useUserSettings(user?.uid);
  const unreadMessageCount = useLiveQuery(
    async () => {
      if (!user?.uid) {
        return 0;
      }

      return messageNotificationRepository.countUnread(user.uid);
    },
    [user?.uid],
    0
  );
  const recentMessageNotifications = useLiveQuery(
    async () => {
      if (!user?.uid) {
        return [];
      }

      return messageNotificationRepository.listRecent(user.uid, 7);
    },
    [user?.uid],
    []
  );
  const displayName = getProfileDisplayName(profile, user?.email);
  const compactMeta = getCompactProfileMeta(profile, user?.email);
  const profileComplete = isProfileComplete(profile);
  const navigation = profileComplete ? dashboardNavigation : onboardingNavigation;
  const profileHref = profileComplete ? "/settings" : "/welcome";
  const guideActive = pathname === "/guide";
  const showWorkspaceHeader = pathname !== "/dashboard";
  const currentPageLabelKey =
    [...dashboardNavigation, ...onboardingNavigation, { href: "/guide", labelKey: "nav.guide" as const }].find(
      (item) => pathname === item.href
    )?.labelKey || "nav.overview";
  const shellOverlayVisible = mobileNavOpen || mobileActionOpen || notificationsOpen;

  useEffect(() => {
    setMobileNavOpen(false);
    setMobileActionOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;

    if (shellOverlayVisible) {
      body.style.overflow = "hidden";
    }

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [shellOverlayVisible]);

  useEffect(() => {
    void syncAppBadge(unreadMessageCount || 0).catch(() => undefined);
  }, [unreadMessageCount]);

  async function handleNotificationClick(notificationId: string) {
    if (!user?.uid) {
      return;
    }

    await messageNotificationRepository.markRead(user.uid, notificationId);
    setNotificationsOpen(false);
  }

  async function handleMarkAllNotificationsRead() {
    if (!user?.uid) {
      return;
    }

    await messageNotificationRepository.markAllRead(user.uid);
  }

  function handleSectionNavigation(event: MouseEvent<HTMLAnchorElement>, href: string, active: boolean) {
    setMobileNavOpen(false);
    setMobileActionOpen(false);
    setNotificationsOpen(false);

    if (!active) {
      return;
    }

    event.preventDefault();

    if (typeof window !== "undefined") {
      window.location.reload();
      return;
    }

    router.replace(href);
  }

  const notificationBell = (
    <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition">
      <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
        <path
          d="M9.75 18.25h4.5M6.75 16.5h10.5l-1.25-1.5v-3.5a4.5 4.5 0 1 0-9 0V15l-1.25 1.5Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
        />
      </svg>
      {unreadMessageCount ? (
        <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-[0_10px_20px_rgba(244,63,94,0.35)]">
          {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
        </span>
      ) : null}
    </span>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.12),_transparent_24rem),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)]">
      <div className="safe-shell mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 px-3 pb-4 pt-3 sm:px-4 sm:pb-5 lg:flex-row lg:gap-6 lg:px-6 lg:py-4">
        <div className="lg:hidden">
          <div className="fixed inset-x-0 top-0 z-[70] px-3 pb-2 pt-[max(0.65rem,env(safe-area-inset-top))] sm:px-4">
            <div className="mx-auto max-w-[1600px]">
              <div className="mobile-topbar flex items-center justify-between gap-3 rounded-[28px] border border-white/85 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,246,255,0.94))] px-3 py-3.5 shadow-[0_18px_44px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
                <Link className="flex min-w-0 flex-1 items-center gap-3" href={profileHref}>
                  <ProfileAvatar
                    className="origin-left scale-[0.9]"
                    imageUrl={profile?.avatarDataUrl}
                    name={displayName}
                    showBadge={false}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-700 shadow-[0_6px_18px_rgba(14,116,144,0.08)]">
                        {t(currentPageLabelKey)}
                      </span>
                      <p className="truncate text-[11px] font-medium text-slate-500">{compactMeta}</p>
                    </div>
                    <p className="mt-2 truncate text-sm font-semibold tracking-tight text-slate-950">{displayName}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-2">
                  {profileComplete ? (
                    <button
                      aria-label={notificationsOpen ? t("notifications.closeInbox") : t("notifications.openInbox")}
                      type="button"
                      onClick={() => {
                        setMobileNavOpen(false);
                        setMobileActionOpen(false);
                        setNotificationsOpen((current) => !current);
                      }}
                    >
                      {notificationBell}
                    </button>
                  ) : null}

                  {profileComplete ? (
                    <button
                      aria-label="Open quick actions"
                      className="mobile-fab inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-emerald-200/80 bg-[linear-gradient(135deg,#16a34a_0%,#0f766e_100%)] text-lg font-semibold text-white shadow-[0_16px_34px_rgba(13,148,136,0.22)] transition active:scale-[0.98]"
                      type="button"
                      onClick={() => {
                        setMobileNavOpen(false);
                        setMobileActionOpen((current) => !current);
                      }}
                    >
                      +
                    </button>
                  ) : null}

                  <button
                    aria-label="Toggle menu"
                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-slate-200/90 bg-white text-slate-900 shadow-[0_12px_26px_rgba(15,23,42,0.08)] transition active:scale-[0.98]"
                    type="button"
                    onClick={() => {
                      setMobileActionOpen(false);
                      setMobileNavOpen((current) => !current);
                    }}
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
            </div>
          </div>
          <div aria-hidden="true" className="h-[5.9rem] sm:h-[6.4rem]" />
        </div>

        <button
          aria-hidden={!shellOverlayVisible}
          className={cn(
            "fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm transition duration-300 lg:hidden",
            shellOverlayVisible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
          type="button"
          onClick={() => {
            setMobileNavOpen(false);
            setMobileActionOpen(false);
            setNotificationsOpen(false);
          }}
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
            className="group relative flex min-h-[92px] items-center overflow-hidden rounded-[28px] border border-white/12 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_38%),linear-gradient(160deg,rgba(255,255,255,0.1),rgba(255,255,255,0.03))] px-4 py-4 shadow-[0_18px_54px_rgba(2,6,23,0.34)] transition hover:-translate-y-0.5 hover:bg-white/10 lg:rounded-[30px]"
            href={profileHref}
          >
            <div className="absolute -left-6 -top-4 h-20 w-20 rounded-full bg-emerald-300/15 blur-2xl transition duration-300 group-hover:scale-110" />
            <div className="absolute inset-y-4 left-3 w-1 rounded-full bg-[linear-gradient(180deg,rgba(134,239,172,0.95),rgba(56,189,248,0.95))]" />
            <div className="relative flex w-full items-center gap-4 pl-3">
              <ProfileAvatar imageUrl={profile?.avatarDataUrl} name={displayName} showBadge={false} size="md" />
              <div className="min-w-0 flex-1">
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
                  onClick={(event) => handleSectionNavigation(event, item.href, active)}
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
            onClick={(event) => handleSectionNavigation(event, "/guide", guideActive)}
          >
            <div className="absolute -right-6 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full bg-sky-300/20 blur-2xl transition duration-300 group-hover:scale-125" />
            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xs font-bold text-white">
                G
              </span>
              <span>{t("layout.guideSpotlightTitle")}</span>
            </div>
          </Link>

          {profileComplete ? (
            <button
              className="group relative mt-3 flex min-h-11 w-full items-center justify-between overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.05] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(2,6,23,0.18)] transition hover:-translate-y-0.5 hover:border-sky-300/[0.22] hover:bg-white/[0.08]"
              type="button"
              onClick={() => setNotificationsOpen((current) => !current)}
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/12 bg-white/10 text-white">
                  <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <path
                      d="M9.75 18.25h4.5M6.75 16.5h10.5l-1.25-1.5v-3.5a4.5 4.5 0 1 0-9 0V15l-1.25 1.5Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
                <span>{t("notifications.inboxTitle")}</span>
              </span>
              {unreadMessageCount ? (
                <span className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[10px] font-bold text-white">
                  {unreadMessageCount > 99 ? "99+" : unreadMessageCount}
                </span>
              ) : null}
            </button>
          ) : null}

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4 lg:mt-8">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{t("layout.privacyMode")}</p>
            <p className="mt-3 text-sm text-slate-300">{t("layout.privacyDescription")}</p>
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

          <main className="pb-[calc(6.75rem+env(safe-area-inset-bottom))] lg:pb-8">
            <div className="space-y-4 rounded-[28px] bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.42),_transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02))] p-1 sm:space-y-6 lg:rounded-[34px]">
              {children}
              <DeveloperSignatureCard />
            </div>
          </main>

          <InstallShortcutPrompt enabled={profileComplete} hidden={shellOverlayVisible} />
        </div>

        {profileComplete ? (
          <>
            <aside
              className={cn(
                "fixed inset-y-0 right-0 z-50 flex w-[min(92vw,360px)] flex-col border-l border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(241,245,249,0.96))] shadow-[0_28px_90px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-transform duration-300",
                notificationsOpen ? "translate-x-0" : "translate-x-[105%]"
              )}
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-4 py-4 sm:px-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-500">
                    {t("common.collaboration")}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
                    {t("notifications.inboxTitle")}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{t("notifications.inboxDescription")}</p>
                </div>
                <button
                  aria-label={t("notifications.closeInbox")}
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-900"
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 sm:px-5">
                <p className="text-sm font-medium text-slate-700">
                  {unreadMessageCount ? `${unreadMessageCount} unread` : t("notifications.emptyTitle")}
                </p>
                <Button
                  className="min-h-9 rounded-2xl px-3 py-2 text-xs"
                  type="button"
                  variant="ghost"
                  onClick={() => void handleMarkAllNotificationsRead()}
                >
                  {t("notifications.markAllRead")}
                </Button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                {recentMessageNotifications.length === 0 ? (
                  <div className="rounded-[24px] border border-dashed border-slate-200 bg-white/80 px-4 py-8 text-center">
                    <p className="text-sm font-semibold text-slate-900">{t("notifications.emptyTitle")}</p>
                    <p className="mt-2 text-sm text-slate-500">{t("notifications.emptyDescription")}</p>
                  </div>
                ) : (
                  recentMessageNotifications.map((item) => (
                    <Link
                      key={item.id}
                      className={cn(
                        "block rounded-[24px] border px-4 py-4 transition",
                        item.readAt
                          ? "border-slate-200 bg-white/75 text-slate-700"
                          : "border-sky-200 bg-[linear-gradient(180deg,rgba(239,246,255,0.95),rgba(255,255,255,0.98))] text-slate-900 shadow-[0_16px_40px_rgba(14,116,144,0.08)]"
                      )}
                      href={item.routeHref}
                      onClick={() => void handleNotificationClick(item.id)}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold tracking-tight">{item.title}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.counterpartName}</p>
                        </div>
                        {!item.readAt ? <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" /> : null}
                      </div>
                      <p className="mt-3 max-h-12 overflow-hidden text-sm leading-6 text-slate-600">{item.body}</p>
                      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">
                        {relativeFromNow(item.messageCreatedAt)}
                      </p>
                    </Link>
                  ))
                )}
              </div>
            </aside>

            <div
              className={cn(
                "fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(0.95rem+env(safe-area-inset-bottom))] pt-4 transition duration-300 lg:hidden",
                mobileActionOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
              )}
            >
              <div className="mobile-sheet relative overflow-hidden rounded-[32px] border border-white/14 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(8,47,73,0.94))] px-4 py-4 text-white shadow-[0_28px_90px_rgba(2,6,23,0.42)]">
                <div className="absolute -right-10 top-0 h-24 w-24 rounded-full bg-sky-400/18 blur-3xl" />
                <div className="absolute -left-10 bottom-0 h-24 w-24 rounded-full bg-emerald-400/18 blur-3xl" />
                <div className="relative">
                  <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-white/12" />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
                        {t("common.actions")}
                      </p>
                      <p className="mt-2 text-sm text-slate-300">{t("layout.guideSpotlightDescription")}</p>
                    </div>
                    <button
                      className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
                      type="button"
                      onClick={() => setMobileActionOpen(false)}
                    >
                      ×
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {mobileQuickActions.map((item) => (
                      <Link
                        key={item.href}
                        className={cn(
                          "group relative overflow-hidden rounded-[24px] border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] px-4 py-4 shadow-[0_18px_40px_rgba(2,6,23,0.22)] transition duration-300 active:scale-[0.98]",
                          "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-100 before:content-['']",
                          item.surfaceClassName
                        )}
                        href={item.href}
                        onClick={(event) =>
                          handleSectionNavigation(event, item.href, pathname === item.href)
                        }
                      >
                        <div className="relative">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.08] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                            <MobileNavIcon icon={item.icon} />
                          </span>
                          <div className="mt-6 flex items-center justify-between gap-3">
                            <p className="text-base font-semibold tracking-tight text-white">{t(item.labelKey)}</p>
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.08] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                              <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <path
                                  d="m9 6 6 6-6 6"
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="1.75"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[calc(0.95rem+env(safe-area-inset-bottom))] pt-3 lg:hidden">
              <nav
                className={cn(
                  "mobile-dock glass mx-auto flex max-w-md items-center gap-1 rounded-[30px] border border-white/12 bg-[linear-gradient(135deg,rgba(15,23,42,0.94),rgba(8,47,73,0.88))] px-2.5 py-2.5 text-white shadow-[0_26px_70px_rgba(15,23,42,0.26)] backdrop-blur-3xl transition duration-300",
                  shellOverlayVisible
                    ? "pointer-events-none translate-y-6 opacity-0"
                    : "pointer-events-auto translate-y-0 opacity-100"
                )}
              >
                {mobilePrimaryNavigation.map((item) => {
                  const active = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      className={cn(
                        "group relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-[22px] px-2 py-2.5 text-center transition duration-300",
                        active
                          ? "bg-[linear-gradient(135deg,rgba(16,185,129,0.28),rgba(56,189,248,0.24))] text-white shadow-[0_16px_30px_rgba(8,47,73,0.24)]"
                          : "text-slate-300 hover:bg-white/[0.07]"
                      )}
                      href={item.href}
                      onClick={(event) => handleSectionNavigation(event, item.href, active)}
                    >
                      <span
                        className={cn(
                          "inline-flex h-9 w-9 items-center justify-center rounded-2xl border transition duration-300",
                          active
                            ? "border-white/15 bg-white/[0.14] text-white"
                            : "border-white/[0.08] bg-white/[0.04] text-slate-300 group-hover:border-white/[0.14] group-hover:bg-white/[0.1]"
                        )}
                      >
                        <MobileNavIcon active={active} icon={item.icon} />
                      </span>
                      <span
                        className={cn(
                          "h-1.5 w-8 rounded-full transition duration-300",
                          active ? "bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.45)]" : "bg-white/10 group-hover:bg-white/20"
                        )}
                      />
                      <span className="truncate text-[11px] font-semibold">{t(item.labelKey)}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
