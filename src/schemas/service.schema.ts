import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().trim().min(2, "Enter a service name").max(100),
  description: z.string().trim().max(500).optional(),
  durationMinutes: z.coerce.number().int().min(5, "Minimum 5 minutes").max(480, "Maximum 8 hours"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int(),
});

export type ServiceInput = z.infer<typeof serviceSchema>;

export const updateServiceSchema = serviceSchema.extend({
  id: z.string().uuid(),
});

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
