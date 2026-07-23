"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/actions/booking.actions";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDuration } from "@/lib/utils";
import { formatSlotDateTime } from "@/components/booking/booking-format";
import type { GuestDetailsInput } from "@/schemas/booking.schema";
import type { SlotOption } from "@/actions/booking.actions";
import type { Tables } from "@/types/supabase";

interface BookingSummaryProps {
  service: Tables<"services">;
  slot: SlotOption;
  guest: GuestDetailsInput;
  onEditDetails: () => void;
}

export function BookingSummary({ service, slot, guest, onEditDetails }: BookingSummaryProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    setError(null);

    startTransition(async () => {
      const result = await createBooking({
        name: guest.name,
        phone: guest.phone,
        email: guest.email,
        serviceId: service.id,
        startTime: slot.start,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push(
        `/booking/confirmation/${result.data.appointmentId}?token=${result.data.cancellationToken}`,
      );
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-eyebrow text-[10px]">Review & confirm</p>

      <dl className="divide-y divide-ink-border border-y border-ink-border text-sm">
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Service</dt>
          <dd className="text-ivory">{service.name}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">When</dt>
          <dd className="text-ivory">{formatSlotDateTime(new Date(slot.start))}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Duration</dt>
          <dd className="text-ivory">{formatDuration(service.duration_minutes)}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Price</dt>
          <dd className="font-display text-gold">{formatPrice(service.price)}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Name</dt>
          <dd className="text-ivory">{guest.name}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Phone</dt>
          <dd className="text-ivory">{guest.phone}</dd>
        </div>
        {guest.email ? (
          <div className="flex items-center justify-between py-3">
            <dt className="text-ivory-dim">Email</dt>
            <dd className="text-ivory">{guest.email}</dd>
          </div>
        ) : null}
      </dl>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onEditDetails} className="flex-1">
          Edit details
        </Button>
        <Button type="button" onClick={handleConfirm} disabled={isPending} className="flex-1">
          {isPending ? "Confirming…" : "Confirm booking"}
        </Button>
      </div>
    </div>
  );
}
