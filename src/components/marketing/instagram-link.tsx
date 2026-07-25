"use client";

import Link from "next/link";
import { Instagram } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

interface InstagramLinkProps {
  className?: string;
  variant?: "button" | "inline";
}

export function InstagramLink({ className, variant = "button" }: InstagramLinkProps) {
  const { dict } = useLocale();
  const handle = siteConfig.links.instagram.replace(/\/$/, "").split("/").pop();

  if (variant === "inline") {
    return (
      <Link
        href={siteConfig.links.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex items-center gap-2 text-sm text-ivory-dim transition-colors hover:text-accent",
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
        "inline-flex items-center gap-2 rounded-sm border border-ink-border px-5 py-3 text-sm " +
          "text-ivory transition-colors hover:border-accent hover:text-accent",
        className,
      )}
    >
      <Instagram className="h-4 w-4" strokeWidth={1.5} />
      {dict.contact.followAlong}
    </Link>
  );
}
