import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const SERVICE_ACCOUNT_PATTERN = /firebase-adminsdk-.*\.json$/i;

function readEnvValue(filePath, key) {
  if (!existsSync(filePath)) {
    return "";
  }

  const content = readFileSync(filePath, "utf8");
  const line = content
    .split(/\r?\n/)
    .find((entry) => entry.startsWith(`${key}=`));

  if (!line) {
    return "";
  }

  return line.slice(key.length + 1).trim();
}

export function findServiceAccountPath() {
  const explicitPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  if (explicitPath) {
    return path.resolve(process.cwd(), explicitPath);
  }

  const candidates = readdirSync(process.cwd()).filter((entry) => SERVICE_ACCOUNT_PATTERN.test(entry));

  if (candidates.length === 0) {
    throw new Error(
      "No Firebase service account file found. Set FIREBASE_SERVICE_ACCOUNT_PATH or add a *firebase-adminsdk*.json file in the repo root."
    );
  }

  if (candidates.length === 1) {
    return path.resolve(process.cwd(), candidates[0]);
  }

  const { projectId } = loadClientProjectId();

  if (projectId) {
    const projectMatch = candidates.find((entry) => {
      const fullPath = path.resolve(process.cwd(), entry);
      const raw = JSON.parse(readFileSync(fullPath, "utf8"));

      return raw.project_id === projectId;
    });

    if (projectMatch) {
      return path.resolve(process.cwd(), projectMatch);
    }
  }

  throw new Error(
    `Multiple Firebase service account files were found (${candidates.join(", ")}). Set FIREBASE_SERVICE_ACCOUNT_PATH or keep only the key that matches NEXT_PUBLIC_FIREBASE_PROJECT_ID.`
  );
}

export function loadServiceAccountSummary() {
  const serviceAccountPath = findServiceAccountPath();
  const raw = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

  if (raw.type !== "service_account") {
    throw new Error(`Expected a Firebase service account JSON file at ${serviceAccountPath}.`);
  }

  return {
    path: serviceAccountPath,
    projectId: raw.project_id || "",
    clientEmail: raw.client_email || "",
    credentials: raw
  };
}

export function loadClientProjectId() {
  const localProjectId = readEnvValue(path.resolve(process.cwd(), ".env.local"), "NEXT_PUBLIC_FIREBASE_PROJECT_ID");

  if (localProjectId) {
    return { projectId: localProjectId, source: ".env.local" };
  }

  const exampleProjectId = readEnvValue(
    path.resolve(process.cwd(), ".env.example"),
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
  );

  return { projectId: exampleProjectId, source: ".env.example" };
}

export function assertProjectAlignment(serviceProjectId, clientProjectId) {
  if (!clientProjectId) {
    throw new Error(
      "NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing from .env.local and .env.example, so the admin key cannot be matched to the app project."
    );
  }

  if (serviceProjectId !== clientProjectId && process.env.ALLOW_FIREBASE_PROJECT_MISMATCH !== "1") {
    throw new Error(
      `Firebase project mismatch: service account is for "${serviceProjectId}" but the app is configured for "${clientProjectId}". Use a matching key or update the client Firebase env together.`
    );
  }
}

export function initializeAdminFirestore() {
  const serviceAccount = loadServiceAccountSummary();
  const clientProject = loadClientProjectId();

  assertProjectAlignment(serviceAccount.projectId, clientProject.projectId);

  const app =
    getApps()[0] ||
    initializeApp({
      credential: cert(serviceAccount.credentials),
      projectId: serviceAccount.projectId
    });

  return {
    db: getFirestore(app),
    serviceAccount,
    clientProject
  };
}
