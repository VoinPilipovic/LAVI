import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}

/**
 * Builds a Next.js Metadata object for a given page, falling back to the
 * site-wide defaults in config/site.ts. Centralizing this means every
 * page gets consistent OpenGraph/Twitter tags without repeating them.
 */
export function buildMetadata({
  title,
  description,
  path = "",
  noIndex = false,
}: BuildMetadataOptions = {}): Metadata {
  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
  const resolvedDescription = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: [siteConfig.ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
