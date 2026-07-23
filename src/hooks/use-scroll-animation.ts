"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

interface UseScrollAnimationOptions {
  /** CSS selector for the child elements to stagger within the container. */
  selector: string;
  /** Delay between each child's animation start, in seconds. */
  stagger?: number;
  /** Vertical offset (px) each child animates in from. */
  yOffset?: number;
  /** ScrollTrigger start position. */
  start?: string;
}

/**
 * Animates a group of child elements with a GSAP stagger fade-up as the
 * container scrolls into view. Built for grids (gallery, services) where
 * Framer Motion's per-item `whileInView` would fire at slightly different
 * times per item — GSAP's timeline keeps the stagger perfectly coordinated
 * from one scroll trigger.
 *
 * Respects prefers-reduced-motion by skipping the animation and setting
 * children to their final visible state immediately.
 */
export function useScrollAnimation<T extends HTMLElement>({
  selector,
  stagger = 0.1,
  yOffset = 24,
  start = "top 80%",
}: UseScrollAnimationOptions): RefObject<T | null> {
  const containerRef = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const targets = containerRef.current.querySelectorAll(selector);

    if (targets.length === 0) return;

    if (prefersReducedMotion) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: yOffset });

      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: containerRef.current,
          start,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [selector, stagger, yOffset, start, prefersReducedMotion]);

  return containerRef;
}
