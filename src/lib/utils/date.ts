import { format, formatDistanceToNowStrict, isAfter, isBefore, parseISO } from "date-fns";

export function formatDate(value: string) {
  return format(parseISO(value), "MMM d, yyyy");
}

export function formatShortDate(value: string) {
  return format(parseISO(value), "MMM d");
}

export function formatDateTime(value: string) {
  return format(parseISO(value), "MMM d, yyyy h:mm a");
}

export function relativeFromNow(value: string) {
  return formatDistanceToNowStrict(parseISO(value), { addSuffix: true });
}

export function isPastDate(value: string) {
  return isBefore(parseISO(value), new Date());
}

export function isFutureDate(value: string) {
  return isAfter(parseISO(value), new Date());
}
