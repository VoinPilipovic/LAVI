"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";
import { translateBookingError } from "@/lib/booking-errors";

interface BookingNotFoundProps {
  /** A booking-errors code, or omitted when there was no token at all (missing/invalid link). */
  code?: string;
}

export function BookingNotFound({ code }: BookingNotFoundProps) {
  const { dict } = useLocale();

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="space-y-2">
        <h1 className="font-display text-2xl text-ivory">{dict.booking.confirmation.notFoundTitle}</h1>
        <p className="text-sm text-ivory-dim">
          {code ? translateBookingError(code, dict) : dict.booking.confirmation.notFoundMessage}
        </p>
      </div>
      <Button asChild>
        <Link href="/booking">{dict.booking.confirmation.bookAppointment}</Link>
      </Button>
    </div>
  );
}
