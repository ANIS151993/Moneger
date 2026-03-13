"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { BankForm } from "@/components/forms/BankForm";
import { useI18n } from "@/components/providers/LanguageProvider";
import { SimpleTable } from "@/components/shared/SimpleTable";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/lib/hooks/use-auth";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { ledgerService } from "@/lib/services/ledger-service";

export default function BanksPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const settings = useUserSettings(user?.uid);
  const baseCurrency = settings?.baseCurrency || "USD";
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
        eyebrow={t("banksPage.eyebrow")}
        title={t("banksPage.title")}
        description={t("banksPage.description")}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <BankForm key={baseCurrency} userId={user.uid} defaultCurrency={baseCurrency} />
        {banks.length === 0 ? (
          <EmptyState
            title={t("banksPage.emptyTitle")}
            description={t("banksPage.emptyDescription")}
          />
        ) : (
          <SimpleTable
            title={t("banksPage.tableTitle")}
            description={t("banksPage.tableDescription")}
            rows={banks}
            columns={[
              {
                key: "bank",
                header: t("banksPage.bank"),
                render: (item) => (
                  <div>
                    <p className="font-medium text-slate-900">{item.bankName}</p>
                    <p className="text-xs text-slate-400">{item.nickname}</p>
                  </div>
                )
              },
              {
                key: "last4",
                header: t("bankForm.last4"),
                render: (item) => item.last4
              },
              {
                key: "currency",
                header: t("common.currency"),
                render: (item) => item.currency
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
                  <Button variant="ghost" onClick={() => void ledgerService.deleteBank(user.uid, item.id)}>
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
