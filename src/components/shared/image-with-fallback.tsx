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
}

/**
 * Renders a Next Image when `src` is provided and loads successfully;
 * otherwise renders a styled placeholder (gold-on-ink gradient with a
 * mark and label) so the layout never breaks while real salon
 * photography is being sourced ahead of launch.
 */
export function ImageWithFallback({
  src,
  alt,
  label,
  className,
  fill = true,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "relative flex h-full w-full items-center justify-center overflow-hidden",
          "bg-[radial-gradient(circle_at_30%_20%,rgba(200,164,100,0.16),transparent_60%),linear-gradient(160deg,#151517,#0B0B0C)]",
          className,
        )}
      >
        <div className="flex flex-col items-center gap-3 text-gold/70">
          <Scissors className="h-6 w-6" strokeWidth={1.25} />
          {label ? (
            <span className="text-eyebrow text-[10px] text-gold/60">{label}</span>
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
