import { SectionHeading } from "@/components/shared/section-heading";
import { RevealText } from "@/components/shared/reveal-text";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { businessConfig } from "@/config/business";

export function AboutSection() {
  const { eyebrow, title, description, quickFacts } = businessConfig.about;

  return (
    <section id="about" className="border-t border-ink-border bg-ink py-24 md:py-32">
      <div className="container grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
          <ImageWithFallback
            alt={`Inside the ${businessConfig.name} atelier`}
            label="The Atelier"
            className="rounded-sm"
          />
          <div className="pointer-events-none absolute inset-0 rounded-sm ring-1 ring-inset ring-gold/10" />
        </div>

        <div className="space-y-10">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />

          <dl className="grid grid-cols-3 gap-6 border-t border-ink-border pt-8">
            {quickFacts.map((fact, index) => (
              <RevealText key={fact.label} as="div" delay={0.1 + index * 0.08}>
                <dt className="text-eyebrow text-[10px] text-ivory-dim">{fact.label}</dt>
                <dd className="mt-2 font-display text-2xl text-ivory">{fact.value}</dd>
              </RevealText>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
