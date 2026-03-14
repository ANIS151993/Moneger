"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  setDoc,
  where
} from "firebase/firestore";

import { auth, firestore } from "@/lib/firebase/client";
import { supportedCurrencies } from "@/lib/constants/options";
import { getUserDatabase } from "@/lib/db/moneger-db";
import { settingsRepository } from "@/lib/repositories/finance-repositories";
import { nowIso, createId } from "@/lib/utils/id";
import { normalizeInstallments } from "@/lib/utils/installments";
import { getProfileDisplayName } from "@/lib/utils/profile";
import type {
  CurrencyCode,
  DebtRecord,
  InstallmentScheduleItem,
  OwedRecord,
  SettingsRecord,
  SharedAgreementStatus,
  SharedObligationParticipant,
  SharedObligationRecord,
  SharedRecordMeta,
  SharingStatus,
  UserDirectoryRecord
} from "@/types/finance";

const SHARED_OBLIGATIONS_COLLECTION = "sharedObligations";
const USER_DIRECTORY_COLLECTION = "userDirectory";

const supportedCurrencySet = new Set<CurrencyCode>(supportedCurrencies);

function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() || "";
}

function uniqueNonEmpty(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value && value.trim()))));
}

function getAuthenticatedEmail() {
  return normalizeEmail(auth?.currentUser?.email);
}

function normalizeCurrency(value: unknown): CurrencyCode {
  return typeof value === "string" && supportedCurrencySet.has(value as CurrencyCode)
    ? (value as CurrencyCode)
    : "USD";
}

function normalizeParticipant(value: unknown, fallbackEmail = ""): SharedObligationParticipant {
  const candidate = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

  return {
    uid: typeof candidate.uid === "string" && candidate.uid ? candidate.uid : null,
    email: normalizeEmail(typeof candidate.email === "string" ? candidate.email : fallbackEmail),
    name: typeof candidate.name === "string" ? candidate.name : "",
    phone: typeof candidate.phone === "string" ? candidate.phone : "",
    acceptedAt: typeof candidate.acceptedAt === "string" && candidate.acceptedAt ? candidate.acceptedAt : null
  };
}

function normalizeSharedAgreementStatus(value: unknown): SharedAgreementStatus {
  return value === "invited" || value === "pending-acceptance" || value === "agreed" || value === "cancelled"
    ? value
    : "invited";
}

function normalizeSharedObligation(id: string, value: unknown): SharedObligationRecord | null {
  const candidate = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;

  if (!candidate) {
    return null;
  }

  const creditor = normalizeParticipant(candidate.creditor);
  const debtor = normalizeParticipant(candidate.debtor);

  return {
    id,
    createdAt: typeof candidate.createdAt === "string" ? candidate.createdAt : "",
    updatedAt: typeof candidate.updatedAt === "string" ? candidate.updatedAt : "",
    createdByUid: typeof candidate.createdByUid === "string" ? candidate.createdByUid : "",
    sourceType: candidate.sourceType === "owed" ? "owed" : "debt",
    amount: Number(candidate.amount || 0),
    currency: normalizeCurrency(candidate.currency),
    note: typeof candidate.note === "string" ? candidate.note : "",
    createdDate: typeof candidate.createdDate === "string" ? candidate.createdDate : "",
    settlementDate: typeof candidate.settlementDate === "string" ? candidate.settlementDate : "",
    installments: normalizeInstallments(
      Array.isArray(candidate.installments) ? (candidate.installments as InstallmentScheduleItem[]) : []
    ),
    sourceStatus: typeof candidate.sourceStatus === "string" ? candidate.sourceStatus : "",
    participantUids: Array.isArray(candidate.participantUids)
      ? uniqueNonEmpty(candidate.participantUids as string[])
      : uniqueNonEmpty([creditor.uid || "", debtor.uid || ""]),
    participantEmails: Array.isArray(candidate.participantEmails)
      ? uniqueNonEmpty((candidate.participantEmails as string[]).map((item) => normalizeEmail(item)))
      : uniqueNonEmpty([creditor.email, debtor.email]),
    status: normalizeSharedAgreementStatus(candidate.status),
    inviteEmailSentAt:
      typeof candidate.inviteEmailSentAt === "string" && candidate.inviteEmailSentAt
        ? candidate.inviteEmailSentAt
        : null,
    creditor,
    debtor
  };
}

function inferCollaborationMeta(
  userId: string,
  obligation: SharedObligationRecord
): SharedRecordMeta {
  const currentParticipant = obligation.creditor.uid === userId ? obligation.creditor : obligation.debtor;
  const counterpart = obligation.creditor.uid === userId ? obligation.debtor : obligation.creditor;
  const sharingStatus: SharingStatus = obligation.status === "invited" ? "invited" : "matched";

  return {
    sharedObligationId: obligation.id,
    sharingStatus,
    counterpartUserId: counterpart.uid || undefined,
    sharedAgreementStatus: obligation.status,
    sharedCurrentUserAcceptedAt: currentParticipant.acceptedAt,
    sharedCounterpartyAcceptedAt: counterpart.acceptedAt,
    sharedUpdatedAt: obligation.updatedAt
  };
}

function inferSharedProgressState(
  sourceStatus: string,
  installments: InstallmentScheduleItem[],
  settlementDate: string
) {
  const nextPendingInstallment = installments.find((item) => !item.settled);

  if (installments.length > 0) {
    if (!nextPendingInstallment) {
      return "settled" as const;
    }

    const hasSettledInstallments = installments.some((item) => item.settled);
    const isOverdue = new Date(nextPendingInstallment.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

    if (isOverdue) {
      return "overdue" as const;
    }

    if (hasSettledInstallments) {
      return "partial" as const;
    }

    return "open" as const;
  }

  if (sourceStatus === "paid" || sourceStatus === "settled") {
    return "settled" as const;
  }

  if (sourceStatus === "partial") {
    return "partial" as const;
  }

  if (sourceStatus === "overdue" || new Date(settlementDate).getTime() < new Date().setHours(0, 0, 0, 0)) {
    return "overdue" as const;
  }

  return "open" as const;
}

function mapSharedToDebtStatus(obligation: SharedObligationRecord): DebtRecord["status"] {
  const state = inferSharedProgressState(
    obligation.sourceStatus,
    obligation.installments,
    obligation.settlementDate
  );

  if (state === "settled") {
    return "paid";
  }

  if (state === "partial") {
    return "partial";
  }

  if (state === "overdue") {
    return "overdue";
  }

  return "unpaid";
}

function mapSharedToOwedStatus(obligation: SharedObligationRecord): OwedRecord["status"] {
  const state = inferSharedProgressState(
    obligation.sourceStatus,
    obligation.installments,
    obligation.settlementDate
  );

  if (state === "settled") {
    return "settled";
  }

  if (state === "partial") {
    return "partial";
  }

  if (state === "overdue") {
    return "overdue";
  }

  return "pending";
}

async function readUserSettings(userId: string) {
  return settingsRepository.get(userId);
}

function buildDirectoryPayload(
  userId: string,
  email: string,
  settings?: SettingsRecord
): UserDirectoryRecord {
  const now = nowIso();

  return {
    uid: userId,
    email,
    emailLower: email,
    displayName: getProfileDisplayName(settings, email),
    contactNumber: settings?.contactNumber || "",
    location: settings?.location || "",
    avatarDataUrl: settings?.avatarDataUrl || "",
    languagePreference: settings?.languagePreference || "en",
    createdAt: settings?.createdAt || now,
    updatedAt: now
  };
}

async function findDirectoryUserByEmail(email: string, currentUserId: string) {
  const db = firestore;

  if (!db || !email) {
    return undefined;
  }

  const directoryQuery = query(
    collection(db, USER_DIRECTORY_COLLECTION),
    where("emailLower", "==", email),
    limit(1)
  );
  const snapshot = await getDocs(directoryQuery);
  const match = snapshot.docs[0];

  if (!match || match.id === currentUserId) {
    return undefined;
  }

  const data = match.data();

  return {
    uid: match.id,
    email: normalizeEmail(typeof data.email === "string" ? data.email : email),
    displayName: typeof data.displayName === "string" ? data.displayName : "",
    contactNumber: typeof data.contactNumber === "string" ? data.contactNumber : ""
  };
}

async function getSharedObligation(sharedObligationId: string) {
  const db = firestore;

  if (!db || !sharedObligationId) {
    return undefined;
  }

  const snapshot = await getDoc(doc(db, SHARED_OBLIGATIONS_COLLECTION, sharedObligationId));

  if (!snapshot.exists()) {
    return undefined;
  }

  return normalizeSharedObligation(snapshot.id, snapshot.data()) || undefined;
}

function buildMailtoLink(to: string, subject: string, body: string) {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function buildActorParticipant(
  userId: string,
  email: string,
  settings: SettingsRecord | undefined,
  acceptedAt: string
): SharedObligationParticipant {
  return {
    uid: userId,
    email,
    name: getProfileDisplayName(settings, email),
    phone: settings?.contactNumber || "",
    acceptedAt
  };
}

function nextAgreementStatus(
  creditor: SharedObligationParticipant,
  debtor: SharedObligationParticipant
): SharedAgreementStatus {
  if (!creditor.uid || !debtor.uid) {
    return "invited";
  }

  if (creditor.acceptedAt && debtor.acceptedAt) {
    return "agreed";
  }

  return "pending-acceptance";
}

async function upsertSharedObligationForLocalRecord(
  userId: string,
  record: DebtRecord | OwedRecord,
  sourceType: SharedObligationRecord["sourceType"]
): Promise<SharedRecordMeta | undefined> {
  const db = firestore;

  if (!db) {
    return;
  }

  const actorEmail = getAuthenticatedEmail();
  const settings = await readUserSettings(userId);

  if (!actorEmail) {
    return;
  }

  const counterpartEmail =
    sourceType === "debt"
      ? normalizeEmail((record as DebtRecord).creditorEmail)
      : normalizeEmail((record as OwedRecord).debtorEmail);

  if (!counterpartEmail || counterpartEmail === actorEmail) {
    if (record.sharedObligationId) {
      await archiveSharedObligation(userId, record.sharedObligationId);
    }

    const localOnlyMeta: SharedRecordMeta = {
      sharedObligationId: undefined,
      sharingStatus: "local",
      counterpartUserId: undefined,
      sharedAgreementStatus: undefined,
      sharedCurrentUserAcceptedAt: undefined,
      sharedCounterpartyAcceptedAt: undefined,
      sharedUpdatedAt: undefined
    };

    return localOnlyMeta;
  }

  await upsertUserDirectoryProfile(userId, actorEmail, settings);

  const matchedCounterparty = await findDirectoryUserByEmail(counterpartEmail, userId);
  const existing = record.sharedObligationId ? await getSharedObligation(record.sharedObligationId) : undefined;
  const acceptedAt = nowIso();
  const actor = buildActorParticipant(userId, actorEmail, settings, acceptedAt);

  const counterpartBase: SharedObligationParticipant = {
    uid: matchedCounterparty?.uid || existing?.[sourceType === "debt" ? "creditor" : "debtor"].uid || null,
    email: counterpartEmail,
    name:
      (sourceType === "debt" ? (record as DebtRecord).creditorName : (record as OwedRecord).debtorName) ||
      matchedCounterparty?.displayName ||
      existing?.[sourceType === "debt" ? "creditor" : "debtor"].name ||
      "",
    phone:
      (sourceType === "debt" ? (record as DebtRecord).creditorPhone : (record as OwedRecord).debtorPhone) ||
      matchedCounterparty?.contactNumber ||
      existing?.[sourceType === "debt" ? "creditor" : "debtor"].phone ||
      "",
    acceptedAt: null
  };

  const creditor = sourceType === "debt" ? counterpartBase : actor;
  const debtor = sourceType === "debt" ? actor : counterpartBase;
  const sharedObligationId = record.sharedObligationId || createId("shared");
  const now = nowIso();
  const nextPayload: SharedObligationRecord = {
    id: sharedObligationId,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    createdByUid: existing?.createdByUid || userId,
    sourceType,
    amount: record.amount,
    currency: record.currency,
    note: record.note,
    createdDate: record.createdDate,
    settlementDate: record.settlementDate,
    installments: normalizeInstallments(record.installments),
    sourceStatus: record.status,
    participantUids: uniqueNonEmpty([userId, creditor.uid, debtor.uid]),
    participantEmails: uniqueNonEmpty([actorEmail, counterpartEmail]),
    status: nextAgreementStatus(creditor, debtor),
    inviteEmailSentAt: existing?.inviteEmailSentAt || null,
    creditor,
    debtor
  };

  await setDoc(doc(db, SHARED_OBLIGATIONS_COLLECTION, sharedObligationId), nextPayload);

  return inferCollaborationMeta(userId, nextPayload);
}

function getSharedRoleForUser(userId: string, obligation: SharedObligationRecord) {
  if (obligation.creditor.uid === userId) {
    return "creditor" as const;
  }

  if (obligation.debtor.uid === userId) {
    return "debtor" as const;
  }

  return null;
}

async function putSharedDebtRecord(userId: string, obligation: SharedObligationRecord, current?: DebtRecord) {
  const db = getUserDatabase(userId);
  const counterpart = obligation.creditor;
  const meta = inferCollaborationMeta(userId, obligation);
  const nextRecord: DebtRecord = {
    id: current?.id || createId("debt"),
    userId,
    createdAt: current?.createdAt || obligation.createdAt || nowIso(),
    updatedAt: obligation.updatedAt || nowIso(),
    creditorName: counterpart.name || counterpart.email || "Creditor",
    creditorEmail: counterpart.email,
    creditorPhone: counterpart.phone,
    amount: obligation.amount,
    currency: obligation.currency,
    note: obligation.note,
    createdDate: obligation.createdDate,
    settlementDate: obligation.settlementDate,
    status: mapSharedToDebtStatus(obligation),
    installments: obligation.installments,
    ...meta
  };

  if (current?.sharedUpdatedAt === obligation.updatedAt && current?.sharedAgreementStatus === meta.sharedAgreementStatus) {
    return;
  }

  await db.debts.put(nextRecord);
}

async function putSharedOwedRecord(userId: string, obligation: SharedObligationRecord, current?: OwedRecord) {
  const db = getUserDatabase(userId);
  const counterpart = obligation.debtor;
  const meta = inferCollaborationMeta(userId, obligation);
  const nextRecord: OwedRecord = {
    id: current?.id || createId("owed"),
    userId,
    createdAt: current?.createdAt || obligation.createdAt || nowIso(),
    updatedAt: obligation.updatedAt || nowIso(),
    debtorName: counterpart.name || counterpart.email || "Debtor",
    debtorEmail: counterpart.email,
    debtorPhone: counterpart.phone,
    amount: obligation.amount,
    currency: obligation.currency,
    note: obligation.note,
    createdDate: obligation.createdDate,
    settlementDate: obligation.settlementDate,
    status: mapSharedToOwedStatus(obligation),
    installments: obligation.installments,
    ...meta
  };

  if (current?.sharedUpdatedAt === obligation.updatedAt && current?.sharedAgreementStatus === meta.sharedAgreementStatus) {
    return;
  }

  await db.owed.put(nextRecord);
}

export async function upsertUserDirectoryProfile(
  userId: string,
  email?: string | null,
  settings?: SettingsRecord
) {
  const normalizedEmail = normalizeEmail(email || getAuthenticatedEmail());
  const db = firestore;

  if (!db || !normalizedEmail) {
    return;
  }

  const directoryRef = doc(db, USER_DIRECTORY_COLLECTION, userId);
  const current = await getDoc(directoryRef);
  const payload = buildDirectoryPayload(userId, normalizedEmail, settings);

  await setDoc(directoryRef, {
    ...payload,
    createdAt: current.exists() && typeof current.data().createdAt === "string" ? current.data().createdAt : payload.createdAt
  });
}

export async function claimPendingSharedObligations(userId: string, email?: string | null) {
  const normalizedEmail = normalizeEmail(email || getAuthenticatedEmail());
  const db = firestore;

  if (!db || !normalizedEmail) {
    return;
  }

  const pendingQuery = query(
    collection(db, SHARED_OBLIGATIONS_COLLECTION),
    where("participantEmails", "array-contains", normalizedEmail)
  );
  const snapshot = await getDocs(pendingQuery);

  await Promise.all(
    snapshot.docs.map(async (item) => {
      const obligation = normalizeSharedObligation(item.id, item.data());

      if (!obligation || obligation.status === "cancelled") {
        return;
      }

      let changed = false;
      const nextCreditor = { ...obligation.creditor };
      const nextDebtor = { ...obligation.debtor };

      if (nextCreditor.email === normalizedEmail && !nextCreditor.uid) {
        nextCreditor.uid = userId;
        changed = true;
      }

      if (nextDebtor.email === normalizedEmail && !nextDebtor.uid) {
        nextDebtor.uid = userId;
        changed = true;
      }

      if (!changed) {
        return;
      }

      const nextPayload: SharedObligationRecord = {
        ...obligation,
        updatedAt: nowIso(),
        creditor: nextCreditor,
        debtor: nextDebtor,
        participantUids: uniqueNonEmpty([obligation.createdByUid, nextCreditor.uid, nextDebtor.uid]),
        status: nextAgreementStatus(nextCreditor, nextDebtor)
      };

      await setDoc(doc(db, SHARED_OBLIGATIONS_COLLECTION, obligation.id), nextPayload);
    })
  );
}

export function subscribeToSharedObligations(
  userId: string,
  onChange: (obligations: SharedObligationRecord[]) => void
) {
  const db = firestore;

  if (!db || !userId) {
    onChange([]);
    return () => undefined;
  }

  const obligationsQuery = query(
    collection(db, SHARED_OBLIGATIONS_COLLECTION),
    where("participantUids", "array-contains", userId)
  );

  return onSnapshot(
    obligationsQuery,
    (snapshot) => {
      const obligations = snapshot.docs
        .map((item) => normalizeSharedObligation(item.id, item.data()))
        .filter((item): item is SharedObligationRecord => Boolean(item))
        .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());

      onChange(obligations);
    },
    (error) => {
      console.warn("Shared obligations subscription failed", error);
    }
  );
}

export async function mirrorSharedObligationsToLocal(userId: string, obligations: SharedObligationRecord[]) {
  const db = getUserDatabase(userId);
  const [debts, owed] = await Promise.all([db.debts.toArray(), db.owed.toArray()]);
  const debtsBySharedId = new Map(
    debts
      .filter((item) => item.sharedObligationId)
      .map((item) => [item.sharedObligationId as string, item])
  );
  const owedBySharedId = new Map(
    owed
      .filter((item) => item.sharedObligationId)
      .map((item) => [item.sharedObligationId as string, item])
  );
  const activeDebtIds = new Set<string>();
  const activeOwedIds = new Set<string>();

  for (const obligation of obligations) {
    const role = getSharedRoleForUser(userId, obligation);

    if (!role || obligation.status === "cancelled") {
      continue;
    }

    if (role === "debtor") {
      activeDebtIds.add(obligation.id);
      await putSharedDebtRecord(userId, obligation, debtsBySharedId.get(obligation.id));
      continue;
    }

    activeOwedIds.add(obligation.id);
    await putSharedOwedRecord(userId, obligation, owedBySharedId.get(obligation.id));
  }

  await Promise.all(
    debts
      .filter((item) => item.sharedObligationId && !activeDebtIds.has(item.sharedObligationId))
      .map((item) => db.debts.delete(item.id))
  );
  await Promise.all(
    owed
      .filter((item) => item.sharedObligationId && !activeOwedIds.has(item.sharedObligationId))
      .map((item) => db.owed.delete(item.id))
  );
}

export async function syncDebtCollaboration(userId: string, record: DebtRecord) {
  return upsertSharedObligationForLocalRecord(userId, record, "debt");
}

export async function syncOwedCollaboration(userId: string, record: OwedRecord) {
  return upsertSharedObligationForLocalRecord(userId, record, "owed");
}

export async function archiveSharedObligation(userId: string, sharedObligationId?: string) {
  const db = firestore;

  if (!db || !sharedObligationId) {
    return;
  }

  const obligation = await getSharedObligation(sharedObligationId);

  if (!obligation || !obligation.participantUids.includes(userId)) {
    return;
  }

    await setDoc(
    doc(db, SHARED_OBLIGATIONS_COLLECTION, sharedObligationId),
    {
      ...obligation,
      status: "cancelled",
      updatedAt: nowIso()
    },
    { merge: true }
  );
}

export async function acceptSharedObligationSchedule(userId: string, sharedObligationId?: string) {
  const db = firestore;

  if (!db || !sharedObligationId) {
    return;
  }

  const obligation = await getSharedObligation(sharedObligationId);

  if (!obligation) {
    return;
  }

  const acceptedAt = nowIso();
  const nextCreditor = {
    ...obligation.creditor,
    acceptedAt: obligation.creditor.uid === userId ? acceptedAt : obligation.creditor.acceptedAt
  };
  const nextDebtor = {
    ...obligation.debtor,
    acceptedAt: obligation.debtor.uid === userId ? acceptedAt : obligation.debtor.acceptedAt
  };

  await setDoc(
    doc(db, SHARED_OBLIGATIONS_COLLECTION, sharedObligationId),
    {
      ...obligation,
      creditor: nextCreditor,
      debtor: nextDebtor,
      status: nextAgreementStatus(nextCreditor, nextDebtor),
      updatedAt: acceptedAt
    }
  );
}

export async function markInviteEmailSent(userId: string, sharedObligationId?: string) {
  const db = firestore;

  if (!db || !sharedObligationId) {
    return;
  }

  const obligation = await getSharedObligation(sharedObligationId);

  if (!obligation || !obligation.participantUids.includes(userId)) {
    return;
  }

  await setDoc(
    doc(db, SHARED_OBLIGATIONS_COLLECTION, sharedObligationId),
    {
      inviteEmailSentAt: nowIso(),
      updatedAt: nowIso()
    },
    { merge: true }
  );
}

export function buildSharedInviteEmailDraft(record: DebtRecord | OwedRecord, brandUrl: string) {
  const counterpartyEmail = normalizeEmail(
    "creditorEmail" in record ? record.creditorEmail : record.debtorEmail
  );
  const counterpartName = "creditorName" in record ? record.creditorName : record.debtorName;
  const subject = "Join me on Moneger for a shared payment plan";
  const body = [
    `Hi ${counterpartName || "there"},`,
    "",
    `I added a shared settlement record for us in Moneger.`,
    `Create your account here: ${brandUrl}`,
    "",
    "Once you sign in, the debt/installment schedule will appear automatically in your account.",
    "",
    "Sent from Moneger"
  ].join("\n");

  return buildMailtoLink(counterpartyEmail, subject, body);
}

export function buildSharedReminderEmailDraft(record: DebtRecord | OwedRecord, brandUrl: string) {
  const counterpartyEmail = normalizeEmail(
    "creditorEmail" in record ? record.creditorEmail : record.debtorEmail
  );
  const counterpartName = "creditorName" in record ? record.creditorName : record.debtorName;
  const subject = "Moneger settlement reminder";
  const body = [
    `Hi ${counterpartName || "there"},`,
    "",
    "This is a reminder about our shared settlement schedule in Moneger.",
    `Open the app here: ${brandUrl}`,
    "",
    "Please review the installment schedule and upcoming payment dates.",
    "",
    "Sent from Moneger"
  ].join("\n");

  return buildMailtoLink(counterpartyEmail, subject, body);
}
