import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Runs on every matched request.
 *
 * Phase 0 responsibility: keep the Supabase session cookie fresh so
 * Server Components always see an up-to-date auth state.
 *
 * The admin-area redirect guard protects `/admin` and everything under
 * it, while leaving `/admin-login` itself reachable — note the explicit
 * exact-match/prefix-with-slash check below, since a naive
 * `startsWith("/admin")` would also match `/admin-login` and create a
 * redirect loop.
 */
export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  if (isAdminRoute && !user) {
    const redirectUrl = new URL("/admin-login", request.url);
    redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico, images, fonts (static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif)$).*)",
  ],
};
