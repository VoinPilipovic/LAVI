"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { adminLoginSchema } from "@/schemas/auth.schema";
import type { ActionResult } from "@/types";

/**
 * Signs in the salon owner. There is no public registration in the
 * beta — the one admin account is provisioned manually (see
 * supabase/seed.sql). On success, redirects to /admin; on failure,
 * returns a generic error so the login form never reveals whether the
 * email or the password was wrong.
 */
export async function signInAdmin(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { success: false, error: "Incorrect email or password." };
  }

  // Confirm the signed-in user actually has an admin_profiles row —
  // signInWithPassword alone only proves they have *a* Supabase Auth
  // account, not that they're the salon admin.
  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!adminProfile) {
    await supabase.auth.signOut();
    return { success: false, error: "This account does not have admin access." };
  }

  redirect("/admin");
}

/** Signs the admin out and returns them to the public site. */
export async function signOutAdmin(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
