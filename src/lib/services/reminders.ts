import { differenceInCalendarDays, parseISO } from "date-fns";

import type { CurrencyCode, DebtRecord, OwedRecord, ReminderItem } from "@/types/finance";
import { getNextPendingInstallment } from "@/lib/utils/installments";

function buildReminder(
  id: string,
  type: "debt" | "owed",
  title: string,
  subtitle: string,
  amount: number,
  currency: CurrencyCode,
  dueDate: string,
  severity: "upcoming" | "overdue"
): ReminderItem {
  return {
    id,
    type,
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

    const nextInstallment = getNextPendingInstallment(item.installments);
    const dueDate = nextInstallment?.dueDate || item.settlementDate;
    const amount = nextInstallment?.amount || item.amount;

    if (item.installments?.length && !nextInstallment) {
      continue;
    }

    const days = differenceInCalendarDays(parseISO(dueDate), new Date());
    if (days < 0 || days <= 7) {
      reminders.push(
        buildReminder(
          item.id,
          "debt",
          "Debt settlement due",
          item.creditorName,
          amount,
          item.currency,
          dueDate,
          days < 0 ? "overdue" : "upcoming"
        )
      );
    }
  }

  for (const item of owed) {
    if (item.status === "settled") {
      continue;
    }

    const nextInstallment = getNextPendingInstallment(item.installments);
    const dueDate = nextInstallment?.dueDate || item.settlementDate;
    const amount = nextInstallment?.amount || item.amount;

    if (item.installments?.length && !nextInstallment) {
      continue;
    }

    const days = differenceInCalendarDays(parseISO(dueDate), new Date());
    if (days < 0 || days <= 7) {
      reminders.push(
        buildReminder(
          item.id,
          "owed",
          "Money owed reminder",
          item.debtorName,
          amount,
          item.currency,
          dueDate,
          days < 0 ? "overdue" : "upcoming"
        )
      );
    }
  }

  return reminders.sort(
    (left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime()
  );
}
