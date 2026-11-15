"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, GitCompare, Heart, Minus, Plus, Ruler } from "lucide-react";
import { useId, useState } from "react";
import { isOneSize, type Product } from "@/lib/catalog";
import { MAX_QTY_PER_LINE } from "@/lib/cart";
import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";
import { useProductActions } from "@/components/shop/useProductActions";

export function PurchasePanel({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { t, fill, money } = useI18n();
  const shop = useShop();
  const ui = useUI();
  const actions = useProductActions();
  const one = isOneSize(product);
  const [size, setSize] = useState<string | null>(one ? "One Size" : null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const groupId = useId();
  const errorId = useId();

  const stockForSize = size ? (product.stock[size] ?? 0) : null;
  const inBag = size ? (shop.cart.find((l) => l.productId === product.id && l.size === size)?.quantity ?? 0) : 0;
  const maxQty = stockForSize != null ? Math.max(0, Math.min(MAX_QTY_PER_LINE, stockForSize - inBag)) : MAX_QTY_PER_LINE;
  const inWishlist = shop.wishlist.includes(product.id);
  const inCompare = shop.compare.includes(product.id);
  const soldOutAll = product.sizes.every((s) => (product.stock[s] ?? 0) === 0);

  const onAdd = () => {
    if (!size) {
      setError(t.common.chooseSizeFirst);
      document.getElementById(groupId)?.querySelector<HTMLElement>("button:not(:disabled)")?.focus();
      return;
    }
    const added = actions.add(product.id, size, Math.min(qty, Math.max(1, maxQty)));
    if (added > 0) {
      setJustAdded(true);
      setQty(1);
      window.setTimeout(() => setJustAdded(false), 1800);
    }
  };

  // Keyboard support for the size radiogroup (arrow keys move between enabled sizes).
  const onSizeKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
    e.preventDefault();
    const enabled = product.sizes.filter((s) => (product.stock[s] ?? 0) > 0);
    if (!enabled.length) return;
    const idx = size ? enabled.indexOf(size) : -1;
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
    const next = enabled[(idx + dir + enabled.length) % enabled.length];
    setSize(next);
    setError(null);
    document.getElementById(`${groupId}-${next}`)?.focus();
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-2xl font-semibold tabular-nums">{money(product.price)}</p>
        {product.price !== product.basePrice && <p className="mt-1 text-xs text-taupe">{t.product.priceEdited}</p>}
        <p className="mt-1 text-xs text-taupe">{fill(t.bag.vatIncluded, { amount: "21%" }).split("(")[0]}</p>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="h-5 w-5 rounded-full ring-1 ring-ink/20" style={{ backgroundColor: product.colorHex }} aria-hidden="true" />
        <span>
          <span className="text-taupe">{t.common.colour}: </span>
          {product.copy.color}
        </span>
      </div>

      {!one && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span id={`${groupId}-label`} className="text-sm font-semibold">
              {t.common.size}
              {size && <span className="font-normal text-taupe"> — {size}</span>}
            </span>
            <button
              type="button"
              onClick={() => ui.setSizeGuideOpen(true)}
              className="link-underline inline-flex items-center gap-1.5 text-sm"
            >
              <Ruler size={15} aria-hidden="true" />
              {t.product.sizeGuide}
            </button>
          </div>
          <div
            id={groupId}
            role="radiogroup"
            aria-labelledby={`${groupId}-label`}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={Boolean(error)}
            className="flex flex-wrap gap-2"
            onKeyDown={onSizeKey}
          >
            {product.sizes.map((s) => {
              const n = product.stock[s] ?? 0;
              const selected = size === s;
              const tabbable = selected || (!size && s === product.sizes.find((x) => (product.stock[x] ?? 0) > 0));
              return (
                <button
                  key={s}
                  id={`${groupId}-${s}`}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-disabled={n === 0}
                  aria-label={n === 0 ? fill(t.common.soldOutSize, { size: s }) : s}
                  tabIndex={tabbable ? 0 : -1}
                  className="chip min-w-12"
                  onClick={() => {
                    if (n === 0) return;
                    setSize(s);
                    setQty(1);
                    setError(null);
                  }}
                >
                  {s}
                </button>
              );
            })}
          </div>
          <p id={errorId} className="mt-2 min-h-5 text-sm text-danger" role={error ? "alert" : undefined}>
            {error}
          </p>
        </div>
      )}

      <p className="text-sm" aria-live="polite">
        {soldOutAll ? (
          <span className="text-danger">{t.common.outOfStock}</span>
        ) : stockForSize != null ? (
          stockForSize === 0 ? (
            <span className="text-danger">{t.common.outOfStock}</span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-success">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              {fill(t.common.stockLeft, { n: stockForSize })}
            </span>
          )
        ) : (
          <span className="text-taupe">{t.common.selectSize}</span>
        )}
      </p>

      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-center rounded-full border border-line bg-paper" role="group" aria-label={t.common.quantity}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label={t.common.decrease}
          >
            <Minus size={16} aria-hidden="true" />
          </button>
          <output className="w-8 text-center tabular-nums" aria-live="polite" aria-label={t.common.quantity}>
            {qty}
          </output>
          <button
            type="button"
            className="icon-btn"
            onClick={() => setQty((q) => Math.min(Math.max(1, maxQty), q + 1))}
            disabled={qty >= maxQty}
            aria-label={t.common.increase}
          >
            <Plus size={16} aria-hidden="true" />
          </button>
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          disabled={soldOutAll || (size != null && maxQty === 0)}
          className="btn btn-accent relative min-w-48 flex-1 overflow-hidden"
          data-testid="add-to-bag"
        >
          <AnimatePresence mode="wait" initial={false}>
            {justAdded ? (
              <motion.span key="ok" className="inline-flex items-center gap-2" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}>
                <Check size={17} aria-hidden="true" /> {t.common.addedToBag}
              </motion.span>
            ) : (
              <motion.span key="add" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -16, opacity: 0 }}>
                {t.common.addToBag}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <div className={`flex flex-wrap gap-2 ${compact ? "" : "border-b border-line pb-5"}`}>
        <button
          type="button"
          onClick={() => actions.toggleWishlist(product.id)}
          aria-pressed={inWishlist}
          className="btn btn-outline btn-sm"
        >
          <Heart size={15} className={inWishlist ? "fill-burgundy text-burgundy" : ""} aria-hidden="true" />
          {inWishlist ? t.common.wishlistRemove : t.common.wishlistAdd}
        </button>
        <button
          type="button"
          onClick={() => actions.toggleCompare(product.id)}
          aria-pressed={inCompare}
          disabled={!inCompare && shop.compare.length >= 4}
          className="btn btn-outline btn-sm"
        >
          <GitCompare size={15} aria-hidden="true" />
          {inCompare ? t.common.compareRemove : !inCompare && shop.compare.length >= 4 ? t.common.compareFull : t.common.compareAdd}
        </button>
      </div>
    </div>
  );
}
