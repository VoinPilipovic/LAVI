"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  createBlockedSlot,
  deleteBlockedSlot,
} from "@/actions/availability.actions";
import { blockedSlotSchema, type BlockedSlotInput } from "@/schemas/availability.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatSlotDateTime } from "@/components/booking/booking-format";
import type { Tables } from "@/types/supabase";

interface AvailabilityManagerProps {
  blockedSlots: Tables<"blocked_slots">[];
}

export function AvailabilityManager({ blockedSlots: initial }: AvailabilityManagerProps) {
  const router = useRouter();
  const [blockedSlots, setBlockedSlots] = useState(initial);
  const [formError, setFormError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setBlockedSlots(initial);
  }, [initial]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlockedSlotInput>({
    resolver: zodResolver(blockedSlotSchema),
    defaultValues: { isFullDay: true },
  });

  const isFullDay = watch("isFullDay");

  const onSubmit = (values: BlockedSlotInput) => {
    setFormError(null);

    startTransition(async () => {
      const result = await createBlockedSlot(values);

      if (!result.success) {
        setFormError(result.error);
        return;
      }

      reset({ isFullDay: true, date: "", startTime: "", endTime: "", reason: "" });
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);

    startTransition(async () => {
      const result = await deleteBlockedSlot(id);

      if (result.success) {
        setBlockedSlots((prev) => prev.filter((slot) => slot.id !== id));
      }

      setDeletingId(null);
      router.refresh();
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <p className="text-eyebrow text-[10px]">Block a date</p>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            aria-invalid={!!errors.date}
            aria-describedby={errors.date ? "date-error" : undefined}
            {...register("date")}
          />
          {errors.date ? (
            <p id="date-error" role="alert" className="text-xs text-destructive">
              {errors.date.message}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isFullDay"
            type="checkbox"
            className="h-4 w-4 rounded-sm border-ink-border bg-ink-elevated"
            {...register("isFullDay")}
          />
          <Label htmlFor="isFullDay">Block the entire day</Label>
        </div>

        {!isFullDay ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">From</Label>
              <Input id="startTime" type="time" {...register("startTime")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Until</Label>
              <Input
                id="endTime"
                type="time"
                aria-invalid={!!errors.endTime}
                aria-describedby={errors.endTime ? "endTime-error" : undefined}
                {...register("endTime")}
              />
              {errors.endTime ? (
                <p id="endTime-error" role="alert" className="text-xs text-destructive">
                  {errors.endTime.message}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="reason">Reason (optional)</Label>
          <Input id="reason" placeholder="Holiday, personal time…" {...register("reason")} />
        </div>

        {formError ? (
          <p role="alert" className="text-sm text-destructive">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Saving…" : "Block this time"}
        </Button>
      </form>

      <div className="space-y-3">
        <p className="text-eyebrow text-[10px]">Upcoming blocked times</p>
        {blockedSlots.length === 0 ? (
          <p className="border border-ink-border bg-ink-elevated p-6 text-center text-sm text-ivory-dim">
            Nothing blocked right now.
          </p>
        ) : (
          <ul className="divide-y divide-ink-border border-y border-ink-border">
            {blockedSlots.map((slot) => (
              <li key={slot.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="text-sm text-ivory">
                    {formatSlotDateTime(new Date(slot.start_time))} →{" "}
                    {formatSlotDateTime(new Date(slot.end_time))}
                  </p>
                  {slot.reason ? (
                    <p className="text-xs text-ivory-dim">{slot.reason}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(slot.id)}
                  disabled={isPending && deletingId === slot.id}
                  aria-label="Remove blocked slot"
                  className="p-2 text-ivory-dim transition-colors hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
