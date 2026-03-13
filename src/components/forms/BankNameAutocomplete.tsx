"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";

import { useI18n } from "@/components/providers/LanguageProvider";
import { Input } from "@/components/ui/Input";
import { bankCountryCatalog } from "@/lib/constants/options";
import { getLanguageDefinition } from "@/lib/i18n/config";
import {
  googlePlacesAutocompleteEnabled,
  loadGooglePlacesLibrary
} from "@/lib/services/google-places";
import { cn } from "@/lib/utils/cn";
import type { CountryCode } from "@/types/finance";

type BankSuggestion = {
  id: string;
  label: string;
  secondaryLabel?: string;
  source: "local" | "google";
};

const MAX_SUGGESTIONS = 8;

function rankBanks(query: string, country: CountryCode) {
  const bankList = bankCountryCatalog[country].banks;
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return bankList.slice(0, MAX_SUGGESTIONS);
  }

  return [...bankList]
    .filter((bank) => bank.toLowerCase().includes(normalizedQuery))
    .sort((left, right) => {
      const leftLower = left.toLowerCase();
      const rightLower = right.toLowerCase();
      const leftStartsWith = leftLower.startsWith(normalizedQuery) ? 1 : 0;
      const rightStartsWith = rightLower.startsWith(normalizedQuery) ? 1 : 0;

      if (leftStartsWith !== rightStartsWith) {
        return rightStartsWith - leftStartsWith;
      }

      return left.localeCompare(right);
    })
    .slice(0, MAX_SUGGESTIONS);
}

function buildLocalSuggestions(query: string, country: CountryCode): BankSuggestion[] {
  return rankBanks(query, country).map((bank) => ({
    id: `local_${bank}`,
    label: bank,
    source: "local" as const
  }));
}

function mergeSuggestions(localSuggestions: BankSuggestion[], googleSuggestions: BankSuggestion[]) {
  const suggestions = new Map<string, BankSuggestion>();

  for (const suggestion of [...localSuggestions, ...googleSuggestions]) {
    const key = suggestion.label.toLowerCase();

    if (!suggestions.has(key)) {
      suggestions.set(key, suggestion);
    }
  }

  return [...suggestions.values()].slice(0, MAX_SUGGESTIONS);
}

export function BankNameAutocomplete({
  country,
  value,
  onChange,
  onBlur
}: {
  country: CountryCode;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}) {
  const { language, t } = useI18n();
  const locale = getLanguageDefinition(language).locale;
  const selectedCountry = bankCountryCatalog[country];
  const deferredValue = useDeferredValue(value);
  const [suggestions, setSuggestions] = useState<BankSuggestion[]>(() => buildLocalSuggestions("", country));
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [googleAttributionVisible, setGoogleAttributionVisible] = useState(false);
  const [loadingGoogleSuggestions, setLoadingGoogleSuggestions] = useState(false);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  const googleSessionTokenRef = useRef<any>(null);

  const helperText = useMemo(() => {
    return googlePlacesAutocompleteEnabled
      ? t("bankForm.bankSearchHintGoogle", { country: selectedCountry.label })
      : t("bankForm.bankSearchHintLocal", { country: selectedCountry.label });
  }, [selectedCountry.label, t]);

  useEffect(() => {
    const query = deferredValue.trim();
    const localSuggestions = buildLocalSuggestions(query, country);
    const activeRequestId = ++requestIdRef.current;

    setSuggestions(localSuggestions);
    setGoogleAttributionVisible(false);

    if (!query || query.length < 2 || !googlePlacesAutocompleteEnabled) {
      setLoadingGoogleSuggestions(false);
      return;
    }

    let cancelled = false;

    setLoadingGoogleSuggestions(true);

    void (async () => {
      try {
        const placesLibrary = await loadGooglePlacesLibrary();

        if (!placesLibrary?.AutocompleteSuggestion || !placesLibrary?.AutocompleteSessionToken) {
          return;
        }

        googleSessionTokenRef.current ||= new placesLibrary.AutocompleteSessionToken();

        const request = {
          input: query,
          includedPrimaryTypes: ["bank"],
          includedRegionCodes: [selectedCountry.googleRegionCode],
          language: locale,
          region: selectedCountry.googleRegionCode,
          sessionToken: googleSessionTokenRef.current
        };
        const response = await placesLibrary.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        const googleSuggestions = (response?.suggestions || [])
          .map((suggestion: any) => {
            const prediction = suggestion.placePrediction;
            const text =
              prediction?.text?.toString?.() ||
              prediction?.text?.text ||
              prediction?.mainText?.text ||
              "";
            const secondaryLabel =
              prediction?.structuredFormat?.secondaryText?.text ||
              prediction?.secondaryText?.text ||
              "";

            if (!text) {
              return null;
            }

            return {
              id: prediction?.placeId || `google_${text}`,
              label: text,
              secondaryLabel,
              source: "google" as const
            };
          })
          .filter((suggestion: BankSuggestion | null): suggestion is BankSuggestion => Boolean(suggestion));

        if (cancelled || requestIdRef.current !== activeRequestId) {
          return;
        }

        setSuggestions(mergeSuggestions(localSuggestions, googleSuggestions));
        setGoogleAttributionVisible(googleSuggestions.length > 0);
      } catch {
        if (!cancelled && requestIdRef.current === activeRequestId) {
          setGoogleAttributionVisible(false);
        }
      } finally {
        if (!cancelled && requestIdRef.current === activeRequestId) {
          setLoadingGoogleSuggestions(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [country, deferredValue, locale, selectedCountry.googleRegionCode]);

  useEffect(() => {
    setSuggestions(buildLocalSuggestions("", country));
    setGoogleAttributionVisible(false);
    setLoadingGoogleSuggestions(false);
    googleSessionTokenRef.current = null;
  }, [country]);

  useEffect(() => {
    return () => {
      if (blurTimerRef.current) {
        clearTimeout(blurTimerRef.current);
      }
    };
  }, []);

  function handleSelect(suggestion: BankSuggestion) {
    onChange(suggestion.label);
    setShowSuggestions(false);
    googleSessionTokenRef.current = null;
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          autoComplete="off"
          className="pr-28"
          placeholder={t("bankForm.bankNamePlaceholder")}
          value={value}
          onBlur={() => {
            blurTimerRef.current = setTimeout(() => {
              setShowSuggestions(false);
              onBlur?.();
            }, 120);
          }}
          onChange={(event) => {
            if (blurTimerRef.current) {
              clearTimeout(blurTimerRef.current);
            }

            onChange(event.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center gap-2">
          {loadingGoogleSuggestions ? (
            <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
          ) : null}
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {country}
          </span>
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">{helperText}</p>

      {showSuggestions ? (
        <div className="absolute z-20 mt-3 w-full overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          <div className="max-h-72 overflow-y-auto p-2">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="flex w-full items-start justify-between gap-3 rounded-[18px] px-3 py-3 text-left transition hover:bg-emerald-50"
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleSelect(suggestion);
                  }}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{suggestion.label}</p>
                    {suggestion.secondaryLabel ? (
                      <p className="mt-1 truncate text-xs text-slate-500">{suggestion.secondaryLabel}</p>
                    ) : null}
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]",
                      suggestion.source === "google"
                        ? "border border-sky-200 bg-sky-50 text-sky-700"
                        : "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    )}
                  >
                    {suggestion.source === "google" ? "Google" : `Top ${country}`}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-sm text-slate-500">
                {t("bankForm.bankSearchEmpty", { country: selectedCountry.label })}
              </div>
            )}
          </div>

          {googleAttributionVisible ? (
            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2 text-right text-[11px] font-medium text-slate-500">
              Powered by Google
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
