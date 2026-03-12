import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Poppins } from "next/font/google";

import { AppProviders } from "@/components/providers/AppProviders";
import { brand } from "@/lib/branding/brand";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins"
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains"
});

export const metadata: Metadata = {
  metadataBase: new URL(brand.domain),
  title: {
    default: brand.title,
    template: `%s | ${brand.name}`
  },
  description: brand.description,
  applicationName: brand.name,
  keywords: [
    "money management",
    "privacy first finance app",
    "local first finance",
    "offline budgeting",
    "debt tracking",
    "income tracking"
  ],
  openGraph: {
    title: brand.title,
    description: brand.description,
    url: brand.domain,
    siteName: brand.name,
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: brand.title,
    description: brand.description
  },
  icons: {
    icon: "/icons/icon.svg",
    shortcut: "/icons/icon.svg",
    apple: "/icons/icon.svg"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  themeColor: "#16A34A",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} ${jetBrainsMono.variable} font-sans`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
