"use client";

import Dexie, { type Table } from "dexie";

import type {
  BankRecord,
  DebtRecord,
  ExchangeRateRecord,
  ExchangeRateSnapshotRecord,
  ExpenseRecord,
  IncomeRecord,
  OwedRecord,
  SettingsRecord,
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
