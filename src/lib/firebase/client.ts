"use client";

import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { firebaseEnv, isFirebaseConfigured } from "@/lib/firebase/env";

const firebaseApp = isFirebaseConfigured
  ? getApps()[0] || initializeApp(firebaseEnv)
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const firestore = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseClientConfigured = isFirebaseConfigured;

export function getFirebaseApp() {
  return firebaseApp ? getApp() : null;
}
