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

function fail(
  violation: BookingRuleViolation,
  message: string,
): BookingValidationResult {
  return {
    valid: false,
    violation,
    message,
  };
}

const VALID: BookingValidationResult = {
  valid: true,
};

export function isWithinBookingWindow(
  startTime: Date,
  now: Date = new Date(),
): boolean {
  const limit = addDays(now, MAX_BOOKING_WINDOW_DAYS);

  return !isAfter(startTime, limit);
}

export function hasMinimumNotice(
  startTime: Date,
  now: Date = new Date(),
): boolean {
  const earliestBookable = addHours(
    now,
    MIN_BOOKING_NOTICE_HOURS,
  );

  return !isBefore(startTime, earliestBookable);
}

export function canCancel(
  appointmentStartTime: Date,
  now: Date = new Date(),
): boolean {
  const cutoff = addHours(
    now,
    CANCELLATION_CUTOFF_HOURS,
  );

  return !isAfter(cutoff, appointmentStartTime);
}

function parseTimeToMinutes(time: string): number | null {
  const parts = time.split(":");

  if (parts.length !== 2) {
    return null;
  }

  const hourText = parts[0];
  const minuteText = parts[1];

  if (hourText === undefined || minuteText === undefined) {
    return null;
  }

  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  return hour * 60 + minute;
}

export function isWithinWorkingHours(
  startTime: Date,
  endTime: Date,
): boolean {
  const zonedStart = toZonedTime(
    startTime,
    SALON_TIMEZONE,
  );

  const zonedEnd = toZonedTime(
    endTime,
    SALON_TIMEZONE,
  );

  const weekday = zonedStart.getDay();
  const hours = WORKING_HOURS[weekday] ?? null;

  if (hours === null) {
    return false;
  }

  const sameCalendarDay =
    zonedEnd.getFullYear() === zonedStart.getFullYear() &&
    zonedEnd.getMonth() === zonedStart.getMonth() &&
    zonedEnd.getDate() === zonedStart.getDate();

  if (!sameCalendarDay) {
    return false;
  }

  const openMinutes = parseTimeToMinutes(hours.open);
  const closeMinutes = parseTimeToMinutes(hours.close);

  if (openMinutes === null || closeMinutes === null) {
    return false;
  }

  const startMinutes =
    zonedStart.getHours() * 60 +
    zonedStart.getMinutes();

  const endMinutes =
    zonedEnd.getHours() * 60 +
    zonedEnd.getMinutes();

  return (
    startMinutes >= openMinutes &&
    endMinutes <= closeMinutes
  );
}

/**
 * `message` here is a stable error CODE (see Dictionary["booking"]["errors"]
 * in src/locales/types.ts), never an English sentence — this domain layer
 * has no notion of the guest's locale, only the application layer
 * (src/actions/booking.actions.ts) forwards it on, and the client
 * translates the code via src/lib/booking-errors.ts. `MINIMUM_NOTICE_REQUIRED`
 * and `TIME_ALREADY_PASSED` share the `INSUFFICIENT_NOTICE` violation
 * classification but are distinct message codes, since they read very
 * differently to a guest.
 */
export function validateBookingRequest(
  candidate: BookingCandidate,
  now: Date = new Date(),
): BookingValidationResult {
  if (!isAfter(candidate.startTime, now)) {
    return fail(
      "INSUFFICIENT_NOTICE",
      "TIME_ALREADY_PASSED",
    );
  }

  if (!hasMinimumNotice(candidate.startTime, now)) {
    return fail(
      "INSUFFICIENT_NOTICE",
      "MINIMUM_NOTICE_REQUIRED",
    );
  }

  if (!isWithinBookingWindow(candidate.startTime, now)) {
    return fail(
      "OUTSIDE_BOOKING_WINDOW",
      "OUTSIDE_BOOKING_WINDOW",
    );
  }

  if (
    !isWithinWorkingHours(
      candidate.startTime,
      candidate.endTime,
    )
  ) {
    return fail(
      "OUTSIDE_WORKING_HOURS",
      "OUTSIDE_WORKING_HOURS",
    );
  }

  return VALID;
}