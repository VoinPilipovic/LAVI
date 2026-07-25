"use client";

import { locales } from "@/config/i18n";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * Minimal text-based language selector — no flags, no dropdown chrome,
 * consistent with the site's restrained typographic system. Visually
 * just three tracked-caps labels separated by hairline slashes, active
 * one picked out in the accent blue.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, dict, setLocale } = useLocale();

  return (
    <div
      role="group"
      aria-label={dict.nav.language}
      className={cn("flex items-center gap-2", className)}
    >
      {locales.map((option, index) => (
        <div key={option.code} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden className="text-[10px] text-ivory-dim/30">
              /
            </span>
          ) : null}
          <button
            type="button"
            aria-pressed={locale === option.code}
            onClick={() => setLocale(option.code)}
            className={cn(
              "text-eyebrow !text-[10px] p-2 transition-colors -m-2",
              locale === option.code ? "!text-accent" : "!text-ivory-dim hover:!text-ivory",
            )}
          >
            {option.label}
          </button>
        </div>
      ))}
    </div>
  );
}
