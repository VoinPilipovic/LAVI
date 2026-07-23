import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving conflicts (e.g. "p-2 p-4" -> "p-4").
 * Standard shadcn/ui utility — used by every component in the design system.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price stored in whole currency units (e.g. euros) for display.
 * Kept locale-aware since the salon may serve a non-English-speaking market.
 */
export function formatPrice(amount: number, currency = "EUR", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats minutes as a human-readable duration, e.g. 45 -> "45 min",
 * 90 -> "1h 30min". Used by service cards and the booking summary.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}min`;
}

/**
 * Formats a Date as a readable day + date string, e.g. "Tue, Jul 22".
 * Shared by the booking calendar and admin appointment lists.
 */
export function formatDate(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Formats a Date as a 24-hour time string, e.g. "14:30".
 */
export function formatTime(date: Date, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Type-safe delay helper, occasionally useful for orchestrating
 * sequenced UI states (e.g. loader minimum display time).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
