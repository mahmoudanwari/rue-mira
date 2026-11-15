import type { Cents, ShippingMethod } from "./money";

export type PaymentLabel = "card" | "bank" | "pickup";

/** Only non-personal data is stored: code, items, totals and time. Never names, addresses or emails. */
export interface DemoOrder {
  code: string;
  createdAt: string;
  items: { productId: string; size: string; quantity: number; unitPrice: Cents }[];
  subtotal: Cents;
  discount: Cents;
  shipping: Cents;
  total: Cents;
  shippingMethod: ShippingMethod;
  payment: PaymentLabel;
  promo: string | null;
}

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateOrderCode(random: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[Math.floor(random() * ALPHABET.length)];
  return `DEMO-RM-${s}`;
}

export function isDemoOrder(v: unknown): v is DemoOrder {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.code === "string" &&
    /^DEMO-RM-[A-Z0-9]{6}$/.test(o.code) &&
    typeof o.createdAt === "string" &&
    Array.isArray(o.items) &&
    typeof o.total === "number"
  );
}

export function validateOrders(raw: unknown): DemoOrder[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.filter(isDemoOrder).slice(0, 50);
}
