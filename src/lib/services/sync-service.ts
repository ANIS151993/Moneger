"use client";

import { collection, doc, setDoc } from "firebase/firestore";

import { firestore } from "@/lib/firebase/client";
import { encryptFinancePayload, type EncryptionKeyMaterial } from "@/lib/security/encryption";
import { syncQueueRepository } from "@/lib/repositories/finance-repositories";
import type { OptionalEncryptedSyncPayload, SyncQueueRecord } from "@/types/finance";

export interface SyncTransport {
  upload: (userId: string, payload: OptionalEncryptedSyncPayload) => Promise<void>;
}

export const firestoreEncryptedSyncTransport: SyncTransport = {
  async upload(userId, payload) {
    if (!firestore) {
      throw new Error("Firestore sync is not configured");
    }

    await setDoc(
      doc(collection(firestore, "users", userId, "syncSnapshots")),
      {
        ...payload,
        uploadedAt: new Date().toISOString(),
        mode: "encrypted-client-side"
      },
      { merge: true }
    );
  }
};

export async function queueEncryptedSync(
  userId: string,
  record: Omit<SyncQueueRecord, "id" | "createdAt" | "updatedAt" | "userId">
) {
  return syncQueueRepository.create(userId, {
    ...record,
    errorMessage: "",
    encryptedPayload: null
  });
}

export async function uploadEncryptedSnapshot(
  userId: string,
  keyMaterial: EncryptionKeyMaterial,
  snapshotJson: string,
  transport: SyncTransport = firestoreEncryptedSyncTransport
) {
  const encrypted = await encryptFinancePayload(keyMaterial, snapshotJson);
  await transport.upload(userId, encrypted);
  return encrypted;
}
