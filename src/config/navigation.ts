export interface NavLink {
  label: string;
  href: string;
}

/**
 * Primary site navigation. Every marketing section on the landing page
 * has a matching anchor id (see each section component), so these links
 * work as in-page jumps from any scroll position.
 */
export const mainNav: NavLink[] = [
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Contact", href: "/#contact" },
];

/** Primary conversion action, surfaced in the navbar, hero, and CTA section. */
export const bookingCta: NavLink = {
  label: "Book Now",
  href: "/booking",
};

/** Footer link groups, separate from primary nav so they can diverge later. */
export const footerNav: NavLink[] = [
  ...mainNav,
  { label: "Book Now", href: "/booking" },
];
