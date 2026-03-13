"use client";

import type { ReminderItem } from "@/types/finance";
import { translateRuntimeMessage } from "@/lib/i18n/messages";

export function browserNotificationSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function requestBrowserNotificationPermission() {
  if (!browserNotificationSupported()) {
    return "unsupported" as const;
  }

  return Notification.requestPermission();
}

export function pushReminderNotifications(reminders: ReminderItem[]) {
  if (!browserNotificationSupported() || Notification.permission !== "granted") {
    return;
  }

  reminders.slice(0, 2).forEach((reminder) => {
    const title =
      reminder.severity === "overdue"
        ? translateRuntimeMessage("notifications.overduePaymentAlert")
        : translateRuntimeMessage("notifications.upcomingSettlementAlert");
    const body = translateRuntimeMessage(
      reminder.type === "debt" ? "notifications.body.debt" : "notifications.body.owed",
      { name: reminder.subtitle }
    );

    new Notification(title, {
      body,
      tag: reminder.id
    });
  });
}

export const notificationArchitectureNote =
  "Optional email reminders should be triggered by a backend only after user-approved, encrypted reminder metadata is derived locally and uploaded as the minimum necessary payload.";
