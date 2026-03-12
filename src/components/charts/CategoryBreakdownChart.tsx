"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { Card } from "@/components/ui/Card";
import type { CategoryTotal } from "@/types/finance";

ChartJS.register(ArcElement, Tooltip, Legend);

const palette = ["#16A34A", "#38BDF8", "#0F172A", "#22C55E", "#0EA5E9", "#475569"];

export function CategoryBreakdownChart({ items }: { items: CategoryTotal[] }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Category mix</p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Expense breakdown</h2>
      <div className="mt-6 h-[320px]">
        <Doughnut
          data={{
            labels: items.map((item) => item.category),
            datasets: [
              {
                data: items.map((item) => item.amount),
                backgroundColor: palette
              }
            ]
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
              legend: {
                position: "bottom"
              }
            }
          }}
        />
      </div>
    </Card>
  );
}
