"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

let registered = false;

/**
 * Registers GSAP's ScrollTrigger plugin once per app load and keeps its
 * measurements in sync with the viewport. This does not itself implement
 * inertia/easing (no third-party smooth-scroll library is introduced in
 * the beta to keep the dependency surface small) — it establishes the
 * shared GSAP scroll context that Phase 1's scroll-reveal components
 * (`use-scroll-animation`, `reveal-text`) will register their own
 * ScrollTrigger instances against.
 *
 * Respects prefers-reduced-motion: when active, ScrollTrigger is still
 * registered (layout needs it) but consuming components are expected to
 * check `usePrefersReducedMotion` themselves before animating.
 */
export function useSmoothScroll() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }

    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { prefersReducedMotion };
}
