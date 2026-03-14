"use client";

import { useEffect, useRef, useState, useTransition } from "react";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  sendSharedObligationMessage,
  subscribeToSharedObligationMessages
} from "@/lib/services/shared-obligations-cloud-service";
import { cn } from "@/lib/utils/cn";
import { formatDateTime, relativeFromNow } from "@/lib/utils/date";
import type { SharedObligationMessageRecord } from "@/types/finance";

export function SharedObligationChat({
  sharedObligationId,
  counterpartyName,
  userId
}: {
  sharedObligationId: string;
  counterpartyName: string;
  userId: string;
}) {
  const { user } = useAuth();
  const { t } = useI18n();
  const [messages, setMessages] = useState<SharedObligationMessageRecord[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement | null>(null);
  const normalizedUserEmail = user?.email?.trim().toLowerCase() || "";

  useEffect(() => {
    setError("");

    return subscribeToSharedObligationMessages(sharedObligationId, setMessages);
  }, [sharedObligationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    startTransition(async () => {
      try {
        await sendSharedObligationMessage(userId, sharedObligationId, draft);
        setDraft("");
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "Unable to send a shared message right now."
        );
      }
    });
  }

  return (
    <Card className="border border-sky-100/90 bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(239,246,255,0.96))] p-0 shadow-[0_24px_70px_rgba(14,116,144,0.12)]">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-sky-100/80 px-4 py-4 sm:px-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-500">
            {t("common.collaboration")}
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-950">
            {t("collaboration.chatTitle")}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {counterpartyName
              ? `${t("collaboration.chatDescription")} ${counterpartyName}.`
              : t("collaboration.chatDescription")}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-600 shadow-[0_10px_24px_rgba(14,116,144,0.08)]">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sky-400" />
          Live
        </div>
      </div>

      <div className="max-h-[22rem] space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
        {messages.length === 0 ? (
          <div className="rounded-[20px] border border-dashed border-sky-200 bg-white/80 px-4 py-6 text-center text-sm text-slate-500">
            {t("collaboration.noMessages")}
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser =
              message.senderUid === userId || message.senderEmail === normalizedUserEmail;

            return (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  isCurrentUser ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[90%] rounded-[22px] px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:max-w-[75%]",
                    isCurrentUser
                      ? "bg-[linear-gradient(135deg,#0f172a_0%,#0f766e_100%)] text-white"
                      : "border border-white/80 bg-white/95 text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <p className={cn("text-sm font-semibold", isCurrentUser ? "text-white" : "text-slate-900")}>
                      {message.senderName || message.senderEmail || "Moneger user"}
                    </p>
                    <span
                      className={cn(
                        "text-[11px]",
                        isCurrentUser ? "text-white/70" : "text-slate-400"
                      )}
                      title={formatDateTime(message.createdAt)}
                    >
                      {relativeFromNow(message.createdAt)}
                    </span>
                  </div>
                  <p className={cn("mt-2 whitespace-pre-wrap text-sm leading-6", isCurrentUser ? "text-white/90" : "text-slate-600")}>
                    {message.body}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form className="border-t border-sky-100/80 px-4 py-4 sm:px-5" onSubmit={handleSubmit}>
        <Textarea
          className="min-h-[96px] bg-white/95"
          placeholder={t("collaboration.chatPlaceholder")}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="min-h-5 text-sm font-medium text-rose-600">{error}</div>
          <Button disabled={isPending || !draft.trim()} type="submit">
            {isPending ? t("common.saving") : t("collaboration.sendMessage")}
          </Button>
        </div>
      </form>
    </Card>
  );
}
