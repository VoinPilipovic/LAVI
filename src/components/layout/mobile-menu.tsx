"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { mainNav, bookingCta } from "@/config/navigation";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Full-screen mobile nav overlay. Kept separate from navbar.tsx so the
 * navbar itself stays a simple bar and this can own its own open/close
 * transition and focus handling.
 */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Move focus into the dialog when it opens (the close button is the
  // first focusable element and always present, unlike the staggered
  // nav links below), and let Escape close it — both are baseline
  // expectations for any full-screen modal overlay.
  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex flex-col bg-ink/98 backdrop-blur-sm md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="flex items-center justify-end px-5 pt-5">
            <button
              ref={closeButtonRef}
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-sm p-2 text-ivory transition-colors hover:text-gold"
            >
              <X className="h-6 w-6" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {mainNav.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index + 0.1, duration: 0.4 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="font-display text-3xl uppercase tracking-wide text-ivory transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * mainNav.length + 0.1, duration: 0.4 }}
              className="pt-4"
            >
              <Button asChild size="lg" onClick={onClose}>
                <Link href={bookingCta.href}>{bookingCta.label}</Link>
              </Button>
            </motion.div>
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
