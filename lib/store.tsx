"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  addToCart as addLine,
  lineKey,
  MAX_COMPARE,
  removeLine as removeCartLine,
  setQuantity,
  toggleId,
  validateIdList,
  validateLines,
  type CartLine,
} from "./cart";
import { getProducts, SEED_PRODUCTS, type Product, type ProductOverride } from "./catalog";
import type { Locale } from "./config";
import { validateOrders, type DemoOrder } from "./demo-orders";
import { normalizePromo, type ShippingMethod } from "./money";
import { readStore, removeStore, storageAvailable, writeStore } from "./storage";
import { sanitizeOverrides } from "./studio";

const KNOWN_IDS = new Set(SEED_PRODUCTS.map((p) => p.id));

const KEYS = {
  cart: ["cart", 1],
  wishlist: ["wishlist", 1],
  compare: ["compare", 1],
  promo: ["promo", 1],
  shipping: ["shipping", 1],
  overrides: ["studio-overrides", 1],
  orders: ["demo-orders", 1],
} as const;

interface ShopContextValue {
  locale: Locale;
  hydrated: boolean;
  storageOk: boolean;
  products: Product[];
  productById: (id: string) => Product | undefined;
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  promo: string | null;
  shippingMethod: ShippingMethod;
  overrides: Record<string, ProductOverride>;
  orders: DemoOrder[];
  addToCart: (productId: string, size: string, quantity?: number) => number;
  setLineQuantity: (key: string, qty: number) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  clearWishlist: () => void;
  toggleCompare: (id: string) => boolean;
  clearCompare: () => void;
  setPromo: (code: string | null) => boolean;
  setShippingMethod: (m: ShippingMethod) => void;
  setOverride: (id: string, patch: ProductOverride | null) => void;
  replaceOverrides: (o: Record<string, ProductOverride>) => void;
  recordOrder: (order: DemoOrder) => void;
  resetDemo: () => void;
}

const ShopContext = createContext<ShopContextValue | null>(null);

export function ShopProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [promo, setPromoState] = useState<string | null>(null);
  const [shippingMethod, setShippingMethodState] = useState<ShippingMethod>("home");
  const [overrides, setOverrides] = useState<Record<string, ProductOverride>>({});
  const [orders, setOrders] = useState<DemoOrder[]>([]);

  // Load persisted state after mount (keeps server HTML and first client render identical).
  useEffect(() => {
    const ok = storageAvailable();
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from browser storage */
    setStorageOk(ok);
    setCart(readStore(KEYS.cart[0], KEYS.cart[1], (r) => validateLines(r, KNOWN_IDS), []));
    setWishlist(readStore(KEYS.wishlist[0], KEYS.wishlist[1], (r) => validateIdList(r, KNOWN_IDS), []));
    setCompare(readStore(KEYS.compare[0], KEYS.compare[1], (r) => validateIdList(r, KNOWN_IDS, MAX_COMPARE), []));
    setPromoState(readStore(KEYS.promo[0], KEYS.promo[1], (r) => (typeof r === "string" ? normalizePromo(r) : null), null));
    setShippingMethodState(
      readStore<ShippingMethod>(KEYS.shipping[0], KEYS.shipping[1], (r) => (r === "home" || r === "pickup" ? r : null), "home"),
    );
    setOverrides(readStore(KEYS.overrides[0], KEYS.overrides[1], (r) => sanitizeOverrides(r, SEED_PRODUCTS), {}));
    setOrders(readStore(KEYS.orders[0], KEYS.orders[1], validateOrders, []));
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const persist = <T,>(key: readonly [string, number], value: T) => {
    if (hydrated) writeStore(key[0], key[1], value);
  };
  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => persist(KEYS.cart, cart), [cart, hydrated]);
  useEffect(() => persist(KEYS.wishlist, wishlist), [wishlist, hydrated]);
  useEffect(() => persist(KEYS.compare, compare), [compare, hydrated]);
  useEffect(() => persist(KEYS.promo, promo), [promo, hydrated]);
  useEffect(() => persist(KEYS.shipping, shippingMethod), [shippingMethod, hydrated]);
  useEffect(() => persist(KEYS.overrides, overrides), [overrides, hydrated]);
  useEffect(() => persist(KEYS.orders, orders), [orders, hydrated]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const products = useMemo(() => getProducts(locale, overrides), [locale, overrides]);
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);
  const productById = useCallback((id: string) => byId.get(id), [byId]);

  const cartRef = useRef(cart);
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const addToCart = useCallback(
    (productId: string, size: string, quantity = 1) => {
      const p = byId.get(productId);
      if (!p || !p.sizes.includes(size)) return 0;
      const result = addLine(cartRef.current, { productId, size, quantity }, p.stock[size] ?? 0);
      if (result.added > 0) {
        cartRef.current = result.lines;
        setCart(result.lines);
      }
      return result.added;
    },
    [byId],
  );

  const setLineQuantity = useCallback(
    (key: string, qty: number) => {
      setCart((lines) => {
        const line = lines.find((l) => lineKey(l) === key);
        const p = line ? byId.get(line.productId) : undefined;
        return setQuantity(lines, key, qty, p && line ? (p.stock[line.size] ?? 0) : 0);
      });
    },
    [byId],
  );

  const value: ShopContextValue = {
    locale,
    hydrated,
    storageOk,
    products,
    productById,
    cart,
    wishlist,
    compare,
    promo,
    shippingMethod,
    overrides,
    orders,
    addToCart,
    setLineQuantity,
    removeLine: (key) => setCart((l) => removeCartLine(l, key)),
    clearCart: () => setCart([]),
    toggleWishlist: (id) => setWishlist((l) => toggleId(l, id).list),
    clearWishlist: () => setWishlist([]),
    toggleCompare: (id) => {
      const r = toggleId(compare, id, MAX_COMPARE);
      if (r.ok) setCompare(r.list);
      return r.ok;
    },
    clearCompare: () => setCompare([]),
    setPromo: (code) => {
      if (code === null) {
        setPromoState(null);
        return true;
      }
      const n = normalizePromo(code);
      if (n) setPromoState(n);
      return Boolean(n);
    },
    setShippingMethod: setShippingMethodState,
    setOverride: (id, patch) =>
      setOverrides((o) => {
        const next = { ...o };
        if (patch === null) delete next[id];
        else {
          const stock = { ...next[id]?.stock, ...patch.stock };
          const merged: ProductOverride = { ...next[id], ...patch, stock: Object.keys(stock).length ? stock : undefined };
          // Drop cleared fields; an override equal to the seed is removed entirely.
          const seed = SEED_PRODUCTS.find((p) => p.id === id);
          if (merged.price === undefined || merged.price === (seed ? Math.round(seed.price_eur * 100) : -1)) delete merged.price;
          if (merged.stock === undefined) delete merged.stock;
          if (merged.hidden !== true) delete merged.hidden;
          if (Object.keys(merged).length) next[id] = merged;
          else delete next[id];
        }
        return next;
      }),
    replaceOverrides: setOverrides,
    recordOrder: (order) => {
      setOrders((o) => [order, ...o].slice(0, 50));
      // Reduce local demo stock for each purchased size.
      setOverrides((o) => {
        const next = { ...o };
        for (const item of order.items) {
          const p = byId.get(item.productId);
          if (!p) continue;
          const current = p.stock[item.size] ?? 0;
          next[item.productId] = {
            ...next[item.productId],
            stock: { ...next[item.productId]?.stock, [item.size]: Math.max(0, current - item.quantity) },
          };
        }
        return next;
      });
      setCart([]);
      setPromoState(null);
    },
    resetDemo: () => {
      Object.values(KEYS).forEach(([k]) => removeStore(k));
      setCart([]);
      setWishlist([]);
      setCompare([]);
      setPromoState(null);
      setShippingMethodState("home");
      setOverrides({});
      setOrders([]);
    },
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop(): ShopContextValue {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}

/* ---------- Transient UI state (drawers, modals, toasts) ---------- */

interface UIContextValue {
  bagOpen: boolean;
  setBagOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  quickViewId: string | null;
  setQuickViewId: (id: string | null) => void;
  sizeGuideOpen: boolean;
  setSizeGuideOpen: (v: boolean) => void;
  lastAdded: { productId: string; size: string; at: number } | null;
  notifyAdded: (productId: string, size: string) => void;
  announce: (message: string) => void;
  announcement: string;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [bagOpen, setBagOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState<string | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<UIContextValue["lastAdded"]>(null);
  const [announcement, setAnnouncement] = useState("");

  const value: UIContextValue = {
    bagOpen,
    setBagOpen,
    searchOpen,
    setSearchOpen,
    quickViewId,
    setQuickViewId,
    sizeGuideOpen,
    setSizeGuideOpen,
    lastAdded,
    notifyAdded: (productId, size) => setLastAdded({ productId, size, at: Date.now() }),
    announce: (m) => {
      // Clear then set so screen readers re-announce identical messages.
      setAnnouncement("");
      requestAnimationFrame(() => setAnnouncement(m));
    },
    announcement,
  };
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI(): UIContextValue {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
