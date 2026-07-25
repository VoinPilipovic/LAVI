import {
  MIN_BOOKING_NOTICE_HOURS,
  MAX_BOOKING_WINDOW_DAYS,
  CANCELLATION_CUTOFF_HOURS,
} from "@/lib/constants";
import type { Dictionary } from "@/locales/types";

/**
 * Translates a stable error CODE returned by a booking Server Action
 * (src/actions/booking.actions.ts) into the active locale's text. The
 * server can't localize these itself — locale is client-only state —
 * so every booking action returns a code instead of a sentence, and
 * every client component that displays `result.error` should route it
 * through this function rather than rendering the code directly.
 */
export function translateBookingError(code: string, dict: Dictionary): string {
  const { errors } = dict.booking;

  switch (code) {
    case "MINIMUM_NOTICE_REQUIRED":
      return errors.MINIMUM_NOTICE_REQUIRED.replace("{hours}", String(MIN_BOOKING_NOTICE_HOURS));
    case "OUTSIDE_BOOKING_WINDOW":
      return errors.OUTSIDE_BOOKING_WINDOW.replace("{days}", String(MAX_BOOKING_WINDOW_DAYS));
    case "CANCELLATION_TOO_LATE":
      return errors.CANCELLATION_TOO_LATE.replace("{hours}", String(CANCELLATION_CUTOFF_HOURS));
    default: {
      const known = (errors as Record<string, string | undefined>)[code];
      return known ?? errors.GENERIC;
    }
  }
}
