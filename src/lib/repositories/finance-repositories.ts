"use client";

import type {
  BankRecord,
  DebtRecord,
  ExchangeRateRecord,
  ExpenseRecord,
  IncomeRecord,
  OwedRecord,
  SettingsRecord,
  SyncQueueRecord
} from "@/types/finance";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { createLocalRepository } from "@/lib/repositories/base-local-repository";
import { nowIso } from "@/lib/utils/id";

export const incomeRepository = createLocalRepository<IncomeRecord>("incomes", "income");
export const expenseRepository = createLocalRepository<ExpenseRecord>("expenses", "expense");
export const debtRepository = createLocalRepository<DebtRecord>("debts", "debt");
export const owedRepository = createLocalRepository<OwedRecord>("owed", "owed");
export const bankRepository = createLocalRepository<BankRecord>("banks", "bank");
export const syncQueueRepository = createLocalRepository<SyncQueueRecord>("syncQueue", "sync");

function buildDefaultSettings(): Omit<SettingsRecord, "id" | "userId" | "createdAt" | "updatedAt"> {
  return {
    displayCurrency: "USD",
    notificationsEnabled: true,
    optionalEncryptedSyncEnabled: false,
    browserNotificationsPermission:
      typeof Notification === "undefined" ? "unsupported" : Notification.permission,
    themePreference: "system",
    fullName: "",
    contactNumber: "",
    occupation: "",
    gender: "",
    maritalStatus: "",
    location: "",
    bio: "",
    avatarDataUrl: ""
  };
}

export const exchangeRateRepository = {
  async getRate(userId: string, pair: string) {
    return getUserDatabase(userId).exchangeRates.get(pair);
  },
  async saveRate(
    userId: string,
    payload: Omit<ExchangeRateRecord, "id" | "userId" | "createdAt" | "updatedAt">
  ) {
    const current = await getUserDatabase(userId).exchangeRates.get(payload.pair);
    const now = nowIso();
    const record: ExchangeRateRecord = {
      id: payload.pair,
      ...payload,
      userId,
      createdAt: current?.createdAt || now,
      updatedAt: now
    };
    await getUserDatabase(userId).exchangeRates.put(record);
    return record;
  }
};

export const settingsRepository = {
  async get(userId: string) {
    const record = await getUserDatabase(userId).settings.get(`settings_${userId}`);

    if (!record) {
      return undefined;
    }

    return {
      ...buildDefaultSettings(),
      ...record
    };
  },
  async upsert(
    userId: string,
    payload: Partial<Omit<SettingsRecord, "id" | "userId" | "createdAt" | "updatedAt">>
  ) {
    const current = await this.get(userId);
    const now = nowIso();
    const record: SettingsRecord = {
      id: `settings_${userId}`,
      userId,
      createdAt: current?.createdAt || now,
      updatedAt: now,
      ...buildDefaultSettings(),
      ...current,
      ...payload
    };
    await getUserDatabase(userId).settings.put(record);
    return record;
  }
};
