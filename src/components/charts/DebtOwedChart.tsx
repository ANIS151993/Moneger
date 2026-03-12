"use client";

import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { Card } from "@/components/ui/Card";

ChartJS.register(ArcElement, Tooltip, Legend);

export function DebtOwedChart({ debt, owed }: { debt: number; owed: number }) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Liabilities</p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">Debt vs money owed</h2>
      <div className="mt-6 h-[320px]">
        {debt === 0 && owed === 0 ? (
          <div className="grid h-full place-items-center rounded-3xl bg-slate-50 px-6 text-center text-sm text-slate-500">
            Add debt or owed records to compare liabilities here.
          </div>
        ) : (
          <Doughnut
            data={{
              labels: ["Debt", "Owed to you"],
              datasets: [
                {
                  data: [debt, owed],
                  backgroundColor: ["#0F172A", "#16A34A"]
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
