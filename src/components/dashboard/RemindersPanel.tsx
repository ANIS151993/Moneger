"use client";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { relativeDaysFromNow } from "@/lib/utils/date";
import { formatCurrency } from "@/lib/utils/finance";
import type { ReminderItem } from "@/types/finance";

export function RemindersPanel({ reminders }: { reminders: ReminderItem[] }) {
  const { t } = useI18n();

  return (
    <Card>
      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t("dashboard.remindersEyebrow")}</p>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">{t("dashboard.remindersTitle")}</h2>
      <div className="mt-6 space-y-4">
        {reminders.length === 0 ? (
          <div className="rounded-3xl bg-emerald-50 px-4 py-5 text-sm text-emerald-700">
            {t("dashboard.remindersEmpty")}
          </div>
        ) : (
          reminders.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-100 bg-white px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-slate-900">{t(`options.reminderTitle.${item.type}`)}</p>
                    <Badge tone={item.severity === "overdue" ? "danger" : "warning"}>
                      {t(`options.reminderSeverity.${item.severity}`)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatCurrency(item.amount, item.currency)}</p>
                  <p className="mt-1 text-xs text-slate-400">{relativeDaysFromNow(item.dueDate)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
