import Link from "next/link";

import { BrandLogo } from "@/components/branding/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { brand, marketingHighlights } from "@/lib/branding/brand";

export default function LandingPage() {
  return (
    <main className="px-4 py-4">
      <div className="mx-auto max-w-7xl">
        <header className="glass flex items-center justify-between rounded-[30px] border border-white/80 px-6 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <BrandLogo />
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Create account</Button>
            </Link>
          </div>
        </header>

        <section className="grid gap-8 px-2 py-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-center lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Privacy-first. Local-first. Offline-first.
            </p>
            <h1 className="mt-5 max-w-4xl text-5xl font-semibold tracking-tight text-slate-950 md:text-7xl">
              <span className="gradient-text">{brand.name}</span> keeps your money records under your
              control.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Track income, expenses, debt, banks, and money owed while keeping your financial source
              of truth on your own device. Sync is optional. Encryption is expected. Server dependency
              is not.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup">
                <Button className="px-6 py-4 text-base">Start using Moneger</Button>
              </Link>
              <Link href="/dashboard">
                <Button className="px-6 py-4 text-base" variant="ghost">
                  Open dashboard
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {marketingHighlights.map((item) => (
                <Card key={item} className="rounded-[24px] p-5">
                  <p className="text-sm leading-6 text-slate-600">{item}</p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="overflow-hidden rounded-[34px] bg-slate-950 p-0 text-white">
            <div className="border-b border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-300">Dashboard preview</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Financial clarity without cloud lock-in</h2>
            </div>
            <div className="grid gap-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ["Net balance", "$4,260"],
                  ["Debt due", "$148"],
                  ["Money owed", "$240"],
                  ["Offline ready", "Yes"]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Local-first ledger</p>
                    <p className="mt-1 text-sm text-slate-400">Per-user IndexedDB financial store</p>
                  </div>
                  <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                    Active
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  {[
                    ["Income tracking", "Salary, freelance, rental, and more"],
                    ["Expense analysis", "Categories, trends, and mixed-currency totals"],
                    ["Debt reminders", "Upcoming and overdue settlement indicators"]
                  ].map(([title, copy]) => (
                    <div key={title} className="rounded-2xl bg-white/5 px-4 py-3">
                      <p className="font-medium text-white">{title}</p>
                      <p className="mt-1 text-sm text-slate-400">{copy}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="grid gap-6 pb-16 lg:grid-cols-3">
          <Card>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">Why local-first</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Your records stay yours</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              By default, Moneger stores financial records in IndexedDB on the device, namespaced per
              authenticated user. That means your data remains available even if the internet or your
              own server does not.
            </p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-600">Offline-first</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Built to keep working</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Core flows such as logging income, expenses, debts, and owed money do not depend on
              Firestore. Exchange rates are cached locally and reused offline.
            </p>
          </Card>
          <Card>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-600">Optional sync</p>
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Encryption before upload</h3>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Firebase is reserved for auth, profile metadata, and optional encrypted sync scaffolding.
              Plaintext financial records are not the default remote storage model.
            </p>
          </Card>
        </section>
      </div>
    </main>
  );
}
