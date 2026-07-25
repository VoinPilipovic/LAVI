export type NavKey = "about" | "services" | "gallery" | "contact" | "bookNow";

export interface NavLink {
  /** Looked up against `dict.nav[key]` for the translated label — see src/locales. */
  key: NavKey;
  href: string;
}

/**
 * Primary site navigation. Every marketing section on the landing page
 * has a matching anchor id (see each section component), so these links
 * work as in-page jumps from any scroll position.
 */
export const mainNav: NavLink[] = [
  { key: "about", href: "/#about" },
  { key: "services", href: "/#services" },
  { key: "gallery", href: "/#gallery" },
  { key: "contact", href: "/#contact" },
];

/** Primary conversion action, surfaced in the navbar, hero, and CTA section. */
export const bookingCta: NavLink = {
  key: "bookNow",
  href: "/booking",
};

/** Footer link groups, separate from primary nav so they can diverge later. */
export const footerNav: NavLink[] = [...mainNav, bookingCta];
