"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { DebtForm } from "@/components/forms/DebtForm";
import { SimpleTable } from "@/components/shared/SimpleTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { ledgerService } from "@/lib/services/ledger-service";
import { formatDate } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/finance";

export default function DebtsPage() {
  const { user } = useAuth();
  const debts = useLiveQuery(
    async () => {
      if (!user) {
        return [];
      }

      return getUserDatabase(user.uid).debts.orderBy("settlementDate").toArray();
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
        eyebrow="Debts"
        title="Keep debt obligations visible"
        description="Track creditors, due dates, notes, and settlement progress with overdue awareness."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DebtForm userId={user.uid} />
        {debts.length === 0 ? (
          <EmptyState
            title="No debt records yet"
            description="Add debt positions to monitor due dates and settlement exposure."
          />
        ) : (
          <SimpleTable
            title="Debt ledger"
            description="Designed for reminders, overdue visibility, and future secure sync."
            rows={debts}
            columns={[
              {
                key: "creditor",
                header: "Creditor",
                render: (item) => (
                  <div>
                    <p className="font-medium text-slate-900">{item.creditorName}</p>
                    <p className="text-xs text-slate-400">{item.creditorEmail || item.creditorPhone || "No contact"}</p>
                  </div>
                )
              },
              {
                key: "amount",
                header: "Amount",
                render: (item) => formatCurrency(item.amount, item.currency)
              },
              {
                key: "settlement",
                header: "Settlement",
                render: (item) => formatDate(item.settlementDate)
              },
              {
                key: "status",
                header: "Status",
                render: (item) => (
                  <Badge tone={item.status === "overdue" ? "danger" : item.status === "paid" ? "success" : "warning"}>
                    {item.status}
                  </Badge>
                )
              },
              {
                key: "actions",
                header: "Actions",
                render: (item) => (
                  <Button variant="ghost" onClick={() => void ledgerService.deleteDebt(user.uid, item.id)}>
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
