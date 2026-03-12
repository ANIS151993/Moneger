import type { MetadataRoute } from "next";

import { brand } from "@/lib/branding/brand";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${brand.domain}/sitemap.xml`
  };
}
