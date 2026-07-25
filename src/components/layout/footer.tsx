"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { InstagramLink } from "@/components/marketing/instagram-link";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { useLocale } from "@/components/providers/locale-provider";

export function Footer() {
  const year = new Date().getFullYear();
  const { dict } = useLocale();

  return (
    <footer className="border-t border-ink-border bg-ink">
      <div className="container flex flex-col gap-10 py-16">
        <div className="flex flex-col justify-between gap-10 md:flex-row md:items-start">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-ivory-dim">{dict.footer.description}</p>
          </div>

          <nav className="flex flex-col gap-4 md:items-end">
            {footerNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-eyebrow !text-ivory-dim transition-colors hover:!text-accent"
              >
                {dict.nav[link.key]}
              </Link>
            ))}
          </nav>
        </div>

        <div className="divider-line" />

        <div className="flex flex-col-reverse items-center justify-between gap-6 text-xs text-ivory-dim/70 md:flex-row">
          <span>
            © {year} {siteConfig.name}. {dict.footer.rights}
          </span>
          <InstagramLink variant="inline" />
        </div>
      </div>
    </footer>
  );
}
