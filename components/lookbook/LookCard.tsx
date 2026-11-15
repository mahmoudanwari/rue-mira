"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { isOneSize } from "@/lib/catalog";
import type { Look } from "@/lib/catalog/lookbook";
import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";
import { useProductActions } from "@/components/shop/useProductActions";

/** A lookbook photograph with accessible HTML hotspot buttons for each product in the look. */
export function LookImage({ look, sizes = "(min-width: 1024px) 33vw, 100vw", priority = false }: { look: Look; sizes?: string; priority?: boolean }) {
  const { t, fill, money, href } = useI18n();
  const shop = useShop();
  const ui = useUI();
  const actions = useProductActions();
  const [active, setActive] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        wrapRef.current?.querySelector<HTMLButtonElement>(`[data-hotspot="${active}"]`)?.focus();
        setActive(null);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setActive(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [active]);

  return (
    <div ref={wrapRef} className="relative">
      <AssetImage src={look.image} alt="" ratio="4 / 5" sizes={sizes} priority={priority} className="rounded-sm" />
      {look.hotspots.map((h, i) => {
        const p = shop.productById(h.productId);
        if (!p) return null;
        const open = active === h.productId;
        const popId = `${look.id}-${h.productId}`;
        const anchor = h.x > 65 ? "right-0" : h.x < 35 ? "left-0" : "left-1/2 -translate-x-1/2";
        return (
          <div key={h.productId} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
            <motion.button
              type="button"
              data-hotspot={h.productId}
              aria-expanded={open}
              aria-controls={popId}
              aria-label={fill(t.lookbook.hotspot, { name: p.copy.name })}
              onClick={() => setActive(open ? null : h.productId)}
              className="relative -ml-5 -mt-5 flex h-10 w-10 items-center justify-center"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.12, type: "spring", stiffness: 300, damping: 18 }}
            >
              <span className="absolute inset-1.5 animate-ping rounded-full bg-white/50 motion-reduce:animate-none" aria-hidden="true" />
              <span
                className={`relative flex h-7 w-7 items-center justify-center rounded-full shadow-lg ring-1 ring-ink/10 transition ${
                  open ? "rotate-45 bg-ink text-bone" : "bg-bone text-ink"
                }`}
              >
                <Plus size={14} aria-hidden="true" />
              </span>
            </motion.button>
            <AnimatePresence>
              {open && (
                <motion.div
                  id={popId}
                  role="group"
                  aria-label={p.copy.name}
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.22 }}
                  className={`absolute ${h.y > 62 ? "bottom-6" : "top-6"} z-20 flex w-[min(15rem,calc(100vw-2.5rem))] gap-3 rounded-xl bg-bone p-2.5 text-ink shadow-2xl ${anchor}`}
                >
                  <AssetImage src={p.images[0]} alt="" ratio="3 / 4" className="w-16 shrink-0 rounded" sizes="64px" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Link href={href(`/products/${p.slug}/`)} className="text-sm font-semibold leading-snug hover:underline">
                      {p.copy.name}
                    </Link>
                    <span className="text-xs text-taupe">{p.copy.color}</span>
                    <span className="text-sm font-semibold tabular-nums">{money(p.price)}</span>
                    <div className="mt-auto flex gap-1.5">
                      {isOneSize(p) ? (
                        <button type="button" className="btn btn-primary btn-sm !min-h-8 !px-3 text-[10px]" onClick={() => actions.add(p.id, "One Size")}>
                          {t.common.addToBag}
                        </button>
                      ) : (
                        <button type="button" className="btn btn-primary btn-sm !min-h-8 !px-3 text-[10px]" onClick={() => ui.setQuickViewId(p.id)}>
                          {t.common.selectSize}
                        </button>
                      )}
                    </div>
                  </div>
                  <button type="button" onClick={() => setActive(null)} className="absolute right-1 top-1 rounded-full p-1 hover:bg-sand" aria-label={t.common.close}>
                    <X size={13} aria-hidden="true" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
