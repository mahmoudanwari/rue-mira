"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
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
    // Phones: the 4:5 photo is shown whole and the headline starts over the dress, below her face.
    // Tablets and up: full-screen photo with the text beside the model.
    <section ref={ref} className="relative -mt-16 overflow-hidden bg-ink text-white md:h-[calc(100svh-2.25rem)] md:min-h-[34rem] lg:-mt-[4.5rem] lg:max-h-[56rem]">
      <motion.div
        className="relative aspect-[4/5] md:absolute md:inset-0 md:aspect-auto"
        style={{ y: imageY, transformOrigin: "50% 0%" }}
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
              // Anchored to the photo's top edge: on wide, short screens the 16:9 desktop photo is trimmed
              // top and bottom, and the model's face sits near the top — so trim the pavement, not her head.
              className="h-full w-full object-cover object-[50%_30%] md:object-[70%_0%]"
            />
          </picture>
        )}
        {/* Phones: soft shade under the header, and the photo fading into the dark text area below. */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/45 to-transparent md:hidden" aria-hidden="true" />
      </motion.div>
      {/* Phones: the photo (125vw tall) fades into the dark text area. Drawn over the photo edge, 2px past it,
          so the half-pixel bottom edge of the photo can never show as a light line. */}
      <div className="absolute inset-x-0 top-[56.25vw] h-[calc(68.75vw+2px)] bg-gradient-to-t from-ink from-[3px] via-ink/55 to-transparent md:hidden" aria-hidden="true" />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-ink/65 via-ink/20 to-transparent md:block" aria-hidden="true" />

      <div className="container-rm relative -mt-[46vw] flex flex-col pb-14 md:mt-0 md:h-full md:justify-center md:pb-0 md:pt-28">
        <h1 className="display max-w-[11ch] text-[3.4rem] leading-[0.95] xs:text-6xl md:text-7xl xl:text-[7.5rem]">
          {words.map((w, i) => (
            <span key={`${w}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span
                className={`inline-block ${i === words.length - 1 ? "italic text-rose" : ""}`}
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
            <Link href={href("/shop/")} className="btn btn-light group">
              {t.home.heroCtaShop}
              <ArrowRight size={16} className="arrow" aria-hidden="true" />
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
