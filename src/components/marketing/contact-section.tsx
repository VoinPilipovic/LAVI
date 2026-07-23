import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { GoogleMap } from "@/components/marketing/google-map";
import { InstagramLink } from "@/components/marketing/instagram-link";
import { WORKING_HOURS } from "@/lib/constants";
import { businessConfig } from "@/config/business";

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type DayHours = { open: string; close: string } | null;

function sameHours(a: DayHours, b: DayHours) {
  if (a === null && b === null) return true;
  if (!a || !b) return false;
  return a.open === b.open && a.close === b.close;
}

/**
 * Groups consecutive days (Monday through Sunday) that share the same
 * open/close hours into a single display row (e.g. "Mon–Wed") instead
 * of listing all seven days — derived from the same WORKING_HOURS
 * constant the booking engine will enforce in Phase 3, so the hours
 * shown here can never drift out of sync with what's actually bookable.
 */
function formatWorkingHours() {
  const displayOrder = [1, 2, 3, 4, 5, 6, 0]; // Monday .. Sunday
  const rows: { label: string; hours: string }[] = [];

  let i = 0;
  while (i < displayOrder.length) {
    const entry = WORKING_HOURS[displayOrder[i]];
    let j = i;

    while (
      j + 1 < displayOrder.length &&
      sameHours(WORKING_HOURS[displayOrder[j + 1]], entry)
    ) {
      j++;
    }

    const startLabel = dayLabels[displayOrder[i]];
    const endLabel = dayLabels[displayOrder[j]];

    rows.push({
      label: i === j ? startLabel : `${startLabel}–${endLabel}`,
      hours: entry ? `${entry.open} – ${entry.close}` : "Closed",
    });

    i = j + 1;
  }

  return rows;
}

export function ContactSection() {
  const hoursRows = formatWorkingHours();
  const { eyebrow, title, description, address, phone, email } = businessConfig.contact;

  return (
    <section id="contact" className="border-t border-ink-border bg-ink py-24 md:py-32">
      <div className="container grid gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="space-y-10">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />

          <ul className="space-y-5 border-t border-ink-border pt-8">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              <span className="text-sm text-ivory-dim">{address}</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              <a
                href={`tel:${phone.replace(/\s/g, "")}`}
                className="text-sm text-ivory-dim transition-colors hover:text-gold"
              >
                {phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              <a
                href={`mailto:${email}`}
                className="text-sm text-ivory-dim transition-colors hover:text-gold"
              >
                {email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
              <div className="space-y-1 text-sm text-ivory-dim">
                {hoursRows.map((row) => (
                  <div key={row.label} className="flex gap-4">
                    <span className="w-16 text-ivory">{row.label}</span>
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
