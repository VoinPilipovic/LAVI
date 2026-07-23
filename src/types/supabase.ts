import type { Database } from "@/types/database.types";

/**
 * Convenience generics on top of the raw Database type, so the rest of
 * the codebase writes `Tables<"services">` instead of the full nested
 * path. Mirrors the pattern Supabase's own docs recommend.
 */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type { Database, AppointmentStatus } from "@/types/database.types";
