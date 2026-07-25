"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useLocale } from "@/components/providers/locale-provider";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Tables } from "@/types/supabase";

interface ServicesListProps {
  services: Tables<"services">[];
}

/**
 * Editorial numbered list rather than generic rounded cards: large
 * display numbering carries the visual weight, a thin line draws in
 * under each row on scroll, and the only interactive color is the
 * restrained blue underline that grows in on hover/focus — usable on
 * touch since it's decoration on a non-interactive row, not a control.
 */
export function ServicesList({ services }: ServicesListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { dict } = useLocale();

  useEffect(() => {
    if (!listRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const rows = listRef.current.querySelectorAll<HTMLElement>("[data-service-row]");
    const lines = listRef.current.querySelectorAll<HTMLElement>("[data-service-line]");

    if (rows.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(rows, { opacity: 1, y: 0 });
      gsap.set(lines, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(rows, { opacity: 0, y: 22 });
      gsap.set(lines, { scaleX: 0, transformOrigin: "left" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: listRef.current,
          start: "top 82%",
        },
      });

      rows.forEach((row, index) => {
        const line = lines[index];
        tl.to(row, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, index * 0.12);
        if (line) {
          tl.to(line, { scaleX: 1, duration: 0.8, ease: "power2.out" }, index * 0.12);
        }
      });
    }, listRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, services.length]);

  if (services.length === 0) {
    return (
      <p className="mt-14 border-y border-ink-border py-10 text-center text-sm text-ivory-dim">
        {dict.services.emptyState}
      </p>
    );
  }

  return (
    <div ref={listRef} className="mt-14 border-t border-ink-border">
      {services.map((service, index) => (
        <div key={service.id} data-service-row className="group relative">
          <span
            data-service-line
            aria-hidden
            className="absolute left-0 top-0 h-px w-full bg-ink-border"
          />
          <span
            data-service-line
            aria-hidden
            className="absolute bottom-0 left-0 h-px w-0 bg-accent/70 transition-[width] duration-500 ease-out group-hover:w-full group-focus-within:w-full"
          />

          <div className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="flex items-start gap-6">
              <span className="font-display text-sm text-ivory-dim/60 sm:text-base">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-xl text-ivory sm:text-2xl">{service.name}</h3>
                {service.description ? (
                  <p className="mt-1 max-w-md text-sm text-ivory-dim">{service.description}</p>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 items-baseline gap-5 pl-11 sm:pl-0">
              <span className="text-sm text-ivory-dim">
                {formatDuration(service.duration_minutes)}
              </span>
              <span className="font-display text-xl text-ivory">
                {formatPrice(service.price)}
              </span>
            </div>
          </div>
        </div>
      ))}
      <div className="h-px w-full bg-ink-border" />
    </div>
  );
}
