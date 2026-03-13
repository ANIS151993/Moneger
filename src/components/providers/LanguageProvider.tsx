"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/lib/hooks/use-auth";
import { useUserSettings } from "@/lib/hooks/use-user-settings";
import { defaultLanguage, getLanguageDefinition, isSupportedLanguage } from "@/lib/i18n/config";
import { setRuntimeLanguage, translateMessage } from "@/lib/i18n/messages";
import type { LanguagePreference } from "@/types/finance";

const LANGUAGE_STORAGE_KEY = "moneger:language";

interface LanguageContextValue {
  dir: "ltr" | "rtl";
  language: LanguagePreference;
  locale: string;
  setLanguagePreference: (language: LanguagePreference) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function readStoredLanguage() {
  if (typeof window === "undefined") {
    return defaultLanguage;
  }

  const candidate = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (candidate && isSupportedLanguage(candidate)) {
    return candidate;
  }

  return defaultLanguage;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const settings = useUserSettings(user?.uid);
  const [language, setLanguage] = useState<LanguagePreference>(defaultLanguage);

  useEffect(() => {
    setLanguage(readStoredLanguage());
  }, []);

  useEffect(() => {
    if (settings?.languagePreference) {
      setLanguage(settings.languagePreference);
      return;
    }

    if (!user) {
      setLanguage(readStoredLanguage());
    }
  }, [settings?.languagePreference, user]);

  useEffect(() => {
    const definition = getLanguageDefinition(language);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }

    document.documentElement.lang = definition.locale;
    document.documentElement.dir = definition.dir;
    setRuntimeLanguage(language);
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    const definition = getLanguageDefinition(language);

    return {
      dir: definition.dir,
      language,
      locale: definition.locale,
      setLanguagePreference: setLanguage,
      t: (key, params) => translateMessage(language, key, params)
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useI18n must be used within LanguageProvider");
  }

  return context;
}
