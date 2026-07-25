"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { GoogleMap } from "@/components/marketing/google-map";
import { InstagramLink } from "@/components/marketing/instagram-link";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useLocale } from "@/components/providers/locale-provider";
import { WORKING_HOURS } from "@/lib/constants";
import { businessConfig } from "@/config/business";
import type { Dictionary } from "@/locales/types";

type DayHours = {
  open: string;
  close: string;
} | null;

function sameHours(a: DayHours, b: DayHours) {
  if (a === null && b === null) {
    return true;
  }

  if (!a || !b) {
    return false;
  }

  return a.open === b.open && a.close === b.close;
}

/**
 * Groups consecutive days that share the same working hours into a
 * single display row. `dayLabels` is Sun..Sat (dict.contact.days) so
 * the grouped row labels translate along with everything else.
 */
function formatWorkingHours(dayLabels: Dictionary["contact"]["days"], closedLabel: string) {
  const displayOrder = [1, 2, 3, 4, 5, 6, 0] as const;

  const rows: {
    label: string;
    hours: string;
  }[] = [];

  let i = 0;

  while (i < displayOrder.length) {
    const currentDay = displayOrder[i];

    if (currentDay === undefined) {
      break;
    }

    const entry = WORKING_HOURS[currentDay] ?? null;
    let j = i;

    while (j + 1 < displayOrder.length) {
      const nextDay = displayOrder[j + 1];

      if (nextDay === undefined) {
        break;
      }

      const nextEntry = WORKING_HOURS[nextDay] ?? null;
      if (!sameHours(nextEntry, entry)) {
        break;
      }

      j++;
    }

    const startDay = displayOrder[i];
    const endDay = displayOrder[j];

    if (startDay === undefined || endDay === undefined) {
      break;
    }

    const startLabel = dayLabels[startDay];
    const endLabel = dayLabels[endDay];

    rows.push({
      label: i === j ? startLabel : `${startLabel}–${endLabel}`,
      hours: entry ? `${entry.open} – ${entry.close}` : closedLabel,
    });

    i = j + 1;
  }

  return rows;
}

export function ContactSection() {
  const { dict } = useLocale();
  const hoursRows = formatWorkingHours(dict.contact.days, dict.contact.closed);
  const listRef = useScrollAnimation<HTMLUListElement>({
    selector: "[data-contact-item]",
    stagger: 0.1,
    yOffset: 14,
  });

  const { eyebrow, title, description } = dict.contact;
  const { address, phone, email } = businessConfig.contact;

  return (
    <section
      id="contact"
      className="border-t border-ink-border bg-ink py-24 md:py-32"
    >
      <div className="container grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-10">
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />

          <ul ref={listRef} className="space-y-5 border-t border-ink-border pt-8">
            <li data-contact-item className="flex items-start gap-3 opacity-0">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-ivory-dim"
                strokeWidth={1.5}
              />

              <span className="text-sm text-ivory-dim">
                {address}
              </span>
            </li>

            <li data-contact-item className="flex items-start gap-3 opacity-0">
              <Phone
                className="mt-0.5 h-4 w-4 shrink-0 text-ivory-dim"
                strokeWidth={1.5}
              />

              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-sm text-ivory-dim transition-colors hover:text-accent"
              >
                {phone}
              </a>
            </li>

            <li data-contact-item className="flex items-start gap-3 opacity-0">
              <Mail
                className="mt-0.5 h-4 w-4 shrink-0 text-ivory-dim"
                strokeWidth={1.5}
              />

              <a
                href={`mailto:${email}`}
                className="text-sm text-ivory-dim transition-colors hover:text-accent"
              >
                {email}
              </a>
            </li>

            <li data-contact-item className="flex items-start gap-3 opacity-0">
              <Clock
                className="mt-0.5 h-4 w-4 shrink-0 text-ivory-dim"
                strokeWidth={1.5}
              />

              <div className="space-y-1 text-sm text-ivory-dim">
                {hoursRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex gap-4"
                  >
                    <span className="w-16 text-ivory">
                      {row.label}
                    </span>

                    <span>{row.hours}</span>
                  </div>
                ))}
              </div>
            </li>
          </ul>

          <InstagramLink />
        </div>

        <GoogleMap />
      </div>
    </section>
  );
}
