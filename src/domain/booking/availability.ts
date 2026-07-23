import { addMinutes, isAfter, isBefore } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { SLOT_INTERVAL_MINUTES, WORKING_HOURS, SALON_TIMEZONE } from "@/lib/constants";
import { hasMinimumNotice, isWithinBookingWindow } from "./booking-rules";
import type { AvailabilityParams, TimeRange, TimeSlot } from "./booking.types";

/** Whether two time ranges overlap at all (touching endpoints don't count). */
export function rangesOverlap(a: TimeRange, b: TimeRange): boolean {
  return isBefore(a.start, b.end) && isBefore(b.start, a.end);
}

/** Whether `candidate` overlaps none of `occupied`. */
export function isSlotFree(candidate: TimeRange, occupied: TimeRange[]): boolean {
  return !occupied.some((range) => rangesOverlap(candidate, range));
}

/**
 * Whether a specific candidate time is bookable right now: free of
 * both existing appointments and admin-blocked slots. This is the
 * function a server action re-checks immediately before writing a new
 * appointment (Phase 4) — the DB's exclusion constraint is the true
 * last line of defense, but this gives a clean error message instead
 * of a raw constraint-violation error.
 */
export function isCandidateAvailable(
  candidate: TimeRange,
  existingAppointments: TimeRange[],
  blockedSlots: TimeRange[],
): boolean {
  return isSlotFree(candidate, existingAppointments) && isSlotFree(candidate, blockedSlots);
}

/**
 * Returns the [start, end) UTC instant range covering the full local
 * calendar day (00:00–24:00 in SALON_TIMEZONE) that `date` falls on.
 *
 * Intended for the application layer (Server Actions): fetch every
 * appointment/blocked slot whose range overlaps this window in one
 * Supabase query, then pass the results into generateAvailableSlots()
 * for the actual per-slot filtering. Deliberately wider than working
 * hours — blocked_slots aren't constrained to working hours, so a
 * blocked range starting before opening or ending after closing must
 * still be fetched to be accounted for.
 */
export function getLocalDayBounds(date: Date): TimeRange {
  const zoned = toZonedTime(date, SALON_TIMEZONE);
  const year = zoned.getFullYear();
  const month = zoned.getMonth();
  const day = zoned.getDate();

  const startOfDayLocal = new Date(year, month, day, 0, 0, 0, 0);
  const startOfNextDayLocal = new Date(year, month, day + 1, 0, 0, 0, 0);

  return {
    start: fromZonedTime(startOfDayLocal, SALON_TIMEZONE),
    end: fromZonedTime(startOfNextDayLocal, SALON_TIMEZONE),
  };
}

/**
 * Generates every bookable start time for the given calendar date, at
 * SLOT_INTERVAL_MINUTES granularity, for a service of the given
 * duration. A slot is included only if it:
 *   - starts far enough in the future to satisfy the minimum notice period
 *   - falls within the maximum booking window
 *   - starts and ends within working hours for that local day
 *   - doesn't overlap an existing appointment or a blocked slot
 *
 * All working-hours math happens in SALON_TIMEZONE regardless of the
 * server's own timezone, and calendar-day/DST correctness is handled
 * by date-fns-tz rather than manual UTC offset arithmetic.
 */
export function generateAvailableSlots(params: AvailabilityParams): TimeSlot[] {
  const {
    date,
    serviceDurationMinutes,
    existingAppointments,
    blockedSlots,
    now = new Date(),
  } = params;

  const zonedDate = toZonedTime(date, SALON_TIMEZONE);
  const weekday = zonedDate.getDay();
  const hours = WORKING_HOURS[weekday];
  if (!hours) return []; // Closed that day.

  const [openHour, openMinute] = hours.open.split(":").map(Number);
  const [closeHour, closeMinute] = hours.close.split(":").map(Number);

  const year = zonedDate.getFullYear();
  const month = zonedDate.getMonth();
  const day = zonedDate.getDate();

  // Build "naive" local Date values carrying only the Y/M/D/H/M we
  // want, then reinterpret them as SALON_TIMEZONE wall-clock time to
  // get the real UTC instant — independent of the server's own
  // timezone and correct across DST transitions.
  const localOpen = new Date(year, month, day, openHour, openMinute, 0, 0);
  const localClose = new Date(year, month, day, closeHour, closeMinute, 0, 0);
  const openInstant = fromZonedTime(localOpen, SALON_TIMEZONE);
  const closeInstant = fromZonedTime(localClose, SALON_TIMEZONE);

  const slots: TimeSlot[] = [];
  let cursor = openInstant;

  while (!isAfter(addMinutes(cursor, serviceDurationMinutes), closeInstant)) {
    const slotStart = cursor;
    const slotEnd = addMinutes(cursor, serviceDurationMinutes);
    const candidate: TimeRange = { start: slotStart, end: slotEnd };

    const eligible =
      hasMinimumNotice(slotStart, now) &&
      isWithinBookingWindow(slotStart, now) &&
      isCandidateAvailable(candidate, existingAppointments, blockedSlots);

    if (eligible) {
      slots.push({ start: slotStart, end: slotEnd });
    }

    cursor = addMinutes(cursor, SLOT_INTERVAL_MINUTES);
  }

  return slots;
}
