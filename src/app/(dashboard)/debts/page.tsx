"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useSearchParams } from "next/navigation";

import { DebtForm } from "@/components/forms/DebtForm";
import { useI18n } from "@/components/providers/LanguageProvider";
import { SharedObligationChat } from "@/components/shared/SharedObligationChat";
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

export default function DebtsPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [chatRecordId, setChatRecordId] = useState<string | null>(null);
  const [actionError, setActionError] = useState("");
  const settings = useUserSettings(user?.uid);
  const baseCurrency = settings?.baseCurrency || "USD";
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://moneger.marcbd.site");
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
  const chatDebt = debts.find((item) => item.id === chatRecordId);

  useEffect(() => {
    if (editingId && !editingDebt) {
      setEditingId(null);
    }
  }, [editingDebt, editingId]);

  useEffect(() => {
    if (chatRecordId && !chatDebt) {
      setChatRecordId(null);
    }
  }, [chatDebt, chatRecordId]);

  useEffect(() => {
    const requestedSharedChatId = searchParams.get("chat");

    if (!requestedSharedChatId) {
      return;
    }

    const matchingRecord = debts.find((item) => item.sharedObligationId === requestedSharedChatId);

    if (matchingRecord && matchingRecord.id !== chatRecordId) {
      setChatRecordId(matchingRecord.id);
    }
  }, [chatRecordId, debts, searchParams]);

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

  async function handleInviteEmail(item: (typeof debts)[number]) {
    setActionError("");

    try {
      await markInviteEmailSent(userId, item.sharedObligationId);
    } catch (error) {
      console.warn("Unable to update shared invite state", error);
      setActionError(t("collaboration.localSaveWarning"));
    }

    openDraft(buildSharedInviteEmailDraft(item, appUrl));
  }

  function handleReminderEmail(item: (typeof debts)[number]) {
    setActionError("");
    openDraft(buildSharedReminderEmailDraft(item, appUrl));
  }

  async function handleAcceptSchedule(sharedObligationId?: string) {
    setActionError("");

    try {
      await acceptSharedObligationSchedule(userId, sharedObligationId);
    } catch (error) {
      console.warn("Unable to accept shared obligation schedule", error);
      setActionError(t("collaboration.localSaveWarning"));
    }
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
          userId={userId}
        />
        {debts.length === 0 ? (
          <EmptyState
            title={t("debtsPage.emptyTitle")}
            description={t("debtsPage.emptyDescription")}
          />
        ) : (
          <div className="space-y-4">
            {actionError ? <p className="text-sm font-medium text-amber-600">{actionError}</p> : null}
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
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-slate-900">{item.creditorName}</p>
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
                        {item.creditorEmail || item.creditorPhone || t("common.noContact")}
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
                      {item.sharedObligationId && !item.sharedCurrentUserAcceptedAt ? (
                        <Button
                          variant="ghost"
                          onClick={() => void handleAcceptSchedule(item.sharedObligationId)}
                        >
                          {t("collaboration.acceptSchedule")}
                        </Button>
                      ) : null}
                      {item.sharedObligationId ? (
                        <Button
                          variant={chatRecordId === item.id ? "secondary" : "ghost"}
                          onClick={() => setChatRecordId((current) => (current === item.id ? null : item.id))}
                        >
                          {t(chatRecordId === item.id ? "collaboration.closeChat" : "collaboration.openChat")}
                        </Button>
                      ) : null}
                      {item.sharingStatus === "invited" && item.creditorEmail ? (
                        <Button variant="ghost" onClick={() => void handleInviteEmail(item)}>
                          {t("collaboration.sendInvite")}
                        </Button>
                      ) : null}
                      {item.sharingStatus === "matched" && item.creditorEmail ? (
                        <Button variant="ghost" onClick={() => handleReminderEmail(item)}>
                          {t("collaboration.emailReminder")}
                        </Button>
                      ) : null}
                      <Button variant="ghost" onClick={() => void ledgerService.deleteDebt(userId, item.id)}>
                        {t("common.delete")}
                      </Button>
                    </div>
                  )
                }
              ]}
            />
            {chatDebt?.sharedObligationId ? (
              <SharedObligationChat
                counterpartyName={chatDebt.creditorName}
                sharedObligationId={chatDebt.sharedObligationId}
                userId={userId}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
