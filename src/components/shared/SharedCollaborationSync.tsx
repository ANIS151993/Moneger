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

    void upsertUserDirectoryProfile(user.uid, user.email, settings).catch((error) => {
      console.warn("Unable to upsert current user directory profile", error);
    });
  }, [settings, user?.email, user?.uid]);

  useEffect(() => {
    if (!user?.uid || !user.email) {
      return;
    }

    const unsubscribe = subscribeToSharedObligations(user.uid, user.email, (obligations) => {
      void mirrorSharedObligationsToLocal(user.uid, obligations, user.email);
    });

    void claimPendingSharedObligations(user.uid, user.email).catch((error) => {
      console.warn("Unable to claim pending shared obligations", error);
    });

    return () => {
      unsubscribe();
    };
  }, [user?.email, user?.uid]);

  return null;
}
