import { Card } from "@/components/ui/Card";

export function StatCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="bg-gradient-to-br from-white to-slate-50">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
      <h3 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{value}</h3>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </Card>
  );
}
