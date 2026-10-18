/** Display currencies for the pricing section. Prices are set in USD and converted. */
export const currencies = [
  { code: "USD", name: "US dollar" },
  { code: "GBP", name: "British pound" },
  { code: "EUR", name: "Euro" },
  { code: "AED", name: "UAE dirham" },
  { code: "CAD", name: "Canadian dollar" },
] as const;

export type CurrencyCode = (typeof currencies)[number]["code"];

/** Units of each currency per 1 USD, plus where they came from. */
export type Rates = {
  rates: Record<CurrencyCode, number>;
  /** ECB reference date (YYYY-MM-DD) for the floating rates. */
  date: string;
};

/**
 * The dirham has been pegged to the US dollar at 3.6725 by the Central Bank of
 * the UAE since 1997, so the peg is the accurate rate (the ECB doesn't publish AED).
 */
export const AED_PER_USD = 3.6725;

const formatters = new Map<CurrencyCode, Intl.NumberFormat>();

/** Whole units with an unambiguous symbol: $1,990 · £1,492 · €1,768 · AED 7,308 · CA$2,818. */
export function formatPrice(usd: number, code: CurrencyCode, rates: Rates | null) {
  const rate = code === "USD" ? 1 : (rates?.rates[code] ?? NaN);
  let f = formatters.get(code);
  if (!f) {
    f = new Intl.NumberFormat("en", { style: "currency", currency: code, maximumFractionDigits: 0 });
    formatters.set(code, f);
  }
  return f.format(Math.round(usd * rate));
}

const EUROZONE = ["AT", "BE", "CY", "DE", "EE", "ES", "FI", "FR", "GR", "HR", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PT", "SI", "SK"];

/** Currency for an ISO country code: GB → GBP, AE → AED, CA → CAD, eurozone → EUR, else USD. */
export function currencyForCountry(country: string | null | undefined): CurrencyCode | null {
  if (!country) return null;
  const c = country.toUpperCase();
  if (c === "GB") return "GBP";
  if (c === "AE") return "AED";
  if (c === "CA") return "CAD";
  if (EUROZONE.includes(c)) return "EUR";
  return "USD";
}

/** Fallback when location is unknown: the region in the browser's language tags, e.g. en-GB → GBP. */
export function currencyForLanguages(languages: readonly string[]): CurrencyCode {
  for (const lang of languages) {
    const region = lang.split("-")[1];
    if (region && region.length === 2) return currencyForCountry(region)!;
  }
  return "USD";
}
