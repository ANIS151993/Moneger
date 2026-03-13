import type { SettingsRecord } from "@/types/finance";
import { getRuntimeLanguage, translateMessage } from "@/lib/i18n/messages";

function fallbackNameFromEmail(email?: string | null) {
  if (!email) {
    return translateMessage(getRuntimeLanguage(), "profile.defaultUserName");
  }

  return email.split("@")[0]?.replace(/[._-]+/g, " ") || email;
}

export function getProfileDisplayName(profile?: Partial<SettingsRecord>, email?: string | null) {
  return profile?.fullName?.trim() || fallbackNameFromEmail(email);
}

export function getProfileInitials(name?: string | null) {
  const source = (name || translateMessage(getRuntimeLanguage(), "profile.defaultUserName")).trim();
  const parts = source.split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function getProfileSummary(profile?: Partial<SettingsRecord>) {
  const summary = [profile?.occupation, profile?.location].filter(Boolean).join(" • ");

  return summary || profile?.bio?.trim() || translateMessage(getRuntimeLanguage(), "profile.defaultSummary");
}

export function formatMaritalStatus(status?: SettingsRecord["maritalStatus"]) {
  if (!status) {
    return "";
  }

  return translateMessage(getRuntimeLanguage(), `options.maritalStatus.${status}`);
}

export function formatGender(gender?: SettingsRecord["gender"]) {
  if (!gender) {
    return "";
  }

  return translateMessage(getRuntimeLanguage(), `options.gender.${gender}`);
}

export function getCompactProfileMeta(profile?: Partial<SettingsRecord>, email?: string | null) {
  return (
    profile?.occupation ||
    profile?.contactNumber ||
    profile?.location ||
    email ||
    translateMessage(getRuntimeLanguage(), "profile.defaultCompactMeta")
  );
}

export function getProfileLocation(profile?: Partial<SettingsRecord>) {
  return profile?.location?.trim() || "";
}

export function getProfileContact(profile?: Partial<SettingsRecord>) {
  return profile?.contactNumber?.trim() || "";
}
