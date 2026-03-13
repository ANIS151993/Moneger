import type { LanguagePreference } from "@/types/finance";

export interface LanguageDefinition {
  code: LanguagePreference;
  locale: string;
  dir: "ltr" | "rtl";
  nativeLabel: string;
}

export const defaultLanguage: LanguagePreference = "en";

export const languageDefinitions: LanguageDefinition[] = [
  { code: "en", locale: "en-US", dir: "ltr", nativeLabel: "English" },
  { code: "bn", locale: "bn-BD", dir: "ltr", nativeLabel: "বাংলা" },
  { code: "hi", locale: "hi-IN", dir: "ltr", nativeLabel: "हिन्दी" },
  { code: "ur", locale: "ur-PK", dir: "rtl", nativeLabel: "اردو" },
  { code: "ar", locale: "ar-SA", dir: "rtl", nativeLabel: "العربية" },
  { code: "ru", locale: "ru-RU", dir: "ltr", nativeLabel: "Русский" },
  { code: "ky", locale: "ky-KG", dir: "ltr", nativeLabel: "Кыргызча" },
  { code: "fr", locale: "fr-FR", dir: "ltr", nativeLabel: "Français" },
  { code: "de", locale: "de-DE", dir: "ltr", nativeLabel: "Deutsch" },
  { code: "ne", locale: "ne-NP", dir: "ltr", nativeLabel: "नेपाली" }
];

const languageMap = new Map(languageDefinitions.map((definition) => [definition.code, definition]));

export function isSupportedLanguage(value: string): value is LanguagePreference {
  return languageMap.has(value as LanguagePreference);
}

export function getLanguageDefinition(language?: LanguagePreference | string | null) {
  if (!language || !isSupportedLanguage(language)) {
    return languageMap.get(defaultLanguage)!;
  }

  return languageMap.get(language)!;
}
