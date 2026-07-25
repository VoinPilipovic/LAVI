import { SALON_TIMEZONE } from "@/lib/constants";

/**
 * These intentionally differ from the general-purpose formatters in
 * src/lib/utils.ts by always passing `timeZone: SALON_TIMEZONE` — a
 * booking time must read as "when to show up at the salon", not
 * "what time it is for the visitor browsing from elsewhere". `locale`
 * is a full Intl BCP-47 tag (see `localeIntlTag` in src/config/i18n.ts),
 * defaulted to English only for any caller that hasn't been updated to
 * pass the active locale explicitly.
 */

export function formatSlotTime(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: SALON_TIMEZONE,
  }).format(date);
}

export function formatSlotDate(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: SALON_TIMEZONE,
  }).format(date);
}

export function formatSlotDateTime(date: Date, locale = "en-US"): string {
  return `${formatSlotDate(date, locale)}, ${formatSlotTime(date, locale)}`;
}
