"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cancelBooking, type BookingConfirmationData } from "@/actions/booking.actions";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDuration } from "@/lib/utils";
import { formatSlotDateTime } from "@/components/booking/booking-format";
import { useLocale } from "@/components/providers/locale-provider";
import { localeIntlTag } from "@/config/i18n";
import { translateBookingError } from "@/lib/booking-errors";
import { CANCELLATION_CUTOFF_HOURS } from "@/lib/constants";

interface BookingConfirmationProps {
  appointment: BookingConfirmationData;
  token: string;
}

export function BookingConfirmation({ appointment, token }: BookingConfirmationProps) {
  const { locale, dict } = useLocale();
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
          <h1 className="font-display text-2xl text-ivory">{dict.booking.confirmation.cancelledTitle}</h1>
          <p className="text-sm text-ivory-dim">
            {dict.booking.confirmation.cancelledMessage.replace(
              "{service}",
              appointment.service.name,
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <CheckCircle2 className="h-10 w-10 text-accent" strokeWidth={1.25} />
        <div className="space-y-2">
          <span className="text-eyebrow">{dict.booking.confirmation.confirmedEyebrow}</span>
          <h1 className="font-display text-2xl text-ivory">
            {dict.booking.confirmation.seeYou.replace(
              "{when}",
              formatSlotDateTime(new Date(appointment.startTime), localeIntlTag[locale]),
            )}
          </h1>
        </div>
      </div>

      <dl className="divide-y divide-ink-border border-y border-ink-border text-sm">
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">{dict.booking.confirmation.name}</dt>
          <dd className="text-ivory">{appointment.guestName}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">{dict.booking.confirmation.service}</dt>
          <dd className="text-ivory">{appointment.service.name}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">{dict.booking.confirmation.when}</dt>
          <dd className="text-ivory">
            {formatSlotDateTime(new Date(appointment.startTime), localeIntlTag[locale])}
          </dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">{dict.booking.confirmation.duration}</dt>
          <dd className="text-ivory">{formatDuration(appointment.service.durationMinutes)}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="text-ivory-dim">{dict.booking.confirmation.price}</dt>
          <dd className="font-display text-accent">
            {formatPrice(appointment.service.price, "EUR", localeIntlTag[locale])}
          </dd>
        </div>
      </dl>

      {error ? (
        <p role="alert" className="text-center text-sm text-destructive">
          {translateBookingError(error, dict)}
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
          {isPending ? dict.booking.confirmation.cancelling : dict.booking.confirmation.cancelBooking}
        </Button>
        <p className="text-xs text-ivory-dim">
          {dict.booking.confirmation.cancellationNotice.replace(
            "{hours}",
            String(CANCELLATION_CUTOFF_HOURS),
          )}
        </p>
      </div>
    </div>
  );
}
