import { Card } from "@/components/ui/Card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-slate-200/80 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.18),_transparent_30%),linear-gradient(145deg,rgba(255,255,255,0.96),rgba(236,253,245,0.82))]">
        <div className="animate-pulse">
          <div className="h-3 w-28 rounded-full bg-emerald-100" />
          <div className="mt-4 h-9 w-72 rounded-full bg-slate-200" />
          <div className="mt-4 h-4 w-full rounded-full bg-slate-100" />
          <div className="mt-2 h-4 w-4/5 rounded-full bg-slate-100" />
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            key={index}
            className="animate-pulse border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.94),rgba(241,245,249,0.82))]"
          >
            <div className="h-3 w-20 rounded-full bg-slate-200" />
            <div className="mt-4 h-8 w-32 rounded-full bg-slate-200" />
            <div className="mt-4 h-3 w-24 rounded-full bg-slate-100" />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card className="animate-pulse border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(236,253,245,0.78))]">
          <div className="h-3 w-32 rounded-full bg-slate-200" />
          <div className="mt-5 h-52 rounded-[24px] bg-slate-100" />
        </Card>
        <Card className="animate-pulse border-white/90 bg-[linear-gradient(145deg,rgba(15,23,42,0.96),rgba(15,118,110,0.88))]">
          <div className="h-3 w-24 rounded-full bg-white/15" />
          <div className="mt-5 h-44 rounded-[24px] bg-white/10" />
        </Card>
      </div>
    </div>
  );
}
