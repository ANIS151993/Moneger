import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/finance";
import type { ActivityItem, CurrencyCode } from "@/types/finance";

const toneBadge = {
  income: "success",
  expense: "warning",
  debt: "danger",
  owed: "info"
} as const;

export function RecentActivityList({
  items,
  displayCurrency
}: {
  items: ActivityItem[];
  displayCurrency: CurrencyCode;
}) {
  return (
    <Card>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Recent activity</p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Ledger movement</h2>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
            No recorded income, expense, debt, or owed activity yet.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 px-4 py-4">
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <Badge tone={toneBadge[item.tone]}>{item.tone}</Badge>
                </div>
                <p className="mt-1 text-sm text-slate-500">{item.description}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">{formatCurrency(item.amount, item.currency)}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(item.date)} · display {displayCurrency}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
