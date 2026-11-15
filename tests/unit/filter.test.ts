import { describe, expect, it } from "vitest";
import { CATEGORY_IDS, COLOR_FAMILIES, getProducts } from "@/lib/catalog";
import { applyFilters, EMPTY_FILTERS, normalize, parseFilters, serializeFilters, sortProducts } from "@/lib/catalog/filter";

const en = getProducts("en");
const fr = getProducts("fr");
const valid = { categories: CATEGORY_IDS, colors: Object.keys(COLOR_FAMILIES) };

describe("search", () => {
  it("normalizes diacritics", () => {
    expect(normalize("Céleste Élan")).toBe("celeste elan");
  });
  it("finds Céleste without the accent", () => {
    const r = applyFilters(en, { ...EMPTY_FILTERS, q: "celeste" });
    expect(r.map((p) => p.id)).toEqual(["rm-011"]);
  });
  it("searches localized copy (French 'robe')", () => {
    const r = applyFilters(fr, { ...EMPTY_FILTERS, q: "robe" });
    expect(r.length).toBeGreaterThanOrEqual(6);
    expect(r.every((p) => p.category === "dresses")).toBe(true);
  });
  it("requires every term to match", () => {
    expect(applyFilters(en, { ...EMPTY_FILTERS, q: "burgundy shoes" }).map((p) => p.id)).toEqual(["rm-025"]);
  });
});

describe("filters compose", () => {
  it("filters by category + colour + price", () => {
    const r = applyFilters(en, { ...EMPTY_FILTERS, categories: ["dresses", "shoes"], colors: ["red"], max: 60 });
    expect(r.map((p) => p.id).sort()).toEqual(["rm-025"]);
  });
  it("filters by size and in-stock together", () => {
    // Size 36 shoes exist but have 0 stock.
    expect(applyFilters(en, { ...EMPTY_FILTERS, sizes: ["36"] }).length).toBe(5);
    expect(applyFilters(en, { ...EMPTY_FILTERS, sizes: ["36"], inStock: true }).length).toBe(0);
  });
  it("respects min price inclusively", () => {
    const r = applyFilters(en, { ...EMPTY_FILTERS, min: 89 });
    expect(r.map((p) => p.id).sort()).toEqual(["rm-016", "rm-018"]);
  });
  it("excludes hidden products", () => {
    const hidden = getProducts("en", { "rm-001": { hidden: true } });
    expect(applyFilters(hidden, EMPTY_FILTERS).find((p) => p.id === "rm-001")).toBeUndefined();
  });
});

describe("sorting", () => {
  it("sorts by price ascending and descending", () => {
    const asc = sortProducts(en, "price-asc");
    expect(asc[0].price).toBeLessThanOrEqual(asc[asc.length - 1].price);
    expect(asc[0].id).toBe("rm-031");
    expect(sortProducts(en, "price-desc")[0].id).toBe("rm-018");
  });
  it("puts new items first for 'newest'", () => {
    const n = sortProducts(en, "newest");
    const firstOld = n.findIndex((p) => !p.isNew);
    expect(n.slice(firstOld).every((p) => !p.isNew)).toBe(true);
  });
  it("keeps catalog order for 'featured'", () => {
    expect(sortProducts(en, "featured").map((p) => p.id)).toEqual(en.map((p) => p.id));
  });
});

describe("URL state", () => {
  it("round-trips filters through the query string", () => {
    const f = { ...EMPTY_FILTERS, q: "linen", categories: ["dresses" as const], colors: ["red" as const], sizes: ["M"], inStock: true, min: 20, max: 80, sort: "price-asc" as const };
    expect(parseFilters(serializeFilters(f), valid)).toEqual(f);
  });
  it("ignores invalid values", () => {
    const f = parseFilters("?category=hats,dresses&color=neon&sort=bogus&min=-3", valid);
    expect(f.categories).toEqual(["dresses"]);
    expect(f.colors).toEqual([]);
    expect(f.sort).toBe("featured");
    expect(f.min).toBeNull();
  });
});
