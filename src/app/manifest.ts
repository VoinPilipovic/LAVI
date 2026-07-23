import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { businessConfig } from "@/config/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.defaultTitle,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: businessConfig.theme.colors.ink,
    theme_color: businessConfig.theme.colors.ink,
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
