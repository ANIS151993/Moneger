"use client";

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

export default function DebtsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
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
        <DebtForm key={baseCurrency} userId={user.uid} defaultCurrency={baseCurrency} />
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
                render: (item) => formatCurrency(item.amount, item.currency)
              },
              {
                key: "settlement",
                header: t("debtsPage.settlement"),
                render: (item) => formatDate(item.settlementDate)
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
                  <Button variant="ghost" onClick={() => void ledgerService.deleteDebt(user.uid, item.id)}>
                    {t("common.delete")}
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
