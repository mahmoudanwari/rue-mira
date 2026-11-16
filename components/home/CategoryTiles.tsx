"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Accent } from "@/components/ui/Accent";
import { AssetImage } from "@/components/ui/AssetImage";
import { CATEGORY_IDS, collectionImage } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n/client";

const TILES = [...CATEGORY_IDS, "new-arrivals"] as const;

export function CategoryMarquee() {
  const { t } = useI18n();
  const words = TILES.map((c) => t.categories[c].label);
  return (
    <div className="marquee-wrap overflow-hidden border-y border-line bg-paper py-4" aria-hidden="true">
      <div className="marquee">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {words.map((w) => (
              <span key={`${k}-${w}`} className="display flex items-center whitespace-nowrap px-6 text-3xl italic text-ink/80 md:text-4xl">
                {w}
                <span className="ml-12 inline-block h-1.5 w-1.5 rotate-45 bg-burgundy" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CategoryTiles() {
  const { t, href } = useI18n();
  return (
    <section aria-labelledby="cat-title" className="container-rm mt-20 md:mt-28">
      <div className="mb-10 flex items-end justify-between gap-6 border-b border-line pb-6">
        <h2 id="cat-title" className="display text-4xl md:text-[3.5rem]">
          <Accent text={t.home.categoriesTitle} />
        </h2>
        <Link href={href("/shop/")} className="arrow-link hidden shrink-0 items-center gap-1.5 text-sm font-semibold sm:inline-flex">
          <span className="link-underline">{t.common.viewAll}</span>
          <ArrowUpRight size={15} className="arrow" aria-hidden="true" />
        </Link>
      </div>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-3 relative overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-4 md:gap-4">
        {TILES.map((c, i) => (
          <motion.li
            key={c}
            className="w-[62vw] shrink-0 snap-start sm:w-auto"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5%" }}
            transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href={href(c === "new-arrivals" ? "/new/" : `/collections/${c}/`)} className="group relative block overflow-hidden rounded-sm">
              <AssetImage
                src={collectionImage(c)}
                alt=""
                ratio="3 / 4"
                sizes="(min-width: 768px) 24vw, 62vw"
                imgClassName="transition-transform duration-[1.4s] ease-[var(--ease-editorial)] [@media(hover:hover)]:group-hover:scale-[1.04] motion-reduce:transition-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 text-white">
                <span>
                  <span className="display block text-2xl md:text-3xl">{t.categories[c].label}</span>
                  <span className="mt-1 block text-xs text-white/85 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
                    {t.categories[c].blurb}
                  </span>
                </span>
                <ArrowUpRight size={20} className="shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
