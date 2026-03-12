import { Card } from "@/components/ui/Card";

export function LoadingCard({ title = "Loading workspace" }: { title?: string }) {
  return (
    <Card className="animate-pulse">
      <div className="h-3 w-32 rounded-full bg-slate-200" />
      <div className="mt-4 h-8 w-64 rounded-full bg-slate-200" />
      <div className="mt-3 h-4 w-full rounded-full bg-slate-100" />
      <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
      <p className="mt-6 text-sm text-slate-400">{title}</p>
    </Card>
  );
}
