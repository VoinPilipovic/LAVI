/**
 * Pure domain types for the booking engine. Deliberately independent
 * of Supabase's generated types (src/types/database.types.ts) — the
 * domain layer should never import outward toward infrastructure.
 * Mapping between this shape and a database row happens in the
 * application layer (src/actions), built in Phase 4.
 */

/** A half-open time interval: [start, end). */
export interface TimeRange {
  start: Date;
  end: Date;
}

export type BookingRuleViolation =
  | "OUTSIDE_BOOKING_WINDOW"
  | "INSUFFICIENT_NOTICE"
  | "OUTSIDE_WORKING_HOURS"
  | "SLOT_UNAVAILABLE";

export interface BookingRuleFailure {
  valid: false;
  violation: BookingRuleViolation;
  message: string;
}

export interface BookingRuleSuccess {
  valid: true;
}

export type BookingValidationResult = BookingRuleSuccess | BookingRuleFailure;

/** A specific start/end time a guest is attempting to book. */
export interface BookingCandidate {
  startTime: Date;
  endTime: Date;
}

/** A single bookable start/end time offered to the guest. */
export interface TimeSlot {
  start: Date;
  end: Date;
}

export interface AvailabilityParams {
  /** Calendar date to generate slots for — only its local calendar day is used. */
  date: Date;
  /** Duration of the service being booked, in minutes. */
  serviceDurationMinutes: number;
  /** Appointments already on the books (any status other than cancelled) that could conflict. */
  existingAppointments: TimeRange[];
  /** Admin-defined blocked ranges (holidays, personal time, etc.). */
  blockedSlots: TimeRange[];
  /** Injectable "now" for testability; defaults to the real current time. */
  now?: Date;
}
