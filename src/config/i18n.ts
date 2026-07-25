import { rs } from "@/locales/rs";
import { en } from "@/locales/en";
import { ro } from "@/locales/ro";
import type { Dictionary } from "@/locales/types";

/** Supported UI languages for the language switcher, in display order. */
export const locales = [
  { code: "rs", label: "RS" },
  { code: "en", label: "EN" },
  { code: "ro", label: "RO" },
] as const;

export type LocaleCode = (typeof locales)[number]["code"];

/** Serbian is the salon's home market — first-time visitors land in RS. */
export const defaultLocale: LocaleCode = "rs";

/** BCP-47 tag per locale, for `document.documentElement.lang`. */
export const localeHtmlLang: Record<LocaleCode, string> = {
  rs: "sr",
  en: "en",
  ro: "ro",
};

/**
 * Full BCP-47 tag per locale for `Intl.DateTimeFormat`/`Intl.NumberFormat`
 * (booking-format.ts, lib/utils.ts) — "sr-Latn" specifically, not plain
 * "sr", so Serbian renders in Latin script rather than Cyrillic, matching
 * every other Serbian string in this app.
 */
export const localeIntlTag: Record<LocaleCode, string> = {
  rs: "sr-Latn",
  en: "en-US",
  ro: "ro-RO",
};

export const dictionaries: Record<LocaleCode, Dictionary> = { rs, en, ro };
