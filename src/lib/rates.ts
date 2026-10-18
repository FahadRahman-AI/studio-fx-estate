import { AED_PER_USD, type Rates } from "@/lib/currency";

/** European Central Bank reference rates via Frankfurter (free, no key). */
const ECB_URL = "https://api.frankfurter.dev/v1/latest?base=USD&symbols=GBP,EUR,CAD";

/**
 * Server-only. Cached and refreshed hourly; the ECB publishes once per working
 * day around 16:00 CET. Returns null if the rates can't be fetched, so the
 * pricing falls back to USD instead of showing a stale or guessed conversion.
 */
export async function getRates(): Promise<Rates | null> {
  try {
    const res = await fetch(ECB_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data: { date: string; rates: { GBP: number; EUR: number; CAD: number } } = await res.json();
    const { GBP, EUR, CAD } = data.rates;
    if (![GBP, EUR, CAD].every((r) => typeof r === "number" && r > 0)) return null;
    return { date: data.date, rates: { USD: 1, GBP, EUR, CAD, AED: AED_PER_USD } };
  } catch {
    return null;
  }
}
