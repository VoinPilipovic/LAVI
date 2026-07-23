"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { bookingCta } from "@/config/navigation";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { businessConfig } from "@/config/business";

/**
 * The hero's signature motion: a slow, endless horizontal band of
 * service names in tracked gold uppercase, bounded by hairlines — a
 * continuous rotation that echoes a barber pole without depicting one
 * literally. This is the one deliberate motion risk on the page;
 * everything else stays quiet by comparison.
 */
function ServiceMarquee() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const words = [...businessConfig.hero.marqueeWords, ...businessConfig.hero.marqueeWords];

  return (
    <div className="relative w-full overflow-hidden border-y border-gold/20 py-4">
      <motion.div
        className="flex w-max shrink-0 gap-8 whitespace-nowrap"
        animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 26, ease: "linear", repeat: Infinity }
        }
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="text-eyebrow flex items-center gap-8 text-ivory-dim"
          >
            {word}
            <span className="text-gold">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink pt-32">
      {/* Ambient background wash — no photography required, pure token-driven gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(200,164,100,0.14),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgb(var(--color-ink))_100%)]"
      />

      <div className="container relative z-10 flex flex-1 flex-col justify-center gap-8 pb-16">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-eyebrow"
        >
          {businessConfig.hero.eyebrow}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-balance font-display text-5xl leading-[1.05] text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {businessConfig.hero.headlineLines.map((line, index) => (
            <span key={line}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-md text-pretty text-base text-ivory-dim md:text-lg"
        >
          {businessConfig.hero.subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="flex flex-wrap items-center gap-6 pt-2"
        >
          <MagneticButton>
            <Button asChild size="lg">
              <Link href={bookingCta.href}>{bookingCta.label}</Link>
            </Button>
          </MagneticButton>

          <Link
            href="#about"
            className="flex items-center gap-2 text-sm text-ivory-dim transition-colors hover:text-gold"
          >
            <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
            {businessConfig.hero.secondaryCtaLabel}
          </Link>
        </motion.div>
      </div>

      <div className="relative z-10">
        <ServiceMarquee />
      </div>
    </section>
  );
}
