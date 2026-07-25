import { enUS, ro, srLatn } from "date-fns/locale";
import type { Locale } from "date-fns";
import type { LocaleCode } from "@/config/i18n";

/**
 * date-fns `Locale` object per app locale, for `format(date, str, {locale})`
 * calls (booking-calendar.tsx's weekday/month abbreviations). `srLatn`
 * specifically — Serbian in Latin script, matching every other Serbian
 * string in this app (not the default Cyrillic `sr`).
 */
export const dateFnsLocale: Record<LocaleCode, Locale> = {
  rs: srLatn,
  en: enUS,
  ro,
};
