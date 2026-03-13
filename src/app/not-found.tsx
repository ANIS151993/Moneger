"use client";

import Link from "next/link";

import { useI18n } from "@/components/providers/LanguageProvider";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <Card className="max-w-xl text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{t("notFound.title")}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">{t("notFound.description")}</p>
        <div className="mt-6">
          <Link className={buttonClassName({})} href="/">
            {t("notFound.returnHome")}
          </Link>
        </div>
      </Card>
    </main>
  );
}
