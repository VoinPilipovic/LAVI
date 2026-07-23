"use client";

import { motion } from "framer-motion";
import { type ElementType, type ReactNode } from "react";
import { fadeUp, defaultViewport } from "@/styles/animations";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface RevealTextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
}

/**
 * Fades and lifts its children into place the first time they scroll
 * into view. The default building block for section headings, copy
 * blocks, and standalone elements across the marketing site.
 *
 * Renders children unanimated (but still visible) when the visitor
 * prefers reduced motion.
 */
export function RevealText({
  children,
  as: Wrapper = "div",
  className,
  delay = 0,
}: RevealTextProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <Wrapper className={cn(className)}>{children}</Wrapper>;
  }

  const MotionWrapper = motion(Wrapper);

  return (
    <MotionWrapper
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      variants={fadeUp}
      transition={{ delay }}
    >
      {children}
    </MotionWrapper>
  );
}
