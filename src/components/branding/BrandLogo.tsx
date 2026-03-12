import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export function BrandLogo({ compact = false, className = "" }: { compact?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center gap-3", className)}>
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-lg font-bold text-white shadow-lg shadow-emerald-600/25">
        <span className="relative -top-px">M</span>
      </span>
      {!compact ? (
        <span className="flex flex-col">
          <span className="text-base font-semibold tracking-tight text-slate-950">Moneger</span>
          <span className="text-xs text-slate-500">Your Smart Money Manager</span>
        </span>
      ) : null}
    </Link>
  );
}
