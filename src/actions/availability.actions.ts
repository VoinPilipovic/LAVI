"use server";

import { addMinutes } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import { SALON_TIMEZONE } from "@/lib/constants";
import { blockedSlotSchema, type BlockedSlotInput } from "@/schemas/availability.schema";
import type { ActionResult } from "@/types";
import type { Tables } from "@/types/supabase";

/** Converts a "YYYY-MM-DD" + "HH:MM" pair (salon-local) into a UTC instant. */
function toInstant(date: string, time: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return fromZonedTime(new Date(year, month - 1, day, hour, minute, 0, 0), SALON_TIMEZONE);
}

/** Upcoming blocked slots (past ones are no longer actionable, so excluded). */
export async function getBlockedSlots(): Promise<ActionResult<Tables<"blocked_slots">[]>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("blocked_slots")
      .select("*")
      .gte("end_time", new Date().toISOString())
      .order("start_time", { ascending: true });

    if (error) {
      return { success: false, error: "Could not load blocked slots." };
    }

    return { success: true, data: data ?? [] };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}

/** Blocks a date or a specific time range on a date. */
export async function createBlockedSlot(rawInput: BlockedSlotInput): Promise<ActionResult<void>> {
  const parsed = blockedSlotSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }
  const { date, isFullDay, startTime, endTime, reason } = parsed.data;

  const dayStart = toInstant(date, "00:00");
  const start = isFullDay ? dayStart : toInstant(date, startTime!);
  const end = isFullDay ? addMinutes(dayStart, 24 * 60) : toInstant(date, endTime!);

  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("blocked_slots").insert({
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      reason: reason || null,
    });

    if (error) {
      return { success: false, error: "Could not create blocked slot." };
    }

    revalidatePath("/admin/availability");
    revalidatePath("/booking");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}

/** Removes a blocked slot, freeing that time back up for booking. */
export async function deleteBlockedSlot(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("blocked_slots").delete().eq("id", id);

    if (error) {
      return { success: false, error: "Could not remove blocked slot." };
    }

    revalidatePath("/admin/availability");
    revalidatePath("/booking");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}
