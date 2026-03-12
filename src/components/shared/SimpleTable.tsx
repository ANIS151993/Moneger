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
      <div className="border-b border-slate-100 px-6 py-5">
        <h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left">
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
