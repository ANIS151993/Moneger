"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { settingsRepository } from "@/lib/repositories/finance-repositories";

export function useUserSettings(userId?: string) {
  return useLiveQuery(
    async () => {
      if (!userId) {
        return undefined;
      }

      return settingsRepository.get(userId);
    },
    [userId]
  );
}
