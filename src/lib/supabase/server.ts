import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Supabase client for use inside Server Components, Server Actions, and
 * Route Handlers. Reads/writes the user's session cookie so RLS policies
 * are evaluated as the signed-in user (or anonymous, for guest bookings).
 *
 * Must be created fresh per request — never cached at module scope.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if middleware is refreshing sessions.
          }
        },
      },
    },
  );
}

/**
 * Verifies the current request has a valid, authorized admin session
 * (a signed-in Supabase Auth user with a matching `admin_profiles`
 * row), then returns the RLS-respecting server client for immediate
 * use. Throws if not authorized.
 *
 * Every admin Server Action (src/actions/appointment.actions.ts,
 * service.actions.ts, availability.actions.ts) calls this first, as a
 * defense-in-depth check beyond the middleware/layout guards — those
 * already prevent an unauthenticated visitor from reaching admin pages
 * under normal navigation, but a Server Action is a callable endpoint
 * in its own right and should not rely solely on the page around it
 * having checked first.
 *
 * Deliberately uses the RLS-respecting client (not the service-role
 * admin client from lib/supabase/admin.ts) — an authenticated admin
 * session should be authorized by the real `is_admin()` RLS policies
 * built in Phase 2, not bypass them. The service-role client stays
 * reserved for the guest booking flow, where no session exists for RLS
 * to evaluate at all.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const { data: adminProfile } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!adminProfile) {
    throw new Error("Not authorized.");
  }

  return supabase;
}
