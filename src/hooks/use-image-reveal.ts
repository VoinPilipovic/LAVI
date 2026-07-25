"use client";

import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

export type ClipDirection = "left" | "right" | "top" | "bottom";

interface UseImageRevealOptions {
  /** Which edge the mask opens from. */
  clipFrom?: ClipDirection;
  /** Starting scale of the image before it settles to 1 as the section scrolls through. */
  scaleFrom?: number;
  /** Vertical parallax drift in percent (e.g. 8 = image drifts 8% over the scroll range). */
  parallax?: number;
  /** Delay (seconds) before the clip-open reveal starts, for staggering multiple images in one composition. */
  delay?: number;
}

const CLIP_INSET: Record<ClipDirection, string> = {
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
  top: "inset(100% 0% 0% 0%)",
  bottom: "inset(0% 0% 100% 0%)",
};

/**
 * Attach to the OUTER overflow-hidden wrapper of an image. Applies a
 * one-time clip-path "wipe" reveal on scroll-in (the wrapper), plus a
 * continuous scale-settle and optional parallax on the image itself
 * (the wrapper's first <img>), scrubbed across the section's scroll
 * range — the two run as independent GSAP tweens so each image in a
 * composition can be given its own direction/scale/delay.
 */
export function useImageReveal<T extends HTMLElement>({
  clipFrom = "bottom",
  scaleFrom = 1.08,
  parallax = 0,
  delay = 0,
}: UseImageRevealOptions = {}): RefObject<T | null> {
  const wrapperRef = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // The direct child is either the real next/image <img> or
    // ImageWithFallback's placeholder <div> — either way it's the single
    // visual layer we want to scale/parallax independent of the wrapper's
    // clip-path reveal, so this works identically before and after real
    // salon photography replaces the placeholders.
    const img = wrapper.firstElementChild as HTMLElement | null;

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      gsap.set(wrapper, { clipPath: "inset(0% 0% 0% 0%)" });
      if (img) gsap.set(img, { scale: 1, yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(wrapper, { clipPath: CLIP_INSET[clipFrom] });
      gsap.to(wrapper, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.4,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 88%",
          end: "bottom top",
          // Bidirectional: reveals scrolling down into view, reverses
          // scrolling back up past it, replays scrolling down again —
          // rather than a one-shot that gets stuck revealed (or worse,
          // stuck on a stale trigger position) if you scroll past and back.
          toggleActions: "play reverse play reverse",
          invalidateOnRefresh: true,
        },
      });

      if (img) {
        gsap.set(img, { scale: scaleFrom, transformOrigin: "center" });
        gsap.to(img, {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        if (parallax) {
          gsap.fromTo(
            img,
            { yPercent: -parallax / 2 },
            {
              yPercent: parallax / 2,
              ease: "none",
              scrollTrigger: {
                trigger: wrapper,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      }
    }, wrapper);

    return () => ctx.revert();
  }, [clipFrom, scaleFrom, parallax, delay, prefersReducedMotion]);

  return wrapperRef;
}
