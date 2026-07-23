"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useAvailability } from "@/hooks/use-availability";
import { formatSlotTime } from "@/components/booking/booking-format";
import type { SlotOption } from "@/actions/booking.actions";

interface TimeSlotPickerProps {
  serviceId: string;
  date: string;
  selectedSlot: SlotOption | null;
  onSelectSlot: (slot: SlotOption) => void;
}

export function TimeSlotPicker({ serviceId, date, selectedSlot, onSelectSlot }: TimeSlotPickerProps) {
  const { slots, isLoading, error, fetchSlots } = useAvailability();

  useEffect(() => {
    fetchSlots(serviceId, date);
  }, [serviceId, date, fetchSlots]);

  return (
    <div className="space-y-3">
      <p className="text-eyebrow text-[10px]">Select a time</p>

      {isLoading ? (
        <div className="flex items-center gap-2 py-6 text-sm text-ivory-dim">
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.5} />
          Checking availability…
        </div>
      ) : error ? (
        <p className="py-6 text-sm text-destructive">{error}</p>
      ) : slots.length === 0 ? (
        <p className="py-6 text-sm text-ivory-dim">
          No times available on this date. Try another day.
        </p>
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
                    ? "border-gold bg-gold/10 text-ivory"
                    : "border-ink-border bg-ink-elevated text-ivory-dim hover:border-gold/40 hover:text-ivory"
                }`}
              >
                {formatSlotTime(new Date(slot.start))}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
