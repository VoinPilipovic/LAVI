"use client";

import { type ElementType } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { defaultViewport } from "@/styles/animations";
import { cn } from "@/lib/utils";

interface LineRevealProps {
  /** The heading text. Split into words and masked-revealed one at a time —
   * distinct from RevealText's whole-block fade, used for section
   * headlines so consecutive sections don't repeat the same motion. */
  text: string;
  as?: ElementType;
  className?: string;
  wordClassName?: string;
  delay?: number;
  /** Seconds between each word's reveal. */
  stagger?: number;
}

/**
 * Reveals a heading word-by-word, each word sliding up out of an
 * overflow-hidden mask rather than simply fading in place. Cheaper and
 * more reliable across browsers than animating clip-path directly, but
 * reads the same way: the text looks like it's being uncovered, not
 * faded on.
 */
export function LineReveal({
  text,
  as: Wrapper = "h2",
  className,
  wordClassName,
  delay = 0,
  stagger = 0.06,
}: LineRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const words = text.split(" ");

  if (prefersReducedMotion) {
    return <Wrapper className={className}>{text}</Wrapper>;
  }

  return (
    <Wrapper className={cn("flex flex-wrap", className)}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="mr-[0.28em] overflow-hidden py-1 last:mr-0">
          <motion.span
            className={cn("inline-block", wordClassName)}
            initial={{ y: "115%" }}
            whileInView={{ y: "0%" }}
            viewport={defaultViewport}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + index * stagger,
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Wrapper>
  );
}
