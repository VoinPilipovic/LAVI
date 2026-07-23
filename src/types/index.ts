/**
 * Shared, hand-written types that aren't 1:1 with a database table.
 *
 * Database-generated types (src/types/supabase.ts, database.types.ts)
 * are introduced in Phase 2 once the Supabase schema exists. Domain
 * types (booking, appointment, service) are introduced alongside their
 * respective domain modules in later phases.
 *
 * This file is intentionally minimal in Phase 0 — it exists so the
 * `@/types/*` path alias resolves, and grows as each phase adds shapes
 * that don't belong to a single domain module.
 */

/** Generic discriminated result type used by server actions across phases. */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
