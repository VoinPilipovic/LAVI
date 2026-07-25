"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { businessConfig } from "@/config/business";

interface LoaderProps {
  className?: string;
  label?: string;
}

/**
 * Full-viewport luxury loading state: a thin accent line draws itself
 * beneath the wordmark. Deliberately restrained — one animated element,
 * not a spinner — matching the brand's "quiet confidence" direction.
 */
export function Loader({ className, label = "Loading" }: LoaderProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "flex min-h-[60vh] w-full flex-col items-center justify-center gap-4",
        className,
      )}
    >
      <span className="font-display text-lg uppercase tracking-eyebrow text-ivory">
        {businessConfig.logoText}
      </span>
      <div className="h-px w-24 overflow-hidden bg-ivory/10">
        <motion.div
          className="h-full w-full bg-accent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <span className="sr-only">{label}…</span>
    </div>
  );
}
