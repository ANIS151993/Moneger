"use client";

import { createContext, startTransition, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { auth, firebaseClientConfigured } from "@/lib/firebase/client";
import { clearLocalAuthSession, readLocalAuthSession, touchSessionCookie, writeLocalAuthSession } from "@/lib/utils/session";
import { nowIso } from "@/lib/utils/id";
import type { AuthContextValue, AuthUser } from "@/types/auth";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function localUidFromEmail(email: string) {
  const normalized = email.toLowerCase().trim();
  if (typeof btoa === "function") {
    return `local_${btoa(normalized).replace(/=+$/g, "")}`;
  }

  return `local_${normalized.replace(/[^a-z0-9]/g, "_")}`;
}

function mapFirebaseUser(): AuthUser | null {
  if (!auth?.currentUser) {
    return null;
  }

  return {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    displayName: auth.currentUser.displayName,
    authMode: "firebase"
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async () => {
        const nextUser = mapFirebaseUser();
        startTransition(() => {
          setUser(nextUser);
          setLoading(false);
        });

        if (nextUser) {
          touchSessionCookie();
        } else {
          clearLocalAuthSession();
        }
      });

      return unsubscribe;
    }

    const localSession = readLocalAuthSession();
    if (localSession) {
      const nextUser: AuthUser = {
        uid: localSession.uid,
        email: localSession.email,
        displayName: localSession.email.split("@")[0],
        authMode: "local"
      };
      setUser(nextUser);
    }

    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    if (auth) {
      await signInWithEmailAndPassword(auth, email, password);
      return;
    }

    const nextUser: AuthUser = {
      uid: localUidFromEmail(email),
      email,
      displayName: email.split("@")[0],
      authMode: "local"
    };

    writeLocalAuthSession({
      uid: nextUser.uid,
      email,
      createdAt: nowIso()
    });
    setUser(nextUser);
    void password;
  }

  async function signup(email: string, password: string) {
    if (auth) {
      await createUserWithEmailAndPassword(auth, email, password);
      return;
    }

    await login(email, password);
  }

  async function logout() {
    if (auth) {
      await signOut(auth);
    }

    clearLocalAuthSession();
    setUser(null);
  }

  async function resetPassword(email: string) {
    if (auth) {
      await sendPasswordResetEmail(auth, email);
      return;
    }

    window.localStorage.setItem("moneger:password-reset-last-email", email);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authMode: auth ? "firebase" : "local",
        isConfigured: firebaseClientConfigured,
        login,
        signup,
        logout,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
