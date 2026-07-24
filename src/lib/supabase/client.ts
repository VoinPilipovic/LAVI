import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for use inside Client Components ("use client").
 * Respects Row Level Security using the anonymous key — safe to expose
 * to the browser. Never pass the service role key here.
 *
 * Typed against the generated Database schema so every `.from("table")`
 * call is checked at compile time.
 */
export function createClient() {
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
