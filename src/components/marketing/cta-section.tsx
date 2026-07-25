"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { RevealText } from "@/components/shared/reveal-text";
import { LineReveal } from "@/components/shared/line-reveal";
import { bookingCta } from "@/config/navigation";
import { useLocale } from "@/components/providers/locale-provider";

/**
 * The closing scene: everything quiets down (no marquee, no grid, no
 * secondary links) and the headline is deliberately the largest type on
 * the page, so this reads as a crescendo rather than another section.
 * The only accent-blue moment is the thin divider under the eyebrow.
 */
export function CtaSection() {
  const { dict } = useLocale();

  return (
    <section className="relative overflow-hidden border-t border-ink-border bg-ink py-32 md:py-44">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(240,242,245,0.05), transparent 70%)",
        }}
      />

      <div className="container relative flex flex-col items-center gap-10 text-center">
        <div className="flex flex-col items-center gap-4">
          <RevealText as="p" className="text-eyebrow">
            {dict.cta.eyebrow}
          </RevealText>
          <div className="divider-accent max-w-16" />
        </div>

        <LineReveal
          as="h2"
          text={dict.cta.title}
          className="max-w-3xl justify-center text-balance font-display text-4xl leading-[1.1] text-ivory md:text-6xl"
        />

        <RevealText delay={0.3}>
          <MagneticButton>
            <Button asChild size="lg">
              <Link href={bookingCta.href}>{dict.nav.bookNow}</Link>
            </Button>
          </MagneticButton>
        </RevealText>
      </div>
    </section>
  );
}
