import { describe, expect, it } from "vitest";
import rawCatalog from "@/data/catalog.json";
import { allManifestPaths, CATEGORY_IDS, IMAGE_MAP, SEED_PRODUCTS, getProducts, relatedProducts } from "@/lib/catalog";
import { getLooks } from "@/lib/catalog/lookbook";
import { PRODUCT_TRANSLATIONS } from "@/lib/catalog/translations";
import { LOCALES } from "@/lib/config";
import { getContent } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { buildStudioExport, parseStudioImport } from "@/lib/studio";
import { generateOrderCode, validateOrders } from "@/lib/demo-orders";

describe("catalog integrity", () => {
  it("has 32 products in 7 categories with unique IDs and slugs", () => {
    expect(SEED_PRODUCTS).toHaveLength(32);
    expect(new Set(SEED_PRODUCTS.map((p) => p.category)).size).toBe(7);
    expect(new Set(SEED_PRODUCTS.map((p) => p.id)).size).toBe(32);
    expect(new Set(SEED_PRODUCTS.map((p) => p.slug)).size).toBe(32);
  });
  it("keeps canonical data untouched (prices, images) from the supplied JSON", () => {
    expect(SEED_PRODUCTS).toEqual(rawCatalog);
  });
  it("references exactly 88 unique image paths", () => {
    expect(allManifestPaths()).toHaveLength(88);
  });
  it("has stock entries for every size", () => {
    for (const p of SEED_PRODUCTS) expect(Object.keys(p.stock_by_size).sort()).toEqual([...p.sizes].sort());
  });
  it("has Dutch and French copy for every product", () => {
    for (const p of SEED_PRODUCTS) {
      for (const l of ["nl", "fr"] as const) {
        const c = PRODUCT_TRANSLATIONS[p.id]?.[l];
        expect(c, `${p.id} ${l}`).toBeDefined();
        expect(c.name && c.color && c.material && c.description).toBeTruthy();
      }
    }
  });
  it("related products prefer the same category and exclude the product itself", () => {
    const all = getProducts("en");
    const r = relatedProducts(all, all[0]);
    expect(r).toHaveLength(4);
    expect(r.find((p) => p.id === all[0].id)).toBeUndefined();
    expect(r[0].category).toBe(all[0].category);
  });
});

describe("lookbook", () => {
  it("wires all 6 looks to real product IDs with hotspots", () => {
    const ids = new Set(SEED_PRODUCTS.map((p) => p.id));
    for (const l of LOCALES) {
      const looks = getLooks(l);
      expect(looks).toHaveLength(6);
      for (const look of looks) {
        expect(look.productIds.every((id) => ids.has(id))).toBe(true);
        expect(look.hotspots).toHaveLength(look.productIds.length);
        for (const h of look.hotspots) {
          expect(h.x).toBeGreaterThan(0);
          expect(h.x).toBeLessThan(100);
        }
      }
    }
  });
  it("has 8 collection images including new arrivals", () => {
    expect(Object.keys(IMAGE_MAP.collections).sort()).toEqual([...CATEGORY_IDS, "new-arrivals"].sort());
  });
});

describe("translations", () => {
  const flatten = (o: unknown, prefix = ""): [string, string][] =>
    typeof o === "string" ? [[prefix, o]] : Object.entries(o as object).flatMap(([k, v]) => flatten(v, prefix ? `${prefix}.${k}` : k));

  it("every locale has every key, with no empty strings", () => {
    const en = flatten(getDictionary("en"));
    for (const l of LOCALES) {
      const d = new Map(flatten(getDictionary(l)));
      for (const [k] of en) expect(d.get(k), `${l}:${k}`).toBeTruthy();
    }
  });
  it("placeholders match across locales", () => {
    const ph = (s: string) => (s.match(/\{\w+\}/g) ?? []).sort().join();
    const en = new Map(flatten(getDictionary("en")));
    for (const l of ["nl", "fr"] as const) for (const [k, v] of flatten(getDictionary(l))) expect(ph(v), `${l}:${k}`).toBe(ph(en.get(k)!));
  });
  it("Dutch and French UI copy is actually translated (not English leftovers)", () => {
    const en = new Map(flatten(getDictionary("en")));
    for (const l of ["nl", "fr"] as const) {
      // "{name} in {color}" is also correct Dutch.
      const same = flatten(getDictionary(l)).filter(([k, v]) => v === en.get(k) && v.length > 12 && !v.includes("RUE MIRA") && !(l === "nl" && k === "product.imageAlt"));
      expect(same.map(([k]) => k), l).toEqual([]);
    }
  });
  it("long-form content exists for every locale", () => {
    for (const l of LOCALES) {
      const c = getContent(l);
      expect(c.journal.stories).toHaveLength(2);
      expect(c.help.faq.length).toBeGreaterThan(4);
    }
  });
});

describe("demo studio import / orders", () => {
  it("round-trips a valid export and drops unknown sizes/products", () => {
    const text = buildStudioExport({ "rm-001": { price: 5900, stock: { M: 2 }, hidden: true } });
    expect(parseStudioImport(text, SEED_PRODUCTS)).toEqual({ "rm-001": { price: 5900, stock: { M: 2 }, hidden: true } });
    const tampered = JSON.stringify({ app: "rue-mira-studio", version: 1, overrides: { "rm-001": { stock: { XXL: 3 } }, "rm-777": { hidden: true } } });
    expect(parseStudioImport(tampered, SEED_PRODUCTS)).toEqual({});
  });
  it("rejects invalid or unexpected input", () => {
    expect(parseStudioImport("not json", SEED_PRODUCTS)).toBeNull();
    expect(parseStudioImport(JSON.stringify({ app: "other", version: 1, overrides: {} }), SEED_PRODUCTS)).toBeNull();
    expect(parseStudioImport(JSON.stringify({ app: "rue-mira-studio", version: 1, overrides: { "rm-001": { price: -5 } } }), SEED_PRODUCTS)).toBeNull();
    expect(parseStudioImport(JSON.stringify({ app: "rue-mira-studio", version: 1, overrides: { "rm-001": { script: "<x>" } } }), SEED_PRODUCTS)).toBeNull();
  });
  it("generates DEMO-RM order codes and validates stored orders", () => {
    const code = generateOrderCode();
    expect(code).toMatch(/^DEMO-RM-[A-Z0-9]{6}$/);
    expect(validateOrders([{ code, createdAt: "x", items: [], total: 1 }, { code: "HACK" }])).toHaveLength(1);
  });
});
