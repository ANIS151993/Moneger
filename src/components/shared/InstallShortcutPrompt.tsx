"use client";

import { useEffect, useMemo, useState } from "react";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/Button";
import { brand } from "@/lib/branding/brand";
import { cn } from "@/lib/utils/cn";

type InstallPlatform = "ios-safari" | "desktop-safari" | "chromium" | "generic";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const INSTALLED_STORAGE_KEY = "moneger:app-installed";

function isStandaloneMode() {
  if (typeof window === "undefined") {
    return false;
  }

  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean };

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    navigatorWithStandalone.standalone === true
  );
}

function detectInstallPlatform(): InstallPlatform {
  if (typeof navigator === "undefined") {
    return "generic";
  }

  const userAgent = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/i.test(userAgent);
  const isSafari = /Safari/i.test(userAgent) && !/Chrome|CriOS|Edg|EdgiOS|FxiOS/i.test(userAgent);
  const isMacSafari = /Macintosh/i.test(userAgent) && isSafari;
  const isChromium = /Chrome|CriOS|Edg|EdgiOS/i.test(userAgent);

  if (isIos && isSafari) {
    return "ios-safari";
  }

  if (isMacSafari) {
    return "desktop-safari";
  }

  if (isChromium) {
    return "chromium";
  }

  return "generic";
}

export function InstallShortcutPrompt({
  enabled,
  hidden = false
}: {
  enabled: boolean;
  hidden?: boolean;
}) {
  const { t } = useI18n();
  const [closed, setClosed] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<InstallPlatform>("generic");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const installedFromStorage = window.localStorage.getItem(INSTALLED_STORAGE_KEY) === "true";
    const installedNow = installedFromStorage || isStandaloneMode();

    if (installedNow) {
      window.localStorage.setItem(INSTALLED_STORAGE_KEY, "true");
    }

    setInstalled(installedNow);
    setPlatform(detectInstallPlatform());

    function handleBeforeInstallPrompt(event: Event) {
      const promptEvent = event as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
    }

    function handleInstalled() {
      window.localStorage.setItem(INSTALLED_STORAGE_KEY, "true");
      setInstalled(true);
      setDeferredPrompt(null);
    }

    function handleDisplayModeChange() {
      if (isStandaloneMode()) {
        handleInstalled();
      }
    }

    const displayMode = window.matchMedia("(display-mode: standalone)");
    const legacyDisplayMode = displayMode as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
    window.addEventListener("appinstalled", handleInstalled);
    if (typeof displayMode.addEventListener === "function") {
      displayMode.addEventListener("change", handleDisplayModeChange);
    } else {
      legacyDisplayMode.addListener?.(handleDisplayModeChange);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt as EventListener);
      window.removeEventListener("appinstalled", handleInstalled);
      if (typeof displayMode.removeEventListener === "function") {
        displayMode.removeEventListener("change", handleDisplayModeChange);
      } else {
        legacyDisplayMode.removeListener?.(handleDisplayModeChange);
      }
    };
  }, []);

  const steps = useMemo(() => {
    switch (platform) {
      case "ios-safari":
        return [t("install.iosStep1"), t("install.iosStep2")];
      case "desktop-safari":
        return [t("install.desktopSafariStep1"), t("install.desktopSafariStep2")];
      case "chromium":
        return [t("install.chromiumStep1"), t("install.chromiumStep2")];
      default:
        return [t("install.chromiumStep1"), t("install.chromiumStep2")];
    }
  }, [platform, t]);

  async function handleInstall() {
    if (!deferredPrompt) {
      return;
    }

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === "accepted") {
      window.localStorage.setItem(INSTALLED_STORAGE_KEY, "true");
      setInstalled(true);
    }

    setDeferredPrompt(null);
  }

  if (!enabled || installed || closed) {
    return null;
  }

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-3 bottom-[calc(6.4rem+env(safe-area-inset-bottom))] z-[45] transition duration-300 lg:inset-x-auto lg:bottom-6 lg:right-6 lg:w-[380px]",
        hidden ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      )}
    >
      <div className="pointer-events-auto fx-card-sheen relative overflow-hidden rounded-[28px] border border-white/80 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.24),_transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.97),rgba(240,249,255,0.94)_56%,rgba(236,253,245,0.9)_100%)] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.16)] backdrop-blur">
        <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute -left-4 bottom-0 h-16 w-16 rounded-full bg-emerald-300/16 blur-3xl" />
        <button
          aria-label={t("install.later")}
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-500 transition hover:text-slate-900"
          type="button"
          onClick={() => setClosed(true)}
        >
          ×
        </button>

        <div className="relative">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
            {t("install.badge")}
          </span>
          <h3 className="mt-3 max-w-[18rem] text-lg font-semibold tracking-tight text-slate-950">
            {t("install.title", { brand: brand.name })}
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{t("install.description")}</p>

          <div className="mt-4 rounded-[22px] border border-slate-200/80 bg-white/75 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <ol className="grid gap-2 text-sm text-slate-700">
              {steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-[11px] font-semibold text-white">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {deferredPrompt ? <Button onClick={() => void handleInstall()}>{t("install.installNow")}</Button> : null}
            <Button
              className={deferredPrompt ? "" : "min-w-[8.5rem]"}
              variant={deferredPrompt ? "ghost" : "secondary"}
              onClick={() => setClosed(true)}
            >
              {t("install.later")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
