import type { ReactNode } from "react";

import { BrandLogo } from "@/components/branding/BrandLogo";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(22,163,74,0.18),_transparent_26rem),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_28rem),linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)] px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="hidden rounded-[36px] border border-white/70 bg-slate-950 p-10 text-white shadow-2xl lg:block">
          <BrandLogo compact className="text-white [&_span:last-child]:text-slate-300" />
          <h1 className="mt-8 max-w-xl text-5xl font-semibold tracking-tight">
            Privacy-first money management without surrendering your ledger.
          </h1>
          <p className="mt-5 max-w-lg text-base text-slate-300">
            Moneger keeps the financial source of truth local on your device, stays useful offline,
            and reserves remote services for auth and optional encrypted sync only.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-emerald-300">Local-first storage</p>
              <p className="mt-2 text-sm text-slate-300">IndexedDB powered data residency per user.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-semibold text-sky-300">Offline-ready dashboard</p>
              <p className="mt-2 text-sm text-slate-300">Core ledger views remain available without a server.</p>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
