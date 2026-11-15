import { afterEach, describe, expect, it } from "vitest";
import { __resetStorageProbe, readStore, storageAvailable, writeStore } from "@/lib/storage";

const g = globalThis as unknown as { window?: unknown };

function installWindow(localStorage: unknown) {
  g.window = { localStorage };
}

afterEach(() => {
  delete g.window;
  __resetStorageProbe();
});

const asArray = (r: unknown) => (Array.isArray(r) ? (r as string[]) : null);

describe("storage", () => {
  it("round-trips versioned data", () => {
    const mem = new Map<string, string>();
    installWindow({ getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => mem.set(k, v), removeItem: (k: string) => mem.delete(k) });
    expect(storageAvailable()).toBe(true);
    writeStore("wishlist", 1, ["rm-001"]);
    expect(readStore("wishlist", 1, asArray, [])).toEqual(["rm-001"]);
    // A different version is ignored (schema migration safety).
    expect(readStore("wishlist", 2, asArray, ["fallback"])).toEqual(["fallback"]);
  });

  it("falls back to in-memory state when localStorage throws", () => {
    installWindow({
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
      removeItem: () => {
        throw new Error("SecurityError");
      },
    });
    expect(storageAvailable()).toBe(false);
    expect(() => writeStore("cart", 1, ["x"])).not.toThrow();
    expect(readStore("cart", 1, asArray, [])).toEqual(["x"]);
  });

  it("survives corrupted JSON", () => {
    installWindow({ getItem: () => "{not json", setItem: () => {}, removeItem: () => {} });
    expect(readStore("cart", 1, asArray, ["safe"])).toEqual(["safe"]);
  });

  it("works with no window at all (static prerender)", () => {
    expect(storageAvailable()).toBe(false);
    expect(readStore("cart", 1, asArray, [])).toEqual([]);
  });
});
