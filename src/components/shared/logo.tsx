import Link from "next/link";
import { cn } from "@/lib/utils";
import { businessConfig } from "@/config/business";

interface LogoProps {
  className?: string;
  href?: string;
}

/**
 * LAVI wordmark. Deliberately typographic rather than an icon mark — the
 * brand's signature is the tracked-out display serif itself, not a logo
 * graphic. Reused in the navbar, footer, and auth layout.
 */
export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "font-display text-2xl uppercase tracking-eyebrow text-ivory transition-colors " +
          "hover:text-gold",
        className,
      )}
    >
      {businessConfig.logoText}
    </Link>
  );
}
