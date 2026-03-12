"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { IncomeForm } from "@/components/forms/IncomeForm";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SimpleTable } from "@/components/shared/SimpleTable";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { ledgerService } from "@/lib/services/ledger-service";
import { formatDate } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/finance";

export default function IncomePage() {
  const { user } = useAuth();
  const incomes = useLiveQuery(
    async () => {
      if (!user) {
        return [];
      }

      return getUserDatabase(user.uid).incomes.orderBy("date").reverse().toArray();
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
        eyebrow="Income"
        title="Track what comes in"
        description="Capture salary, freelance, business, and one-time income locally with category and frequency metadata."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <IncomeForm userId={user.uid} />
        {incomes.length === 0 ? (
          <EmptyState
            title="No income records yet"
            description="Add your first income source to start building your local financial picture."
          />
        ) : (
          <SimpleTable
            title="Income ledger"
            description="Stored locally in IndexedDB and isolated per account."
            rows={incomes}
            columns={[
              {
                key: "source",
                header: "Source",
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
                key: "frequency",
                header: "Frequency",
                render: (item) => item.frequency
              },
              {
                key: "date",
                header: "Date",
                render: (item) => formatDate(item.date)
              },
              {
                key: "actions",
                header: "Actions",
                render: (item) => (
                  <Button variant="ghost" onClick={() => void ledgerService.deleteIncome(user.uid, item.id)}>
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
