"use client";

import { SectionHeading } from "@/components/shared/section-heading";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { cn } from "@/lib/utils";
import { businessConfig } from "@/config/business";

const galleryItems = [
  { id: "chair", label: "The Chair", span: "lg:col-span-2 lg:row-span-2" },
  { id: "fade", label: "Fade In Progress", span: "" },
  { id: "tools", label: "The Tools", span: "" },
  { id: "towel", label: "Hot Towel Finish", span: "" },
  { id: "shave", label: "Straight Razor Shave", span: "lg:col-span-2" },
  { id: "space", label: "The Atelier", span: "" },
];

/**
 * Photography for each slot is not yet sourced — ImageWithFallback
 * renders a labelled placeholder until real images are added under
 * public/images/gallery and wired in with a `src`.
 */
export function GalleryGrid() {
  const gridRef = useScrollAnimation<HTMLDivElement>({
    selector: "[data-gallery-item]",
    stagger: 0.09,
  });

  return (
    <section id="gallery" className="border-t border-ink-border bg-ink py-24 md:py-32">
      <div className="container">
        <SectionHeading
          eyebrow={businessConfig.gallery.eyebrow}
          title={businessConfig.gallery.title}
          className="mb-14"
        />

        <div
          ref={gridRef}
          className="grid auto-rows-[220px] grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4"
        >
          {galleryItems.map((item) => (
            <div
              key={item.id}
              data-gallery-item
              className={cn(
                "relative overflow-hidden rounded-sm opacity-0",
                item.span,
              )}
            >
              <ImageWithFallback alt={item.label} label={item.label} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
