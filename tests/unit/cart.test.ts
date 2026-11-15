import { describe, expect, it } from "vitest";
import { addToCart, cartCount, lineKey, removeLine, setQuantity, toggleId, validateIdList, validateLines } from "@/lib/cart";

describe("cart", () => {
  it("keeps separate lines per product + size", () => {
    let lines = addToCart([], { productId: "rm-001", size: "M", quantity: 1 }, 9).lines;
    lines = addToCart(lines, { productId: "rm-001", size: "S", quantity: 1 }, 6).lines;
    lines = addToCart(lines, { productId: "rm-001", size: "M", quantity: 2 }, 9).lines;
    expect(lines).toHaveLength(2);
    expect(lines.find((l) => l.size === "M")?.quantity).toBe(3);
    expect(cartCount(lines)).toBe(4);
  });

  it("never exceeds available demo stock", () => {
    const r = addToCart([{ productId: "rm-001", size: "XS", quantity: 2 }], { productId: "rm-001", size: "XS", quantity: 5 }, 3);
    expect(r.added).toBe(1);
    expect(r.lines[0].quantity).toBe(3);
    expect(addToCart([], { productId: "rm-012", size: "24", quantity: 1 }, 0).added).toBe(0);
  });

  it("updates and removes quantities", () => {
    const lines = [{ productId: "rm-007", size: "M", quantity: 2 }];
    const key = lineKey(lines[0]);
    expect(setQuantity(lines, key, 5, 9)[0].quantity).toBe(5);
    expect(setQuantity(lines, key, 50, 4)[0].quantity).toBe(4);
    expect(setQuantity(lines, key, 0, 9)).toHaveLength(0);
    expect(removeLine(lines, key)).toHaveLength(0);
  });
});

describe("wishlist / compare", () => {
  it("toggles ids", () => {
    expect(toggleId(["a"], "b").list).toEqual(["a", "b"]);
    expect(toggleId(["a", "b"], "a").list).toEqual(["b"]);
  });
  it("caps compare at 4", () => {
    const r = toggleId(["a", "b", "c", "d"], "e", 4);
    expect(r.ok).toBe(false);
    expect(r.list).toHaveLength(4);
    expect(toggleId(["a", "b", "c", "d"], "a", 4).ok).toBe(true);
  });
});

describe("stored-state validation", () => {
  const known = new Set(["rm-001", "rm-002"]);
  it("drops malformed and unknown lines", () => {
    const raw = [{ productId: "rm-001", size: "M", quantity: 2 }, { productId: "rm-999", size: "M", quantity: 1 }, { bad: true }, "x"];
    expect(validateLines(raw, known)).toEqual([{ productId: "rm-001", size: "M", quantity: 2 }]);
    expect(validateLines("nope", known)).toBeNull();
  });
  it("dedupes id lists and enforces max", () => {
    expect(validateIdList(["rm-001", "rm-001", "rm-002", 4], known, 1)).toEqual(["rm-001"]);
  });
});
