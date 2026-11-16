"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Eye } from "lucide-react";
import { useId, useState } from "react";
import { LookImage } from "@/components/lookbook/LookCard";
import { AssetImage } from "@/components/ui/AssetImage";
import { Accent } from "@/components/ui/Accent";
import { Reveal } from "@/components/ui/Reveal";
import { IMAGE_MAP, type Product } from "@/lib/catalog";
import type { Look } from "@/lib/catalog/lookbook";
import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";

export function SectionHeading({ id, title, sub, link, linkLabel }: { id: string; title: string; sub?: string; link?: string; linkLabel?: string }) {
  return (
    <div className="mb-10 flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id={id} className="display text-4xl text-balance md:text-[3.5rem]">
          <Accent text={title} />
        </h2>
        {sub && <p className="mt-2 max-w-lg text-sm text-taupe">{sub}</p>}
      </div>
      {link && linkLabel && (
        <Link href={link} className="arrow-link group inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-semibold sm:self-auto">
          <span className="link-underline">{linkLabel}</span>
          <ArrowRight size={15} className="arrow" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export function EditorialSplit() {
  const { t, href } = useI18n();
  return (
    <section aria-labelledby="editorial-title" className="mt-24 md:mt-36">
      <div className="container-rm grid items-center gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-16">
        <Reveal>
          <AssetImage src={IMAGE_MAP.campaigns["campaign-city-essentials"]} alt="" ratio="16 / 9" sizes="(min-width: 1024px) 60vw, 100vw" className="rounded-sm" />
        </Reveal>
        <Reveal delay={0.1} className="flex flex-col items-start gap-5">
          <h2 id="editorial-title" className="display text-5xl md:text-6xl text-balance">
            <Accent text={t.home.editorialTitle} />
          </h2>
          <p className="max-w-md leading-relaxed text-ink/80">{t.home.editorialBody}</p>
          <Link href={href("/shop/?q=work")} className="btn btn-primary group mt-2">
            {t.home.editorialCta}
            <ArrowRight size={16} className="arrow" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

export function Spotlight({ product: initial }: { product: Product }) {
  const { t, money, href } = useI18n();
  const shop = useShop();
  const ui = useUI();
  const p = shop.productById(initial.id) ?? initial;
  const [view, setView] = useState<0 | 1>(0);
  const tabsId = useId();
  return (
    <section aria-labelledby="spotlight-title" className="mt-24 bg-sand py-20 md:mt-36 md:py-28">
      <div className="container-rm grid items-center gap-10 md:grid-cols-2 lg:gap-20">
        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -left-4 -top-4 hidden h-full w-full rounded-sm border border-champagne md:block" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "3 / 4" }} id={`${tabsId}-panel`} role="tabpanel">
            <AnimatePresence initial={false}>
              <motion.div
                key={view}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <AssetImage src={p.images[view]} alt={`${p.copy.name} — ${view === 0 ? t.product.viewMain : t.product.viewDetail}`} className="h-full w-full" sizes="(min-width: 768px) 40vw, 90vw" />
              </motion.div>
            </AnimatePresence>
          </div>
          <div role="tablist" aria-label={t.product.gallery} className="absolute bottom-3 left-3 flex gap-1 rounded-full bg-bone/90 p-1 backdrop-blur">
            {([0, 1] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={view === v}
                aria-controls={`${tabsId}-panel`}
                onClick={() => setView(v)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${view === v ? "bg-ink text-bone" : "hover:bg-sand"}`}
              >
                {v === 0 ? t.product.viewMain : t.product.viewDetail}
              </button>
            ))}
          </div>
        </div>
        <Reveal className="flex flex-col items-start gap-5">
          <h2 id="spotlight-title" className="display text-5xl md:text-7xl">
            {p.copy.name}
          </h2>
          <p className="max-w-md leading-relaxed text-ink/80">{p.copy.description}</p>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <dt className="text-taupe">{t.common.material}</dt>
            <dd>{p.copy.material}</dd>
            <dt className="text-taupe">{t.common.colour}</dt>
            <dd className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full ring-1 ring-ink/20" style={{ backgroundColor: p.colorHex }} aria-hidden="true" />
              {p.copy.color}
            </dd>
            <dt className="text-taupe">{t.common.price}</dt>
            <dd className="font-semibold tabular-nums">{money(p.price)}</dd>
          </dl>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href={href(`/products/${p.slug}/`)} className="btn btn-primary group">
              {t.home.spotlightCta}
              <ArrowRight size={16} className="arrow" aria-hidden="true" />
            </Link>
            <button type="button" className="btn btn-outline" onClick={() => ui.setQuickViewId(p.id)}>
              <Eye size={16} aria-hidden="true" /> {t.common.quickView}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function WeekendEdit() {
  const { t, href } = useI18n();
  const moods = [
    { q: "work", label: t.home.moods.work },
    { q: "weekend", label: t.home.moods.weekend },
    { q: "occasion", label: t.home.moods.occasion },
    { q: "everyday", label: t.home.moods.everyday },
  ];
  // The photo is 16:9. Phones show it at that shape with the text below (no cropping);
  // large screens use a 16:9 frame with the text over the photo.
  return (
    <section aria-labelledby="weekend-title" className="on-dark relative mt-24 bg-ink text-white lg:mt-36 lg:bg-transparent">
      <div className="relative">
        <AssetImage src={IMAGE_MAP.campaigns["campaign-weekend-edit"]} alt="" ratio="16 / 9" sizes="100vw" />
        <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/80 via-ink/40 to-transparent lg:block" aria-hidden="true" />
        <div className="container-rm py-10 lg:absolute lg:inset-0 lg:flex lg:items-center lg:py-0">
          <Reveal className="max-w-lg">
            <h2 id="weekend-title" className="display text-5xl lg:text-6xl xl:text-7xl">
              <Accent text={t.home.weekendTitle} />
            </h2>
            <p className="mt-4 leading-relaxed text-white/90">{t.home.weekendBody}</p>
            <ul className="mt-7 flex flex-wrap gap-2">
              {moods.map((m) => (
                <li key={m.q}>
                  <Link
                    href={href(`/shop/?q=${m.q}`)}
                    className="inline-flex min-h-11 items-center rounded-full border border-white/70 px-5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white hover:text-ink"
                  >
                    {m.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function AccessoryPromos() {
  const { t, href } = useI18n();
  const promos = [
    { img: IMAGE_MAP.campaigns["campaign-bag-feature"], title: t.home.bagsPromo, cat: "handbags" as const, offset: "md:mt-0" },
    { img: IMAGE_MAP.campaigns["campaign-shoes-feature"], title: t.home.shoesPromo, cat: "shoes" as const, offset: "md:mt-24" },
    { img: IMAGE_MAP.campaigns["campaign-jewellery-feature"], title: t.home.jewelleryPromo, cat: "jewellery" as const, offset: "md:mt-12" },
  ];
  return (
    <section aria-labelledby="acc-title" className="container-rm mt-24 md:mt-36">
      <SectionHeading id="acc-title" title={t.home.accessoriesTitle} />
      <ul className="grid gap-10 md:grid-cols-3 md:gap-6">
        {promos.map((p, i) => (
          <li key={p.cat} className={p.offset}>
            <Reveal delay={i * 0.1}>
              <Link href={href(`/collections/${p.cat}/`)} className="group block">
                <div className="overflow-hidden rounded-sm">
                  <AssetImage
                    src={p.img}
                    alt=""
                    ratio="4 / 5"
                    sizes="(min-width: 768px) 32vw, 100vw"
                    imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="display text-3xl">{p.title}</h3>
                  <span className="arrow-link eyebrow inline-flex shrink-0 items-center gap-1 transition-colors group-hover:text-burgundy">
                    {t.categories[p.cat].label}
                    <ArrowRight size={13} className="arrow" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function LookbookPreview({ looks }: { looks: Look[] }) {
  const { t, href } = useI18n();
  return (
    <section aria-labelledby="lb-title" className="mt-24 bg-paper py-20 md:mt-36 md:py-28">
      <div className="container-rm">
        <SectionHeading id="lb-title" title={t.home.lookbookTitle} sub={t.home.lookbookSub} link={href("/lookbook/")} linkLabel={t.home.lookbookCta} />
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {looks.map((look, i) => (
            <li key={look.id} className={i % 3 === 1 ? "md:translate-y-10" : ""}>
              <LookImage look={look} sizes="(min-width: 768px) 30vw, 50vw" />
              <p className="mt-3 flex items-baseline justify-between gap-2">
                <span className="display text-xl md:text-2xl">{look.title}</span>
                <span className="text-xs text-taupe">0{i + 1}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Manifesto() {
  const { t, href } = useI18n();
  return (
    <section aria-labelledby="manifesto-title" className="container-rm mt-24 md:mt-40">
      <Reveal className="mx-auto max-w-4xl text-center">
        {/* A hairline with a small burgundy lozenge: the brand's printed-journal ornament. */}
        <div className="ornament mx-auto mb-10 max-w-xs" aria-hidden="true" />
        <h2 id="manifesto-title" className="display text-5xl text-balance md:text-7xl">
          <Accent text={t.home.manifestoTitle} />
        </h2>
        <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-ink/80 text-pretty">{t.home.manifestoBody}</p>
        <Link href={href("/about/")} className="btn btn-outline group mt-9">
          {t.home.manifestoCta}
          <ArrowRight size={16} className="arrow" aria-hidden="true" />
        </Link>
        <div className="ornament mx-auto mt-14 max-w-xs" aria-hidden="true" />
      </Reveal>
    </section>
  );
}

export function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "invalid">("idle");
  const inputId = useId();
  return (
    <section aria-labelledby="nl-title" className="container-rm mt-24 md:mt-36">
      <div className="grid items-center overflow-hidden rounded-sm bg-rose-soft md:grid-cols-2">
        <AssetImage src={IMAGE_MAP.campaigns["newsletter-still-life"]} alt="" ratio="16 / 9" className="self-center" sizes="(min-width: 768px) 50vw, 100vw" />
        <div className="flex flex-col justify-center gap-4 p-8 md:p-14">
          <h2 id="nl-title" className="display text-4xl md:text-5xl">
            {t.home.newsletterTitle}
          </h2>
          <p className="text-sm leading-relaxed text-ink/80">{t.home.newsletterBody}</p>
          {state === "done" ? (
            <p role="status" className="rounded-lg bg-bone p-4 text-sm">
              {t.home.newsletterDone}
            </p>
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                // Demo only: the value never leaves this component and is cleared immediately.
                if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                  setEmail("");
                  setState("done");
                } else setState("invalid");
              }}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <label htmlFor={inputId} className="sr-only">
                {t.home.newsletterPlaceholder}
              </label>
              <input
                id={inputId}
                type="email"
                autoComplete="off"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setState("idle");
                }}
                placeholder={t.home.newsletterPlaceholder}
                aria-invalid={state === "invalid"}
                aria-describedby={state === "invalid" ? `${inputId}-err` : undefined}
                className="field flex-1 !bg-bone"
              />
              <button type="submit" className="btn btn-primary shrink-0">
                {t.home.newsletterCta}
              </button>
            </form>
          )}
          {state === "invalid" && (
            <p id={`${inputId}-err`} className="text-sm text-danger" role="alert">
              {t.home.newsletterInvalid}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
