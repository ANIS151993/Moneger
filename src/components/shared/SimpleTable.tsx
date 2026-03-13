import type { ReactNode } from "react";

import { Card } from "@/components/ui/Card";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
}

export function SimpleTable<T>({
  title,
  description,
  columns,
  rows
}: {
  title: string;
  description: string;
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="divide-y divide-slate-100 md:hidden">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-3 bg-white/80 px-4 py-4">
            {columns.map((column) => (
              <div key={column.key} className="grid gap-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">{column.header}</p>
                <div className="text-sm text-slate-700">{column.render(row)}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-100 text-start">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white/80">
            {rows.map((row, index) => (
              <tr key={index} className="align-top">
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 text-sm text-slate-700">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
