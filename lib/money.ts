import { INTL_LOCALE, type Locale } from "./config";

/** All money math is done in integer euro cents to avoid floating-point drift. */
export type Cents = number;

export const toCents = (euros: number): Cents => Math.round(euros * 100);

const formatters = new Map<string, Intl.NumberFormat>();
export function formatMoney(cents: Cents, locale: Locale): string {
  const key = locale;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.NumberFormat(INTL_LOCALE[locale], { style: "currency", currency: "EUR" });
    formatters.set(key, f);
  }
  return f.format(cents / 100);
}

export const PROMO_CODES: Record<string, { percent: number }> = {
  MIRA10: { percent: 10 },
};

export type ShippingMethod = "home" | "pickup";
export const SHIPPING_RATES: Record<ShippingMethod, Cents> = { home: 495, pickup: 295 };
export const FREE_HOME_DELIVERY_FROM: Cents = 7000;

export interface Totals {
  subtotal: Cents;
  discount: Cents;
  shipping: Cents;
  total: Cents;
  /** VAT (21%) already included in total — shown for transparency only. */
  vatIncluded: Cents;
  freeShippingApplied: boolean;
  amountToFreeShipping: Cents;
}

export interface PricedLine {
  unitPrice: Cents;
  quantity: number;
}

export function normalizePromo(code: string | null | undefined): string | null {
  if (!code) return null;
  const c = code.trim().toUpperCase();
  return PROMO_CODES[c] ? c : null;
}

export function computeTotals(
  lines: PricedLine[],
  options: { promo?: string | null; shipping?: ShippingMethod | null } = {},
): Totals {
  const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * Math.max(0, Math.floor(l.quantity)), 0);
  const promo = normalizePromo(options.promo);
  const discount = promo ? Math.round((subtotal * PROMO_CODES[promo].percent) / 100) : 0;
  const method = options.shipping ?? null;
  // Free home delivery is evaluated on the pre-discount subtotal.
  const freeShippingApplied = method === "home" && subtotal >= FREE_HOME_DELIVERY_FROM;
  let shipping = 0;
  if (subtotal > 0 && method) shipping = freeShippingApplied ? 0 : SHIPPING_RATES[method];
  const total = subtotal - discount + shipping;
  const vatIncluded = Math.round(total - total / 1.21);
  return {
    subtotal,
    discount,
    shipping,
    total,
    vatIncluded,
    freeShippingApplied,
    amountToFreeShipping: Math.max(0, FREE_HOME_DELIVERY_FROM - subtotal),
  };
}
