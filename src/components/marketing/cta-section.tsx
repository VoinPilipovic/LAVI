import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { RevealText } from "@/components/shared/reveal-text";
import { bookingCta } from "@/config/navigation";
import { businessConfig } from "@/config/business";

export function CtaSection() {
  return (
    <section className="border-t border-ink-border bg-ink py-24 md:py-32">
      <div className="container flex flex-col items-center gap-8 text-center">
        <RevealText as="p" className="text-eyebrow">
          {businessConfig.cta.eyebrow}
        </RevealText>

        <RevealText
          as="h2"
          delay={0.1}
          className="max-w-2xl text-balance font-display text-4xl leading-tight text-ivory md:text-5xl"
        >
          {businessConfig.cta.title}
        </RevealText>

        <RevealText delay={0.2}>
          <MagneticButton>
            <Button asChild size="lg">
              <Link href={bookingCta.href}>{bookingCta.label}</Link>
            </Button>
          </MagneticButton>
        </RevealText>
      </div>
    </section>
  );
}
