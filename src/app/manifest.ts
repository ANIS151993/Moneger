import type { MetadataRoute } from "next";

import { brand } from "@/lib/branding/brand";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: brand.title,
    short_name: brand.name,
    description: brand.description,
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#F8FBFF",
    theme_color: "#16A34A",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      },
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any"
      }
    ]
  };
}
