"use client";

import { useEffect } from "react";

import { useAuth } from "@/lib/hooks/use-auth";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import {
  claimPendingSharedObligations,
  mirrorSharedObligationsToLocal,
  subscribeToSharedObligations,
  upsertUserDirectoryProfile
} from "@/lib/services/shared-obligations-cloud-service";

export function SharedCollaborationSync() {
  const { user } = useAuth();
  const settings = useUserSettings(user?.uid);

  useEffect(() => {
    if (!user?.uid || !user.email) {
      return;
    }

    void upsertUserDirectoryProfile(user.uid, user.email, settings);
  }, [settings, user?.email, user?.uid]);

  useEffect(() => {
    if (!user?.uid || !user.email) {
      return;
    }

    let unsubscribe = () => {};
    let active = true;

    void (async () => {
      await claimPendingSharedObligations(user.uid, user.email);

      if (!active) {
        return;
      }

      unsubscribe = subscribeToSharedObligations(user.uid, (obligations) => {
        void mirrorSharedObligationsToLocal(user.uid, obligations);
      });
    })();

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user?.email, user?.uid]);

  return null;
}
