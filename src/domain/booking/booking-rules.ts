import { addDays, addHours, isAfter, isBefore } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import {
  MAX_BOOKING_WINDOW_DAYS,
  MIN_BOOKING_NOTICE_HOURS,
  CANCELLATION_CUTOFF_HOURS,
  WORKING_HOURS,
  SALON_TIMEZONE,
} from "@/lib/constants";
import type {
  BookingCandidate,
  BookingRuleViolation,
  BookingValidationResult,
} from "./booking.types";

/**
 * Single source of truth for LAVI's booking rules:
 *   - Maximum booking window: MAX_BOOKING_WINDOW_DAYS
 *   - Minimum notice: MIN_BOOKING_NOTICE_HOURS
 *   - Cancellation cutoff: CANCELLATION_CUTOFF_HOURS
 *   - Working hours only, per WORKING_HOURS
 *
 * These functions accept an explicit `now` parameter (defaulting to
 * the real current time) purely so they're deterministic and cheap to
 * unit test — production callers never need to pass it.
 */

function fail(violation: BookingRuleViolation, message: string): BookingValidationResult {
  return { valid: false, violation, message };
}

const VALID: BookingValidationResult = { valid: true };

/** Whether `startTime` falls within the maximum allowed booking window from `now`. */
export function isWithinBookingWindow(startTime: Date, now: Date = new Date()): boolean {
  const limit = addDays(now, MAX_BOOKING_WINDOW_DAYS);
  return !isAfter(startTime, limit);
}

/** Whether `startTime` is far enough in the future to satisfy the minimum notice period. */
export function hasMinimumNotice(startTime: Date, now: Date = new Date()): boolean {
  const earliestBookable = addHours(now, MIN_BOOKING_NOTICE_HOURS);
  return !isBefore(startTime, earliestBookable);
}

/**
 * Whether an existing appointment starting at `appointmentStartTime`
 * may still be cancelled, relative to `now`. Cancellation is allowed
 * until CANCELLATION_CUTOFF_HOURS before the appointment.
 */
export function canCancel(appointmentStartTime: Date, now: Date = new Date()): boolean {
  const cutoff = addHours(now, CANCELLATION_CUTOFF_HOURS);
  return !isAfter(cutoff, appointmentStartTime);
}

/**
 * Whether [startTime, endTime) falls entirely within the salon's
 * working hours for that local calendar day (per WORKING_HOURS),
 * evaluated in SALON_TIMEZONE regardless of the server's own
 * timezone. Appointments that would cross local midnight are treated
 * as invalid — the salon's schedule never spans two calendar days.
 */
export function isWithinWorkingHours(startTime: Date, endTime: Date): boolean {
  const zonedStart = toZonedTime(startTime, SALON_TIMEZONE);
  const zonedEnd = toZonedTime(endTime, SALON_TIMEZONE);

  const weekday = zonedStart.getDay();
  const hours = WORKING_HOURS[weekday];
  if (!hours) return false; // Closed that day.

  const sameCalendarDay =
    zonedEnd.getFullYear() === zonedStart.getFullYear() &&
    zonedEnd.getMonth() === zonedStart.getMonth() &&
    zonedEnd.getDate() === zonedStart.getDate();
  if (!sameCalendarDay) return false;

  const [openHour, openMinute] = hours.open.split(":").map(Number);
  const [closeHour, closeMinute] = hours.close.split(":").map(Number);

  const startMinutes = zonedStart.getHours() * 60 + zonedStart.getMinutes();
  const endMinutes = zonedEnd.getHours() * 60 + zonedEnd.getMinutes();
  const openMinutes = openHour * 60 + openMinute;
  const closeMinutes = closeHour * 60 + closeMinute;

  return startMinutes >= openMinutes && endMinutes <= closeMinutes;
}

/**
 * Runs every static booking rule against a candidate time, in the
 * order a guest would want to hear about them (soonest-blocking
 * reason first). Does NOT check for conflicts against existing
 * appointments or blocked slots — that's occupancy data, not a static
 * rule, and is handled by src/domain/booking/availability.ts.
 */
export function validateBookingRequest(
  candidate: BookingCandidate,
  now: Date = new Date(),
): BookingValidationResult {
  if (!isAfter(candidate.startTime, now)) {
    return fail("INSUFFICIENT_NOTICE", "This time has already passed.");
  }

  if (!hasMinimumNotice(candidate.startTime, now)) {
    return fail(
      "INSUFFICIENT_NOTICE",
      `Bookings require at least ${MIN_BOOKING_NOTICE_HOURS} hours' notice.`,
    );
  }

  if (!isWithinBookingWindow(candidate.startTime, now)) {
    return fail(
      "OUTSIDE_BOOKING_WINDOW",
      `Bookings can only be made up to ${MAX_BOOKING_WINDOW_DAYS} days in advance.`,
    );
  }

  if (!isWithinWorkingHours(candidate.startTime, candidate.endTime)) {
    return fail("OUTSIDE_WORKING_HOURS", "This time falls outside working hours.");
  }

  return VALID;
}
