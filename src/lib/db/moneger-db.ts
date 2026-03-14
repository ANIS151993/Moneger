"use client";

import Dexie, { type Table } from "dexie";

import { inferBankCountry } from "@/lib/constants/options";
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

export class MonegerDatabase extends Dexie {
  incomes!: Table<IncomeRecord, string>;
  expenses!: Table<ExpenseRecord, string>;
  debts!: Table<DebtRecord, string>;
  owed!: Table<OwedRecord, string>;
  banks!: Table<BankRecord, string>;
  exchangeRates!: Table<ExchangeRateRecord, string>;
  exchangeRateSnapshots!: Table<ExchangeRateSnapshotRecord, string>;
  syncQueue!: Table<SyncQueueRecord, string>;
  settings!: Table<SettingsRecord, string>;
  messageNotifications!: Table<MessageNotificationRecord, string>;
  sharedMessageStates!: Table<SharedMessageStateRecord, string>;

  constructor(name: string) {
    super(name);

    this.version(1).stores({
      incomes: "id, userId, date, category, source, createdAt, updatedAt",
      expenses: "id, userId, date, category, source, createdAt, updatedAt",
      debts: "id, userId, settlementDate, status, creditorName, createdAt, updatedAt",
      owed: "id, userId, settlementDate, status, debtorName, createdAt, updatedAt",
      banks: "id, userId, bankName, nickname, createdAt, updatedAt",
      exchangeRates: "pair, userId, fetchedAt, updatedAt",
      syncQueue: "id, userId, entityType, status, createdAt, updatedAt",
      settings: "id, userId, updatedAt"
    });

    this.version(2).stores({
      incomes: "id, userId, date, category, source, createdAt, updatedAt",
      expenses: "id, userId, date, category, source, createdAt, updatedAt",
      debts: "id, userId, settlementDate, status, creditorName, createdAt, updatedAt",
      owed: "id, userId, settlementDate, status, debtorName, createdAt, updatedAt",
      banks: "id, userId, bankName, nickname, createdAt, updatedAt",
      exchangeRates: "pair, userId, fetchedAt, updatedAt",
      exchangeRateSnapshots: "id, userId, fetchedAt, updatedAt",
      syncQueue: "id, userId, entityType, status, createdAt, updatedAt",
      settings: "id, userId, updatedAt"
    });

    this.version(3)
      .stores({
        incomes: "id, userId, date, category, source, createdAt, updatedAt",
        expenses: "id, userId, date, category, source, createdAt, updatedAt",
        debts: "id, userId, settlementDate, status, creditorName, createdAt, updatedAt",
        owed: "id, userId, settlementDate, status, debtorName, createdAt, updatedAt",
        banks: "id, userId, country, bankName, nickname, createdAt, updatedAt",
        exchangeRates: "pair, userId, fetchedAt, updatedAt",
        exchangeRateSnapshots: "id, userId, fetchedAt, updatedAt",
        syncQueue: "id, userId, entityType, status, createdAt, updatedAt",
        settings: "id, userId, updatedAt"
      })
      .upgrade(async (transaction) => {
        await transaction
          .table("banks")
          .toCollection()
          .modify((record: { bankName?: string; currency?: BankRecord["currency"]; country?: BankRecord["country"] }) => {
            if (record.country) {
              return;
            }

            record.country = inferBankCountry(record.bankName || "", record.currency || "USD");
          });
      });

    this.version(4).stores({
      incomes: "id, userId, date, category, source, createdAt, updatedAt",
      expenses: "id, userId, date, category, source, createdAt, updatedAt",
      debts: "id, userId, settlementDate, status, creditorName, createdAt, updatedAt",
      owed: "id, userId, settlementDate, status, debtorName, createdAt, updatedAt",
      banks: "id, userId, country, bankName, nickname, createdAt, updatedAt",
      exchangeRates: "pair, userId, fetchedAt, updatedAt",
      exchangeRateSnapshots: "id, userId, fetchedAt, updatedAt",
      syncQueue: "id, userId, entityType, status, createdAt, updatedAt",
      settings: "id, userId, updatedAt",
      messageNotifications: "id, userId, sharedObligationId, readAt, messageCreatedAt, updatedAt",
      sharedMessageStates: "id, userId, sharedObligationId, lastKnownMessageAt, lastSeenAt, updatedAt"
    });
  }
}

const databaseCache = new Map<string, MonegerDatabase>();

export function getUserDatabase(userId: string) {
  const dbName = `moneger_${userId}`;
  const cached = databaseCache.get(dbName);

  if (cached) {
    return cached;
  }

  const db = new MonegerDatabase(dbName);
  databaseCache.set(dbName, db);
  return db;
}
