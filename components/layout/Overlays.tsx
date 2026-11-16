"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BagLines, FreeShippingMeter, TotalsTable, useBag } from "@/components/checkout/BagContents";
import { Gallery } from "@/components/product/Gallery";
import { PurchasePanel } from "@/components/product/PurchasePanel";
import { SizeGuideTables } from "@/components/product/SizeGuideTables";
import { AssetImage } from "@/components/ui/AssetImage";
import { Dialog } from "@/components/ui/Dialog";
import { cartCount } from "@/lib/cart";
import type { SiteContent } from "@/lib/content";
import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";

export function BagDrawer() {
  const ui = useUI();
  const { t, fill, href } = useI18n();
  const { lines, shop } = useBag();
  const n = cartCount(shop.cart);
  const close = () => ui.setBagOpen(false);
  return (
    <Dialog
      open={ui.bagOpen}
      onClose={close}
      title={`${t.bag.title} (${n === 1 ? t.common.item : fill(t.common.items, { n })})`}
      closeLabel={t.common.close}
      variant="right"
      footer={
        lines.length > 0 ? (
          <div className="space-y-4">
            <TotalsTable />
            <div className="grid gap-2">
              <Link href={href("/checkout/")} onClick={close} className="btn btn-accent w-full">
                {t.bag.checkout}
              </Link>
              <Link href={href("/bag/")} onClick={close} className="btn btn-outline w-full">
                {t.bag.viewBag}
              </Link>
            </div>
          </div>
        ) : undefined
      }
    >
      <div className="px-5">
        {lines.length === 0 ? (
          <div className="flex flex-col items-start gap-4 py-12">
            <p className="display text-3xl">{t.bag.empty}</p>
            <p className="text-sm text-taupe">{t.bag.emptyHint}</p>
            <Link href={href("/shop/")} onClick={close} className="btn btn-primary">
              {t.common.continueShopping}
            </Link>
          </div>
        ) : (
          <>
            <div className="pt-4">
              <FreeShippingMeter />
            </div>
            <BagLines onNavigate={close} />
          </>
        )}
      </div>
    </Dialog>
  );
}

/** Small, non-modal confirmation after adding to bag. */
export function BagToast() {
  const ui = useUI();
  const shop = useShop();
  const { t, href, money } = useI18n();
  const [visible, setVisible] = useState<typeof ui.lastAdded>(null);

  useEffect(() => {
    if (!ui.lastAdded) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- show the toast for each new add event
    setVisible(ui.lastAdded);
    const id = window.setTimeout(() => setVisible(null), 4200);
    return () => window.clearTimeout(id);
  }, [ui.lastAdded]);

  const p = visible ? shop.productById(visible.productId) : undefined;
  return (
    <div className="pointer-events-none fixed inset-x-3 top-20 z-[70] flex justify-end sm:inset-x-6 lg:top-24">
      <AnimatePresence>
        {visible && p && !ui.bagOpen && (
          <motion.div
            key={visible.at}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto flex w-full max-w-sm gap-3 rounded-2xl border border-line bg-bone p-3 shadow-2xl"
            data-testid="bag-toast"
          >
            <AssetImage src={p.images[0]} alt="" ratio="3 / 4" className="w-16 shrink-0 rounded" sizes="64px" />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-success">
                <Check size={14} aria-hidden="true" /> {t.bag.miniTitle}
              </p>
              <p className="truncate text-sm font-medium">{p.copy.name}</p>
              <p className="text-xs text-taupe">
                {visible.size === "One Size" ? t.common.oneSize : visible.size} · {money(p.price)}
              </p>
              <div className="mt-2 flex gap-2">
                <button type="button" className="btn btn-primary btn-sm !min-h-8 !px-3" onClick={() => ui.setBagOpen(true)}>
                  {t.bag.viewBag}
                </button>
                <Link href={href("/checkout/")} className="btn btn-outline btn-sm !min-h-8 !px-3">
                  {t.checkout.title}
                </Link>
              </div>
            </div>
            <button type="button" className="icon-btn !h-8 !w-8" onClick={() => setVisible(null)} aria-label={t.common.close}>
              <X size={16} aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function QuickView() {
  const ui = useUI();
  const shop = useShop();
  const { t, href } = useI18n();
  const p = ui.quickViewId ? shop.productById(ui.quickViewId) : undefined;
  return (
    <Dialog
      open={Boolean(p)}
      onClose={() => ui.setQuickViewId(null)}
      title={p ? `${t.common.quickView}: ${p.copy.name}` : t.common.quickView}
      hideTitle
      closeLabel={t.common.close}
      variant="center"
    >
      {p && (
        <div className="grid gap-6 p-4 sm:p-6 md:grid-cols-2 md:gap-10">
          <Gallery product={p} enableZoom={false} />
          <div className="flex flex-col gap-4 md:pt-6">
            <p className="eyebrow">{t.categories[p.category].label}</p>
            <h3 className="display text-4xl">{p.copy.name}</h3>
            <p className="text-sm leading-relaxed text-ink/80">{p.copy.description}</p>
            <PurchasePanel product={p} compact />
            <Link href={href(`/products/${p.slug}/`)} onClick={() => ui.setQuickViewId(null)} className="link-underline self-start text-sm font-semibold">
              {t.common.viewProduct} <ArrowRight size={14} className="arrow ml-1 inline" aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </Dialog>
  );
}

export function CompareTray() {
  const shop = useShop();
  const { t, fill, href, locale } = useI18n();
  const pathname = usePathname() ?? "";
  const hide = pathname.startsWith(`/${locale}/compare`) || pathname.startsWith(`/${locale}/checkout`);
  const items = shop.compare.map((id) => shop.productById(id)).filter((p) => p !== undefined);
  return (
    <AnimatePresence>
      {items.length > 0 && !hide && (
        <motion.aside
          aria-label={t.compare.tray}
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-30 mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-line bg-bone/95 p-2.5 shadow-2xl backdrop-blur sm:bottom-5"
        >
          <ul className="flex flex-1 gap-1.5 relative overflow-x-auto no-scrollbar">
            {items.map((p) => (
              <li key={p.id} className="relative shrink-0">
                <AssetImage src={p.images[0]} alt={p.copy.name} ratio="3 / 4" className="w-11 rounded" sizes="44px" />
                <button
                  type="button"
                  onClick={() => shop.toggleCompare(p.id)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-bone"
                  aria-label={`${t.common.compareRemove}: ${p.copy.name}`}
                >
                  <X size={11} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="text-xs text-taupe underline" onClick={shop.clearCompare}>
            {t.compare.clear}
          </button>
          <Link href={href("/compare/")} className="btn btn-primary btn-sm shrink-0">
            {fill(t.compare.compareNow, { n: items.length })}
          </Link>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

export function SizeGuideDrawer({ guide }: { guide: SiteContent["sizeGuide"] }) {
  const ui = useUI();
  const { t } = useI18n();
  return (
    <Dialog open={ui.sizeGuideOpen} onClose={() => ui.setSizeGuideOpen(false)} title={t.product.sizeGuide} closeLabel={t.common.close} variant="right" className="!max-w-lg">
      <div className="p-5">
        <p className="mb-6 text-sm text-taupe">{guide.intro}</p>
        <SizeGuideTables guide={guide} />
      </div>
    </Dialog>
  );
}

export function LiveRegion() {
  const ui = useUI();
  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {ui.announcement}
    </div>
  );
}

export function StorageWarning() {
  const shop = useShop();
  const { t } = useI18n();
  if (!shop.hydrated || shop.storageOk) return null;
  return (
    <p className="bg-rose-soft px-4 py-2 text-center text-xs" role="note">
      {t.common.storageWarning}
    </p>
  );
}
