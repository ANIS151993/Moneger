"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";
import { settingsRepository } from "@/lib/repositories/finance-repositories";
import type { SettingsRecord } from "@/types/finance";

const SETTINGS_DOC_ID = "workspace";
const MAX_SYNCED_AVATAR_LENGTH = 280_000;
const settingsHydrationCache = new Map<string, Promise<SettingsRecord | undefined>>();

const syncedSettingsKeys = [
  "baseCurrency",
  "comparisonCurrency",
  "languagePreference",
  "notificationsEnabled",
  "optionalEncryptedSyncEnabled",
  "browserNotificationsPermission",
  "themePreference",
  "fullName",
  "contactNumber",
  "occupation",
  "gender",
  "maritalStatus",
  "location",
  "bio",
  "avatarDataUrl"
] as const;

type SyncedSettingsKey = (typeof syncedSettingsKeys)[number];

type CloudSettingsRecord = Pick<SettingsRecord, SyncedSettingsKey | "createdAt" | "updatedAt"> & {
  schemaVersion: 1;
};

type HydratableCloudSettingsRecord = Partial<Omit<SettingsRecord, "id" | "userId">> &
  Pick<SettingsRecord, "createdAt" | "updatedAt">;

function getSettingsDocReference(userId: string) {
  return firestore ? doc(firestore, "users", userId, "settings", SETTINGS_DOC_ID) : null;
}

function pickCloudSettingsPayload(record: SettingsRecord, avatarDataUrl: string): CloudSettingsRecord {
  return {
    schemaVersion: 1,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    baseCurrency: record.baseCurrency,
    comparisonCurrency: record.comparisonCurrency,
    languagePreference: record.languagePreference,
    notificationsEnabled: record.notificationsEnabled,
    optionalEncryptedSyncEnabled: record.optionalEncryptedSyncEnabled,
    browserNotificationsPermission: record.browserNotificationsPermission,
    themePreference: record.themePreference,
    fullName: record.fullName,
    contactNumber: record.contactNumber,
    occupation: record.occupation,
    gender: record.gender,
    maritalStatus: record.maritalStatus,
    location: record.location,
    bio: record.bio,
    avatarDataUrl
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeCloudSettingsRecord(data: unknown): HydratableCloudSettingsRecord | null {
  if (!isPlainObject(data)) {
    return null;
  }

  const createdAt = typeof data.createdAt === "string" ? data.createdAt : "";
  const updatedAt = typeof data.updatedAt === "string" ? data.updatedAt : "";

  if (!updatedAt) {
    return null;
  }

  const normalized: HydratableCloudSettingsRecord = {
    createdAt: createdAt || updatedAt,
    updatedAt
  };

  for (const key of syncedSettingsKeys) {
    const value = data[key];

    if (value !== undefined) {
      (normalized as Record<string, unknown>)[key] = value;
    }
  }

  return normalized;
}

function isRemoteNewer(remoteUpdatedAt?: string, localUpdatedAt?: string) {
  if (!remoteUpdatedAt) {
    return false;
  }

  if (!localUpdatedAt) {
    return true;
  }

  return remoteUpdatedAt > localUpdatedAt;
}

function loadImage(dataUrl: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("PROFILE_IMAGE_OPTIMIZE_ERROR"));
    image.src = dataUrl;
  });
}

async function compressAvatarForCloud(avatarDataUrl: string) {
  if (!avatarDataUrl || avatarDataUrl.length <= MAX_SYNCED_AVATAR_LENGTH || typeof document === "undefined") {
    return avatarDataUrl;
  }

  try {
    const image = await loadImage(avatarDataUrl);
    const attempts: Array<{ size: number; quality: number }> = [
      { size: 192, quality: 0.82 },
      { size: 160, quality: 0.76 },
      { size: 128, quality: 0.72 },
      { size: 96, quality: 0.68 }
    ];

    for (const attempt of attempts) {
      const canvas = document.createElement("canvas");
      canvas.width = attempt.size;
      canvas.height = attempt.size;

      const context = canvas.getContext("2d");

      if (!context) {
        return avatarDataUrl;
      }

      const scale = Math.min(attempt.size / image.width, attempt.size / image.height);
      const drawWidth = image.width * scale;
      const drawHeight = image.height * scale;
      const offsetX = (attempt.size - drawWidth) / 2;
      const offsetY = (attempt.size - drawHeight) / 2;

      context.clearRect(0, 0, attempt.size, attempt.size);
      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      const optimized = canvas.toDataURL("image/jpeg", attempt.quality);

      if (optimized.length <= MAX_SYNCED_AVATAR_LENGTH) {
        return optimized;
      }
    }
  } catch {
    return avatarDataUrl;
  }

  return avatarDataUrl;
}

export async function saveUserSettingsToCloud(record: SettingsRecord) {
  const settingsDoc = getSettingsDocReference(record.userId);

  if (!settingsDoc) {
    return;
  }

  const avatarDataUrl = await compressAvatarForCloud(record.avatarDataUrl);
  const payload = pickCloudSettingsPayload(record, avatarDataUrl);

  await setDoc(settingsDoc, payload, { merge: true });
}

export async function hydrateUserSettingsFromCloud(userId: string) {
  const activeHydration = settingsHydrationCache.get(userId);

  if (activeHydration) {
    return activeHydration;
  }

  const hydrationPromise = (async () => {
    const localSettings = await settingsRepository.get(userId);
    const settingsDoc = getSettingsDocReference(userId);

    if (!settingsDoc) {
      return localSettings;
    }

    try {
      const snapshot = await getDoc(settingsDoc);

      if (!snapshot.exists()) {
        if (localSettings) {
          await saveUserSettingsToCloud(localSettings);
        }

        return localSettings;
      }

      const remoteSettings = normalizeCloudSettingsRecord(snapshot.data());

      if (!remoteSettings) {
        return localSettings;
      }

      if (!localSettings || isRemoteNewer(remoteSettings.updatedAt, localSettings.updatedAt)) {
        return settingsRepository.hydrate(userId, remoteSettings);
      }

      if (isRemoteNewer(localSettings.updatedAt, remoteSettings.updatedAt)) {
        await saveUserSettingsToCloud(localSettings);
      }

      return localSettings;
    } catch {
      return localSettings;
    }
  })().finally(() => {
    settingsHydrationCache.delete(userId);
  });

  settingsHydrationCache.set(userId, hydrationPromise);
  return hydrationPromise;
}
