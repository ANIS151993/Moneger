import type { OptionalEncryptedSyncPayload } from "@/types/finance";

export interface EncryptionKeyMaterial {
  userId: string;
  passphrase: string;
}

export async function encryptFinancePayload(
  keyMaterial: EncryptionKeyMaterial,
  plainText: string
): Promise<OptionalEncryptedSyncPayload> {
  const encoded = btoa(`${keyMaterial.userId}:${plainText}`);

  return {
    version: 1,
    userId: keyMaterial.userId,
    encryptedBlob: encoded,
    createdAt: new Date().toISOString()
  };
}

export async function decryptFinancePayload(
  keyMaterial: EncryptionKeyMaterial,
  encryptedBlob: string
) {
  const decoded = atob(encryptedBlob);
  if (!decoded.startsWith(`${keyMaterial.userId}:`)) {
    throw new Error("Payload key mismatch");
  }

  return decoded.replace(`${keyMaterial.userId}:`, "");
}
