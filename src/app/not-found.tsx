import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          The route you requested does not exist in this Moneger workspace.
        </p>
        <div className="mt-6">
          <Link href="/">
            <Button>Return home</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
