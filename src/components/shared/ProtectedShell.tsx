"use client";

import type { ReactNode } from "react";

import { LoadingCard } from "@/components/shared/LoadingCard";
import { useRequireAuth } from "@/lib/hooks/use-require-auth";

export function ProtectedShell({ children }: { children: ReactNode }) {
  const { loading, user } = useRequireAuth();

  if (loading || !user) {
    return <LoadingCard title="Checking session and preparing your local ledger..." />;
  }

  return <>{children}</>;
}
