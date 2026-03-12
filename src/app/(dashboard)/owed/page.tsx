"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { OwedForm } from "@/components/forms/OwedForm";
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

export default function OwedPage() {
  const { user } = useAuth();
  const owed = useLiveQuery(
    async () => {
      if (!user) {
        return [];
      }

      return getUserDatabase(user.uid).owed.orderBy("settlementDate").toArray();
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
        eyebrow="Money owed"
        title="Track what should come back to you"
        description="Stay on top of debtor details, settlement timing, and overdue reimbursements."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <OwedForm userId={user.uid} />
        {owed.length === 0 ? (
          <EmptyState
            title="No owed records yet"
            description="Add the money people owe you so the dashboard can include it in your net picture."
          />
        ) : (
          <SimpleTable
            title="Owed ledger"
            description="Useful for reimbursements, personal lending, and client receivables."
            rows={owed}
            columns={[
              {
                key: "debtor",
                header: "Debtor",
                render: (item) => (
                  <div>
                    <p className="font-medium text-slate-900">{item.debtorName}</p>
                    <p className="text-xs text-slate-400">{item.debtorEmail || item.debtorPhone || "No contact"}</p>
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
                  <Badge tone={item.status === "overdue" ? "danger" : item.status === "settled" ? "success" : "info"}>
                    {item.status}
                  </Badge>
                )
              },
              {
                key: "actions",
                header: "Actions",
                render: (item) => (
                  <Button variant="ghost" onClick={() => void ledgerService.deleteOwed(user.uid, item.id)}>
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
