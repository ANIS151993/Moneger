"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/lib/hooks/use-auth";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import {
  subscribeToSharedObligationMessages,
  subscribeToSharedObligations
} from "@/lib/services/shared-obligations-cloud-service";
import { syncSharedMessageNotifications } from "@/lib/services/shared-message-notification-service";
import type { SharedObligationRecord } from "@/types/finance";

export function SharedMessageNotificationsSync() {
  const { user } = useAuth();
  const settings = useUserSettings(user?.uid);
  const [obligations, setObligations] = useState<SharedObligationRecord[]>([]);

  useEffect(() => {
    if (!user?.uid || !user.email) {
      setObligations([]);
      return;
    }

    return subscribeToSharedObligations(user.uid, user.email, setObligations);
  }, [user?.email, user?.uid]);

  useEffect(() => {
    if (!user?.uid || !user.email) {
      return;
    }

    const unsubscribeCallbacks = obligations
      .filter((obligation) => obligation.status !== "cancelled")
      .map((obligation) =>
        subscribeToSharedObligationMessages(obligation.id, (messages) => {
          void syncSharedMessageNotifications({
            userId: user.uid,
            userEmail: user.email,
            obligation,
            messages,
            notificationsEnabled: Boolean(settings?.notificationsEnabled)
          });
        })
      );

    return () => {
      unsubscribeCallbacks.forEach((unsubscribe) => unsubscribe());
    };
  }, [obligations, settings?.notificationsEnabled, user?.email, user?.uid]);

  return null;
}

