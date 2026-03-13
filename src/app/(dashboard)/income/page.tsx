"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { IncomeForm } from "@/components/forms/IncomeForm";
import { useI18n } from "@/components/providers/LanguageProvider";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { SimpleTable } from "@/components/shared/SimpleTable";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { ledgerService } from "@/lib/services/ledger-service";
import { formatDate } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/finance";

export default function IncomePage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const settings = useUserSettings(user?.uid);
  const baseCurrency = settings?.baseCurrency || "USD";
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
        eyebrow={t("incomePage.eyebrow")}
        title={t("incomePage.title")}
        description={t("incomePage.description")}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <IncomeForm key={baseCurrency} userId={user.uid} defaultCurrency={baseCurrency} />
        {incomes.length === 0 ? (
          <EmptyState
            title={t("incomePage.emptyTitle")}
            description={t("incomePage.emptyDescription")}
          />
        ) : (
          <SimpleTable
            title={t("incomePage.tableTitle")}
            description={t("incomePage.tableDescription")}
            rows={incomes}
            columns={[
              {
                key: "source",
                header: t("common.source"),
                render: (item) => (
                  <div>
                    <p className="font-medium text-slate-900">{item.source}</p>
                    <p className="text-xs text-slate-400">{t(`options.incomeCategory.${item.category}`)}</p>
                  </div>
                )
              },
              {
                key: "amount",
                header: t("common.amount"),
                render: (item) => formatCurrency(item.amount, item.currency)
              },
              {
                key: "frequency",
                header: t("common.frequency"),
                render: (item) => t(`options.incomeFrequency.${item.frequency}`)
              },
              {
                key: "date",
                header: t("common.date"),
                render: (item) => formatDate(item.date)
              },
              {
                key: "actions",
                header: t("common.actions"),
                render: (item) => (
                  <Button variant="ghost" onClick={() => void ledgerService.deleteIncome(user.uid, item.id)}>
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
