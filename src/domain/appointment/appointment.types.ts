/**
 * Domain-level appointment shape. The application layer (src/actions,
 * built in Phase 4) is responsible for mapping this to/from the
 * Supabase `appointments` row (see src/types/database.types.ts) —
 * dates as strings there become real Date instances here, and
 * snake_case columns become camelCase fields.
 */

export type AppointmentStatus = "confirmed" | "completed" | "cancelled" | "no_show";

export interface AppointmentRecord {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string | null;
  customerId: string | null;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes: string | null;
  cancellationToken: string;
  createdAt: Date;
  updatedAt: Date;
}
