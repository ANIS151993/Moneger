import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "export",
  trailingSlash: true,
  outputFileTracingRoot: process.cwd(),
  experimental: {
    optimizePackageImports: ["date-fns", "react-hook-form"]
  }
};

export default nextConfig;
