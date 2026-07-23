"use client";

import { type ReactNode } from "react";
import { useSmoothScroll } from "@/hooks/use-smooth-scroll";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Mounts the shared GSAP ScrollTrigger context once at the app root.
 * Purely a side-effect provider — it renders its children unchanged.
 * Section-level scroll animations (Phase 1 onward) each register their
 * own ScrollTrigger instances and rely on this provider having already
 * registered the plugin.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useSmoothScroll();
  return <>{children}</>;
}
