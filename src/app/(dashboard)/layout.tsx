import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedShell } from "@/components/shared/ProtectedShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <ProtectedShell>{children}</ProtectedShell>
    </AppShell>
  );
}
