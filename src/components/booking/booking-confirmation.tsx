"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cancelBooking, type BookingConfirmationData } from "@/actions/booking.actions";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDuration } from "@/lib/utils";
import { formatSlotDateTime } from "@/components/booking/booking-format";
import { CANCELLATION_CUTOFF_HOURS } from "@/lib/constants";

interface BookingConfirmationProps {
  appointment: BookingConfirmationData;
  token: string;
}

export function BookingConfirmation({ appointment, token }: BookingConfirmationProps) {
  const [status, setStatus] = useState(appointment.status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    setError(null);

    startTransition(async () => {
      const result = await cancelBooking({ appointmentId: appointment.id, token });

      if (!result.success) {
        setError(result.error);
        return;
      }

      setStatus("cancelled");
    });
  };

  if (status === "cancelled") {
    return (
      <div className="flex flex-col items-center gap-6 text-center">
        <XCircle className="h-10 w-10 text-ivory-dim" strokeWidth={1.25} />
        <div className="space-y-2">
          <h1 className="font-display text-2xl text-ivory">Booking cancelled</h1>
          <p className="text-sm text-ivory-dim">
            Your appointment for {appointment.service.name} has been cancelled. We hope to see you
            another time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-gold" strokeWidth={1.25} />
        <div className="space-y-2">
          <span className="text-eyebrow">Booking Confirmed</span>
          <h1 className="font-display text-2xl text-ivory">
            See you {formatSlotDateTime(new Date(appointment.startTime))}
          </h1>
        </div>
      </div>

      <dl className="divide-y divide-ink-border border-y border-ink-border text-sm">
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Name</dt>
          <dd className="text-ivory">{appointment.guestName}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Service</dt>
          <dd className="text-ivory">{appointment.service.name}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">When</dt>
          <dd className="text-ivory">{formatSlotDateTime(new Date(appointment.startTime))}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Duration</dt>
          <dd className="text-ivory">{formatDuration(appointment.service.durationMinutes)}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">Price</dt>
          <dd className="font-display text-gold">{formatPrice(appointment.service.price)}</dd>
        </div>
      </dl>

      {error ? (
        <p role="alert" className="text-center text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="space-y-3 text-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? "Cancelling…" : "Cancel this booking"}
        </Button>
        <p className="text-xs text-ivory-dim">
          Cancellations are accepted up to {CANCELLATION_CUTOFF_HOURS} hours before your
          appointment.
        </p>
      </div>
    </div>
  );
}
