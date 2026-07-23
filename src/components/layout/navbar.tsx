"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { mainNav, bookingCta } from "@/config/navigation";
import { cn } from "@/lib/utils";

/**
 * Fixed top navbar. Transitions from transparent (over the hero) to a
 * solid ink background with a hairline bottom border once the visitor
 * scrolls — keeps the hero visual uninterrupted while staying legible
 * once content scrolls beneath it.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
          scrolled ? "border-b border-ink-border bg-ink/95 backdrop-blur-sm" : "bg-transparent",
        )}
      >
        <div className="container flex h-20 items-center justify-between">
          <Logo />

          <nav className="hidden items-center gap-10 md:flex">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-eyebrow !text-ivory-dim transition-colors hover:!text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button asChild>
              <Link href={bookingCta.href}>{bookingCta.label}</Link>
            </Button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="p-2 text-ivory md:hidden"
          >
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <MobileMenu open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
