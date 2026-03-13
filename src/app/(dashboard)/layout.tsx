import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/AppShell";
import { ProtectedShell } from "@/components/shared/ProtectedShell";
import { RequireProfileShell } from "@/components/shared/RequireProfileShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AppShell>
      <ProtectedShell>
        <RequireProfileShell>{children}</RequireProfileShell>
      </ProtectedShell>
    </AppShell>
  );
}
