import { businessConfig } from "@/config/business";

/**
 * Site-wide identity config. Deployment-level values (URL, OG image)
 * live here; business content (name, description, contact info) is
 * derived from config/business.ts so there is exactly one place to
 * change it when this template is adapted for a new client.
 */
export const siteConfig = {
  name: businessConfig.name,
  defaultTitle: `${businessConfig.name} — ${businessConfig.category}`,
  description: businessConfig.description,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/images/og-image.jpg",
  links: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? businessConfig.social.instagram,
  },
} as const;

export type SiteConfig = typeof siteConfig;
