"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { getLocalDayBounds } from "@/domain/booking/availability";
import type { ActionResult } from "@/types";
import type { AppointmentStatus, Tables } from "@/types/supabase";

/**
 * Admin-side status changes (including cancellation) are NOT subject
 * to the guest-facing CANCELLATION_CUTOFF_HOURS rule — that rule
 * exists to stop a GUEST from cancelling at the last minute, not to
 * constrain the salon owner's own ability to manage their calendar.
 * The admin can change status at any time. This is a deliberate,
 * explicit decision (see HANDOFF.md §12).
 */

export interface AppointmentWithService extends Tables<"appointments"> {
  service: Pick<Tables<"services">, "name" | "duration_minutes" | "price"> | null;
}

async function attachServices(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  appointments: Tables<"appointments">[],
): Promise<AppointmentWithService[]> {
  if (appointments.length === 0) return [];

  const serviceIds = Array.from(new Set(appointments.map((a) => a.service_id)));
  const { data: services } = await supabase
    .from("services")
    .select("id, name, duration_minutes, price")
    .in("id", serviceIds);

  const serviceMap = new Map((services ?? []).map((s) => [s.id, s]));

  return appointments.map((appointment) => ({
    ...appointment,
    service: serviceMap.get(appointment.service_id)
      ? {
          name: serviceMap.get(appointment.service_id)!.name,
          duration_minutes: serviceMap.get(appointment.service_id)!.duration_minutes,
          price: serviceMap.get(appointment.service_id)!.price,
        }
      : null,
  }));
}

export interface DashboardAppointments {
  today: AppointmentWithService[];
  upcoming: AppointmentWithService[];
}

/** Today's appointments (salon-local calendar day) plus the next batch of upcoming ones. */
export async function getDashboardAppointments(): Promise<ActionResult<DashboardAppointments>> {
  try {
    const supabase = await requireAdmin();
    const todayBounds = getLocalDayBounds(new Date());

    const [{ data: todayRows, error: todayError }, { data: upcomingRows, error: upcomingError }] =
      await Promise.all([
        supabase
          .from("appointments")
          .select("*")
          .gte("start_time", todayBounds.start.toISOString())
          .lt("start_time", todayBounds.end.toISOString())
          .order("start_time", { ascending: true }),
        supabase
          .from("appointments")
          .select("*")
          .gte("start_time", todayBounds.end.toISOString())
          .order("start_time", { ascending: true })
          .limit(50),
      ]);

    if (todayError || upcomingError) {
      return { success: false, error: "Could not load appointments." };
    }

    const [today, upcoming] = await Promise.all([
      attachServices(supabase, todayRows ?? []),
      attachServices(supabase, upcomingRows ?? []),
    ]);

    return { success: true, data: { today, upcoming } };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}

export interface AppointmentDetail extends AppointmentWithService {
  customer: Tables<"customers"> | null;
}

/** Full detail for a single appointment, including its customer record if one exists. */
export async function getAppointmentById(
  appointmentId: string,
): Promise<ActionResult<AppointmentDetail>> {
  try {
    const supabase = await requireAdmin();

    const { data: appointment, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .maybeSingle();

    if (error || !appointment) {
      return { success: false, error: "Appointment not found." };
    }

    const [{ data: service }, { data: customer }] = await Promise.all([
      supabase
        .from("services")
        .select("name, duration_minutes, price")
        .eq("id", appointment.service_id)
        .maybeSingle(),
      appointment.customer_id
        ? supabase.from("customers").select("*").eq("id", appointment.customer_id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    return {
      success: true,
      data: { ...appointment, service: service ?? null, customer: customer ?? null },
    };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}

const updateStatusSchema = z.object({
  appointmentId: z.string().uuid(),
  status: z.enum(["confirmed", "completed", "cancelled", "no_show"]),
});

/** Changes an appointment's status — confirm, complete, mark no-show, or cancel. */
export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
): Promise<ActionResult<void>> {
  const parsed = updateStatusSchema.safeParse({ appointmentId, status });
  if (!parsed.success) {
    return { success: false, error: "Invalid request." };
  }

  try {
    const supabase = await requireAdmin();
    const { error } = await supabase
      .from("appointments")
      .update({ status: parsed.data.status })
      .eq("id", parsed.data.appointmentId);

    if (error) {
      // Postgres code 23P01 = exclusion constraint violation. This can
      // happen specifically when re-activating a previously cancelled
      // appointment (e.g. confirmed -> cancelled -> confirmed again)
      // whose time slot has since been booked by someone else — the
      // same constraint that prevents double-booking on creation
      // applies equally to any status change that makes a row
      // "active" again. Give a specific message rather than the
      // generic fallback.
      if (error.code === "23P01") {
        return {
          success: false,
          error: "This time slot is no longer free — another appointment now overlaps it.",
        };
      }
      return { success: false, error: "Could not update this appointment." };
    }

    revalidatePath("/admin");
    revalidatePath(`/admin/appointments/${appointmentId}`);
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}
