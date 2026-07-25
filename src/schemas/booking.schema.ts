import { z } from "zod";

/**
 * Guest-supplied contact details. Kept as its own schema (rather than
 * folded directly into createBookingSchema) so the guest-details form
 * step can validate independently of which service/time was chosen.
 *
 * These specific English messages never reach a user — this schema is
 * only used server-side (via createBookingSchema below) where a failed
 * parse just returns a generic "INVALID_REQUEST" code, never a
 * per-field message (see src/actions/booking.actions.ts). The form the
 * guest actually sees validates against `createGuestDetailsSchema(...)`
 * instead, built with the active locale's messages.
 */
export const guestDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  phone: z.string().trim().min(6, "Enter a valid phone number").max(30),
  // Optional email: an empty string from an untouched form field is
  // valid (means "not provided"), but if something is entered it must
  // be a real email address.
  email: z
    .union([z.string().trim().email("Enter a valid email address"), z.literal("")])
    .optional(),
});

export type GuestDetailsInput = z.infer<typeof guestDetailsSchema>;

/**
 * Same shape and rules as `guestDetailsSchema`, but with messages from
 * the active locale's dictionary (Dictionary["booking"]["validation"])
 * — used by the client-side guest details form so validation errors
 * are never hardcoded in one language. Kept as a factory (not a second
 * static schema) so it can rebuild with new messages when the visitor
 * switches locale.
 */
export function createGuestDetailsSchema(messages: {
  nameRequired: string;
  phoneInvalid: string;
  emailInvalid: string;
}) {
  return z.object({
    name: z.string().trim().min(2, messages.nameRequired).max(100),
    phone: z.string().trim().min(6, messages.phoneInvalid).max(30),
    email: z
      .union([z.string().trim().email(messages.emailInvalid), z.literal("")])
      .optional(),
  });
}

/**
 * Full payload for creating a booking — guest details plus the chosen
 * service and time. `startTime` travels as an ISO 8601 string across
 * the Server Action boundary (a plain, unambiguous wire format) and is
 * parsed back into a Date inside the action itself.
 */
export const createBookingSchema = guestDetailsSchema.extend({
  serviceId: z.string().uuid("Select a service"),
  startTime: z.string().datetime({ message: "Select a time" }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

/**
 * Availability query input. `date` is a plain "YYYY-MM-DD" string
 * representing a calendar day in the salon's own timezone —
 * deliberately NOT a Date/timestamp, since a Date instant crossing the
 * Server Action boundary would be interpreted relative to whichever
 * timezone constructed it (the visitor's browser), which can disagree
 * with the salon's local calendar day near midnight. A plain date
 * string has no such ambiguity.
 */
export const availabilityQuerySchema = z.object({
  serviceId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
});

export type AvailabilityQueryInput = z.infer<typeof availabilityQuerySchema>;

/** Guest self-service cancellation — the token is the sole authorization. */
export const cancelBookingSchema = z.object({
  appointmentId: z.string().uuid(),
  token: z.string().uuid(),
});

export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
