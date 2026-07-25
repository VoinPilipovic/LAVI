"use client";

import { RevealText } from "@/components/shared/reveal-text";
import { LineReveal } from "@/components/shared/line-reveal";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { useImageReveal } from "@/hooks/use-image-reveal";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";
import type { ClipDirection } from "@/hooks/use-image-reveal";

interface StoryFrame {
  id: string;
  number: string;
  /** Grid placement on lg+; frames stack full-width in document order below lg. */
  gridClassName: string;
  aspectClassName: string;
  clipFrom: ClipDirection;
  scaleFrom: number;
  parallax: number;
  tone?: "neutral" | "accent";
}

/**
 * Five film shots telling the salon's story top to bottom: an
 * establishing wide shot, a detail entering off-axis, credentials as
 * proof of craft, the barber pole as the one accent-blue photo moment,
 * and a closing wide working shot. Swapping in real photography later
 * is a one-line change per frame (set `src` on ImageWithFallback) —
 * the asymmetric grid and reveal choreography don't need to move.
 *
 * Labels/alt text live in dict.gallery.frames (same order, by index)
 * since they're language content, not layout.
 */
const STORY_FRAMES: StoryFrame[] = [
  {
    id: "salon",
    number: "01",
    gridClassName: "lg:col-start-1 lg:col-span-7 lg:row-start-1",
    aspectClassName: "aspect-[4/5]",
    clipFrom: "bottom",
    scaleFrom: 1.1,
    parallax: 8,
  },
  {
    id: "chair",
    number: "02",
    gridClassName: "lg:col-start-8 lg:col-span-5 lg:row-start-1 lg:mt-20",
    aspectClassName: "aspect-[3/4]",
    clipFrom: "right",
    scaleFrom: 1.06,
    parallax: -6,
  },
  {
    id: "credentials",
    number: "03",
    gridClassName: "lg:col-start-8 lg:col-span-5 lg:row-start-2 lg:mt-10",
    aspectClassName: "aspect-[4/3]",
    clipFrom: "top",
    scaleFrom: 1.08,
    parallax: 5,
  },
  {
    id: "pole",
    number: "04",
    gridClassName: "lg:col-start-1 lg:col-span-3 lg:row-start-2 lg:-mt-6",
    aspectClassName: "aspect-[3/5]",
    clipFrom: "bottom",
    scaleFrom: 1.1,
    parallax: 10,
    tone: "accent",
  },
  {
    id: "atelier",
    number: "05",
    gridClassName: "lg:col-start-4 lg:col-span-9 lg:row-start-2 lg:mt-24",
    aspectClassName: "aspect-[16/9]",
    clipFrom: "left",
    scaleFrom: 1.07,
    parallax: -8,
  },
];

function StoryImage({
  frame,
  label,
  alt,
  delay,
}: {
  frame: StoryFrame;
  label: string;
  alt: string;
  delay: number;
}) {
  const ref = useImageReveal<HTMLDivElement>({
    clipFrom: frame.clipFrom,
    scaleFrom: frame.scaleFrom,
    parallax: frame.parallax,
    delay,
  });

  return (
    <figure className={cn("relative", frame.gridClassName)}>
      <div ref={ref} className={cn("relative w-full overflow-hidden rounded-sm", frame.aspectClassName)}>
        <ImageWithFallback alt={alt} label={label} tone={frame.tone} />
      </div>
      <figcaption className="mt-3 flex items-baseline gap-3">
        <span className="font-display text-xs text-ivory-dim/50">{frame.number}</span>
        <span className="text-eyebrow !text-[10px]">{label}</span>
      </figcaption>
    </figure>
  );
}

export function GalleryGrid() {
  const { dict } = useLocale();

  return (
    <section id="gallery" className="border-t border-ink-border bg-ink py-24 md:py-32">
      <div className="container">
        <div className="mb-16 max-w-2xl space-y-4">
          <RevealText as="p" className="text-eyebrow">
            {dict.gallery.eyebrow}
          </RevealText>
          <LineReveal
            as="h2"
            text={dict.gallery.title}
            className="text-balance font-display text-3xl leading-[1.15] text-ivory sm:text-4xl md:text-5xl"
          />
        </div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          {STORY_FRAMES.map((frame, index) => (
            <StoryImage
              key={frame.id}
              frame={frame}
              label={dict.gallery.frames[index]?.label ?? ""}
              alt={dict.gallery.frames[index]?.alt ?? ""}
              delay={index * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
