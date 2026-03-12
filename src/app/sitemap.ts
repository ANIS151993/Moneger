import type { MetadataRoute } from "next";

import { brand } from "@/lib/branding/brand";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    "",
    "/login",
    "/signup",
    "/forgot-password",
    "/dashboard",
    "/income",
    "/expenses",
    "/debts",
    "/owed",
    "/banks",
    "/settings"
  ].map((path) => ({
    url: `${brand.domain}${path}`,
    lastModified: now
  }));
}
