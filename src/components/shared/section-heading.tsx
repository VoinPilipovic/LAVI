import { cn } from "@/lib/utils";
import { RevealText } from "@/components/shared/reveal-text";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * The recurring section header pattern across the landing page: a small
 * tracked-out gold eyebrow label, a display-serif headline, and optional
 * supporting copy. Encodes the eyebrow as a genuine label (what the
 * section is) rather than decoration.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl space-y-4",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <RevealText as="p" className="text-eyebrow">
        {eyebrow}
      </RevealText>
      <RevealText
        as="h2"
        delay={0.08}
        className="text-balance font-display text-3xl leading-[1.15] text-ivory sm:text-4xl md:text-5xl"
      >
        {title}
      </RevealText>
      {description ? (
        <RevealText as="p" delay={0.16} className="text-pretty text-base text-ivory-dim">
          {description}
        </RevealText>
      ) : null}
    </div>
  );
}
