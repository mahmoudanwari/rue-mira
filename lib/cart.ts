/** Pure cart / wishlist / compare logic — no React, fully unit-tested. */
export interface CartLine {
  productId: string;
  size: string;
  quantity: number;
}

export const MAX_QTY_PER_LINE = 10;
export const MAX_COMPARE = 4;

export const lineKey = (l: Pick<CartLine, "productId" | "size">) => `${l.productId}::${l.size}`;

function clampQty(qty: number, available: number): number {
  return Math.max(0, Math.min(Math.floor(qty), MAX_QTY_PER_LINE, Math.max(0, available)));
}

/** Add to an existing (productId + size) line or create one. Respects available stock. */
export function addToCart(lines: CartLine[], add: CartLine, available: number): { lines: CartLine[]; added: number } {
  const key = lineKey(add);
  const existing = lines.find((l) => lineKey(l) === key);
  const current = existing?.quantity ?? 0;
  const next = clampQty(current + add.quantity, available);
  const added = next - current;
  if (added <= 0) return { lines, added: 0 };
  if (existing) return { lines: lines.map((l) => (lineKey(l) === key ? { ...l, quantity: next } : l)), added };
  return { lines: [...lines, { ...add, quantity: next }], added };
}

export function setQuantity(lines: CartLine[], key: string, qty: number, available: number): CartLine[] {
  const q = clampQty(qty, available);
  if (q <= 0) return lines.filter((l) => lineKey(l) !== key);
  return lines.map((l) => (lineKey(l) === key ? { ...l, quantity: q } : l));
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((l) => lineKey(l) !== key);
}

export function cartCount(lines: CartLine[]): number {
  return lines.reduce((s, l) => s + l.quantity, 0);
}

export function toggleId(list: string[], id: string, max = Infinity): { list: string[]; ok: boolean } {
  if (list.includes(id)) return { list: list.filter((x) => x !== id), ok: true };
  if (list.length >= max) return { list, ok: false };
  return { list: [...list, id], ok: true };
}

export function isCartLine(v: unknown): v is CartLine {
  if (!v || typeof v !== "object") return false;
  const o = v as Record<string, unknown>;
  return typeof o.productId === "string" && typeof o.size === "string" && typeof o.quantity === "number" && o.quantity > 0;
}

export function validateLines(raw: unknown, knownIds: Set<string>): CartLine[] | null {
  if (!Array.isArray(raw)) return null;
  return raw.filter(isCartLine).filter((l) => knownIds.has(l.productId)).map((l) => ({ ...l, quantity: Math.min(MAX_QTY_PER_LINE, Math.floor(l.quantity)) }));
}

export function validateIdList(raw: unknown, knownIds: Set<string>, max = Infinity): string[] | null {
  if (!Array.isArray(raw)) return null;
  return [...new Set(raw.filter((x): x is string => typeof x === "string" && knownIds.has(x)))].slice(0, max);
}
