const AUTH_STORAGE_KEY = "moneger:local-auth";
const SESSION_COOKIE = "moneger_session";

export interface LocalAuthSession {
  uid: string;
  email: string;
  createdAt: string;
}

export function readLocalAuthSession(): LocalAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as LocalAuthSession;
  } catch {
    return null;
  }
}

export function writeLocalAuthSession(session: LocalAuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  document.cookie = `${SESSION_COOKIE}=active; path=/; max-age=2592000; SameSite=Lax`;
}

export function clearLocalAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function touchSessionCookie() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_COOKIE}=active; path=/; max-age=2592000; SameSite=Lax`;
}
