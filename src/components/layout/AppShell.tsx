"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/branding/BrandLogo";
import { Button } from "@/components/ui/Button";
import { dashboardNavigation } from "@/lib/constants/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { cn } from "@/lib/utils/cn";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

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
            <p className="text-sm font-medium text-white">{user?.email || "Local account"}</p>
            <p className="mt-1 text-xs text-slate-400">Data store isolated per signed-in account</p>
            <Button className="mt-4 w-full" variant="ghost" onClick={() => void logout()}>
              Sign out
            </Button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col gap-6">
          <header className="flex flex-col gap-4 rounded-[32px] border border-white/80 bg-white/70 px-6 py-5 backdrop-blur md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-emerald-600">Local-first finance workspace</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Your Money. Your Control.
              </h2>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Offline-capable core ledger with optional encrypted sync scaffolding
            </div>
          </header>
          <main className="pb-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
