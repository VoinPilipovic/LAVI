import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Service-role Supabase client. Bypasses Row Level Security entirely.
 *
 * SERVER-ONLY. Never import this file from a Client Component or expose
 * its output to the browser. Reserved for trusted admin-side operations
 * (e.g. aggregating data across all customers) where RLS would otherwise
 * require duplicating policies unnecessarily.
 *
 * Prefer `lib/supabase/server.ts` for anything that can run under normal
 * user RLS — reach for this client only when there is no other way.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing Supabase admin credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY are set in the server environment.",
    );
  }

  return createSupabaseClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
