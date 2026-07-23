import { describe, it, expect } from "vitest";
import { addDays, addHours, addMinutes } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import {
  isWithinBookingWindow,
  hasMinimumNotice,
  canCancel,
  isWithinWorkingHours,
  validateBookingRequest,
} from "@/domain/booking/booking-rules";
import {
  MAX_BOOKING_WINDOW_DAYS,
  MIN_BOOKING_NOTICE_HOURS,
  CANCELLATION_CUTOFF_HOURS,
  SALON_TIMEZONE,
} from "@/lib/constants";

// Fixed reference instant so tests are deterministic. Wednesday,
// July 22 2026, 12:00 UTC — a working day, deep in Lisbon's summer
// DST period (no offset ambiguity for these tests).
const NOW = new Date("2026-07-22T12:00:00Z");

/** Builds a UTC Date from local wall-clock parts in SALON_TIMEZONE. */
function lisbonTime(year: number, month: number, day: number, hour: number, minute = 0): Date {
  return fromZonedTime(new Date(year, month - 1, day, hour, minute, 0, 0), SALON_TIMEZONE);
}

describe("isWithinBookingWindow", () => {
  it("allows a time within the window", () => {
    const startTime = addDays(NOW, MAX_BOOKING_WINDOW_DAYS - 1);
    expect(isWithinBookingWindow(startTime, NOW)).toBe(true);
  });

  it("allows a time exactly at the boundary", () => {
    const startTime = addDays(NOW, MAX_BOOKING_WINDOW_DAYS);
    expect(isWithinBookingWindow(startTime, NOW)).toBe(true);
  });

  it("rejects a time beyond the window", () => {
    const startTime = addDays(NOW, MAX_BOOKING_WINDOW_DAYS + 1);
    expect(isWithinBookingWindow(startTime, NOW)).toBe(false);
  });
});

describe("hasMinimumNotice", () => {
  it("rejects a time with less than the minimum notice", () => {
    const startTime = addHours(NOW, MIN_BOOKING_NOTICE_HOURS - 1);
    expect(hasMinimumNotice(startTime, NOW)).toBe(false);
  });

  it("allows a time exactly at the minimum notice boundary", () => {
    const startTime = addHours(NOW, MIN_BOOKING_NOTICE_HOURS);
    expect(hasMinimumNotice(startTime, NOW)).toBe(true);
  });

  it("allows a time comfortably beyond the minimum notice", () => {
    const startTime = addHours(NOW, MIN_BOOKING_NOTICE_HOURS + 5);
    expect(hasMinimumNotice(startTime, NOW)).toBe(true);
  });
});

describe("canCancel", () => {
  it("rejects cancellation inside the cutoff window", () => {
    const appointmentStart = addHours(NOW, CANCELLATION_CUTOFF_HOURS - 1);
    expect(canCancel(appointmentStart, NOW)).toBe(false);
  });

  it("allows cancellation exactly at the cutoff boundary", () => {
    const appointmentStart = addHours(NOW, CANCELLATION_CUTOFF_HOURS);
    expect(canCancel(appointmentStart, NOW)).toBe(true);
  });

  it("allows cancellation well before the cutoff", () => {
    const appointmentStart = addHours(NOW, CANCELLATION_CUTOFF_HOURS + 24);
    expect(canCancel(appointmentStart, NOW)).toBe(true);
  });
});

describe("isWithinWorkingHours", () => {
  it("allows a slot inside Monday's working hours", () => {
    // Monday, July 20 2026 — salon open 09:00–19:00 Lisbon time.
    const start = lisbonTime(2026, 7, 20, 10, 0);
    const end = addMinutes(start, 45);
    expect(isWithinWorkingHours(start, end)).toBe(true);
  });

  it("rejects a slot before opening time", () => {
    const start = lisbonTime(2026, 7, 20, 8, 30);
    const end = addMinutes(start, 45);
    expect(isWithinWorkingHours(start, end)).toBe(false);
  });

  it("rejects a slot that would end after closing time", () => {
    const start = lisbonTime(2026, 7, 20, 18, 45);
    const end = addMinutes(start, 30); // would end 19:15, after 19:00 close
    expect(isWithinWorkingHours(start, end)).toBe(false);
  });

  it("allows a slot that ends exactly at closing time", () => {
    const start = lisbonTime(2026, 7, 20, 18, 15);
    const end = addMinutes(start, 45); // ends exactly 19:00
    expect(isWithinWorkingHours(start, end)).toBe(true);
  });

  it("rejects any time on a closed day (Sunday)", () => {
    // Sunday, July 26 2026 — salon closed.
    const start = lisbonTime(2026, 7, 26, 11, 0);
    const end = addMinutes(start, 30);
    expect(isWithinWorkingHours(start, end)).toBe(false);
  });

  it("respects Saturday's shorter hours (10:00–18:00)", () => {
    // Saturday, July 25 2026.
    const validStart = lisbonTime(2026, 7, 25, 17, 0);
    const validEnd = addMinutes(validStart, 60); // ends exactly 18:00
    expect(isWithinWorkingHours(validStart, validEnd)).toBe(true);

    const tooEarly = lisbonTime(2026, 7, 25, 9, 0);
    expect(isWithinWorkingHours(tooEarly, addMinutes(tooEarly, 30))).toBe(false);
  });
});

describe("validateBookingRequest", () => {
  it("accepts a valid candidate", () => {
    const startTime = lisbonTime(2026, 7, 27, 14, 0); // Monday, well within notice/window
    const endTime = addMinutes(startTime, 45);
    const result = validateBookingRequest({ startTime, endTime }, NOW);
    expect(result.valid).toBe(true);
  });

  it("flags insufficient notice", () => {
    const startTime = addHours(NOW, 1);
    const endTime = addMinutes(startTime, 45);
    const result = validateBookingRequest({ startTime, endTime }, NOW);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.violation).toBe("INSUFFICIENT_NOTICE");
  });

  it("flags a time beyond the booking window", () => {
    const startTime = addDays(NOW, MAX_BOOKING_WINDOW_DAYS + 5);
    const endTime = addMinutes(startTime, 45);
    const result = validateBookingRequest({ startTime, endTime }, NOW);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.violation).toBe("OUTSIDE_BOOKING_WINDOW");
  });

  it("flags a time outside working hours", () => {
    const startTime = lisbonTime(2026, 7, 26, 11, 0); // Sunday — closed
    const endTime = addMinutes(startTime, 45);
    const result = validateBookingRequest({ startTime, endTime }, NOW);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.violation).toBe("OUTSIDE_WORKING_HOURS");
  });

  it("flags a time already in the past", () => {
    const startTime = addHours(NOW, -2);
    const endTime = addMinutes(startTime, 45);
    const result = validateBookingRequest({ startTime, endTime }, NOW);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.violation).toBe("INSUFFICIENT_NOTICE");
  });
});
