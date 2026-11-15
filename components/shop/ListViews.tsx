"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { BagLines, FreeShippingMeter, PromoForm, ShippingChoice, TotalsTable, useBag } from "@/components/checkout/BagContents";
import { AssetImage } from "@/components/ui/AssetImage";
import { isOneSize } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";
import { ProductGrid } from "./ProductGrid";
import { useProductActions } from "./useProductActions";

function Empty({ title, hint }: { title: string; hint: string }) {
  const { t, href } = useI18n();
  return (
    <div className="rounded-sm bg-paper px-6 py-20 text-center">
      <p className="display text-4xl">{title}</p>
      <p className="mx-auto mt-3 max-w-sm text-sm text-taupe">{hint}</p>
      <Link href={href("/shop/")} className="btn btn-primary mt-8">
        {t.common.continueShopping}
      </Link>
    </div>
  );
}

function Loading() {
  return <div className="h-64 animate-pulse rounded-sm bg-paper" aria-hidden="true" />;
}

export function WishlistView() {
  const { t, fill } = useI18n();
  const shop = useShop();
  if (!shop.hydrated) return <Loading />;
  const items = shop.wishlist.map((id) => shop.productById(id)).filter((p) => p !== undefined);
  if (!items.length) return <Empty title={t.wishlist.empty} hint={t.wishlist.emptyHint} />;
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-taupe" aria-live="polite">
          {items.length === 1 ? t.common.item : fill(t.common.items, { n: items.length })}
        </p>
        <button type="button" className="link-underline inline-flex items-center gap-1.5 text-sm" onClick={shop.clearWishlist}>
          <Trash2 size={14} aria-hidden="true" /> {t.wishlist.clear}
        </button>
      </div>
      <ProductGrid products={items} skipHidden={false} />
    </div>
  );
}

export function CompareView() {
  const { t, money, href } = useI18n();
  const shop = useShop();
  const ui = useUI();
  const actions = useProductActions();
  if (!shop.hydrated) return <Loading />;
  const items = shop.compare.map((id) => shop.productById(id)).filter((p) => p !== undefined);
  if (!items.length) return <Empty title={t.compare.empty} hint={t.compare.emptyHint} />;
  const crossCategory = new Set(items.map((p) => p.category)).size > 1;

  const rows: { label: string; render: (p: (typeof items)[number]) => React.ReactNode }[] = [
    { label: t.common.category, render: (p) => t.categories[p.category].label },
    { label: t.common.price, render: (p) => <span className="font-semibold tabular-nums">{money(p.price)}</span> },
    { label: t.common.material, render: (p) => <span className="capitalize">{p.copy.material}</span> },
    {
      label: t.common.colour,
      render: (p) => (
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full ring-1 ring-ink/20" style={{ backgroundColor: p.colorHex }} aria-hidden="true" />
          {p.copy.color}
        </span>
      ),
    },
    { label: t.common.sizes, render: (p) => (isOneSize(p) ? t.common.oneSize : p.sizes.join(" · ")) },
    {
      label: t.common.stock,
      render: (p) => (
        <ul className="space-y-0.5 text-xs">
          {p.sizes.map((s) => (
            <li key={s} className={(p.stock[s] ?? 0) === 0 ? "text-danger" : ""}>
              {s === "One Size" ? t.common.oneSize : s}: {p.stock[s] ?? 0}
            </li>
          ))}
        </ul>
      ),
    },
    { label: t.common.newLabel, render: (p) => (p.isNew ? "✓" : "—") },
    { label: t.product.description, render: (p) => <span className="text-xs leading-relaxed">{p.copy.description}</span> },
  ];

  return (
    <div>
      {crossCategory && (
        <p className="mb-6 rounded-lg bg-sand px-4 py-3 text-sm" role="note">
          {t.compare.crossCategory}
        </p>
      )}
      <div className="flex items-center justify-between">
        <p className="text-sm text-taupe">{t.compare.max}</p>
        <button type="button" className="link-underline text-sm" onClick={shop.clearCompare}>
          {t.compare.clear}
        </button>
      </div>
      <div className="-mx-4 mt-4 relative overflow-x-auto px-4">
        <table className="w-full min-w-[40rem] table-fixed border-collapse text-sm" data-testid="compare-table">
          <caption className="sr-only">{t.compare.title}</caption>
          <thead>
            <tr>
              <th scope="col" className="w-32 text-left align-bottom">
                <span className="sr-only">{t.compare.attribute}</span>
              </th>
              {items.map((p) => (
                <th key={p.id} scope="col" className="p-2 text-left align-top font-normal">
                  <div className="relative">
                    <Link href={href(`/products/${p.slug}/`)} className="block" tabIndex={-1} aria-hidden="true">
                      <AssetImage src={p.images[0]} alt="" ratio="3 / 4" className="rounded-sm" sizes="200px" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => actions.toggleCompare(p.id)}
                      className="icon-btn absolute right-1 top-1 bg-bone/90"
                      aria-label={`${t.common.compareRemove}: ${p.copy.name}`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                  <Link href={href(`/products/${p.slug}/`)} className="link-underline mt-2 block font-medium">
                    {p.copy.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="py-3 pr-3 text-left align-top text-xs font-semibold uppercase tracking-wider text-taupe">
                  {r.label}
                </th>
                {items.map((p) => (
                  <td key={p.id} className="p-2 py-3 align-top">
                    {r.render(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-t border-line">
              <td />
              {items.map((p) => (
                <td key={p.id} className="p-2 py-4">
                  {isOneSize(p) ? (
                    <button type="button" className="btn btn-primary btn-sm w-full" onClick={() => actions.add(p.id, "One Size")}>
                      {t.common.addToBag}
                    </button>
                  ) : (
                    <button type="button" className="btn btn-outline btn-sm w-full" onClick={() => ui.setQuickViewId(p.id)}>
                      {t.common.selectSize}
                    </button>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BagView() {
  const { t, href } = useI18n();
  const { lines, shop } = useBag();
  if (!shop.hydrated) return <Loading />;
  if (!lines.length) return <Empty title={t.bag.empty} hint={t.bag.emptyHint} />;
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <div>
        <FreeShippingMeter />
        <BagLines />
        {shop.wishlist.length > 0 && (
          <Link href={href("/wishlist/")} className="link-underline mt-6 inline-flex items-center gap-2 text-sm">
            <Heart size={15} aria-hidden="true" /> {t.nav.wishlist} ({shop.wishlist.length})
          </Link>
        )}
      </div>
      <aside aria-labelledby="summary-title" className="h-fit space-y-6 rounded-sm bg-paper p-6 lg:sticky lg:top-24">
        <h2 id="summary-title" className="display text-3xl">
          {t.bag.summary}
        </h2>
        <ShippingChoice />
        <PromoForm />
        <TotalsTable />
        <Link href={href("/checkout/")} className="btn btn-accent w-full" data-testid="to-checkout">
          {t.bag.checkout}
        </Link>
        <p className="text-xs text-taupe">{t.checkout.disclaimer}</p>
      </aside>
    </div>
  );
}
