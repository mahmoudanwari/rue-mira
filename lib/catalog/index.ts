import rawCatalog from "@/data/catalog.json";
import rawImageMap from "@/data/image-map.json";
import type { Locale } from "../config";
import { toCents, type Cents } from "../money";
import { CATEGORY_IDS, catalogSchema, imageMapSchema, type CategoryId, type SeedProduct } from "./schema";
import { PRODUCT_TRANSLATIONS, type ProductCopy } from "./translations";

/** Validated at import time (build + runtime). A malformed seed fails the build loudly. */
export const SEED_PRODUCTS: readonly SeedProduct[] = catalogSchema.parse(rawCatalog);
export const IMAGE_MAP = imageMapSchema.parse(rawImageMap);

export { CATEGORY_IDS };
export type { CategoryId, SeedProduct };

export type ColorFamily = "red" | "pink" | "neutral" | "brown" | "black" | "blue" | "green" | "metallic";
export const COLOR_FAMILIES: Record<ColorFamily, string> = {
  red: "#7E3348",
  pink: "#D4A3A8",
  neutral: "#E6DCCB",
  brown: "#6A4A3A",
  black: "#2A2829",
  blue: "#6F8FAE",
  green: "#6E7553",
  metallic: "#C9AE6E",
};

const FAMILY_BY_ID: Record<string, ColorFamily> = {
  "rm-001": "red", "rm-002": "neutral", "rm-003": "pink", "rm-004": "brown",
  "rm-005": "green", "rm-006": "blue", "rm-007": "neutral", "rm-008": "neutral",
  "rm-009": "blue", "rm-010": "pink", "rm-011": "neutral", "rm-012": "blue",
  "rm-013": "neutral", "rm-014": "black", "rm-015": "brown", "rm-016": "neutral",
  "rm-017": "green", "rm-018": "black", "rm-019": "red", "rm-020": "neutral",
  "rm-021": "neutral", "rm-022": "brown", "rm-023": "brown", "rm-024": "black",
  "rm-025": "red", "rm-026": "neutral", "rm-027": "brown", "rm-028": "brown",
  "rm-029": "metallic", "rm-030": "metallic", "rm-031": "metallic", "rm-032": "neutral",
};

/** A product as the UI sees it: canonical seed data + localized copy + (optional) demo-studio overrides. */
export interface Product {
  id: string;
  slug: string;
  category: CategoryId;
  price: Cents;
  basePrice: Cents;
  colorHex: string;
  colorFamily: ColorFamily;
  sizes: string[];
  stock: Record<string, number>;
  tags: string[];
  isNew: boolean;
  hidden: boolean;
  images: [string, string];
  /** Position in the original catalog (used as the "featured" order). */
  order: number;
  copy: ProductCopy;
}

export function productCopy(p: SeedProduct, locale: Locale): ProductCopy {
  if (locale === "en") {
    return { name: p.name_en, color: p.color_name_en, material: p.material_en, description: p.description_en };
  }
  return PRODUCT_TRANSLATIONS[p.id][locale];
}

export interface ProductOverride {
  price?: Cents;
  stock?: Record<string, number>;
  hidden?: boolean;
}

export function localizeProduct(p: SeedProduct, locale: Locale, override?: ProductOverride): Product {
  const basePrice = toCents(p.price_eur);
  return {
    id: p.id,
    slug: p.slug,
    category: p.category,
    price: override?.price ?? basePrice,
    basePrice,
    colorHex: p.color_hex,
    colorFamily: FAMILY_BY_ID[p.id] ?? "neutral",
    sizes: p.sizes,
    stock: { ...p.stock_by_size, ...(override?.stock ?? {}) },
    tags: p.tags,
    isNew: p.is_new,
    hidden: override?.hidden ?? false,
    images: [p.images[0], p.images[1]],
    order: SEED_PRODUCTS.indexOf(p),
    copy: productCopy(p, locale),
  };
}

export function getProducts(locale: Locale, overrides: Record<string, ProductOverride> = {}): Product[] {
  return SEED_PRODUCTS.map((p) => localizeProduct(p, locale, overrides[p.id]));
}

export function getSeedBySlug(slug: string): SeedProduct | undefined {
  return SEED_PRODUCTS.find((p) => p.slug === slug);
}

export function getSeedById(id: string): SeedProduct | undefined {
  return SEED_PRODUCTS.find((p) => p.id === id);
}

export function totalStock(p: Pick<Product, "stock" | "sizes">): number {
  return p.sizes.reduce((s, size) => s + (p.stock[size] ?? 0), 0);
}

export function isOneSize(p: Pick<Product, "sizes">): boolean {
  return p.sizes.length === 1 && p.sizes[0] === "One Size";
}

/** Editorial picks — a fixed curation, explicitly not based on sales or ratings. */
export const STUDIO_FAVOURITE_IDS = ["rm-006", "rm-013", "rm-008", "rm-012", "rm-023", "rm-028", "rm-007", "rm-030"];

/** Product spotlighted on the homepage. */
export const SPOTLIGHT_ID = "rm-016";

/** Related products: same category first, then shared tags, deterministic. */
export function relatedProducts(all: Product[], product: Product, count = 4): Product[] {
  const scored = all
    .filter((p) => p.id !== product.id && !p.hidden)
    .map((p) => {
      let score = 0;
      if (p.category === product.category) score += 3;
      score += p.tags.filter((t) => product.tags.includes(t)).length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score || a.p.order - b.p.order);
  return scored.slice(0, count).map((s) => s.p);
}

export function collectionImage(category: CategoryId | "new-arrivals"): string {
  return IMAGE_MAP.collections[category];
}

/** Every image path the site references (88 unique files). */
export function allManifestPaths(): string[] {
  const set = new Set<string>();
  SEED_PRODUCTS.forEach((p) => p.images.forEach((i) => set.add(i)));
  Object.values(IMAGE_MAP.collections).forEach((i) => set.add(i));
  Object.values(IMAGE_MAP.campaigns).forEach((i) => set.add(i));
  IMAGE_MAP.lookbook.forEach((l) => set.add(l.image));
  return [...set];
}
