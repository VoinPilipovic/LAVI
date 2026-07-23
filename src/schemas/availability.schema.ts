import { z } from "zod";

export const blockedSlotSchema = z
  .object({
    /** "YYYY-MM-DD", a salon-local calendar date — see booking.schema.ts for why not a Date. */
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
    isFullDay: z.boolean(),
    /** "HH:MM", 24-hour, salon-local. Required unless isFullDay is true. */
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time").optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time").optional(),
    reason: z.string().trim().max(200).optional(),
  })
  .refine(
    (data) => data.isFullDay || (!!data.startTime && !!data.endTime && data.endTime > data.startTime),
    {
      message: "Provide a start and end time after each other, or mark as full day",
      path: ["endTime"],
    },
  );

export type BlockedSlotInput = z.infer<typeof blockedSlotSchema>;
