import type { SettingsRecord } from "@/types/finance";

function fallbackNameFromEmail(email?: string | null) {
  if (!email) {
    return "Moneger user";
  }

  return email.split("@")[0]?.replace(/[._-]+/g, " ") || email;
}

export function getProfileDisplayName(profile?: Partial<SettingsRecord>, email?: string | null) {
  return profile?.fullName?.trim() || fallbackNameFromEmail(email);
}

export function getProfileInitials(name?: string | null) {
  const source = (name || "Moneger User").trim();
  const parts = source.split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

export function getProfileSummary(profile?: Partial<SettingsRecord>) {
  const summary = [profile?.occupation, profile?.location].filter(Boolean).join(" • ");

  return summary || profile?.bio?.trim() || "Complete your profile details in settings";
}

export function formatMaritalStatus(status?: SettingsRecord["maritalStatus"]) {
  return formatProfileOption(status);
}

export function formatGender(gender?: SettingsRecord["gender"]) {
  return formatProfileOption(gender);
}

function formatProfileOption(value?: string) {
  if (!value) {
    return "";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getCompactProfileMeta(profile?: Partial<SettingsRecord>, email?: string | null) {
  return profile?.occupation || profile?.contactNumber || profile?.location || email || "Open settings to personalize";
}

export function getProfileLocation(profile?: Partial<SettingsRecord>) {
  return profile?.location?.trim() || "";
}

export function getProfileContact(profile?: Partial<SettingsRecord>) {
  return profile?.contactNumber?.trim() || "";
}
