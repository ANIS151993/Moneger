"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SimpleTable } from "@/components/shared/SimpleTable";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { ledgerService } from "@/lib/services/ledger-service";
import { formatDate } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/finance";

export default function ExpensesPage() {
  const { user } = useAuth();
  const expenses = useLiveQuery(
    async () => {
      if (!user) {
        return [];
      }

      return getUserDatabase(user.uid).expenses.orderBy("date").reverse().toArray();
    },
    [user?.uid],
    []
  );

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Expenses"
        title="Track spending clearly"
        description="Store merchant, category, date, and note fields locally so your budget view still works offline."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ExpenseForm userId={user.uid} />
        {expenses.length === 0 ? (
          <EmptyState
            title="No expense records yet"
            description="Add your first expense to build trends, category charts, and net balance insight."
          />
        ) : (
          <SimpleTable
            title="Expense ledger"
            description="Every expense is local-first and ready for mixed-currency conversion."
            rows={expenses}
            columns={[
              {
                key: "source",
                header: "Merchant",
                render: (item) => (
                  <div>
                    <p className="font-medium text-slate-900">{item.source}</p>
                    <p className="text-xs text-slate-400">{item.category}</p>
                  </div>
                )
              },
              {
                key: "amount",
                header: "Amount",
                render: (item) => formatCurrency(item.amount, item.currency)
              },
              {
                key: "date",
                header: "Date",
                render: (item) => formatDate(item.date)
              },
              {
                key: "note",
                header: "Note",
                render: (item) => item.note || "—"
              },
              {
                key: "actions",
                header: "Actions",
                render: (item) => (
                  <Button variant="ghost" onClick={() => void ledgerService.deleteExpense(user.uid, item.id)}>
                    Delete
                  </Button>
                )
              }
            ]}
          />
        )}
      </div>
    </div>
  );
}
