/**
 * Domain-level service shape. Mirrors the `services` table
 * (src/types/database.types.ts) with camelCase fields — the
 * application layer maps between the two.
 */
export interface ServiceRecord {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  sortOrder: number;
}
