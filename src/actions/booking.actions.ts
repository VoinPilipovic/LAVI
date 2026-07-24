"use server";

import { addMinutes } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  SALON_TIMEZONE,
  CANCELLATION_CUTOFF_HOURS,
  RATE_LIMIT_WINDOW_MS,
  BOOKING_CREATE_LIMIT_PER_PHONE,
  BOOKING_CREATE_LIMIT_PER_IP,
  BOOKING_CANCEL_LIMIT_PER_APPOINTMENT,
} from "@/lib/constants";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import { validateBookingRequest, canCancel } from "@/domain/booking/booking-rules";
import {
  isCandidateAvailable,
  generateAvailableSlots,
  getLocalDayBounds,
} from "@/domain/booking/availability";
import type { TimeRange } from "@/domain/booking/booking.types";
import {
  availabilityQuerySchema,
  createBookingSchema,
  cancelBookingSchema,
  type AvailabilityQueryInput,
  type CreateBookingInput,
  type CancelBookingInput,
} from "@/schemas/booking.schema";
import type { ActionResult } from "@/types";
import type { Tables, AppointmentStatus } from "@/types/supabase";

/**
 * All Supabase access in this file goes through the service-role admin
 * client, not the RLS-respecting server client. `customers` and
 * `appointments` deliberately have no anonymous RLS policies at all
 * (see supabase/migrations/0009_rls_policies.sql and HANDOFF.md §4/§5)
 * — a guest has no session to be authorized by, so authorization here
 * is enforced in application code instead: business-rule validation,
 * an explicit availability re-check immediately before insert, and (for
 * cancellation/confirmation) an exact match against the row's
 * `cancellation_token`. The database's exclusion constraint on
 * `appointments` remains the unconditional last line of defense against
 * a race condition slipping past the availability re-check.
 */

export interface SlotOption {
  start: string;
  end: string;
}

/** Active services for the service-selection step. Public data — safe to expose in full. */
export async function getActiveServices(): Promise<ActionResult<Tables<"services">[]>> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) {
    return { success: false, error: "Could not load services. Please try again." };
  }

  return { success: true, data: data ?? [] };
}

/** Fetches every existing appointment + blocked slot overlapping the given day. */
async function fetchDayOccupancy(
  dayBounds: TimeRange,
): Promise<{ existingAppointments: TimeRange[]; blockedSlots: TimeRange[] } | null> {
  const supabase = createAdminClient();

  const [{ data: appointments, error: appointmentsError }, { data: blocked, error: blockedError }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("start_time, end_time")
        .neq("status", "cancelled")
        .lt("start_time", dayBounds.end.toISOString())
        .gt("end_time", dayBounds.start.toISOString()),
      supabase
        .from("blocked_slots")
        .select("start_time, end_time")
        .lt("start_time", dayBounds.end.toISOString())
        .gt("end_time", dayBounds.start.toISOString()),
    ]);

  if (appointmentsError || blockedError) {
    return null;
  }

  return {
    existingAppointments: (appointments ?? []).map((row) => ({
      start: new Date(row.start_time),
      end: new Date(row.end_time),
    })),
    blockedSlots: (blocked ?? []).map((row) => ({
      start: new Date(row.start_time),
      end: new Date(row.end_time),
    })),
  };
}

/**
 * Anchors a "YYYY-MM-DD" calendar-date string to local noon in
 * SALON_TIMEZONE, returning the equivalent UTC instant. Noon (rather
 * than midnight) sidesteps any ambiguity right at a DST transition —
 * the domain layer only uses this instant to re-derive the calendar
 * day, never the time-of-day itself.
 */
function anchorCalendarDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);

  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

  if (
    year === undefined ||
    month === undefined ||
    day === undefined
  ) {
    throw new Error("Invalid date.");
  }

  return fromZonedTime(
    new Date(year, month - 1, day, 12, 0, 0, 0),
    SALON_TIMEZONE,
  );
}

/** Computes bookable time slots for a service on a given calendar day. */
export async function getAvailableSlots(
  rawInput: AvailabilityQueryInput,
): Promise<ActionResult<SlotOption[]>> {
  const parsed = availabilityQuerySchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: "Invalid availability request." };
  }
  const { serviceId, date } = parsed.data;

  const supabase = createAdminClient();
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("duration_minutes, is_active")
    .eq("id", serviceId)
    .maybeSingle();

  if (serviceError || !service || !service.is_active) {
    return { success: false, error: "This service is not available." };
  }

  const anchor = anchorCalendarDate(date);
  const dayBounds = getLocalDayBounds(anchor);
  const occupancy = await fetchDayOccupancy(dayBounds);

  if (!occupancy) {
    return { success: false, error: "Could not check availability. Please try again." };
  }

  const slots = generateAvailableSlots({
    date: anchor,
    serviceDurationMinutes: service.duration_minutes,
    existingAppointments: occupancy.existingAppointments,
    blockedSlots: occupancy.blockedSlots,
  });

  return {
    success: true,
    data: slots.map((slot) => ({
      start: slot.start.toISOString(),
      end: slot.end.toISOString(),
    })),
  };
}

/** Creates a guest booking, re-validating every rule server-side before writing. */
export async function createBooking(
  rawInput: CreateBookingInput,
): Promise<ActionResult<{ appointmentId: string; cancellationToken: string }>> {
  const parsed = createBookingSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: "Please check the form and try again." };
  }
  const { name, phone, email, serviceId, startTime } = parsed.data;

  const phoneLimit = checkRateLimit(
    `booking:create:phone:${phone}`,
    BOOKING_CREATE_LIMIT_PER_PHONE,
    RATE_LIMIT_WINDOW_MS,
  );
  if (!phoneLimit.allowed) {
    return {
      success: false,
      error: "Too many booking attempts with this phone number. Please try again later.",
    };
  }

  const ip = await getRequestIp();
  const ipLimit = checkRateLimit(
    `booking:create:ip:${ip}`,
    BOOKING_CREATE_LIMIT_PER_IP,
    RATE_LIMIT_WINDOW_MS,
  );
  if (!ipLimit.allowed) {
    return { success: false, error: "Too many booking attempts. Please try again later." };
  }

  const supabase = createAdminClient();
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("id, duration_minutes, is_active")
    .eq("id", serviceId)
    .maybeSingle();

  if (serviceError || !service || !service.is_active) {
    return { success: false, error: "This service is not available." };
  }

  const start = new Date(startTime);
  const end = addMinutes(start, service.duration_minutes);

  const ruleResult = validateBookingRequest({ startTime: start, endTime: end });
  if (!ruleResult.valid) {
    return { success: false, error: ruleResult.message };
  }

  const dayBounds = getLocalDayBounds(start);
  const occupancy = await fetchDayOccupancy(dayBounds);

  if (!occupancy) {
    return { success: false, error: "Could not verify availability. Please try again." };
  }

  const isAvailable = isCandidateAvailable(
    { start, end },
    occupancy.existingAppointments,
    occupancy.blockedSlots,
  );

  if (!isAvailable) {
    return {
      success: false,
      error: "That time was just booked by someone else. Please choose another.",
    };
  }

  // Recognize repeat guests by phone number; keep their details current.
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .upsert({ full_name: name, phone, email: email || null }, { onConflict: "phone" })
    .select("id")
    .single();

  if (customerError || !customer) {
    return { success: false, error: "Could not save your details. Please try again." };
  }

  const { data: appointment, error: insertError } = await supabase
    .from("appointments")
    .insert({
      guest_name: name,
      guest_phone: phone,
      guest_email: email || null,
      customer_id: customer.id,
      service_id: serviceId,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
    })
    .select("id, cancellation_token")
    .single();

  if (insertError || !appointment) {
    // Postgres code 23P01 = exclusion constraint violation: the DB
    // caught a race condition our own availability check just missed
    // (two guests submitting the same slot within milliseconds of each
    // other). Extremely rare, but this is exactly why the constraint
    // exists independently of the check above.
    if (insertError?.code === "23P01") {
      return {
        success: false,
        error: "That time was just booked by someone else. Please choose another.",
      };
    }
    return { success: false, error: "Could not create your booking. Please try again." };
  }

  return {
    success: true,
    data: { appointmentId: appointment.id, cancellationToken: appointment.cancellation_token },
  };
}

/** Cancels a guest's own booking. The cancellation token is the sole authorization. */
export async function cancelBooking(rawInput: CancelBookingInput): Promise<ActionResult<void>> {
  const parsed = cancelBookingSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: "Invalid cancellation request." };
  }
  const { appointmentId, token } = parsed.data;

  const cancelLimit = checkRateLimit(
    `booking:cancel:${appointmentId}`,
    BOOKING_CANCEL_LIMIT_PER_APPOINTMENT,
    RATE_LIMIT_WINDOW_MS,
  );
  if (!cancelLimit.allowed) {
    return { success: false, error: "Too many attempts. Please try again later." };
  }

  const supabase = createAdminClient();
  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("id, start_time, status, cancellation_token")
    .eq("id", appointmentId)
    .maybeSingle();

  // Deliberately the same message whether the id doesn't exist or the
  // token doesn't match it — same reasoning as signInAdmin() never
  // revealing whether the email or the password was wrong.
  if (error || !appointment || appointment.cancellation_token !== token) {
    return { success: false, error: "Booking not found or this link is invalid." };
  }

  if (appointment.status === "cancelled") {
    return { success: false, error: "This booking has already been cancelled." };
  }

  if (!canCancel(new Date(appointment.start_time))) {
    return {
      success: false,
      error: `Cancellations must be made at least ${CANCELLATION_CUTOFF_HOURS} hours before your appointment.`,
    };
  }

  const { error: updateError } = await supabase
    .from("appointments")
    .update({ status: "cancelled" })
    .eq("id", appointmentId);

  if (updateError) {
    return { success: false, error: "Could not cancel your booking. Please try again." };
  }

  return { success: true, data: undefined };
}

export interface BookingConfirmationData {
  id: string;
  guestName: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  cancellationToken: string;
  service: {
    name: string;
    price: number;
    durationMinutes: number;
  };
}

/** Fetches booking details for the confirmation page. The token authorizes access. */
export async function getBookingConfirmation(
  appointmentId: string,
  token: string,
): Promise<ActionResult<BookingConfirmationData>> {
  const supabase = createAdminClient();

  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("id, guest_name, start_time, end_time, status, cancellation_token, service_id")
    .eq("id", appointmentId)
    .maybeSingle();

  // Deliberately the same message whether the id doesn't exist or the
  // token doesn't match it — see the identical reasoning in cancelBooking().
  if (error || !appointment || appointment.cancellation_token !== token) {
    return { success: false, error: "Booking not found or this link is invalid." };
  }

  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("name, price, duration_minutes")
    .eq("id", appointment.service_id)
    .maybeSingle();

  if (serviceError || !service) {
    return { success: false, error: "Booking not found." };
  }

  return {
    success: true,
    data: {
      id: appointment.id,
      guestName: appointment.guest_name,
      startTime: appointment.start_time,
      endTime: appointment.end_time,
      status: appointment.status,
      cancellationToken: appointment.cancellation_token,
      service: {
        name: service.name,
        price: service.price,
        durationMinutes: service.duration_minutes,
      },
    },
  };
}
