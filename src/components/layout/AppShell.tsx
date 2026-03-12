"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/branding/BrandLogo";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { dashboardNavigation } from "@/lib/constants/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { cn } from "@/lib/utils/cn";
import { formatMaritalStatus, getProfileDisplayName, getProfileSummary } from "@/lib/utils/profile";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const profile = useUserSettings(user?.uid);
  const displayName = getProfileDisplayName(profile, user?.email);
  const profileSummary = getProfileSummary(profile);
  const maritalStatus = formatMaritalStatus(profile?.maritalStatus);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.12),_transparent_24rem),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)]">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 lg:flex-row lg:px-6">
        <aside className="w-full shrink-0 rounded-[32px] border border-white/70 bg-slate-950 px-5 py-6 text-slate-100 shadow-2xl lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)] lg:w-[280px]">
          <BrandLogo compact className="[&>span:first-child]:bg-white [&>span:first-child]:text-emerald-600" />
          <nav className="mt-8 grid gap-2">
            {dashboardNavigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active ? "bg-white text-slate-950" : "text-slate-400 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Privacy Mode</p>
            <p className="mt-3 text-sm text-slate-300">
              Financial records stay local in IndexedDB unless you add encrypted sync.
            </p>
          </div>

          <div className="mt-8 border-t border-white/10 pt-4">
            <div className="flex items-center gap-3">
              <ProfileAvatar className="rounded-[22px]" imageUrl={profile?.avatarDataUrl} name={displayName} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{displayName}</p>
                <p className="truncate text-xs text-slate-400">
                  {profile?.occupation || user?.email || "Local account"}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-400">Data store isolated per signed-in account</p>
            <Button className="mt-4 w-full" variant="ghost" onClick={() => void logout()}>
              Sign out
            </Button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-[32px] border border-white/80 bg-white/70 px-6 py-5 backdrop-blur md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">Local-first finance workspace</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Your Money. Your Control.
              </h2>
            </div>
            <Link
              className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.18),_transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.95),rgba(240,249,255,0.98))] px-4 py-4 shadow-[0_24px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_26px_70px_rgba(15,23,42,0.12)]"
              href="/settings"
            >
              <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-emerald-300/25 blur-2xl transition duration-300 group-hover:scale-110" />
              <div className="absolute left-8 top-0 h-16 w-16 rounded-full bg-sky-300/20 blur-2xl" />
              <div className="relative flex flex-col gap-3 sm:min-w-[320px] sm:flex-row sm:items-center">
                <ProfileAvatar imageUrl={profile?.avatarDataUrl} name={displayName} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Profile</p>
                    {maritalStatus ? <Badge tone="info">{maritalStatus}</Badge> : null}
                  </div>
                  <p className="mt-2 truncate text-lg font-semibold tracking-tight text-slate-950">{displayName}</p>
                  <p className="mt-1 truncate text-sm text-slate-500">{profileSummary}</p>
                </div>
                <div className="inline-flex items-center rounded-full bg-slate-950 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition group-hover:bg-emerald-600">
                  Edit
                </div>
              </div>
            </Link>
          </header>
          <main className="pb-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
