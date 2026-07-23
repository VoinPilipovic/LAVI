"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/server";
import {
  serviceSchema,
  updateServiceSchema,
  type ServiceInput,
  type UpdateServiceInput,
} from "@/schemas/service.schema";
import type { ActionResult } from "@/types";
import type { Tables } from "@/types/supabase";

/** Revalidates every route that reads from the services table. */
function revalidateServiceConsumers() {
  revalidatePath("/admin/services");
  revalidatePath("/");
  revalidatePath("/booking");
}

/** All services, active and inactive — the admin needs to see both to manage them. */
export async function getAllServices(): Promise<ActionResult<Tables<"services">[]>> {
  try {
    const supabase = await requireAdmin();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      return { success: false, error: "Could not load services." };
    }

    return { success: true, data: data ?? [] };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}

export async function createService(rawInput: ServiceInput): Promise<ActionResult<void>> {
  const parsed = serviceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("services").insert({
      name: parsed.data.name,
      description: parsed.data.description || "",
      duration_minutes: parsed.data.durationMinutes,
      price: parsed.data.price,
      is_active: parsed.data.isActive,
      sort_order: parsed.data.sortOrder,
    });

    if (error) {
      return { success: false, error: "Could not create service." };
    }

    revalidateServiceConsumers();
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}

export async function updateService(rawInput: UpdateServiceInput): Promise<ActionResult<void>> {
  const parsed = updateServiceSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const supabase = await requireAdmin();
    const { id, name, description, durationMinutes, price, isActive, sortOrder } = parsed.data;
    const { error } = await supabase
      .from("services")
      .update({
        name,
        description: description || "",
        duration_minutes: durationMinutes,
        price,
        is_active: isActive,
        sort_order: sortOrder,
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: "Could not update service." };
    }

    revalidateServiceConsumers();
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}

export async function deleteService(id: string): Promise<ActionResult<void>> {
  try {
    const supabase = await requireAdmin();
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      // services.id is referenced by appointments with ON DELETE RESTRICT
      // — a service with any booking history cannot be deleted outright.
      return {
        success: false,
        error:
          "Could not delete this service — it has existing appointments. Try deactivating it instead.",
      };
    }

    revalidateServiceConsumers();
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Not authorized." };
  }
}
