"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { BankForm } from "@/components/forms/BankForm";
import { SimpleTable } from "@/components/shared/SimpleTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { ledgerService } from "@/lib/services/ledger-service";

export default function BanksPage() {
  const { user } = useAuth();
  const banks = useLiveQuery(
    async () => {
      if (!user) {
        return [];
      }

      return getUserDatabase(user.uid).banks.orderBy("createdAt").reverse().toArray();
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
        eyebrow="Banks"
        title="Track your account footprint"
        description="Store bank names, nicknames, last four digits, and notes without putting sensitive account data in the cloud."
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <BankForm userId={user.uid} />
        {banks.length === 0 ? (
          <EmptyState
            title="No bank records yet"
            description="Add bank accounts to map where income lands and which currency each account primarily serves."
          />
        ) : (
          <SimpleTable
            title="Bank registry"
            description="Only the minimal local account reference is stored: name, nickname, and last four digits."
            rows={banks}
            columns={[
              {
                key: "bank",
                header: "Bank",
                render: (item) => (
                  <div>
                    <p className="font-medium text-slate-900">{item.bankName}</p>
                    <p className="text-xs text-slate-400">{item.nickname}</p>
                  </div>
                )
              },
              {
                key: "last4",
                header: "Last 4",
                render: (item) => item.last4
              },
              {
                key: "currency",
                header: "Currency",
                render: (item) => item.currency
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
                  <Button variant="ghost" onClick={() => void ledgerService.deleteBank(user.uid, item.id)}>
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
