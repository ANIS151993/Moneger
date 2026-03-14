"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { OwedForm } from "@/components/forms/OwedForm";
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
import {
  acceptSharedObligationSchedule,
  buildSharedInviteEmailDraft,
  buildSharedReminderEmailDraft,
  markInviteEmailSent
} from "@/lib/services/shared-obligations-cloud-service";
import { formatDate } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/finance";
import {
  getInstallmentProgress,
  getNextPendingInstallment,
  getOutstandingScheduledAmount
} from "@/lib/utils/installments";

export default function OwedPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [editingId, setEditingId] = useState<string | null>(null);
  const settings = useUserSettings(user?.uid);
  const baseCurrency = settings?.baseCurrency || "USD";
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://moneger.marcbd.site");
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

  const editingOwed = owed.find((item) => item.id === editingId);

  useEffect(() => {
    if (editingId && !editingOwed) {
      setEditingId(null);
    }
  }, [editingId, editingOwed]);

  if (!user) {
    return null;
  }

  const userId = user.uid;

  function openDraft(url: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.location.href = url;
  }

  async function handleInviteEmail(item: (typeof owed)[number]) {
    await markInviteEmailSent(userId, item.sharedObligationId);
    openDraft(buildSharedInviteEmailDraft(item, appUrl));
  }

  function handleReminderEmail(item: (typeof owed)[number]) {
    openDraft(buildSharedReminderEmailDraft(item, appUrl));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={t("owedPage.eyebrow")}
        title={t("owedPage.title")}
        description={t("owedPage.description")}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <OwedForm
          defaultCurrency={baseCurrency}
          onCancel={() => setEditingId(null)}
          onSaved={() => setEditingId(null)}
          record={editingOwed}
          userId={userId}
        />
        {owed.length === 0 ? (
          <EmptyState
            title={t("owedPage.emptyTitle")}
            description={t("owedPage.emptyDescription")}
          />
        ) : (
          <SimpleTable
            title={t("owedPage.tableTitle")}
            description={t("owedPage.tableDescription")}
            rows={owed}
            columns={[
              {
                key: "debtor",
                header: t("owedPage.debtor"),
                render: (item) => (
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{item.debtorName}</p>
                      {item.sharingStatus === "matched" ? (
                        <Badge tone={item.sharedAgreementStatus === "agreed" ? "success" : "info"}>
                          {t(
                            item.sharedAgreementStatus === "agreed"
                              ? "collaboration.agreed"
                              : "collaboration.monegerLinked"
                          )}
                        </Badge>
                      ) : item.sharingStatus === "invited" ? (
                        <Badge tone="warning">{t("collaboration.invitePending")}</Badge>
                      ) : null}
                    </div>
                    <p className="text-xs text-slate-400">
                      {item.debtorEmail || item.debtorPhone || t("common.noContact")}
                    </p>
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
                header: t("owedPage.settlement"),
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
                      {item.sharedAgreementStatus ? (
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-500">
                          {t(`collaboration.status.${item.sharedAgreementStatus}`)}
                        </p>
                      ) : null}
                    </div>
                  );
                }
              },
              {
                key: "status",
                header: t("common.status"),
                render: (item) => (
                  <Badge tone={item.status === "overdue" ? "danger" : item.status === "settled" ? "success" : "info"}>
                    {t(`options.owedStatus.${item.status}`)}
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
                    {item.sharedObligationId && !item.sharedCurrentUserAcceptedAt ? (
                      <Button
                        variant="ghost"
                        onClick={() => void acceptSharedObligationSchedule(userId, item.sharedObligationId)}
                      >
                        {t("collaboration.acceptSchedule")}
                      </Button>
                    ) : null}
                    {item.sharingStatus === "invited" && item.debtorEmail ? (
                      <Button variant="ghost" onClick={() => void handleInviteEmail(item)}>
                        {t("collaboration.sendInvite")}
                      </Button>
                    ) : null}
                    {item.sharingStatus === "matched" && item.debtorEmail ? (
                      <Button variant="ghost" onClick={() => handleReminderEmail(item)}>
                        {t("collaboration.emailReminder")}
                      </Button>
                    ) : null}
                    <Button variant="ghost" onClick={() => void ledgerService.deleteOwed(userId, item.id)}>
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
