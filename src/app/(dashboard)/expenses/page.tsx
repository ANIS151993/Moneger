"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { ExpenseForm } from "@/components/forms/ExpenseForm";
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

export default function ExpensesPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const settings = useUserSettings(user?.uid);
  const baseCurrency = settings?.baseCurrency || "USD";
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
        eyebrow={t("expensesPage.eyebrow")}
        title={t("expensesPage.title")}
        description={t("expensesPage.description")}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <ExpenseForm key={baseCurrency} userId={user.uid} defaultCurrency={baseCurrency} />
        {expenses.length === 0 ? (
          <EmptyState
            title={t("expensesPage.emptyTitle")}
            description={t("expensesPage.emptyDescription")}
          />
        ) : (
          <SimpleTable
            title={t("expensesPage.tableTitle")}
            description={t("expensesPage.tableDescription")}
            rows={expenses}
            columns={[
              {
                key: "source",
                header: t("expensesPage.merchant"),
                render: (item) => (
                  <div>
                    <p className="font-medium text-slate-900">{item.source}</p>
                    <p className="text-xs text-slate-400">{t(`options.expenseCategory.${item.category}`)}</p>
                  </div>
                )
              },
              {
                key: "amount",
                header: t("common.amount"),
                render: (item) => formatCurrency(item.amount, item.currency)
              },
              {
                key: "date",
                header: t("common.date"),
                render: (item) => formatDate(item.date)
              },
              {
                key: "note",
                header: t("common.note"),
                render: (item) => item.note || "-"
              },
              {
                key: "actions",
                header: t("common.actions"),
                render: (item) => (
                  <Button variant="ghost" onClick={() => void ledgerService.deleteExpense(user.uid, item.id)}>
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
