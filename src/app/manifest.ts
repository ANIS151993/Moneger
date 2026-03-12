import type { MetadataRoute } from "next";

import { brand } from "@/lib/branding/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.title,
    short_name: brand.name,
    description: brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F8FBFF",
    theme_color: "#16A34A",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      },
      {
        src: "/icons/maskable-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable"
      }
    ]
  };
}
