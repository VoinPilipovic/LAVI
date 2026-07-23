"use client";

import { Scissors } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Tables } from "@/types/supabase";

interface ServicesListProps {
  services: Tables<"services">[];
}

/**
 * Pure rendering + scroll animation, no data fetching — the parent
 * (services-preview.tsx) is a Server Component that fetches from
 * Supabase and passes the result down, since GSAP/ScrollTrigger needs
 * a browser environment and can't run server-side.
 */
export function ServicesList({ services }: ServicesListProps) {
  const listRef = useScrollAnimation<HTMLDivElement>({
    selector: "[data-service-row]",
    stagger: 0.08,
  });

  if (services.length === 0) {
    return (
      <p className="mt-14 border-y border-ink-border py-10 text-center text-sm text-ivory-dim">
        Services are being updated — check back shortly.
      </p>
    );
  }

  return (
    <div ref={listRef} className="mt-14 divide-y divide-ink-border border-y border-ink-border">
      {services.map((service) => (
        <div
          key={service.id}
          data-service-row
          className="group flex flex-col gap-3 py-6 opacity-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-7"
        >
          <div className="flex items-start gap-4">
            <Scissors
              className="mt-1 h-4 w-4 shrink-0 text-gold/50 transition-colors group-hover:text-gold"
              strokeWidth={1.25}
            />
            <div>
              <h3 className="font-display text-xl text-ivory sm:text-2xl">{service.name}</h3>
              {service.description ? (
                <p className="mt-1 max-w-md text-sm text-ivory-dim">{service.description}</p>
              ) : null}
            </div>
          </div>

          <div className="flex shrink-0 items-baseline gap-4 pl-8 sm:pl-0">
            <span className="text-sm text-ivory-dim">
              {formatDuration(service.duration_minutes)}
            </span>
            <span className="font-display text-xl text-gold">
              {formatPrice(service.price)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
