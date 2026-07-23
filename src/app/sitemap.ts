import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Static route list. Admin and auth routes are intentionally excluded
 * (noindex, not in sitemap) — see robots.ts. /booking/confirmation is
 * also excluded there since it's a per-booking, token-gated page with
 * no standalone content to index; /booking itself is a real,
 * publicly useful page and is listed below.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/booking"];

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
