import Link from "next/link";
import { Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface InstagramLinkProps {
  className?: string;
  variant?: "button" | "inline";
}

export function InstagramLink({ className, variant = "button" }: InstagramLinkProps) {
  const handle = siteConfig.links.instagram.replace(/\/$/, "").split("/").pop();

  if (variant === "inline") {
    return (
      <Link
        href={siteConfig.links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 text-sm text-ivory-dim transition-colors hover:text-gold",
          className,
        )}
      >
        <Instagram className="h-4 w-4" strokeWidth={1.5} />
        @{handle}
      </Link>
    );
  }

  return (
    <Link
      href={siteConfig.links.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center gap-2 rounded-sm border border-gold/30 px-5 py-3 text-sm " +
          "text-ivory transition-colors hover:border-gold hover:text-gold",
        className,
      )}
    >
      <Instagram className="h-4 w-4" strokeWidth={1.5} />
      Follow along
    </Link>
  );
}
