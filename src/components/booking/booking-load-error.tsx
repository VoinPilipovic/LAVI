"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { translateBookingError } from "@/lib/booking-errors";

interface BookingLoadErrorProps {
  code: string;
}

export function BookingLoadError({ code }: BookingLoadErrorProps) {
  const { dict } = useLocale();

  return <p className="text-center text-sm text-destructive">{translateBookingError(code, dict)}</p>;
}
