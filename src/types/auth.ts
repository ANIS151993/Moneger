export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  authMode: "firebase" | "local";
}

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  authMode: "firebase" | "local";
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
