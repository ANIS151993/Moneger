import { differenceInCalendarDays, parseISO } from "date-fns";

import type { DebtRecord, OwedRecord, ReminderItem } from "@/types/finance";

function buildReminder(
  id: string,
  title: string,
  subtitle: string,
  amount: number,
  currency: "USD" | "BDT",
  dueDate: string,
  severity: "upcoming" | "overdue"
): ReminderItem {
  return {
    id,
    type: title.toLowerCase().includes("owed") ? "owed" : "debt",
    title,
    subtitle,
    amount,
    currency,
    dueDate,
    severity
  };
}

export function buildReminders(debts: DebtRecord[], owed: OwedRecord[]) {
  const reminders: ReminderItem[] = [];

  for (const item of debts) {
    if (item.status === "paid") {
      continue;
    }

    const days = differenceInCalendarDays(parseISO(item.settlementDate), new Date());
    if (days < 0 || days <= 7) {
      reminders.push(
        buildReminder(
          item.id,
          "Debt settlement due",
          item.creditorName,
          item.amount,
          item.currency,
          item.settlementDate,
          days < 0 ? "overdue" : "upcoming"
        )
      );
    }
  }

  for (const item of owed) {
    if (item.status === "settled") {
      continue;
    }

    const days = differenceInCalendarDays(parseISO(item.settlementDate), new Date());
    if (days < 0 || days <= 7) {
      reminders.push(
        buildReminder(
          item.id,
          "Money owed reminder",
          item.debtorName,
          item.amount,
          item.currency,
          item.settlementDate,
          days < 0 ? "overdue" : "upcoming"
        )
      );
    }
  }

  return reminders.sort(
    (left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime()
  );
}
