"use client";

import { AuthProvider } from "@/components/providers/AuthProvider";
import { ServiceWorkerRegistration } from "@/components/shared/ServiceWorkerRegistration";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ServiceWorkerRegistration />
      {children}
    </AuthProvider>
  );
}
