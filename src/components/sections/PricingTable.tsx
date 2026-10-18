"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { pricing } from "@/lib/content";
import {
  currencies,
  currencyForCountry,
  currencyForLanguages,
  formatPrice,
  type CurrencyCode,
  type Rates,
} from "@/lib/currency";
import { buttonPrimary, buttonSecondary } from "@/components/ui/button";
import { CurrencyPicker } from "@/components/ui/CurrencyPicker";

const STORAGE_KEY = "sfx-currency";

const isCode = (v: unknown): v is CurrencyCode => currencies.some((c) => c.code === v);

/** The currency the visitor picked before, if any. */
function readSaved(): CurrencyCode | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (isCode(saved)) return saved;
  } catch {}
  return null;
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(STORAGE_KEY, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(STORAGE_KEY, onChange);
  };
}

function saveCurrency(code: CurrencyCode) {
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {}
  window.dispatchEvent(new Event(STORAGE_KEY));
}

function rateNote(code: CurrencyCode, rates: Rates | null) {
  if (!rates) return "Prices in US dollars. Live exchange rates are unavailable right now.";
  if (code === "USD") return "Prices in US dollars.";
  if (code === "AED") return "Converted from USD at the UAE dirham's fixed peg of 3.6725, rounded.";
  const date = new Date(`${rates.date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  return `Converted from USD at the European Central Bank rate of ${date}, rounded.`;
}

/**
 * Packages grid with a display-currency picker. Server renders USD; after load the
 * currency is the visitor's saved choice, else their location (Vercel IP country),
 * else their browser region, else USD.
 */
export function PricingTable({ rates }: { rates: Rates | null }) {
  const saved = useSyncExternalStore(subscribe, readSaved, () => null);
  const [detected, setDetected] = useState<CurrencyCode | null>(null);

  useEffect(() => {
    if (!rates || saved) return;
    let cancelled = false;
    const fallback = () => currencyForLanguages(navigator.languages ?? [navigator.language]);
    fetch("/api/geo")
      .then((r) => r.json() as Promise<{ country: string | null }>)
      .then(({ country }) => !cancelled && setDetected(currencyForCountry(country) ?? fallback()))
      .catch(() => !cancelled && setDetected(fallback()));
    return () => {
      cancelled = true;
    };
  }, [rates, saved]);

  const shown = rates ? (saved ?? detected ?? "USD") : "USD";

  return (
    <div className="page-grid">
      <div className="col-span-12 mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="type-meta text-grey" aria-live="polite">
          {rateNote(shown, rates)}
        </p>
        <CurrencyPicker value={shown} onChange={saveCurrency} disabled={!rates} />
      </div>

      {/* gap-px over a line-coloured fill draws every 1px rule between cells */}
      <ul className="col-span-12 grid grid-cols-12 gap-px border border-line bg-line">
        {pricing.map((p, i) => (
          <li key={p.name} className="col-span-12 flex flex-col bg-white md:col-span-4">
            <div className="type-meta flex items-center justify-between gap-4 border-b border-line px-4 py-3 md:px-6">
              <span className="text-grey">{String(i + 1).padStart(2, "0")}</span>
              {p.popular && <span>Most Popular</span>}
            </div>

            <div className="px-4 pt-8 md:px-6">
              <h3 className="type-h3">{p.name}</h3>
              <p className="mt-2">
                <span className="type-h3">{formatPrice(p.priceUsd, shown, rates)}</span>
                <span className="type-meta ml-2 text-grey">{p.per}</span>
              </p>
            </div>

            <ul className="mt-8 border-t border-line">
              {p.features.map((f) => (
                <li key={f} className="type-body border-b border-line px-4 py-3 text-grey md:px-6">
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto px-4 py-6 md:px-6">
              <a href="#book" className={`${p.popular ? buttonPrimary : buttonSecondary} px-5 py-4`}>
                Commission a tour +
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
