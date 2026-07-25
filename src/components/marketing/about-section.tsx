"use client";

import { RevealText } from "@/components/shared/reveal-text";
import { LineReveal } from "@/components/shared/line-reveal";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { useImageReveal } from "@/hooks/use-image-reveal";
import { useLocale } from "@/components/providers/locale-provider";

/**
 * A charcoal beat rather than a stark white one — dark like the rest of
 * the film, just one shade up (ink-elevated) from the sections around
 * it, so the hero's darkness carries through instead of cutting to a
 * bright page. Three short philosophy statements stand in for the old
 * founding-year/chairs stat grid — timeless brand language rather than
 * numbers that will need updating.
 */
export function AboutSection() {
  const { dict } = useLocale();
  const { eyebrow, title, description, philosophy, imageAlt, imageLabel } = dict.about;
  const imageRef = useImageReveal<HTMLDivElement>({
    clipFrom: "left",
    scaleFrom: 1.09,
    parallax: 6,
  });

  return (
    <section id="about" className="border-t border-ink-border bg-ink-elevated py-24 md:py-32">
      <div className="container grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
        <div ref={imageRef} className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
          <ImageWithFallback alt={imageAlt} label={imageLabel} />
          <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-ivory/10" />
        </div>

        <div className="space-y-10">
          <div className="max-w-xl space-y-5">
            <RevealText as="p" className="text-eyebrow">
              {eyebrow}
            </RevealText>

            <LineReveal
              as="h2"
              text={title}
              className="text-balance font-display text-3xl leading-[1.15] text-ivory sm:text-4xl md:text-5xl"
            />

            <RevealText as="p" delay={0.15} className="text-pretty text-base text-ivory-dim">
              {description}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 gap-6 border-t border-ink-border pt-8 sm:grid-cols-3">
            {philosophy.map((line, index) => (
              <RevealText
                key={line}
                as="p"
                delay={0.25 + index * 0.08}
                className="font-display text-lg italic leading-snug text-ivory sm:text-xl"
              >
                {line}
              </RevealText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
