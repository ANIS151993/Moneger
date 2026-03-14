import type { InstallmentFrequency, InstallmentScheduleItem } from "@/types/finance";

type InstallmentLike = {
  amount?: unknown;
  dueDate?: unknown;
  frequency?: InstallmentFrequency | null;
  settled?: unknown;
  note?: unknown;
};

export function normalizeInstallments(installments?: InstallmentLike[] | null): InstallmentScheduleItem[] {
  return [...(installments || [])]
    .map((item) => ({
      dueDate: typeof item?.dueDate === "string" ? item.dueDate : "",
      amount: Number(item?.amount || 0),
      settled: Boolean(item?.settled),
      note: typeof item?.note === "string" ? item.note : "",
      frequency: item?.frequency || "custom"
    }))
    .sort((left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime());
}

export function sumInstallments(installments?: InstallmentScheduleItem[]) {
  return normalizeInstallments(installments).reduce((total, item) => total + item.amount, 0);
}

export function sumPendingInstallments(installments?: InstallmentScheduleItem[]) {
  return normalizeInstallments(installments)
    .filter((item) => !item.settled)
    .reduce((total, item) => total + item.amount, 0);
}

export function getInstallmentProgress(installments?: InstallmentScheduleItem[]) {
  const normalized = normalizeInstallments(installments);
  const settled = normalized.filter((item) => item.settled).length;

  return {
    total: normalized.length,
    settled,
    pending: normalized.length - settled
  };
}

export function getNextPendingInstallment(installments?: InstallmentScheduleItem[]) {
  return normalizeInstallments(installments).find((item) => !item.settled);
}

export function getOutstandingScheduledAmount(fallbackAmount: number, installments?: InstallmentScheduleItem[]) {
  if (!installments?.length) {
    return fallbackAmount;
  }

  return sumPendingInstallments(installments);
}

export function getFinalInstallmentDate(installments?: InstallmentScheduleItem[]) {
  const normalized = normalizeInstallments(installments);

  return normalized.at(-1)?.dueDate;
}
