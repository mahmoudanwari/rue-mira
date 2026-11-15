"use client";

import { ChevronDown, Package, RotateCcw } from "lucide-react";
import { Gallery } from "@/components/product/Gallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { relatedProducts, type Product } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n/client";
import { useShop } from "@/lib/store";

function Disclosure({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details className="group border-b border-line" open={open}>
      <summary className="flex min-h-14 list-none items-center justify-between gap-4 text-sm font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <ChevronDown size={18} className="transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-ink/80">{children}</div>
    </details>
  );
}

export function ProductDetail({ product: seed, all }: { product: Product; all: Product[] }) {
  const { t, fill } = useI18n();
  const shop = useShop();
  const product = shop.productById(seed.id) ?? seed;
  const related = relatedProducts(shop.hydrated ? shop.products : all, product);

  return (
    <>
      {product.hidden && (
        <p className="container-rm mt-4 rounded-lg bg-rose-soft px-4 py-3 text-sm" role="note">
          {t.product.hiddenNotice}
        </p>
      )}
      <div className="container-rm mt-6 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <Gallery product={product} priority />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="eyebrow">
            {t.categories[product.category].label}
            {product.isNew && <span className="ml-3 rounded-full bg-rose px-2 py-0.5 text-ink">{t.common.newLabel}</span>}
          </p>
          <h1 className="display mt-3 text-5xl md:text-6xl">{product.copy.name}</h1>
          <p className="mt-4 leading-relaxed text-ink/80">{product.copy.description}</p>
          <p className="mt-3 text-xs text-taupe">{fill(t.product.photoNote, { color: product.copy.color })}</p>
          <div className="mt-8">
            <PurchasePanel product={product} />
          </div>
          <div className="mt-2">
            <Disclosure title={t.product.details} open>
              <dl className="grid grid-cols-[8rem_1fr] gap-y-2">
                <dt className="text-taupe">{t.common.category}</dt>
                <dd>{t.categories[product.category].label}</dd>
                <dt className="text-taupe">{t.common.colour}</dt>
                <dd>{product.copy.color}</dd>
                <dt className="text-taupe">{t.common.material}</dt>
                <dd className="capitalize">{product.copy.material}</dd>
                <dt className="text-taupe">{t.common.sizes}</dt>
                <dd>{product.sizes.map((s) => (s === "One Size" ? t.common.oneSize : s)).join(" · ")}</dd>
                <dt className="text-taupe">ID</dt>
                <dd className="font-mono text-xs">{product.id}</dd>
              </dl>
            </Disclosure>
            <Disclosure title={t.product.materialCare}>
              <p className="capitalize-first">{product.copy.material}.</p>
              <p className="mt-2">{t.product.care}</p>
            </Disclosure>
            <Disclosure title={t.pages.deliveryReturns}>
              <p className="flex gap-2">
                <Package size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {t.product.deliveryNote}
              </p>
              <p className="mt-2 flex gap-2">
                <RotateCcw size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                {t.product.returnsNote}
              </p>
            </Disclosure>
          </div>
        </div>
      </div>

      <section aria-labelledby="related-title" className="container-rm mt-24">
        <h2 id="related-title" className="display mb-8 text-4xl">
          {t.product.related}
        </h2>
        <ProductGrid products={related} />
      </section>
    </>
  );
}
