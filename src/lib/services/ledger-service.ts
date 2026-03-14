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
import type { DebtRecord, LanguagePreference, OwedRecord } from "@/types/finance";

export interface LedgerSaveResult<T> {
  record: T;
  collaborationWarning?: string;
}

function getCloudWarningMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "permission-denied"
  ) {
    return "Saved locally, but Firestore blocked collaboration sync. Publish the latest firestore.rules in Firebase and redeploy Cloudflare Pages if you changed env values.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Saved locally, but cloud collaboration did not sync. Check your Firestore setup and try again.";
}

async function runOptionalCloudStep(task: () => Promise<void>) {
  try {
    await task();
    return undefined;
  } catch (error) {
    console.warn("Optional cloud collaboration step failed", error);
    return getCloudWarningMessage(error);
  }
}

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
    const collaborationWarning = await runOptionalCloudStep(async () => {
      const collaborationMeta = await syncDebtCollaboration(userId, record);

      if (collaborationMeta) {
        record = await debtRepository.update(userId, record.id, collaborationMeta);
      }
    });

    await queueSync(userId, "debt", "create", record.id);
    return {
      record,
      collaborationWarning
    } satisfies LedgerSaveResult<DebtRecord>;
  },
  async updateDebt(userId: string, id: string, input: DebtInput) {
    let record = await debtRepository.update(userId, id, input);
    const collaborationWarning = await runOptionalCloudStep(async () => {
      const collaborationMeta = await syncDebtCollaboration(userId, record);

      if (collaborationMeta) {
        record = await debtRepository.update(userId, id, collaborationMeta);
      }
    });

    await queueSync(userId, "debt", "update", record.id);
    return {
      record,
      collaborationWarning
    } satisfies LedgerSaveResult<DebtRecord>;
  },
  async deleteDebt(userId: string, id: string) {
    const current = await debtRepository.get(userId, id);

    if (current?.sharedObligationId) {
      await runOptionalCloudStep(() => archiveSharedObligation(userId, current.sharedObligationId));
    }

    await debtRepository.remove(userId, id);
    await queueSync(userId, "debt", "delete", id);
  },
  async createOwed(userId: string, input: OwedInput) {
    let record = await owedRepository.create(userId, input);
    const collaborationWarning = await runOptionalCloudStep(async () => {
      const collaborationMeta = await syncOwedCollaboration(userId, record);

      if (collaborationMeta) {
        record = await owedRepository.update(userId, record.id, collaborationMeta);
      }
    });

    await queueSync(userId, "owed", "create", record.id);
    return {
      record,
      collaborationWarning
    } satisfies LedgerSaveResult<OwedRecord>;
  },
  async updateOwed(userId: string, id: string, input: OwedInput) {
    let record = await owedRepository.update(userId, id, input);
    const collaborationWarning = await runOptionalCloudStep(async () => {
      const collaborationMeta = await syncOwedCollaboration(userId, record);

      if (collaborationMeta) {
        record = await owedRepository.update(userId, id, collaborationMeta);
      }
    });

    await queueSync(userId, "owed", "update", record.id);
    return {
      record,
      collaborationWarning
    } satisfies LedgerSaveResult<OwedRecord>;
  },
  async deleteOwed(userId: string, id: string) {
    const current = await owedRepository.get(userId, id);

    if (current?.sharedObligationId) {
      await runOptionalCloudStep(() => archiveSharedObligation(userId, current.sharedObligationId));
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
