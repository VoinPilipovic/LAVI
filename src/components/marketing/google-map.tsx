import { businessConfig } from "@/config/business";

const embedUrl = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL;

/**
 * Renders the salon's location via a standard Google Maps iframe embed
 * (no API key or JS SDK required for the beta). Falls back to a plain
 * text notice if NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL isn't set, so local
 * development never shows a broken iframe.
 */
export function GoogleMap() {
  if (!embedUrl) {
    return (
      <div className="flex aspect-[4/3] w-full items-center justify-center rounded-sm border border-ink-border bg-ink-elevated text-sm text-ivory-dim">
        Map unavailable — set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL to enable.
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm ring-1 ring-inset ring-gold/10">
      <iframe
        src={embedUrl}
        title={`${businessConfig.name} location on Google Maps`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full grayscale invert-[0.92] contrast-[1.05]"
      />
    </div>
  );
}
