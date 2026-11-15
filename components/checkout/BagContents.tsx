"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { lineKey, MAX_QTY_PER_LINE, type CartLine } from "@/lib/cart";
import type { Product } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n/client";
import { computeTotals, type ShippingMethod } from "@/lib/money";
import { useShop } from "@/lib/store";

export interface PricedCartLine extends CartLine {
  product: Product;
}

export function useBag() {
  const shop = useShop();
  const lines: PricedCartLine[] = shop.cart.flatMap((l) => {
    const product = shop.productById(l.productId);
    return product ? [{ ...l, product }] : [];
  });
  const totals = computeTotals(
    lines.map((l) => ({ unitPrice: l.product.price, quantity: l.quantity })),
    { promo: shop.promo, shipping: shop.shippingMethod },
  );
  return { lines, totals, shop };
}

export function BagLines({ onNavigate, readOnly = false }: { onNavigate?: () => void; readOnly?: boolean }) {
  const { t, money, href } = useI18n();
  const { lines, shop } = useBag();
  return (
    <ul className="divide-y divide-line">
      {lines.map((l) => {
        const key = lineKey(l);
        const max = Math.min(MAX_QTY_PER_LINE, l.product.stock[l.size] ?? 0);
        return (
          <li key={key} className="flex gap-4 py-4" data-testid="bag-line">
            <Link href={href(`/products/${l.product.slug}/`)} onClick={onNavigate} className="w-20 shrink-0" tabIndex={-1} aria-hidden="true">
              <AssetImage src={l.product.images[0]} alt="" ratio="3 / 4" className="rounded-sm" sizes="80px" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-start justify-between gap-3">
                <Link href={href(`/products/${l.product.slug}/`)} onClick={onNavigate} className="link-underline font-medium">
                  {l.product.copy.name}
                </Link>
                <span className="font-semibold tabular-nums">{money(l.product.price * l.quantity)}</span>
              </div>
              <p className="text-xs text-taupe">
                {l.product.copy.color} · {t.common.size}: {l.size === "One Size" ? t.common.oneSize : l.size} · {money(l.product.price)}
              </p>
              {readOnly ? (
                <p className="text-sm">
                  {t.common.quantity}: {l.quantity}
                </p>
              ) : (
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-line" role="group" aria-label={`${t.common.quantity}: ${l.product.copy.name}`}>
                    <button
                      type="button"
                      className="icon-btn !h-9 !w-9"
                      onClick={() => shop.setLineQuantity(key, l.quantity - 1)}
                      aria-label={`${t.common.decrease}: ${l.product.copy.name}`}
                    >
                      <Minus size={14} aria-hidden="true" />
                    </button>
                    <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">
                      {l.quantity}
                    </span>
                    <button
                      type="button"
                      className="icon-btn !h-9 !w-9"
                      onClick={() => shop.setLineQuantity(key, l.quantity + 1)}
                      disabled={l.quantity >= max}
                      aria-label={`${t.common.increase}: ${l.product.copy.name}`}
                    >
                      <Plus size={14} aria-hidden="true" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-taupe hover:text-danger"
                    onClick={() => shop.removeLine(key)}
                    aria-label={`${t.common.remove}: ${l.product.copy.name} (${l.size})`}
                  >
                    <Trash2 size={14} aria-hidden="true" /> {t.common.remove}
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function PromoForm() {
  const { t, fill } = useI18n();
  const { shop } = useBag();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  if (shop.promo) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-rose-soft px-3 py-2 text-sm" role="status">
        <span>{fill(t.bag.promoApplied, { code: shop.promo })}</span>
        <button type="button" className="link-underline text-xs" onClick={() => shop.setPromo(null)}>
          {t.bag.promoRemove}
        </button>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(!shop.setPromo(code));
      }}
      noValidate
    >
      <label htmlFor="promo" className="label">
        {t.bag.promoLabel}
      </label>
      <div className="flex gap-2">
        <input
          id="promo"
          className="field !min-h-11 uppercase"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setError(false);
          }}
          placeholder={t.bag.promoPlaceholder}
          aria-invalid={error}
          aria-describedby={error ? "promo-error" : undefined}
          autoComplete="off"
        />
        <button type="submit" className="btn btn-outline btn-sm !min-h-11 shrink-0">
          {t.bag.promoApply}
        </button>
      </div>
      {error && (
        <p id="promo-error" className="mt-1.5 text-sm text-danger" role="alert">
          {t.bag.promoInvalid}
        </p>
      )}
    </form>
  );
}

export function ShippingChoice({ name = "shipping" }: { name?: string }) {
  const { t, money } = useI18n();
  const { shop, totals } = useBag();
  const options: { id: ShippingMethod; label: string; desc: string; price: string }[] = [
    { id: "home", label: t.bag.shippingHome, desc: t.checkout.homeDesc, price: totals.subtotal >= 7000 ? t.bag.free : money(495) },
    { id: "pickup", label: t.bag.shippingPickup, desc: t.checkout.pickupDesc, price: money(295) },
  ];
  return (
    <fieldset className="grid gap-2">
      <legend className="label">{t.bag.shippingEstimate}</legend>
      {options.map((o) => (
        <label
          key={o.id}
          className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
            shop.shippingMethod === o.id ? "border-ink bg-paper" : "border-line hover:border-champagne"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={o.id}
            checked={shop.shippingMethod === o.id}
            onChange={() => shop.setShippingMethod(o.id)}
            className="mt-1 accent-burgundy"
          />
          <span className="flex-1">
            <span className="block text-sm font-semibold">{o.label}</span>
            <span className="block text-xs text-taupe">{o.desc}</span>
          </span>
          <span className="text-sm font-semibold tabular-nums">{o.price}</span>
        </label>
      ))}
    </fieldset>
  );
}

export function TotalsTable() {
  const { t, fill, money } = useI18n();
  const { totals, shop } = useBag();
  return (
    <div>
      <dl className="grid grid-cols-[1fr_auto] gap-y-2 text-sm" data-testid="totals">
        <dt>{t.bag.subtotal}</dt>
        <dd className="text-right tabular-nums">{money(totals.subtotal)}</dd>
        {totals.discount > 0 && (
          <>
            <dt className="text-burgundy">{fill(t.bag.discount, { code: shop.promo ?? "" })}</dt>
            <dd className="text-right tabular-nums text-burgundy">−{money(totals.discount)}</dd>
          </>
        )}
        <dt>
          {t.bag.shipping} <span className="text-taupe">({shop.shippingMethod === "home" ? t.bag.shippingHome : t.bag.shippingPickup})</span>
        </dt>
        <dd className="text-right tabular-nums">{totals.shipping === 0 && totals.subtotal > 0 ? t.bag.free : money(totals.shipping)}</dd>
        <dt className="border-t border-line pt-3 text-base font-semibold">{t.bag.total}</dt>
        <dd className="border-t border-line pt-3 text-right text-base font-semibold tabular-nums" data-testid="grand-total">
          {money(totals.total)}
        </dd>
      </dl>
      <p className="mt-2 text-xs text-taupe">{fill(t.bag.vatIncluded, { amount: money(totals.vatIncluded) })}</p>
      {totals.subtotal > 0 && shop.shippingMethod === "home" && (
        <p className="mt-1 text-xs text-taupe">
          {totals.amountToFreeShipping > 0 ? fill(t.bag.toFree, { amount: money(totals.amountToFreeShipping) }) : t.bag.freeReached}
        </p>
      )}
      <p className="mt-1 text-xs text-taupe">{t.bag.ratesFictional}</p>
    </div>
  );
}

export function FreeShippingMeter() {
  const { totals } = useBag();
  const pct = Math.min(100, Math.round((totals.subtotal / 7000) * 100));
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-line" aria-hidden="true">
      <div className="h-full rounded-full bg-burgundy transition-[width] duration-700" style={{ width: `${pct}%` }} />
    </div>
  );
}
