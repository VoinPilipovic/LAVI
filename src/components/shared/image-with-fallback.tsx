"use client";

import { useState } from "react";
import Image from "next/image";
import { Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  label?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  /** Placeholder color mood. "accent" is reserved for the one deliberate
   * blue moment (e.g. the barber pole); every other placeholder should
   * stay neutral graphite/chrome so the accent doesn't get diluted. */
  tone?: "neutral" | "accent";
}

/**
 * Renders a Next Image when `src` is provided and loads successfully;
 * otherwise renders a styled placeholder (graphite gradient with a mark
 * and label) so the layout never breaks while real salon photography is
 * being sourced ahead of launch.
 */
export function ImageWithFallback({
  src,
  alt,
  label,
  className,
  fill = true,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  tone = "neutral",
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden",
          tone === "accent"
            ? "bg-[radial-gradient(circle_at_30%_20%,rgba(96,156,199,0.18),transparent_60%),linear-gradient(160deg,#141517,#0A0A0B)]"
            : "bg-[radial-gradient(circle_at_30%_20%,rgba(240,242,245,0.05),transparent_60%),linear-gradient(160deg,#18191b,#0A0A0B)]",
          className,
        )}
      >
        <div
          className={cn(
            "flex flex-col items-center gap-3",
            tone === "accent" ? "text-accent/80" : "text-ivory-dim/70",
          )}
        >
          <Scissors className="h-6 w-6" strokeWidth={1.25} />
          {label ? (
            <span
              className={cn(
                "text-eyebrow text-[10px]",
                tone === "accent" ? "!text-accent/70" : "!text-ivory-dim/60",
              )}
            >
              {label}
            </span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes}
      priority={priority}
      onError={() => setErrored(true)}
      className={cn("object-cover", className)}
    />
  );
}
