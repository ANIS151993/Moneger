import { Card } from "@/components/ui/Card";

export function StatCard({
  label,
  value,
  detail,
  comparisonLabel,
  comparisonValue
}: {
  label: string;
  value: string;
  detail: string;
  comparisonLabel?: string;
  comparisonValue?: string;
}) {
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <h3 className="mt-3 break-words text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{value}</h3>
      {comparisonValue ? (
        <div className="mt-3 inline-flex rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2">
          <div>
            {comparisonLabel ? <p className="text-[10px] uppercase tracking-[0.22em] text-emerald-700">{comparisonLabel}</p> : null}
            <p className="mt-1 text-sm font-semibold text-emerald-800">{comparisonValue}</p>
          </div>
        </div>
      ) : null}
      <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
    </Card>
  );
}
