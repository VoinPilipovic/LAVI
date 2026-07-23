import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Supabase client for use inside Client Components ("use client").
 * Respects Row Level Security using the anonymous key — safe to expose
 * to the browser. Never pass the service role key here.
 *
 * Typed against the generated Database schema so every `.from("table")`
 * call is checked at compile time.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
