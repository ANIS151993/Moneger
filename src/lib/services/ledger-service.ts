"use client";

import type {
  BankInput,
  DebtInput,
  ExpenseInput,
  IncomeInput,
  OwedInput,
  ProfileInput,
  SettingsInput
} from "@/lib/validators/finance";
import {
  bankRepository,
  debtRepository,
  expenseRepository,
  incomeRepository,
  owedRepository,
  settingsRepository,
  syncQueueRepository
} from "@/lib/repositories/finance-repositories";
import {
  archiveSharedObligation,
  syncDebtCollaboration,
  syncOwedCollaboration,
  upsertUserDirectoryProfile
} from "@/lib/services/shared-obligations-cloud-service";
import { saveUserSettingsToCloud } from "@/lib/services/user-settings-cloud-service";
import type { LanguagePreference } from "@/types/finance";

async function queueSync(
  userId: string,
  entityType: "income" | "expense" | "debt" | "owed" | "bank" | "settings",
  action: "create" | "update" | "delete",
  recordId: string
) {
  await syncQueueRepository.create(userId, {
    entityType,
    action,
    recordId,
    status: "queued",
    encryptedPayload: null,
    errorMessage: ""
  });
}

export const ledgerService = {
  async createIncome(userId: string, input: IncomeInput) {
    const record = await incomeRepository.create(userId, input);
    await queueSync(userId, "income", "create", record.id);
    return record;
  },
  async updateIncome(userId: string, id: string, input: IncomeInput) {
    const record = await incomeRepository.update(userId, id, input);
    await queueSync(userId, "income", "update", record.id);
    return record;
  },
  async deleteIncome(userId: string, id: string) {
    await incomeRepository.remove(userId, id);
    await queueSync(userId, "income", "delete", id);
  },
  async createExpense(userId: string, input: ExpenseInput) {
    const record = await expenseRepository.create(userId, input);
    await queueSync(userId, "expense", "create", record.id);
    return record;
  },
  async updateExpense(userId: string, id: string, input: ExpenseInput) {
    const record = await expenseRepository.update(userId, id, input);
    await queueSync(userId, "expense", "update", record.id);
    return record;
  },
  async deleteExpense(userId: string, id: string) {
    await expenseRepository.remove(userId, id);
    await queueSync(userId, "expense", "delete", id);
  },
  async createDebt(userId: string, input: DebtInput) {
    let record = await debtRepository.create(userId, input);
    const collaborationMeta = await syncDebtCollaboration(userId, record);

    if (collaborationMeta) {
      record = await debtRepository.update(userId, record.id, collaborationMeta);
    }

    await queueSync(userId, "debt", "create", record.id);
    return record;
  },
  async updateDebt(userId: string, id: string, input: DebtInput) {
    let record = await debtRepository.update(userId, id, input);
    const collaborationMeta = await syncDebtCollaboration(userId, record);

    if (collaborationMeta) {
      record = await debtRepository.update(userId, id, collaborationMeta);
    }

    await queueSync(userId, "debt", "update", record.id);
    return record;
  },
  async deleteDebt(userId: string, id: string) {
    const current = await debtRepository.get(userId, id);

    if (current?.sharedObligationId) {
      await archiveSharedObligation(userId, current.sharedObligationId);
    }

    await debtRepository.remove(userId, id);
    await queueSync(userId, "debt", "delete", id);
  },
  async createOwed(userId: string, input: OwedInput) {
    let record = await owedRepository.create(userId, input);
    const collaborationMeta = await syncOwedCollaboration(userId, record);

    if (collaborationMeta) {
      record = await owedRepository.update(userId, record.id, collaborationMeta);
    }

    await queueSync(userId, "owed", "create", record.id);
    return record;
  },
  async updateOwed(userId: string, id: string, input: OwedInput) {
    let record = await owedRepository.update(userId, id, input);
    const collaborationMeta = await syncOwedCollaboration(userId, record);

    if (collaborationMeta) {
      record = await owedRepository.update(userId, id, collaborationMeta);
    }

    await queueSync(userId, "owed", "update", record.id);
    return record;
  },
  async deleteOwed(userId: string, id: string) {
    const current = await owedRepository.get(userId, id);

    if (current?.sharedObligationId) {
      await archiveSharedObligation(userId, current.sharedObligationId);
    }

    await owedRepository.remove(userId, id);
    await queueSync(userId, "owed", "delete", id);
  },
  async createBank(userId: string, input: BankInput) {
    const record = await bankRepository.create(userId, input);
    await queueSync(userId, "bank", "create", record.id);
    return record;
  },
  async deleteBank(userId: string, id: string) {
    await bankRepository.remove(userId, id);
    await queueSync(userId, "bank", "delete", id);
  },
  async saveSettings(userId: string, input: SettingsInput & { browserNotificationsPermission: NotificationPermission | "unsupported" }) {
    const record = await settingsRepository.upsert(userId, input);
    await queueSync(userId, "settings", "update", record.id);
    void saveUserSettingsToCloud(record).catch(() => undefined);
    return record;
  },
  async saveProfile(userId: string, input: ProfileInput) {
    const record = await settingsRepository.upsert(userId, input);
    await queueSync(userId, "settings", "update", record.id);
    void saveUserSettingsToCloud(record).catch(() => undefined);
    void upsertUserDirectoryProfile(userId, undefined, record).catch(() => undefined);
    return record;
  },
  async saveLanguagePreference(userId: string, languagePreference: LanguagePreference) {
    const record = await settingsRepository.upsert(userId, { languagePreference });
    await queueSync(userId, "settings", "update", record.id);
    void saveUserSettingsToCloud(record).catch(() => undefined);
    void upsertUserDirectoryProfile(userId, undefined, record).catch(() => undefined);
    return record;
  },
  async clearWorkspace(userId: string) {
    await Promise.all([
      incomeRepository.clear(userId),
      expenseRepository.clear(userId),
      debtRepository.clear(userId),
      owedRepository.clear(userId),
      bankRepository.clear(userId),
      syncQueueRepository.clear(userId)
    ]);
  }
};
