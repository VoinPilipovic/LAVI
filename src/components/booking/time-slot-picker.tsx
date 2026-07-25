"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAvailability } from "@/hooks/use-availability";
import { formatSlotTime } from "@/components/booking/booking-format";
import { useLocale } from "@/components/providers/locale-provider";
import { localeIntlTag } from "@/config/i18n";
import { translateBookingError } from "@/lib/booking-errors";
import type { SlotOption } from "@/actions/booking.actions";

interface TimeSlotPickerProps {
  serviceId: string;
  date: string;
  selectedSlot: SlotOption | null;
  onSelectSlot: (slot: SlotOption) => void;
}

export function TimeSlotPicker({ serviceId, date, selectedSlot, onSelectSlot }: TimeSlotPickerProps) {
  const { slots, isLoading, error, fetchSlots } = useAvailability();
  const { locale, dict } = useLocale();

  useEffect(() => {
    fetchSlots(serviceId, date);
  }, [serviceId, date, fetchSlots]);

  return (
    <div className="space-y-3">
      <p className="text-eyebrow text-[10px]">{dict.booking.datetime.selectTime}</p>

      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-ivory-dim">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          {dict.booking.datetime.checkingAvailability}
        </div>
      ) : error ? (
        <p className="py-6 text-sm text-destructive">{translateBookingError(error, dict)}</p>
      ) : slots.length === 0 ? (
        <p className="py-6 text-sm text-ivory-dim">{dict.booking.datetime.noTimesAvailable}</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.start === slot.start;

            return (
              <button
                key={slot.start}
                type="button"
                onClick={() => onSelectSlot(slot)}
                aria-pressed={isSelected}
                className={`rounded-sm border px-3 py-2 text-sm transition-colors ${
                  isSelected
                    ? "border-accent bg-accent/10 text-ivory"
                    : "border-ink-border bg-ink-elevated text-ivory-dim hover:border-accent/40 hover:text-ivory"
                }`}
              >
                {formatSlotTime(new Date(slot.start), localeIntlTag[locale])}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
