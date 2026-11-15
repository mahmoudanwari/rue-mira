"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Eye, GitCompare, Heart, Plus } from "lucide-react";
import { useId, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { isOneSize, totalStock, type Product } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";
import { useProductActions } from "./useProductActions";

export function sizeLabel(size: string, oneSize: string) {
  return size === "One Size" ? oneSize : size;
}

export function ProductCard({
  product: initial,
  priority = false,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw",
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
}) {
  const { t, fill, money, href } = useI18n();
  const shop = useShop();
  const ui = useUI();
  const actions = useProductActions();
  // Live product (Demo Studio overrides) once hydrated; seed product for the static HTML.
  const product = shop.productById(initial.id) ?? initial;
  const [picking, setPicking] = useState(false);
  const sizesId = useId();

  const inWishlist = shop.wishlist.includes(product.id);
  const inCompare = shop.compare.includes(product.id);
  const soldOut = totalStock(product) === 0;
  const name = product.copy.name;
  const url = href(`/products/${product.slug}/`);
  const available = product.sizes.filter((s) => (product.stock[s] ?? 0) > 0);

  const quickAdd = () => {
    if (isOneSize(product)) {
      actions.add(product.id, "One Size");
      return;
    }
    setPicking((v) => !v);
  };

  return (
    <article className="group relative flex flex-col" aria-label={name}>
      <div className="relative">
        <Link href={url} className="block focus-visible:outline-offset-4" aria-label={name} tabIndex={-1}>
          <AssetImage
            src={product.images[0]}
            alt={fill(t.product.imageAlt, { name, color: product.copy.color })}
            ratio="3 / 4"
            sizes={sizes}
            priority={priority}
            className="rounded-sm"
            imgClassName="transition-transform duration-[1.2s] ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
          />
          <AssetImage
            src={product.images[1]}
            alt=""
            sizes={sizes}
            className="!absolute inset-0 rounded-sm opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:hidden"
          />
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.isNew && (
            <span className="rounded-full bg-bone/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
              {t.common.newLabel}
            </span>
          )}
          {soldOut && (
            <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-bone">
              {t.common.outOfStock}
            </span>
          )}
        </div>

        <div className="absolute right-2 top-2 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => actions.toggleWishlist(product.id)}
            aria-pressed={inWishlist}
            aria-label={`${inWishlist ? t.common.wishlistRemove : t.common.wishlistAdd}: ${name}`}
            className="icon-btn bg-bone/85 backdrop-blur hover:bg-bone"
          >
            <motion.span key={String(inWishlist)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} className="inline-flex">
              <Heart
                size={18}
                strokeWidth={1.5}
                className={inWishlist ? "fill-burgundy text-burgundy" : ""}
                aria-hidden="true"
              />
            </motion.span>
          </button>
          <button
            type="button"
            onClick={() => actions.toggleCompare(product.id)}
            aria-pressed={inCompare}
            aria-label={`${inCompare ? t.common.compareRemove : t.common.compareAdd}: ${name}`}
            title={!inCompare && shop.compare.length >= 4 ? t.common.compareFull : undefined}
            className={`icon-btn backdrop-blur transition-opacity md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 ${
              inCompare ? "bg-ink text-bone md:opacity-100" : "bg-bone/85 hover:bg-bone"
            }`}
          >
            <GitCompare size={17} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <div className="absolute inset-x-2 bottom-2 flex flex-col gap-2">
          <AnimatePresence>
            {picking && (
              <motion.div
                id={sizesId}
                role="group"
                aria-label={`${t.common.selectSize}: ${name}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="flex flex-wrap justify-center gap-1.5 rounded-xl bg-bone/95 p-2 shadow-lg backdrop-blur"
              >
                {product.sizes.map((s) => {
                  const out = (product.stock[s] ?? 0) === 0;
                  return (
                    <button
                      key={s}
                      type="button"
                      className="chip !min-h-9 !min-w-10 !px-2.5"
                      disabled={out}
                      aria-label={out ? fill(t.common.soldOutSize, { size: s }) : `${t.common.size} ${s}`}
                      onClick={() => {
                        actions.add(product.id, s);
                        setPicking(false);
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex gap-1.5 transition-all duration-300 md:translate-y-2 md:opacity-0 md:group-focus-within:translate-y-0 md:group-focus-within:opacity-100 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            <button
              type="button"
              onClick={quickAdd}
              disabled={soldOut}
              aria-expanded={isOneSize(product) ? undefined : picking}
              aria-controls={isOneSize(product) ? undefined : sizesId}
              className="btn btn-light btn-sm flex-1 !px-3 shadow-sm"
            >
              <Plus size={15} aria-hidden="true" />
              <span>
                {t.common.quickAdd}
                <span className="sr-only">: {name}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => ui.setQuickViewId(product.id)}
              className="icon-btn !h-10 !w-10 bg-bone shadow-sm hover:bg-white"
              aria-label={`${t.common.quickView}: ${name}`}
            >
              <Eye size={17} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="display text-[1.3rem] !leading-[1.15]">
            <Link href={url} className="link-underline">
              {name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-taupe">
            <span
              className="inline-block h-3 w-3 shrink-0 rounded-full ring-1 ring-ink/15"
              style={{ backgroundColor: product.colorHex }}
              aria-hidden="true"
            />
            <span>{product.copy.color}</span>
          </p>
          <p className="mt-1 text-xs text-taupe">
            <span className="sr-only">{t.common.sizes}: </span>
            {isOneSize(product)
              ? t.common.oneSize
              : available.length
                ? available.join(" · ")
                : t.common.outOfStock}
          </p>
        </div>
        <p className="shrink-0 pt-0.5 text-[0.9375rem] font-medium tabular-nums">{money(product.price)}</p>
      </div>
    </article>
  );
}
