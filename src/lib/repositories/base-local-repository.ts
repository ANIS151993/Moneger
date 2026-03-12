"use client";

import type { Table } from "dexie";

import { getUserDatabase } from "@/lib/db/moneger-db";
import { createId, nowIso } from "@/lib/utils/id";

type SupportedTableName = "incomes" | "expenses" | "debts" | "owed" | "banks" | "syncQueue";

type AuditedEntity = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export function createLocalRepository<TRecord extends AuditedEntity>(
  tableName: SupportedTableName,
  idPrefix: string
) {
  async function getTable(userId: string) {
    const db = getUserDatabase(userId);
    return db[tableName] as unknown as Table<TRecord, string>;
  }

  return {
    async list(userId: string) {
      const table = await getTable(userId);
      return table.orderBy("createdAt").reverse().toArray();
    },
    async get(userId: string, id: string) {
      const table = await getTable(userId);
      return table.get(id);
    },
    async create(userId: string, value: Omit<TRecord, "id" | "userId" | "createdAt" | "updatedAt">) {
      const table = await getTable(userId);
      const now = nowIso();
      const record = {
        ...value,
        userId,
        id: createId(idPrefix),
        createdAt: now,
        updatedAt: now
      } as TRecord;
      await table.put(record);
      return record;
    },
    async update(userId: string, id: string, patch: Partial<Omit<TRecord, "id" | "userId" | "createdAt">>) {
      const table = await getTable(userId);
      const current = await table.get(id);
      if (!current) {
        throw new Error(`${idPrefix} record not found`);
      }

      const nextRecord = {
        ...current,
        ...patch,
        updatedAt: nowIso()
      } as TRecord;

      await table.put(nextRecord);
      return nextRecord;
    },
    async remove(userId: string, id: string) {
      const table = await getTable(userId);
      await table.delete(id);
    },
    async bulkPut(userId: string, values: TRecord[]) {
      const table = await getTable(userId);
      await table.bulkPut(values);
      return values;
    },
    async clear(userId: string) {
      const table = await getTable(userId);
      await table.clear();
    }
  };
}
