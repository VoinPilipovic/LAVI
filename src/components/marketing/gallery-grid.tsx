"use client";

import { useCallback, useState } from "react";
import { Expand } from "lucide-react";
import { RevealText } from "@/components/shared/reveal-text";
import { LineReveal } from "@/components/shared/line-reveal";
import { ImageWithFallback } from "@/components/shared/image-with-fallback";
import { GalleryLightbox } from "@/components/marketing/gallery-lightbox";
import { useImageReveal } from "@/hooks/use-image-reveal";
import { useLocale } from "@/components/providers/locale-provider";

/**
 * The real portfolio shoot, in the order the salon wants it presented.
 * Labels/alt text live in dict.gallery.frames (same order, by index)
 * since they're language content, not layout — swapping in a new photo
 * later is a one-line change here plus one translated entry per locale.
 */
const GALLERY_IMAGES = [
  { id: "mens-fade-classic", src: "/images/gallery/gallery-mens-fade-classic.jpg" },
  { id: "womens-brunette-long", src: "/images/gallery/gallery-womens-brunette-long.jpg" },
  { id: "womens-blonde", src: "/images/gallery/gallery-womens-blonde.jpg" },
  { id: "womens-bob", src: "/images/gallery/gallery-womens-bob.jpg" },
  { id: "womens-balayage", src: "/images/gallery/gallery-womens-balayage.jpg" },
  { id: "mens-design-fade", src: "/images/gallery/gallery-mens-design-fade.jpg" },
  { id: "mens-crop-fade", src: "/images/gallery/gallery-mens-crop-fade.jpg" },
  { id: "mens-curly-fade", src: "/images/gallery/gallery-mens-curly-fade.jpg" },
  { id: "mens-skin-fade-back", src: "/images/gallery/gallery-mens-skin-fade-back.jpg" },
] as const;

interface GalleryTileProps {
  src: string;
  label: string;
  alt: string;
  number: string;
  delay: number;
  onOpen: () => void;
}

function GalleryTile({ src, label, alt, number, delay, onOpen }: GalleryTileProps) {
  const ref = useImageReveal<HTMLButtonElement>({
    clipFrom: "bottom",
    scaleFrom: 1.08,
    parallax: 4,
    delay,
  });

  return (
    <figure>
      <button
        ref={ref}
        type="button"
        onClick={onOpen}
        className="group relative block aspect-[3/4] w-full overflow-hidden text-left"
      >
        <ImageWithFallback
          src={src}
          alt={alt}
          label={label}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/50" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <Expand className="h-6 w-6 text-ivory" strokeWidth={1.25} />
        </div>
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-ivory/10" />
      </button>
      <figcaption className="mt-3 flex items-baseline gap-3">
        <span className="font-display text-xs text-ivory-dim/50">{number}</span>
        <span className="text-eyebrow !text-[10px]">{label}</span>
      </figcaption>
    </figure>
  );
}

export function GalleryGrid() {
  const { dict } = useLocale();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleNavigate = useCallback((direction: 1 | -1) => {
    setOpenIndex((prev) => {
      if (prev === null) return prev;
      return (prev + direction + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    });
  }, []);

  const lightboxImages = GALLERY_IMAGES.map((image, index) => ({
    src: image.src,
    alt: dict.gallery.frames[index]?.alt ?? "",
    label: dict.gallery.frames[index]?.label ?? "",
  }));

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

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
          {GALLERY_IMAGES.map((image, index) => (
            <GalleryTile
              key={image.id}
              src={image.src}
              label={dict.gallery.frames[index]?.label ?? ""}
              alt={dict.gallery.frames[index]?.alt ?? ""}
              number={String(index + 1).padStart(2, "0")}
              delay={(index % 3) * 0.08}
              onOpen={() => setOpenIndex(index)}
            />
          ))}
        </div>
      </div>

      <GalleryLightbox
        images={lightboxImages}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={handleNavigate}
      />
    </section>
  );
}
