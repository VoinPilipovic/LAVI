"use client";

import { useLocale } from "@/components/providers/locale-provider";

/**
 * Split out of booking/page.tsx (a Server Component that fetches
 * Supabase) purely so the translated header can call useLocale().
 */
export function BookingHeader() {
  const { dict } = useLocale();

  return (
    <div className="mb-12 space-y-3 text-center">
      <span className="text-eyebrow">{dict.booking.header.eyebrow}</span>
      <h1 className="font-display text-3xl text-ivory sm:text-4xl">{dict.booking.header.title}</h1>
    </div>
  );
}
