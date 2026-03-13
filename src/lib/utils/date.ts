import { isAfter, isBefore, isValid, parseISO } from "date-fns";

import { getLanguageDefinition } from "@/lib/i18n/config";
import { getRuntimeLanguage } from "@/lib/i18n/messages";

function getCurrentLocale() {
  return getLanguageDefinition(getRuntimeLanguage()).locale;
}

function parseDateValue(value: string | Date) {
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  const isoDate = parseISO(value);

  if (isValid(isoDate)) {
    return isoDate;
  }

  const fallbackDate = new Date(value);

  return isValid(fallbackDate) ? fallbackDate : null;
}

function formatWithLocale(value: string, options: Intl.DateTimeFormatOptions) {
  const parsed = parseDateValue(value);

  if (!parsed) {
    return value;
  }

  return new Intl.DateTimeFormat(getCurrentLocale(), options).format(parsed);
}

export function formatDate(value: string) {
  return formatWithLocale(value, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export function formatShortDate(value: string) {
  return formatWithLocale(value, {
    month: "short",
    day: "numeric"
  });
}

export function formatDateTime(value: string) {
  return formatWithLocale(value, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

export function relativeFromNow(value: string) {
  const parsed = parseDateValue(value);

  if (!parsed) {
    return new Intl.RelativeTimeFormat(getCurrentLocale(), { numeric: "auto" }).format(0, "minute");
  }

  const now = Date.now();
  const target = parsed.getTime();
  const diffMs = target - now;
  const absoluteMs = Math.abs(diffMs);
  const formatter = new Intl.RelativeTimeFormat(getCurrentLocale(), { numeric: "auto" });
  const units = [
    { unit: "year", ms: 1000 * 60 * 60 * 24 * 365 },
    { unit: "month", ms: 1000 * 60 * 60 * 24 * 30 },
    { unit: "week", ms: 1000 * 60 * 60 * 24 * 7 },
    { unit: "day", ms: 1000 * 60 * 60 * 24 },
    { unit: "hour", ms: 1000 * 60 * 60 },
    { unit: "minute", ms: 1000 * 60 }
  ] as const;

  for (const { unit, ms } of units) {
    if (absoluteMs >= ms || unit === "minute") {
      return formatter.format(Math.round(diffMs / ms), unit);
    }
  }

  return formatter.format(0, "minute");
}

export function formatMonthLabel(value: string | Date) {
  const date = parseDateValue(value);

  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat(getCurrentLocale(), { month: "short" }).format(date);
}

export function relativeDaysFromNow(value: string) {
  const parsed = parseDateValue(value);

  if (!parsed) {
    return new Intl.RelativeTimeFormat(getCurrentLocale(), { numeric: "auto" }).format(0, "day");
  }

  const diffDays = Math.round((parsed.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return new Intl.RelativeTimeFormat(getCurrentLocale(), { numeric: "auto" }).format(diffDays, "day");
}

export function isPastDate(value: string) {
  const parsed = parseDateValue(value);

  return parsed ? isBefore(parsed, new Date()) : false;
}

export function isFutureDate(value: string) {
  const parsed = parseDateValue(value);

  return parsed ? isAfter(parsed, new Date()) : false;
}
