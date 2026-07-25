"use client";

import Link from "next/link";
import { RevealText } from "@/components/shared/reveal-text";
import { LineReveal } from "@/components/shared/line-reveal";
import { Button } from "@/components/ui/button";
import { bookingCta } from "@/config/navigation";
import { useLocale } from "@/components/providers/locale-provider";

/**
 * Split out of services-preview.tsx (a Server Component that fetches
 * Supabase) purely so the translated heading/CTA can call useLocale() —
 * the same server-fetches/client-renders split already used for
 * <ServicesList>.
 */
export function ServicesHeading() {
  const { dict } = useLocale();

  return (
    <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl space-y-4">
        <RevealText as="p" className="text-eyebrow">
          {dict.services.eyebrow}
        </RevealText>
        <LineReveal
          as="h2"
          text={dict.services.title}
          className="text-balance font-display text-3xl leading-[1.15] text-ivory sm:text-4xl md:text-5xl"
        />
      </div>
      <Button asChild variant="outline" className="w-fit">
        <Link href={bookingCta.href}>{dict.nav.bookNow}</Link>
      </Button>
    </div>
  );
}
