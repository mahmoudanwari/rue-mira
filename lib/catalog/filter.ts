import type { CategoryId, ColorFamily, Product } from "./index";
import { totalStock } from "./index";

export type SortKey = "featured" | "price-asc" | "price-desc" | "name" | "newest";
export const SORT_KEYS: SortKey[] = ["featured", "price-asc", "price-desc", "name", "newest"];

export interface FilterState {
  q: string;
  categories: CategoryId[];
  colors: ColorFamily[];
  sizes: string[];
  inStock: boolean;
  min: number | null; // euros
  max: number | null; // euros
  sort: SortKey;
}

export const EMPTY_FILTERS: FilterState = {
  q: "",
  categories: [],
  colors: [],
  sizes: [],
  inStock: false,
  min: null,
  max: null,
  sort: "featured",
};

/** Lowercase + strip diacritics so "celeste" finds "Céleste". */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function searchHaystack(p: Product, extra: string[] = []): string {
  return normalize(
    [p.copy.name, p.copy.color, p.copy.material, p.copy.description, p.slug, p.category, ...p.tags, ...extra].join(" "),
  );
}

export function matchesQuery(p: Product, q: string, extra: string[] = []): boolean {
  const terms = normalize(q).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return true;
  const hay = searchHaystack(p, extra);
  return terms.every((t) => hay.includes(t));
}

export function applyFilters(
  products: Product[],
  f: FilterState,
  categoryLabels: Partial<Record<CategoryId, string>> = {},
): Product[] {
  const minC = f.min != null ? Math.round(f.min * 100) : null;
  const maxC = f.max != null ? Math.round(f.max * 100) : null;
  const out = products.filter((p) => {
    if (p.hidden) return false;
    if (f.q && !matchesQuery(p, f.q, [categoryLabels[p.category] ?? ""])) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.colors.length && !f.colors.includes(p.colorFamily)) return false;
    if (f.sizes.length && !f.sizes.some((s) => p.sizes.includes(s) && (!f.inStock || (p.stock[s] ?? 0) > 0))) return false;
    if (f.inStock && totalStock(p) === 0) return false;
    if (minC != null && p.price < minC) return false;
    if (maxC != null && p.price > maxC) return false;
    return true;
  });
  return sortProducts(out, f.sort);
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price || a.order - b.order);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price || a.order - b.order);
    case "name":
      return list.sort((a, b) => a.copy.name.localeCompare(b.copy.name) || a.order - b.order);
    case "newest":
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.order - a.order);
    default:
      return list.sort((a, b) => a.order - b.order);
  }
}

export function activeFilterCount(f: FilterState): number {
  return (
    f.categories.length +
    f.colors.length +
    f.sizes.length +
    (f.inStock ? 1 : 0) +
    (f.min != null ? 1 : 0) +
    (f.max != null ? 1 : 0) +
    (f.q ? 1 : 0)
  );
}

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const num = (v: string | null) => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export function parseFilters(
  search: string,
  valid: { categories: readonly string[]; colors: readonly string[] },
): FilterState {
  const sp = new URLSearchParams(search);
  const sort = sp.get("sort") as SortKey | null;
  return {
    q: sp.get("q") ?? "",
    categories: list(sp.get("category")).filter((c) => valid.categories.includes(c)) as CategoryId[],
    colors: list(sp.get("color")).filter((c) => valid.colors.includes(c)) as ColorFamily[],
    sizes: list(sp.get("size")),
    inStock: sp.get("stock") === "1",
    min: num(sp.get("min")),
    max: num(sp.get("max")),
    sort: sort && SORT_KEYS.includes(sort) ? sort : "featured",
  };
}

export function serializeFilters(f: FilterState): string {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.categories.length) sp.set("category", f.categories.join(","));
  if (f.colors.length) sp.set("color", f.colors.join(","));
  if (f.sizes.length) sp.set("size", f.sizes.join(","));
  if (f.inStock) sp.set("stock", "1");
  if (f.min != null) sp.set("min", String(f.min));
  if (f.max != null) sp.set("max", String(f.max));
  if (f.sort !== "featured") sp.set("sort", f.sort);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Size groups for the filter UI, in a sensible order. */
export function sizeGroups(products: Product[]): string[][] {
  const all = new Set(products.flatMap((p) => p.sizes));
  const letters = ["XS", "S", "M", "L", "XL"].filter((s) => all.has(s));
  const numeric = [...all]
    .filter((s) => /^\d+$/.test(s))
    .map(Number)
    .sort((a, b) => a - b)
    .map(String);
  const waist = numeric.filter((s) => Number(s) < 35);
  const shoes = numeric.filter((s) => Number(s) >= 35);
  const one = all.has("One Size") ? ["One Size"] : [];
  return [letters, waist, shoes, one].filter((g) => g.length);
}
