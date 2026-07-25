"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealText } from "@/components/shared/reveal-text";
import { LineReveal } from "@/components/shared/line-reveal";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { useImageReveal } from "@/hooks/use-image-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { bookingCta } from "@/config/navigation";
import { cn } from "@/lib/utils";

/**
 * Editorial "Meet the Team" section — the salon's real founding story:
 * Lavi (founder) and Bugi (her first student, now right-hand barber),
 * left-to-right in the same order they stand in the photograph. One
 * dark charcoal canvas, one wide photograph, two editorial columns —
 * no cards, no gradients, no rounded containers, everything clamped to
 * a single centered column width so it reads as a magazine spread
 * rather than a web "feature grid."
 */

interface TeamButtonProps {
  href: string;
  label: string;
}

function TeamButton({ href, label }: TeamButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex w-fit items-center gap-2.5 border border-ivory/15 px-6 py-3",
        "text-xs uppercase tracking-wide text-ivory transition-colors duration-300",
        "hover:border-accent hover:text-accent",
      )}
    >
      {label}
      <ArrowUpRight
        className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.5}
      />
    </Link>
  );
}

export function AboutSection() {
  const { dict } = useLocale();
  const { eyebrow, headlineLines, description, team, closingStatement, imageAlt, imageLabel } =
    dict.about;
  const imageRef = useImageReveal<HTMLDivElement>({
    clipFrom: "bottom",
    scaleFrom: 1.08,
    parallax: 5,
  });

  return (
    <section id="about" className="border-t border-ink-border bg-ink-elevated py-24 md:py-32">
      <div className="container">
        <div className="mx-auto max-w-5xl">
          <div className="space-y-6">
            <RevealText as="p" className="text-eyebrow">
              {eyebrow}
            </RevealText>

            <h2 className="font-display text-3xl leading-[1.15] text-ivory sm:text-4xl md:text-5xl">
              <LineReveal as="span" text={headlineLines[0]} className="text-balance" />
              <LineReveal as="span" text={headlineLines[1]} delay={0.1} className="text-balance" />
            </h2>

            <RevealText as="p" delay={0.2} className="max-w-2xl text-pretty text-base leading-relaxed text-ivory-dim">
              {description}
            </RevealText>
          </div>

          <div
            ref={imageRef}
            className="relative mt-16 aspect-[4/5] w-full overflow-hidden sm:aspect-[4/3] md:mt-20 md:aspect-[16/9]"
          >
            <ImageWithFallback
              src="/images/lavi-bugi-team-horizontal.jpg"
              alt={imageAlt}
              label={imageLabel}
              sizes="(min-width: 1024px) 1024px, 100vw"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ivory/10" />
          </div>

          <div className="relative mt-16 grid gap-14 md:mt-24 md:grid-cols-2 md:gap-20 lg:gap-28">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 hidden h-16 w-px -translate-x-1/2 -translate-y-1/2 bg-ivory/10 md:block"
            />

            <div className="space-y-6">
              <RevealText as="h3" className="font-display text-3xl text-ivory sm:text-4xl">
                {team.bugi.name}
              </RevealText>
              <RevealText as="p" delay={0.05} className="text-eyebrow !text-accent/80">
                {team.bugi.role}
              </RevealText>
              <RevealText as="p" delay={0.1} className="text-pretty text-base leading-relaxed text-ivory-dim">
                {team.bugi.bio}
              </RevealText>
              <RevealText delay={0.2} className="pt-2">
                <TeamButton href={bookingCta.href} label={team.bugi.cta} />
              </RevealText>
            </div>

            <div className="space-y-6">
              <RevealText as="h3" className="font-display text-3xl text-ivory sm:text-4xl">
                {team.lavi.name}
              </RevealText>
              <RevealText as="p" delay={0.05} className="text-eyebrow !text-accent/80">
                {team.lavi.role}
              </RevealText>
              <RevealText as="p" delay={0.1} className="text-pretty text-base leading-relaxed text-ivory-dim">
                {team.lavi.bio}
              </RevealText>
              <RevealText delay={0.2} className="pt-2">
                <TeamButton href={bookingCta.href} label={team.lavi.cta} />
              </RevealText>
            </div>
          </div>

          <div className="mt-20 border-t border-ink-border pt-10 text-center md:mt-28">
            <RevealText
              as="p"
              className="mx-auto max-w-2xl text-balance font-display text-lg italic leading-snug text-ivory sm:text-xl"
            >
              {closingStatement}
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  );
}
