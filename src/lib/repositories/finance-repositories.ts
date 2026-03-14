"use client";

import { supportedCurrencies } from "@/lib/constants/options";
import type {
  BankRecord,
  DebtRecord,
  ExchangeRateRecord,
  ExchangeRateSnapshotRecord,
  ExpenseRecord,
  IncomeRecord,
  MessageNotificationRecord,
  OwedRecord,
  SettingsRecord,
  SharedMessageStateRecord,
  SyncQueueRecord
} from "@/types/finance";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { createLocalRepository } from "@/lib/repositories/base-local-repository";
import { nowIso } from "@/lib/utils/id";

const supportedCurrencySet = new Set(supportedCurrencies);

function isSupportedCurrency(value: unknown): value is SettingsRecord["baseCurrency"] {
  return typeof value === "string" && supportedCurrencySet.has(value as SettingsRecord["baseCurrency"]);
}

export const incomeRepository = createLocalRepository<IncomeRecord>("incomes", "income");
export const expenseRepository = createLocalRepository<ExpenseRecord>("expenses", "expense");
export const debtRepository = createLocalRepository<DebtRecord>("debts", "debt");
export const owedRepository = createLocalRepository<OwedRecord>("owed", "owed");
export const bankRepository = createLocalRepository<BankRecord>("banks", "bank");
export const syncQueueRepository = createLocalRepository<SyncQueueRecord>("syncQueue", "sync");

function buildDefaultSettings(): Omit<SettingsRecord, "id" | "userId" | "createdAt" | "updatedAt"> {
  return {
    baseCurrency: "USD",
    comparisonCurrency: "",
    languagePreference: "en",
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

export const exchangeRateSnapshotRepository = {
  async getLatest(userId: string) {
    return getUserDatabase(userId).exchangeRateSnapshots.orderBy("fetchedAt").last();
  },
  async listRecent(userId: string, limit = 12) {
    return getUserDatabase(userId).exchangeRateSnapshots
      .orderBy("fetchedAt")
      .reverse()
      .limit(limit)
      .toArray();
  },
  async saveSnapshot(
    userId: string,
    payload: Omit<ExchangeRateSnapshotRecord, "id" | "userId" | "createdAt" | "updatedAt">
  ) {
    const now = nowIso();
    const record: ExchangeRateSnapshotRecord = {
      id: `snapshot_${payload.fetchedAt}`,
      userId,
      createdAt: now,
      updatedAt: now,
      ...payload
    };
    await getUserDatabase(userId).exchangeRateSnapshots.put(record);
    return record;
  }
};

export const settingsRepository = {
  async get(userId: string) {
    const record = await getUserDatabase(userId).settings.get(`settings_${userId}`);

    if (!record) {
      return undefined;
    }

    const legacyRecord = record as SettingsRecord & { displayCurrency?: SettingsRecord["baseCurrency"] };
    const legacyDisplayCurrency =
      isSupportedCurrency(legacyRecord.displayCurrency)
        ? legacyRecord.displayCurrency
        : undefined;
    const normalizedComparisonCurrency: SettingsRecord["comparisonCurrency"] =
      isSupportedCurrency(record.comparisonCurrency)
        ? record.comparisonCurrency
        : "";

    return {
      ...buildDefaultSettings(),
      ...record,
      baseCurrency: record.baseCurrency || legacyDisplayCurrency || "USD",
      comparisonCurrency: normalizedComparisonCurrency
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
  },
  async hydrate(
    userId: string,
    payload: Partial<Omit<SettingsRecord, "id" | "userId">> &
      Pick<SettingsRecord, "createdAt" | "updatedAt">
  ) {
    const current = await this.get(userId);
    const now = nowIso();
    const { createdAt, updatedAt, ...rest } = payload;
    const record: SettingsRecord = {
      id: `settings_${userId}`,
      userId,
      createdAt: createdAt || current?.createdAt || now,
      updatedAt: updatedAt || current?.updatedAt || now,
      ...buildDefaultSettings(),
      ...current,
      ...rest
    };
    await getUserDatabase(userId).settings.put(record);
    return record;
  }
};

export const messageNotificationRepository = {
  async get(userId: string, messageId: string) {
    return getUserDatabase(userId).messageNotifications.get(`message_notification_${messageId}`);
  },
  async listRecent(userId: string, limit = 8) {
    return getUserDatabase(userId).messageNotifications
      .orderBy("messageCreatedAt")
      .reverse()
      .limit(limit)
      .toArray();
  },
  async countUnread(userId: string) {
    const items = await getUserDatabase(userId).messageNotifications.toArray();
    return items.filter((item) => !item.readAt).length;
  },
  async upsert(
    userId: string,
    payload: Omit<MessageNotificationRecord, "id" | "userId" | "createdAt" | "updatedAt">
  ) {
    const id = `message_notification_${payload.messageId}`;
    const current = await getUserDatabase(userId).messageNotifications.get(id);
    const now = nowIso();
    const record: MessageNotificationRecord = {
      id,
      userId,
      createdAt: current?.createdAt || now,
      updatedAt: now,
      ...payload
    };
    await getUserDatabase(userId).messageNotifications.put(record);
    return record;
  },
  async markRead(userId: string, id: string) {
    const current = await getUserDatabase(userId).messageNotifications.get(id);

    if (!current || current.readAt) {
      return current;
    }

    const nextRecord: MessageNotificationRecord = {
      ...current,
      readAt: nowIso(),
      updatedAt: nowIso()
    };
    await getUserDatabase(userId).messageNotifications.put(nextRecord);
    return nextRecord;
  },
  async markSharedObligationRead(userId: string, sharedObligationId: string) {
    const items = await getUserDatabase(userId).messageNotifications
      .where("sharedObligationId")
      .equals(sharedObligationId)
      .toArray();

    await Promise.all(items.filter((item) => !item.readAt).map((item) => this.markRead(userId, item.id)));
  },
  async markAllRead(userId: string) {
    const items = await getUserDatabase(userId).messageNotifications.toArray();
    await Promise.all(items.filter((item) => !item.readAt).map((item) => this.markRead(userId, item.id)));
  }
};

export const sharedMessageStateRepository = {
  async get(userId: string, sharedObligationId: string) {
    return getUserDatabase(userId).sharedMessageStates.get(`shared_message_state_${sharedObligationId}`);
  },
  async upsert(
    userId: string,
    sharedObligationId: string,
    payload: Omit<SharedMessageStateRecord, "id" | "userId" | "sharedObligationId" | "createdAt" | "updatedAt">
  ) {
    const id = `shared_message_state_${sharedObligationId}`;
    const current = await getUserDatabase(userId).sharedMessageStates.get(id);
    const now = nowIso();
    const record: SharedMessageStateRecord = {
      id,
      userId,
      sharedObligationId,
      createdAt: current?.createdAt || now,
      updatedAt: now,
      lastKnownMessageAt: payload.lastKnownMessageAt,
      lastSeenAt: payload.lastSeenAt
    };
    await getUserDatabase(userId).sharedMessageStates.put(record);
    return record;
  }
};
