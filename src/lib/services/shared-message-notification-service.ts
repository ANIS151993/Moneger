"use client";

import {
  messageNotificationRepository,
  sharedMessageStateRepository
} from "@/lib/repositories/finance-repositories";
import { pushBrowserNotification } from "@/lib/services/notification-service";
import type {
  SharedObligationMessageRecord,
  SharedObligationRecord
} from "@/types/finance";
import { nowIso } from "@/lib/utils/id";

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || "";
}

function compareIso(left?: string | null, right?: string | null) {
  return (left || "").localeCompare(right || "");
}

function getNotificationContext(
  userId: string,
  userEmail: string,
  obligation: SharedObligationRecord
) {
  const isCreditor =
    obligation.creditor.uid === userId || normalizeEmail(obligation.creditor.email) === userEmail;
  const counterpart = isCreditor ? obligation.debtor : obligation.creditor;

  return {
    counterpartName: counterpart.name || counterpart.email || "Moneger user",
    routeHref: `${isCreditor ? "/owed" : "/debts"}?chat=${obligation.id}`
  };
}

export async function syncSharedMessageNotifications(params: {
  userId: string;
  userEmail?: string | null;
  obligation: SharedObligationRecord;
  messages: SharedObligationMessageRecord[];
  notificationsEnabled: boolean;
}) {
  const { userId, obligation, messages, notificationsEnabled } = params;
  const normalizedUserEmail = normalizeEmail(params.userEmail);
  const state = await sharedMessageStateRepository.get(userId, obligation.id);
  const latestMessageAt = messages[messages.length - 1]?.createdAt || "";

  if (!state) {
    if (latestMessageAt) {
      await sharedMessageStateRepository.upsert(userId, obligation.id, {
        lastKnownMessageAt: latestMessageAt,
        lastSeenAt: latestMessageAt
      });
    }

    return;
  }

  const baseline = state.lastKnownMessageAt || state.lastSeenAt || "";
  const incomingMessages = messages.filter(
    (message) =>
      message.senderUid !== userId &&
      normalizeEmail(message.senderEmail) !== normalizedUserEmail &&
      compareIso(message.createdAt, baseline) > 0
  );

  if (incomingMessages.length > 0) {
    const { counterpartName, routeHref } = getNotificationContext(userId, normalizedUserEmail, obligation);

    for (const message of incomingMessages) {
      const existing = await messageNotificationRepository.get(userId, message.id);

      if (existing) {
        continue;
      }

      await messageNotificationRepository.upsert(userId, {
        type: "shared-message",
        sharedObligationId: obligation.id,
        messageId: message.id,
        counterpartName,
        title: counterpartName,
        body: message.body,
        routeHref,
        messageCreatedAt: message.createdAt,
        readAt: null
      });

      if (notificationsEnabled) {
        pushBrowserNotification(counterpartName, message.body, `shared-message-${message.id}`);
      }
    }
  }

  if (latestMessageAt && compareIso(latestMessageAt, state.lastKnownMessageAt) > 0) {
    await sharedMessageStateRepository.upsert(userId, obligation.id, {
      lastKnownMessageAt: latestMessageAt,
      lastSeenAt: state.lastSeenAt
    });
  }
}

export async function markSharedConversationSeen(
  userId: string,
  sharedObligationId: string,
  latestMessageAt?: string
) {
  const state = await sharedMessageStateRepository.get(userId, sharedObligationId);
  const seenAt = latestMessageAt || state?.lastKnownMessageAt || nowIso();

  await messageNotificationRepository.markSharedObligationRead(userId, sharedObligationId);
  await sharedMessageStateRepository.upsert(userId, sharedObligationId, {
    lastKnownMessageAt: compareIso(state?.lastKnownMessageAt, seenAt) > 0 ? state?.lastKnownMessageAt || seenAt : seenAt,
    lastSeenAt: seenAt
  });
}

