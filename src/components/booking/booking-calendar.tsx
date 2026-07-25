"use client";

import { useMemo } from "react";
import { addDays, format, type Locale } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useLocale } from "@/components/providers/locale-provider";
import { dateFnsLocale } from "@/lib/date-fns-locale";
import { MAX_BOOKING_WINDOW_DAYS, WORKING_HOURS, SALON_TIMEZONE } from "@/lib/constants";

interface DayOption {
  /** "YYYY-MM-DD", the value passed to onSelectDate and the availability query. */
  dateStr: string;
  weekdayLabel: string;
  dayNumber: string;
  monthLabel: string;
  closed: boolean;
}

interface BookingCalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

/**
 * Builds the list of the next MAX_BOOKING_WINDOW_DAYS+1 calendar days
 * (today included), evaluated in SALON_TIMEZONE rather than the
 * visitor's own timezone — a guest browsing from another timezone must
 * still see and select the salon's actual calendar days. Weekday/month
 * abbreviations follow the active locale (e.g. "Pon"/"Uto" in Serbian).
 */
function useUpcomingDays(locale: Locale): DayOption[] {
  return useMemo(() => {
    const zonedNow = toZonedTime(new Date(), SALON_TIMEZONE);
    const startOfToday = new Date(
      zonedNow.getFullYear(),
      zonedNow.getMonth(),
      zonedNow.getDate(),
    );

    return Array.from({ length: MAX_BOOKING_WINDOW_DAYS + 1 }, (_, index) => {
      const day = addDays(startOfToday, index);
      const weekday = day.getDay();

      return {
        dateStr: format(day, "yyyy-MM-dd"),
        weekdayLabel: format(day, "EEE", { locale }),
        dayNumber: format(day, "d", { locale }),
        monthLabel: format(day, "MMM", { locale }),
        closed: WORKING_HOURS[weekday] === null,
      };
    });
  }, [locale]);
}

export function BookingCalendar({ selectedDate, onSelectDate }: BookingCalendarProps) {
  const { locale, dict } = useLocale();
  const days = useUpcomingDays(dateFnsLocale[locale]);

  return (
    <div className="space-y-3">
      <p className="text-eyebrow text-[10px]">{dict.booking.datetime.selectDate}</p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {days.map((day) => {
          const isSelected = day.dateStr === selectedDate;

          return (
            <button
              key={day.dateStr}
              type="button"
              disabled={day.closed}
              onClick={() => onSelectDate(day.dateStr)}
              aria-pressed={isSelected}
              aria-label={
                day.closed
                  ? `${day.weekdayLabel} ${day.dayNumber} — ${dict.booking.datetime.closed}`
                  : undefined
              }
              className={`flex w-16 shrink-0 flex-col items-center gap-1 rounded-sm border px-2 py-3 transition-colors ${
                day.closed
                  ? "cursor-not-allowed border-ink-border bg-ink text-ivory-muted opacity-40"
                  : isSelected
                    ? "border-accent bg-accent/10 text-ivory"
                    : "border-ink-border bg-ink-elevated text-ivory hover:border-accent/40"
              }`}
            >
              <span className="text-[10px] uppercase tracking-wide text-ivory-dim">
                {day.weekdayLabel}
              </span>
              <span className="font-display text-lg">{day.dayNumber}</span>
              <span className="text-[10px] uppercase tracking-wide text-ivory-dim">
                {day.monthLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
