"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";

import { Card } from "@/components/ui/Card";
import type { MonthlyTrendPoint } from "@/types/finance";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export function IncomeExpenseLineChart({ points }: { points: MonthlyTrendPoint[] }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Trends</p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Income vs expenses</h2>
      <div className="mt-6 h-[320px]">
        {points.length === 0 ? (
          <div className="grid h-full place-items-center rounded-3xl bg-slate-50 px-6 text-center text-sm text-slate-500">
            Add income and expense records to see monthly trends here.
          </div>
        ) : (
          <Line
            data={{
              labels: points.map((item) => item.label),
              datasets: [
                {
                  label: "Income",
                  data: points.map((item) => item.income),
                  borderColor: "#16A34A",
                  backgroundColor: "rgba(22, 163, 74, 0.16)",
                  fill: true,
                  tension: 0.35
                },
                {
                  label: "Expenses",
                  data: points.map((item) => item.expenses),
                  borderColor: "#38BDF8",
                  backgroundColor: "rgba(56, 189, 248, 0.12)",
                  fill: true,
                  tension: 0.35
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
        )}
      </div>
    </Card>
  );
}
