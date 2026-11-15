"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { IMAGE_MAP } from "@/lib/catalog";
import { assetUrl } from "@/lib/config";
import { useI18n } from "@/lib/i18n/client";
import { webpSrcSet } from "@/lib/images";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t, href } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  // "webp" → generated copies; "png" → originals only; "missing" → placeholder.
  const [stage, setStage] = useState<"webp" | "png" | "missing">("webp");
  const missing = stage === "missing";
  const desktop = IMAGE_MAP.campaigns["home-hero-desktop"];
  const mobile = IMAGE_MAP.campaigns["home-hero-mobile"];
  const desktopWebp = webpSrcSet(desktop);
  const mobileWebp = webpSrcSet(mobile);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);
  const words = t.home.heroTitle.split(" ");

  return (
    <section ref={ref} className="relative -mt-16 h-[calc(100svh-2.25rem)] min-h-[34rem] overflow-hidden bg-ink text-white lg:-mt-[4.5rem] lg:max-h-[56rem]">
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY }}
        initial={reduce ? false : { clipPath: "inset(12% 8% 12% 8%)", scale: 1.08 }}
        animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      >
        {missing ? (
          <div className="skeleton-photo h-full w-full" aria-hidden="true" />
        ) : (
          <picture>
            {stage === "webp" && desktopWebp && <source media="(min-width: 768px)" type="image/webp" srcSet={desktopWebp} sizes="100vw" />}
            <source media="(min-width: 768px)" srcSet={assetUrl(desktop)} />
            {stage === "webp" && mobileWebp && <source type="image/webp" srcSet={mobileWebp} sizes="100vw" />}
            <img
              src={assetUrl(mobile)}
              alt=""
              fetchPriority="high"
              loading="eager"
              onError={() => setStage((s) => (s === "webp" ? "png" : "missing"))}
              className="h-full w-full object-cover object-[50%_30%] md:object-[70%_40%]"
            />
          </picture>
        )}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/15 to-ink/35 md:bg-gradient-to-r md:from-ink/65 md:via-ink/20 md:to-transparent" aria-hidden="true" />

      <div className="container-rm relative flex h-full flex-col justify-end pb-14 pt-28 md:justify-center md:pb-0">
        <motion.p
          className="eyebrow !text-white/85"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          {t.home.heroEyebrow}
        </motion.p>
        <h1 className="display mt-4 max-w-[11ch] text-[3.4rem] leading-[0.95] xs:text-6xl md:text-7xl xl:text-[7.5rem]">
          {words.map((w, i) => (
            <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: "105%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.35 + i * 0.09, ease: EASE }}
              >
                {w}
                {i < words.length - 1 ? " " : ""}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
        >
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/90 md:text-lg">{t.home.heroSub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={href("/shop/")} className="btn btn-light">
              {t.home.heroCtaShop}
            </Link>
            <Link href={href("/new/")} className="btn border border-white/70 text-white hover:bg-white hover:text-ink">
              {t.home.heroCtaNew}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
