"use client";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { ServiceWorkerRegistration } from "@/components/shared/ServiceWorkerRegistration";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ServiceWorkerRegistration />
        {children}
      </LanguageProvider>
    </AuthProvider>
  );
}
