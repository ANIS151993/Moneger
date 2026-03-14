"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { DebtForm } from "@/components/forms/DebtForm";
import { useI18n } from "@/components/providers/LanguageProvider";
import { SimpleTable } from "@/components/shared/SimpleTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { ledgerService } from "@/lib/services/ledger-service";
import { formatDate } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/finance";
import {
  getInstallmentProgress,
  getNextPendingInstallment,
  getOutstandingScheduledAmount
} from "@/lib/utils/installments";

export default function DebtsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [editingId, setEditingId] = useState<string | null>(null);
  const settings = useUserSettings(user?.uid);
  const baseCurrency = settings?.baseCurrency || "USD";
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

  const editingDebt = debts.find((item) => item.id === editingId);

  useEffect(() => {
    if (editingId && !editingDebt) {
      setEditingId(null);
    }
  }, [editingDebt, editingId]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("debtsPage.eyebrow")}
        title={t("debtsPage.title")}
        description={t("debtsPage.description")}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DebtForm
          defaultCurrency={baseCurrency}
          onCancel={() => setEditingId(null)}
          onSaved={() => setEditingId(null)}
          record={editingDebt}
          userId={user.uid}
        />
        {debts.length === 0 ? (
          <EmptyState
            title={t("debtsPage.emptyTitle")}
            description={t("debtsPage.emptyDescription")}
          />
        ) : (
          <SimpleTable
            title={t("debtsPage.tableTitle")}
            description={t("debtsPage.tableDescription")}
            rows={debts}
            columns={[
              {
                key: "creditor",
                header: t("debtsPage.creditor"),
                render: (item) => (
                  <div>
                    <p className="font-medium text-slate-900">{item.creditorName}</p>
                    <p className="text-xs text-slate-400">{item.creditorEmail || item.creditorPhone || t("common.noContact")}</p>
                  </div>
                )
              },
              {
                key: "amount",
                header: t("common.amount"),
                render: (item) => {
                  const progress = getInstallmentProgress(item.installments);
                  const outstandingAmount = getOutstandingScheduledAmount(item.amount, item.installments);

                  return (
                    <div>
                      <p className="font-medium text-slate-900">{formatCurrency(item.amount, item.currency)}</p>
                      <p className="text-xs text-slate-400">
                        {progress.total
                          ? `${t("installments.summary", { settled: progress.settled, total: progress.total })} · ${t("installments.remaining", { amount: formatCurrency(outstandingAmount, item.currency) })}`
                          : t("installments.none")}
                      </p>
                    </div>
                  );
                }
              },
              {
                key: "settlement",
                header: t("debtsPage.settlement"),
                render: (item) => {
                  const nextInstallment = getNextPendingInstallment(item.installments);

                  return (
                    <div>
                      <p className="font-medium text-slate-900">
                        {formatDate(nextInstallment?.dueDate || item.settlementDate)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {nextInstallment
                          ? `${t("installments.nextDue", { date: formatDate(nextInstallment.dueDate) })} · ${formatCurrency(nextInstallment.amount, item.currency)}`
                          : item.installments?.length
                            ? t("installments.complete")
                            : t("installments.none")}
                      </p>
                    </div>
                  );
                }
              },
              {
                key: "status",
                header: t("common.status"),
                render: (item) => (
                  <Badge tone={item.status === "overdue" ? "danger" : item.status === "paid" ? "success" : "warning"}>
                    {t(`options.debtStatus.${item.status}`)}
                  </Badge>
                )
              },
              {
                key: "actions",
                header: t("common.actions"),
                render: (item) => (
                  <div className="flex flex-wrap gap-2">
                    <Button variant="ghost" onClick={() => setEditingId(item.id)}>
                      {t("common.edit")}
                    </Button>
                    <Button variant="ghost" onClick={() => void ledgerService.deleteDebt(user.uid, item.id)}>
                      {t("common.delete")}
                    </Button>
                  </div>
                )
              }
            ]}
          />
        )}
      </div>
    </div>
  );
}
