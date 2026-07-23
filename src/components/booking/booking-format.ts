import { SALON_TIMEZONE } from "@/lib/constants";

/**
 * These intentionally differ from the general-purpose formatters in
 * src/lib/utils.ts by always passing `timeZone: SALON_TIMEZONE` — a
 * booking time must read as "when to show up at the salon", not
 * "what time it is for the visitor browsing from elsewhere".
 */

export function formatSlotTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: SALON_TIMEZONE,
  }).format(date);
}

export function formatSlotDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: SALON_TIMEZONE,
  }).format(date);
}

export function formatSlotDateTime(date: Date): string {
  return `${formatSlotDate(date)}, ${formatSlotTime(date)}`;
}
