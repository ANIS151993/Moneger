import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-emerald-400/60 bg-[linear-gradient(135deg,#16a34a_0%,#22c55e_55%,#38bdf8_100%)] text-white shadow-[0_18px_42px_rgba(22,163,74,0.28)] hover:-translate-y-0.5 hover:shadow-[0_22px_48px_rgba(22,163,74,0.34)] focus-visible:ring-emerald-400",
  secondary:
    "border border-slate-700 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] text-white shadow-[0_16px_34px_rgba(15,23,42,0.24)] hover:-translate-y-0.5 hover:bg-[linear-gradient(135deg,#111827_0%,#334155_100%)] focus-visible:ring-slate-400",
  ghost:
    "border border-slate-300 bg-white/95 text-slate-900 shadow-[0_12px_24px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-50 focus-visible:ring-slate-300",
  danger:
    "border border-rose-500/50 bg-[linear-gradient(135deg,#e11d48_0%,#f43f5e_100%)] text-white shadow-[0_16px_36px_rgba(225,29,72,0.24)] hover:-translate-y-0.5 hover:shadow-[0_20px_42px_rgba(225,29,72,0.3)] focus-visible:ring-rose-400"
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function buttonClassName({
  className,
  variant = "primary"
}: {
  className?: string;
  variant?: ButtonVariant;
}) {
  return cn(
    "inline-flex min-h-11 items-center justify-center rounded-[18px] px-4 py-3 text-sm font-semibold transition duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-60",
    variantClasses[variant],
    className
  );
}

export function Button({ className, variant = "primary", type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={buttonClassName({ className, variant })}
      type={type}
      {...props}
    />
  );
}
