import { describe, expect, it } from "vitest";
import { computeTotals, formatMoney, normalizePromo, toCents } from "@/lib/money";

describe("money", () => {
  it("converts euros to integer cents without float drift", () => {
    expect(toCents(69)).toBe(6900);
    expect(toCents(0.1 + 0.2)).toBe(30);
    expect(toCents(19.99)).toBe(1999);
  });

  it("formats EUR per Belgian locale", () => {
    expect(formatMoney(6900, "en").replace(/\s/g, " ")).toMatch(/€\s?69[.,]00/);
    expect(formatMoney(6900, "nl")).toContain("69,00");
    expect(formatMoney(6900, "fr")).toContain("69,00");
  });

  it("normalizes promo codes", () => {
    expect(normalizePromo(" mira10 ")).toBe("MIRA10");
    expect(normalizePromo("nope")).toBeNull();
    expect(normalizePromo("")).toBeNull();
  });

  it("computes subtotal, home shipping and VAT", () => {
    const t = computeTotals([{ unitPrice: 1800, quantity: 2 }], { shipping: "home" });
    expect(t.subtotal).toBe(3600);
    expect(t.shipping).toBe(495);
    expect(t.total).toBe(4095);
    expect(t.amountToFreeShipping).toBe(3400);
    expect(t.vatIncluded).toBe(Math.round(4095 - 4095 / 1.21));
  });

  it("charges pickup at €2.95 regardless of subtotal", () => {
    expect(computeTotals([{ unitPrice: 9500, quantity: 1 }], { shipping: "pickup" }).shipping).toBe(295);
  });

  it("gives free home delivery from €70 pre-discount, even when the discount brings it lower", () => {
    const t = computeTotals([{ unitPrice: 7200, quantity: 1 }], { shipping: "home", promo: "MIRA10" });
    expect(t.discount).toBe(720);
    expect(t.freeShippingApplied).toBe(true);
    expect(t.shipping).toBe(0);
    expect(t.total).toBe(6480);
  });

  it("applies MIRA10 as a rounded 10% discount in cents", () => {
    const t = computeTotals([{ unitPrice: 1599, quantity: 3 }], { promo: "MIRA10", shipping: "pickup" });
    expect(t.subtotal).toBe(4797);
    expect(t.discount).toBe(480);
    expect(t.total).toBe(4797 - 480 + 295);
  });

  it("charges no shipping on an empty bag", () => {
    const t = computeTotals([], { shipping: "home" });
    expect(t.total).toBe(0);
    expect(t.shipping).toBe(0);
  });

  it("is exactly €70 at the free-shipping threshold", () => {
    expect(computeTotals([{ unitPrice: 7000, quantity: 1 }], { shipping: "home" }).shipping).toBe(0);
    expect(computeTotals([{ unitPrice: 6999, quantity: 1 }], { shipping: "home" }).shipping).toBe(495);
  });
});
