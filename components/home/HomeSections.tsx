"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Eye } from "lucide-react";
import { useId, useState } from "react";
import { LookImage } from "@/components/lookbook/LookCard";
import { AssetImage } from "@/components/ui/AssetImage";
import { Reveal } from "@/components/ui/Reveal";
import { IMAGE_MAP, type Product } from "@/lib/catalog";
import type { Look } from "@/lib/catalog/lookbook";
import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";

export function SectionHeading({ id, title, sub, link, linkLabel }: { id: string; title: string; sub?: string; link?: string; linkLabel?: string }) {
  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 id={id} className="display text-4xl md:text-5xl">
          {title}
        </h2>
        {sub && <p className="mt-2 max-w-lg text-sm text-taupe">{sub}</p>}
      </div>
      {link && linkLabel && (
        <Link href={link} className="link-underline inline-flex items-center gap-1.5 self-start text-sm font-semibold sm:self-auto">
          {linkLabel} <ArrowRight size={15} aria-hidden="true" />
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
          <p className="eyebrow">{t.home.editorialEyebrow}</p>
          <h2 id="editorial-title" className="display text-5xl md:text-6xl text-balance">
            {t.home.editorialTitle}
          </h2>
          <p className="max-w-md leading-relaxed text-ink/80">{t.home.editorialBody}</p>
          <Link href={href("/shop/?q=work")} className="btn btn-primary mt-2">
            {t.home.editorialCta}
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
          <p className="eyebrow">{t.home.spotlightEyebrow}</p>
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
            <Link href={href(`/products/${p.slug}/`)} className="btn btn-primary">
              {t.home.spotlightCta}
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
  return (
    <section aria-labelledby="weekend-title" className="relative mt-24 md:mt-36">
      <div className="relative min-h-[34rem] overflow-hidden md:min-h-[40rem]">
        <AssetImage src={IMAGE_MAP.campaigns["campaign-weekend-edit"]} alt="" className="!absolute inset-0 h-full w-full" sizes="100vw" imgClassName="object-[60%_50%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent md:bg-gradient-to-r md:from-ink/60 md:via-ink/10" aria-hidden="true" />
        <div className="container-rm relative flex min-h-[34rem] flex-col justify-end py-12 text-white md:min-h-[40rem] md:justify-center">
          <Reveal className="max-w-lg">
            <p className="eyebrow !text-white/85">{t.home.weekendEyebrow}</p>
            <h2 id="weekend-title" className="display mt-3 text-5xl md:text-7xl">
              {t.home.weekendTitle}
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
                  <span className="eyebrow shrink-0 transition-colors group-hover:text-burgundy">{t.categories[p.cat].label} →</span>
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
        <p className="eyebrow">{t.home.manifestoEyebrow}</p>
        <h2 id="manifesto-title" className="display mt-5 text-5xl italic text-burgundy md:text-7xl text-balance">
          {t.home.manifestoTitle}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">{t.home.manifestoBody}</p>
        <Link href={href("/about/")} className="btn btn-outline mt-8">
          {t.home.manifestoCta}
        </Link>
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
      <div className="grid overflow-hidden rounded-sm bg-rose-soft md:grid-cols-2">
        <AssetImage src={IMAGE_MAP.campaigns["newsletter-still-life"]} alt="" className="min-h-64 md:min-h-full" sizes="(min-width: 768px) 50vw, 100vw" />
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
