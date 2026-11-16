"use client";

import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { AssetImage } from "@/components/ui/AssetImage";
import { Reveal } from "@/components/ui/Reveal";
import { isOneSize } from "@/lib/catalog";
import type { Look } from "@/lib/catalog/lookbook";
import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";
import { useProductActions } from "@/components/shop/useProductActions";
import { LookImage } from "./LookCard";

export function LookbookView({ looks }: { looks: Look[] }) {
  const { t, money, href } = useI18n();
  const shop = useShop();
  const ui = useUI();
  const actions = useProductActions();

  return (
    <ol className="container-rm mt-14 space-y-24 md:space-y-32">
      {looks.map((look, i) => {
        const products = look.productIds.map((id) => shop.productById(id)).filter((p) => p !== undefined);
        return (
          <li key={look.id} id={look.id} aria-labelledby={`${look.id}-title`} className="scroll-mt-28">
            <div className={`grid items-start gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <Reveal>
                <LookImage look={look} sizes="(min-width: 768px) 45vw, 100vw" priority={i === 0} />
              </Reveal>
              <Reveal delay={0.1} className="md:sticky md:top-28">
                <h2 id={`${look.id}-title`} className="display text-5xl md:text-6xl">
                  {look.title}
                  <span className="ml-3 align-top font-sans text-sm font-medium tabular-nums text-taupe">0{i + 1}</span>
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-ink/80">{look.note}</p>
                <h3 className="eyebrow mb-3 mt-8 !text-ink">{t.lookbook.piecesInLook}</h3>
                <ul className="divide-y divide-line border-y border-line">
                  {products.map((p) => (
                    <li key={p.id} className="flex items-center gap-4 py-3">
                      <AssetImage src={p.images[0]} alt="" ratio="3 / 4" className="w-14 shrink-0 rounded-sm" sizes="56px" />
                      <div className="min-w-0 flex-1">
                        <Link href={href(`/products/${p.slug}/`)} className="link-underline text-sm font-medium">
                          {p.copy.name}
                        </Link>
                        <p className="text-xs text-taupe">
                          {t.categories[p.category].label} · {money(p.price)}
                        </p>
                      </div>
                      {isOneSize(p) ? (
                        <button
                          type="button"
                          className="icon-btn border border-line"
                          onClick={() => actions.add(p.id, "One Size")}
                          aria-label={`${t.common.addToBag}: ${p.copy.name}`}
                          disabled={(p.stock["One Size"] ?? 0) === 0}
                        >
                          <Plus size={17} aria-hidden="true" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="icon-btn border border-line"
                          onClick={() => ui.setQuickViewId(p.id)}
                          aria-label={`${t.common.quickView}: ${p.copy.name}`}
                        >
                          <Eye size={17} aria-hidden="true" />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
