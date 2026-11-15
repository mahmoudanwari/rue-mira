"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CircleCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { INTL_LOCALE } from "@/lib/config";
import type { DemoOrder } from "@/lib/demo-orders";
import { useI18n } from "@/lib/i18n/client";
import { useShop } from "@/lib/store";

export function OrderHistory({ orders }: { orders: DemoOrder[] }) {
  const { t, money, locale } = useI18n();
  const fmt = new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "medium", timeStyle: "short" });
  if (!orders.length) return <p className="text-sm text-taupe">{t.confirmation.none}</p>;
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full min-w-[32rem] text-sm" data-testid="order-history">
        <thead>
          <tr className="border-b border-ink/20 text-left">
            <th scope="col" className="py-2 pr-4">{t.studio.orderCode}</th>
            <th scope="col" className="py-2 pr-4">{t.studio.orderDate}</th>
            <th scope="col" className="py-2 pr-4">{t.studio.orderItems}</th>
            <th scope="col" className="py-2 text-right">{t.studio.orderTotal}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.code} className="border-b border-line">
              <th scope="row" className="py-2 pr-4 text-left font-mono text-xs font-medium">{o.code}</th>
              <td className="py-2 pr-4">{fmt.format(new Date(o.createdAt))}</td>
              <td className="py-2 pr-4">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
              <td className="py-2 text-right tabular-nums">{money(o.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Confirmation() {
  const { t, money, href, locale } = useI18n();
  const shop = useShop();
  const [code, setCode] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the order code from the static page's query string
    setCode(new URLSearchParams(window.location.search).get("code"));
  }, []);

  if (!shop.hydrated) return <div className="h-96 animate-pulse rounded-sm bg-paper" aria-hidden="true" />;
  const order = shop.orders.find((o) => o.code === code) ?? (code ? undefined : shop.orders[0]);
  const fmt = new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long", timeStyle: "short" });

  return (
    <div className="mx-auto max-w-3xl">
      {order ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-sm bg-paper p-6 sm:p-10">
          <CircleCheck size={40} strokeWidth={1.25} className="text-success" aria-hidden="true" />
          <h1 className="display mt-4 text-5xl">{t.confirmation.title}</h1>
          <p className="mt-4 rounded-lg bg-rose-soft px-4 py-3 text-sm" role="note">
            {t.confirmation.note}
          </p>
          <dl className="mt-6 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="eyebrow">{t.confirmation.code}</dt>
              <dd className="mt-1 font-mono text-lg font-semibold" data-testid="order-code">
                {order.code}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">{t.confirmation.placedAt}</dt>
              <dd className="mt-1 text-sm">{fmt.format(new Date(order.createdAt))}</dd>
            </div>
            <div>
              <dt className="eyebrow">{t.bag.total}</dt>
              <dd className="mt-1 text-lg font-semibold tabular-nums">{money(order.total)}</dd>
            </div>
          </dl>
          <ul className="mt-6 divide-y divide-line border-y border-line text-sm">
            {order.items.map((i) => {
              const p = shop.productById(i.productId);
              return (
                <li key={`${i.productId}-${i.size}`} className="flex justify-between gap-3 py-2">
                  <span>
                    {i.quantity} × {p?.copy.name ?? i.productId} <span className="text-taupe">({i.size === "One Size" ? t.common.oneSize : i.size})</span>
                  </span>
                  <span className="tabular-nums">{money(i.unitPrice * i.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <Link href={href("/shop/")} className="btn btn-primary mt-8">
            {t.common.continueShopping}
          </Link>
        </motion.div>
      ) : (
        <div className="rounded-sm bg-paper px-6 py-16 text-center">
          <h1 className="display text-4xl">{t.confirmation.noRecent}</h1>
          <Link href={href("/shop/")} className="btn btn-primary mt-8">
            {t.common.continueShopping}
          </Link>
        </div>
      )}
      <section aria-labelledby="history-title" className="mt-14">
        <h2 id="history-title" className="display mb-4 text-3xl">
          {t.confirmation.history}
        </h2>
        <OrderHistory orders={shop.orders} />
      </section>
    </div>
  );
}
