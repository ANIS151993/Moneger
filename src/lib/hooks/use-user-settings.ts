"use client";

import { useEffect, useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";

import { settingsRepository } from "@/lib/repositories/finance-repositories";
import { hydrateUserSettingsFromCloud } from "@/lib/services/user-settings-cloud-service";
import type { SettingsRecord } from "@/types/finance";

export function useUserSettingsState(userId?: string) {
  const settings = useLiveQuery(
    async () => {
      if (!userId) {
        return undefined;
      }

      return settingsRepository.get(userId);
    },
    [userId]
  );

  const [hydrating, setHydrating] = useState(Boolean(userId));

  useEffect(() => {
    if (!userId) {
      setHydrating(false);
      return;
    }

    let active = true;
    setHydrating(true);

    void hydrateUserSettingsFromCloud(userId).finally(() => {
      if (active) {
        setHydrating(false);
      }
    });

    return () => {
      active = false;
    };
  }, [userId]);

  return {
    settings: settings as SettingsRecord | undefined,
    hydrating
  };
}

export function useUserSettings(userId?: string) {
  return useUserSettingsState(userId).settings;
}
