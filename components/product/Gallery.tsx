"use client";

import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { Dialog } from "@/components/ui/Dialog";
import type { Product } from "@/lib/catalog";
import { assetUrl } from "@/lib/config";
import { largestWebp } from "@/lib/images";
import { useI18n } from "@/lib/i18n/client";

export function Gallery({ product, priority = false, enableZoom = true }: { product: Product; priority?: boolean; enableZoom?: boolean }) {
  const { t, fill } = useI18n();
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  // If a WebP copy fails in the zoom view, fall back to the original PNG.
  const [zoomFallback, setZoomFallback] = useState(false);
  const name = product.copy.name;
  const views = [
    { src: product.images[0], label: t.product.viewMain, alt: fill(t.product.imageAlt, { name, color: product.copy.color }) },
    { src: product.images[1], label: t.product.viewDetail, alt: fill(t.product.detailAlt, { name }) },
  ];
  const go = (d: number) => setIndex((i) => (i + d + views.length) % views.length);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  return (
    <section aria-label={t.product.gallery} aria-roledescription="carousel" onKeyDown={onKey} className="flex flex-col gap-3 md:flex-row-reverse">
      <div className="relative flex-1 lg:max-w-[calc((100svh_-_12.5rem)*0.75)]">
        <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "3 / 4" }}>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} / ${views.length}: ${views[index].label}`}
            >
              <AssetImage
                src={views[index].src}
                alt={views[index].alt}
                className="h-full w-full"
                priority={priority && index === 0}
                sizes="(min-width: 1024px) 45vw, 100vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
          <div className="flex gap-1">
            <button type="button" className="icon-btn bg-bone/85 backdrop-blur" onClick={() => go(-1)} aria-label={t.common.previousImage}>
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            <button type="button" className="icon-btn bg-bone/85 backdrop-blur" onClick={() => go(1)} aria-label={t.common.nextImage}>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
          {enableZoom && (
            <button type="button" className="btn btn-light btn-sm shadow" onClick={() => setZoomOpen(true)}>
              <ZoomIn size={15} aria-hidden="true" />
              {t.product.zoom}
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 md:w-20 md:flex-col" role="tablist" aria-label={t.product.gallery}>
        {views.map((v, i) => (
          <button
            key={v.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={v.label}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className={`w-16 overflow-hidden rounded-sm ring-offset-2 ring-offset-bone transition md:w-full ${
              i === index ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100"
            }`}
          >
            <AssetImage src={v.src} alt="" ratio="3 / 4" sizes="80px" />
          </button>
        ))}
      </div>

      {enableZoom && (
        <Dialog
          open={zoomOpen}
          onClose={() => {
            setZoomOpen(false);
            setZoomed(false);
          }}
          title={fill(t.product.zoomTitle, { name })}
          closeLabel={t.common.close}
          variant="full"
          headerExtra={
            <div className="flex gap-1">
              <button type="button" className="icon-btn" onClick={() => go(-1)} aria-label={t.common.previousImage}>
                <ChevronLeft size={20} aria-hidden="true" />
              </button>
              <button type="button" className="icon-btn" onClick={() => go(1)} aria-label={t.common.nextImage}>
                <ChevronRight size={20} aria-hidden="true" />
              </button>
            </div>
          }
        >
          <div className="flex h-full items-center justify-center bg-paper p-2" onKeyDown={onKey}>
            <button
              type="button"
              className={`relative h-full max-h-[calc(100dvh-5rem)] overflow-hidden ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
              style={{ aspectRatio: "3 / 4" }}
              aria-label={zoomed ? t.common.close : t.product.zoom}
              aria-pressed={zoomed}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
                setZoomed((z) => !z);
              }}
              onMouseMove={(e) => {
                if (!zoomed) return;
                const r = e.currentTarget.getBoundingClientRect();
                setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- full-resolution local asset */}
              <img
                src={zoomFallback ? assetUrl(views[index].src) : (largestWebp(views[index].src) ?? assetUrl(views[index].src))}
                onError={() => setZoomFallback(true)}
                alt={views[index].alt}
                className="h-full w-full object-contain transition-transform duration-300"
                style={{ transform: zoomed ? "scale(2.2)" : "scale(1)", transformOrigin: origin }}
              />
            </button>
          </div>
        </Dialog>
      )}
    </section>
  );
}
