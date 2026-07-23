/**
 * Single source of truth for business rule numbers and working hours.
 *
 * These are imported by domain logic (src/domain/booking) once it is
 * built in Phase 3, and by UI copy in earlier phases (e.g. "book up to
 * {MAX_BOOKING_WINDOW_DAYS} days ahead"). Keeping them here means the
 * number never drifts between what the UI promises and what the server
 * actually enforces.
 */

/** Furthest a customer may book ahead of today. */
export const MAX_BOOKING_WINDOW_DAYS = 30;

/** Minimum lead time required before an appointment start time. */
export const MIN_BOOKING_NOTICE_HOURS = 3;

/** How close to the appointment start time cancellation is still allowed. */
export const CANCELLATION_CUTOFF_HOURS = 12;

/** Standard appointment slot granularity used when generating time slots. */
export const SLOT_INTERVAL_MINUTES = 15;

/**
 * Working hours by day of week (0 = Sunday .. 6 = Saturday).
 * `null` means the salon is closed that day. Overridden per-date by
 * admin-configured blocked slots (Phase 5), not edited here at runtime.
 */
export const WORKING_HOURS: Record<
  number,
  { open: string; close: string } | null
> = {
  0: null, // Sunday — closed
  1: { open: "09:00", close: "19:00" }, // Monday
  2: { open: "09:00", close: "19:00" }, // Tuesday
  3: { open: "09:00", close: "19:00" }, // Wednesday
  4: { open: "09:00", close: "20:00" }, // Thursday
  5: { open: "09:00", close: "20:00" }, // Friday
  6: { open: "10:00", close: "18:00" }, // Saturday
};

/** IANA timezone the salon operates in — used for all working-hours math. */
export const SALON_TIMEZONE = "Europe/Lisbon";

/**
 * Rate limits for the public, unauthenticated guest booking Server
 * Actions (src/actions/booking.actions.ts). See src/lib/rate-limit.ts
 * for the limiter implementation. All windows share one duration for
 * simplicity; split them out if a specific limit ever needs its own
 * cadence.
 */
export const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

/** Max booking creation attempts per phone number, per window. */
export const BOOKING_CREATE_LIMIT_PER_PHONE = 5;

/** Max booking creation attempts per client IP, per window — a broader net alongside the per-phone limit. */
export const BOOKING_CREATE_LIMIT_PER_IP = 10;

/** Max cancellation attempts per appointment id, per window — guards against token brute-forcing. */
export const BOOKING_CANCEL_LIMIT_PER_APPOINTMENT = 10;
