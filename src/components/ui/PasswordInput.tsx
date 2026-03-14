"use client";

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  isVisible: boolean;
  onToggleVisibility: () => void;
  toggleLabel: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { className, id, isVisible, onToggleVisibility, toggleLabel, ...props },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="relative">
      <input
        id={inputId}
        ref={ref}
        className={cn(
          "min-h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-20 text-base text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-emerald-400 md:text-sm",
          className
        )}
        type={isVisible ? "text" : "password"}
        {...props}
      />
      <button
        aria-controls={inputId}
        aria-label={toggleLabel}
        className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
        type="button"
        onClick={onToggleVisibility}
      >
        {toggleLabel}
      </button>
    </div>
  );
});
