import { initializeAdminFirestore } from "./_admin-helpers.mjs";

const { db, serviceAccount, clientProject } = initializeAdminFirestore();
const now = new Date().toISOString();
const verifySuffix = Date.now().toString(36);

const runtimeRef = db.collection("_monegerAdmin").doc("runtime");
const userDirectoryRef = db.collection("userDirectory").doc(`__admin_verify__${verifySuffix}`);
const sharedObligationRef = db.collection("sharedObligations").doc(`__admin_verify__${verifySuffix}`);
const settingsRef = db
  .collection("users")
  .doc(`__admin_verify__${verifySuffix}`)
  .collection("settings")
  .doc("workspace");

await runtimeRef.set(
  {
    lastVerifiedAt: now,
    verifiedBy: "scripts/firebase/verify-firestore-access.mjs",
    serviceAccountProjectId: serviceAccount.projectId,
    clientProjectId: clientProject.projectId,
    featureFlags: {
      settingsSync: true,
      sharedObligations: true,
      emailDeliveryMode: "mailto-draft"
    }
  },
  { merge: true }
);

await userDirectoryRef.set({
  uid: userDirectoryRef.id,
  email: `${userDirectoryRef.id}@invalid.local`,
  emailLower: `${userDirectoryRef.id}@invalid.local`,
  displayName: "Admin verification user",
  contactNumber: "",
  location: "",
  avatarDataUrl: "",
  languagePreference: "en",
  createdAt: now,
  updatedAt: now
});

await sharedObligationRef.set({
  id: sharedObligationRef.id,
  createdAt: now,
  updatedAt: now,
  createdByUid: "__admin_verify__",
  sourceType: "owed",
  amount: 100,
  currency: "USD",
  note: "Admin verification record",
  createdDate: now.slice(0, 10),
  settlementDate: now.slice(0, 10),
  installments: [],
  sourceStatus: "pending",
  participantUids: ["__admin_verify__", "__admin_counterparty__"],
  participantEmails: ["admin-verify@invalid.local", "counterparty@invalid.local"],
  status: "invited",
  inviteEmailSentAt: null,
  creditor: {
    uid: "__admin_verify__",
    email: "admin-verify@invalid.local",
    name: "Admin Verify",
    phone: "",
    acceptedAt: now
  },
  debtor: {
    uid: "__admin_counterparty__",
    email: "counterparty@invalid.local",
    name: "Counterparty Verify",
    phone: "",
    acceptedAt: null
  }
});

await settingsRef.set({
  schemaVersion: 1,
  baseCurrency: "USD",
  comparisonCurrency: "",
  languagePreference: "en",
  notificationsEnabled: true,
  optionalEncryptedSyncEnabled: false,
  browserNotificationsPermission: "unsupported",
  themePreference: "system",
  fullName: "Admin Verify",
  contactNumber: "",
  occupation: "",
  gender: "",
  maritalStatus: "",
  location: "",
  bio: "",
  avatarDataUrl: "",
  createdAt: now,
  updatedAt: now
});

const [runtimeSnap, userDirectorySnap, sharedObligationSnap, settingsSnap] = await Promise.all([
  runtimeRef.get(),
  userDirectoryRef.get(),
  sharedObligationRef.get(),
  settingsRef.get()
]);

if (!runtimeSnap.exists || !userDirectorySnap.exists || !sharedObligationSnap.exists || !settingsSnap.exists) {
  throw new Error("Firestore verification failed: one or more expected documents could not be read back.");
}

await Promise.all([userDirectoryRef.delete(), sharedObligationRef.delete(), settingsRef.delete()]);

console.log("Firestore admin verification passed.");
console.log(`- Service account project: ${serviceAccount.projectId}`);
console.log(`- App client project: ${clientProject.projectId}`);
console.log(`- Verified collections: _monegerAdmin, userDirectory, sharedObligations, users/{uid}/settings`);
