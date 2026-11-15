"use client";

import { Download, Eye, EyeOff, RotateCcw, Search, Upload } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { OrderHistory } from "@/components/checkout/Confirmation";
import { AssetImage } from "@/components/ui/AssetImage";
import { Dialog } from "@/components/ui/Dialog";
import { SEED_PRODUCTS, type Product } from "@/lib/catalog";
import { matchesQuery } from "@/lib/catalog/filter";
import { useI18n } from "@/lib/i18n/client";
import { useShop } from "@/lib/store";
import { buildStudioExport, parseStudioImport } from "@/lib/studio";

type Tab = "products" | "orders" | "data";

function PriceInput({ product }: { product: Product }) {
  const { t } = useI18n();
  const shop = useShop();
  const [value, setValue] = useState((product.price / 100).toFixed(2));
  const [error, setError] = useState(false);
  const id = useId();
  const commit = () => {
    const n = Number(value.replace(",", "."));
    if (!Number.isFinite(n) || n < 1 || n > 999) {
      setError(true);
      return;
    }
    setError(false);
    const cents = Math.round(n * 100);
    setValue((cents / 100).toFixed(2));
    shop.setOverride(product.id, { price: cents === product.basePrice ? undefined : cents });
  };
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {t.studio.priceEur}: {product.copy.name}
      </label>
      <input
        id={id}
        inputMode="decimal"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        aria-invalid={error}
        aria-describedby={error ? `${id}-e` : undefined}
        className="field !min-h-9 w-24 !py-1 text-sm tabular-nums"
      />
      {error && (
        <p id={`${id}-e`} className="mt-1 text-[11px] text-danger">
          {t.studio.invalidPrice}
        </p>
      )}
    </div>
  );
}

function StockInputs({ product }: { product: Product }) {
  const { t, fill } = useI18n();
  const shop = useShop();
  return (
    <div className="flex flex-wrap gap-1.5">
      {product.sizes.map((s) => (
        <label key={s} className="flex flex-col items-center text-[10px] text-taupe">
          {s === "One Size" ? t.common.oneSize : s}
          <input
            type="number"
            min={0}
            max={999}
            value={product.stock[s] ?? 0}
            onChange={(e) => {
              const n = Math.max(0, Math.min(999, Math.floor(Number(e.target.value) || 0)));
              shop.setOverride(product.id, { stock: { [s]: n } });
            }}
            aria-label={`${fill(t.studio.stockFor, { size: s })}: ${product.copy.name}`}
            className={`field !min-h-8 w-12 !px-1 !py-0.5 text-center text-xs tabular-nums ${(product.stock[s] ?? 0) === 0 ? "!border-danger" : ""}`}
          />
        </label>
      ))}
    </div>
  );
}

export function DemoStudio() {
  const { t, fill, money } = useI18n();
  const shop = useShop();
  const [tab, setTab] = useState<Tab>("products");
  const [q, setQ] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const list = useMemo(() => shop.products.filter((p) => matchesQuery(p, q, [p.id])), [shop.products, q]);
  const stats = {
    products: shop.products.length,
    hidden: shop.products.filter((p) => p.hidden).length,
    out: shop.products.reduce((s, p) => s + p.sizes.filter((x) => (p.stock[x] ?? 0) === 0).length, 0),
    orders: shop.orders.length,
  };

  const exportJson = () => {
    const blob = new Blob([buildStudioExport(shop.overrides)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rue-mira-studio-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 200_000 || !/\.json$/i.test(file.name)) {
      setMessage({ kind: "error", text: t.studio.importError });
      return;
    }
    const parsed = parseStudioImport(await file.text(), SEED_PRODUCTS);
    if (!parsed) setMessage({ kind: "error", text: t.studio.importError });
    else {
      shop.replaceOverrides(parsed);
      setMessage({ kind: "ok", text: fill(t.studio.importOk, { n: Object.keys(parsed).length }) });
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  if (!shop.hydrated) return <div className="h-96 animate-pulse rounded-sm bg-paper" aria-hidden="true" />;

  const tabs: { id: Tab; label: string }[] = [
    { id: "products", label: t.studio.products },
    { id: "orders", label: t.studio.orders },
    { id: "data", label: t.studio.data },
  ];

  return (
    <div>
      <section aria-label={t.studio.stats} className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          [t.studio.statProducts, stats.products],
          [t.studio.statHidden, stats.hidden],
          [t.studio.statOutOfStock, stats.out],
          [t.studio.statOrders, stats.orders],
        ].map(([label, n]) => (
          <div key={label as string} className="rounded-sm bg-paper p-4">
            <p className="text-xs text-taupe">{label}</p>
            <p className="display mt-1 text-4xl tabular-nums">{n}</p>
          </div>
        ))}
      </section>

      {message && (
        <p className={`mt-6 rounded-lg px-4 py-3 text-sm ${message.kind === "ok" ? "bg-sand" : "bg-rose-soft text-danger"}`} role="status">
          {message.text}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line">
        <div role="tablist" aria-label={t.studio.title} className="flex gap-1">
          {tabs.map((tb) => (
            <button
              key={tb.id}
              type="button"
              role="tab"
              id={`tab-${tb.id}`}
              aria-selected={tab === tb.id}
              aria-controls={`panel-${tb.id}`}
              tabIndex={tab === tb.id ? 0 : -1}
              onClick={() => setTab(tb.id)}
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                const i = tabs.findIndex((x) => x.id === tab);
                const nextTab = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
                setTab(nextTab.id);
                document.getElementById(`tab-${nextTab.id}`)?.focus();
              }}
              className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold ${tab === tb.id ? "border-ink" : "border-transparent text-taupe hover:text-ink"}`}
            >
              {tb.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => setConfirmOpen(true)} className="btn btn-outline btn-sm mb-2" data-testid="reset-demo">
          <RotateCcw size={14} aria-hidden="true" /> {t.studio.resetAll}
        </button>
      </div>

      <div id="panel-products" role="tabpanel" aria-labelledby="tab-products" hidden={tab !== "products"} className="mt-6">
        <label className="relative block max-w-sm">
          <span className="sr-only">{t.studio.search}</span>
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-taupe" aria-hidden="true" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.studio.search} className="field !rounded-full !pl-9" />
        </label>
        <div className="-mx-4 mt-4 overflow-x-auto px-4">
          <table className="w-full min-w-[52rem] text-sm" data-testid="studio-table">
            <thead>
              <tr className="border-b border-ink/20 text-left text-xs uppercase tracking-wider text-taupe">
                <th scope="col" className="py-2 pr-3">{t.studio.products}</th>
                <th scope="col" className="py-2 pr-3">{t.studio.priceEur}</th>
                <th scope="col" className="py-2 pr-3">{t.common.stock}</th>
                <th scope="col" className="py-2 pr-3">{t.studio.visible}</th>
                <th scope="col" className="py-2"><span className="sr-only">{t.studio.resetProduct}</span></th>
              </tr>
            </thead>
            <tbody>
              {list.map((p) => {
                const edited = Boolean(shop.overrides[p.id]);
                return (
                  <tr key={p.id} className={`border-b border-line align-middle ${p.hidden ? "opacity-60" : ""}`}>
                    <th scope="row" className="py-3 pr-3 text-left font-normal">
                      <div className="flex items-center gap-3">
                        <AssetImage src={p.images[0]} alt="" ratio="3 / 4" className="w-10 shrink-0 rounded-sm" sizes="40px" />
                        <div>
                          <p className="font-medium">{p.copy.name}</p>
                          <p className="text-xs text-taupe">
                            <span className="font-mono">{p.id}</span> · {t.categories[p.category].label} · {money(p.basePrice)}
                            {edited && <span className="ml-2 rounded-full bg-rose px-1.5 py-0.5 text-[10px] text-ink">{t.studio.edited}</span>}
                          </p>
                        </div>
                      </div>
                    </th>
                    <td className="py-3 pr-3">
                      <PriceInput key={`${p.id}-${p.price}`} product={p} />
                    </td>
                    <td className="py-3 pr-3">
                      <StockInputs product={p} />
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!p.hidden}
                        aria-label={fill(t.studio.toggleVisibility, { name: p.copy.name })}
                        onClick={() => shop.setOverride(p.id, { hidden: !p.hidden })}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${p.hidden ? "bg-line" : "bg-success/15 text-success"}`}
                      >
                        {p.hidden ? <EyeOff size={13} aria-hidden="true" /> : <Eye size={13} aria-hidden="true" />}
                        {p.hidden ? t.studio.hidden : t.studio.visible}
                      </button>
                    </td>
                    <td className="py-3 text-right">
                      <button type="button" disabled={!edited} onClick={() => shop.setOverride(p.id, null)} className="btn btn-outline btn-sm !min-h-8 !px-3 text-[10px]">
                        {t.studio.resetProduct}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div id="panel-orders" role="tabpanel" aria-labelledby="tab-orders" hidden={tab !== "orders"} className="mt-6">
        {shop.orders.length ? <OrderHistory orders={shop.orders} /> : <p className="text-sm text-taupe">{t.studio.ordersEmpty}</p>}
      </div>

      <div id="panel-data" role="tabpanel" aria-labelledby="tab-data" hidden={tab !== "data"} className="mt-6 max-w-xl space-y-6">
        <div>
          <button type="button" onClick={exportJson} className="btn btn-primary">
            <Download size={16} aria-hidden="true" /> {t.studio.exportJson}
          </button>
        </div>
        <div>
          <label htmlFor="studio-import" className="btn btn-outline">
            <Upload size={16} aria-hidden="true" /> {t.studio.importJson}
          </label>
          <input
            ref={fileRef}
            id="studio-import"
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={(e) => importJson(e.target.files?.[0])}
          />
          <p className="mt-2 text-sm text-taupe">{t.studio.importHelp}</p>
        </div>
      </div>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} title={t.studio.resetAll} closeLabel={t.common.close} variant="center" className="!max-w-md">
        <div className="space-y-6 p-6">
          <p className="leading-relaxed">{t.studio.resetConfirm}</p>
          <div className="flex justify-end gap-2">
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirmOpen(false)} data-autofocus>
              {t.common.cancel}
            </button>
            <button
              type="button"
              className="btn btn-accent btn-sm"
              data-testid="confirm-reset"
              onClick={() => {
                shop.resetDemo();
                setConfirmOpen(false);
                setMessage({ kind: "ok", text: t.studio.resetDone });
              }}
            >
              {t.common.confirm}
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
