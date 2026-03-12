"use client";
/* eslint-disable @next/next/no-img-element */

import { cn } from "@/lib/utils/cn";
import { getProfileInitials } from "@/lib/utils/profile";

const avatarSizes = {
  sm: "h-12 w-12 rounded-2xl text-sm",
  md: "h-16 w-16 rounded-[22px] text-lg",
  lg: "h-24 w-24 rounded-[30px] text-2xl"
} as const;

export function ProfileAvatar({
  name,
  imageUrl,
  size = "md",
  className
}: {
  name?: string | null;
  imageUrl?: string;
  size?: keyof typeof avatarSizes;
  className?: string;
}) {
  const initials = getProfileInitials(name);

  return (
    <div className={cn("group/avatar relative isolate inline-flex shrink-0", className)}>
      <div className="absolute inset-0 rounded-[inherit] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.8),rgba(22,163,74,0.65),rgba(15,23,42,0.9))] blur-md transition duration-300 group-hover/avatar:scale-110 group-hover/avatar:opacity-100" />
      <div
        className={cn(
          "relative overflow-hidden border border-white/70 bg-slate-950 shadow-[0_18px_48px_rgba(15,23,42,0.28)]",
          avatarSizes[size]
        )}
      >
        {imageUrl ? (
          <img alt={`${name || "User"} profile`} className="h-full w-full object-cover" src={imageUrl} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.95),rgba(15,23,42,0.98))] font-semibold uppercase tracking-[0.2em] text-white">
            {initials}
          </div>
        )}
      </div>
      <div className="absolute -bottom-1 -right-1 rounded-full border border-white/70 bg-emerald-400 px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 shadow-lg">
        Live
      </div>
    </div>
  );
}
