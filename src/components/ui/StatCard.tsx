import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

const toneClasses = {
  emerald: {
    shell:
      "border-emerald-100 bg-[radial-gradient(circle_at_top_right,_rgba(74,222,128,0.18),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#f0fdf4_100%)]",
    dot: "bg-emerald-500",
    accent: "text-emerald-700"
  },
  sky: {
    shell:
      "border-sky-100 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#f0f9ff_100%)]",
    dot: "bg-sky-500",
    accent: "text-sky-700"
  },
  amber: {
    shell:
      "border-amber-100 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.18),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#fffbeb_100%)]",
    dot: "bg-amber-500",
    accent: "text-amber-700"
  },
  rose: {
    shell:
      "border-rose-100 bg-[radial-gradient(circle_at_top_right,_rgba(251,113,133,0.18),_transparent_34%),linear-gradient(180deg,#ffffff_0%,#fff1f2_100%)]",
    dot: "bg-rose-500",
    accent: "text-rose-700"
  }
} as const;

export function StatCard({
  label,
  value,
  detail,
  comparisonLabel,
  comparisonValue,
  tone = "emerald",
  className
}: {
  label: string;
  value: string;
  detail: string;
  comparisonLabel?: string;
  comparisonValue?: string;
  tone?: keyof typeof toneClasses;
  className?: string;
}) {
  const palette = toneClasses[tone];

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]",
        palette.shell,
        className
      )}
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/60 blur-3xl transition duration-300 group-hover:scale-110" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className={cn("h-2.5 w-2.5 rounded-full shadow-[0_0_18px_rgba(255,255,255,0.7)]", palette.dot)} />
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
        </div>
        <h3 className="mt-3 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{value}</h3>
        {comparisonValue ? (
          <div className="mt-3 inline-flex rounded-2xl border border-white/80 bg-white/80 px-3 py-2 shadow-sm">
            <div>
              {comparisonLabel ? <p className={cn("text-[10px] uppercase tracking-[0.22em]", palette.accent)}>{comparisonLabel}</p> : null}
              <p className="mt-1 text-sm font-semibold text-slate-900">{comparisonValue}</p>
            </div>
          </div>
        ) : null}
        <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
      </div>
    </Card>
  );
}
