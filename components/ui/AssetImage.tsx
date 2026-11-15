"use client";

import { useEffect, useRef, useState } from "react";
import { assetUrl } from "@/lib/config";
import { webpSrcSet } from "@/lib/images";

declare global {
  interface Window {
    __RUE_MIRA_MISSING_IMAGES__?: Set<string>;
  }
}

interface AssetImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Above-the-fold images: eager + high fetch priority. */
  priority?: boolean;
  sizes?: string;
  /** CSS aspect-ratio for layout stability, e.g. "3 / 4". Omit when the parent sizes the box. */
  ratio?: string;
  draggable?: boolean;
}

/**
 * Loads only local supplied photographs: the generated WebP copies first (responsive srcset),
 * then the original PNG if a WebP copy fails. If the original is missing too it renders a neutral,
 * clearly non-photographic placeholder (never a substitute picture) and logs the path in development.
 */
export function AssetImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  priority = false,
  sizes,
  ratio,
  draggable,
}: AssetImageProps) {
  const webp = webpSrcSet(src);
  // "webp" → try WebP copies; "png" → original only; "missing" → placeholder.
  const [stage, setStage] = useState<"webp" | "png" | "missing">(webp ? "webp" : "png");
  const missing = stage === "missing";
  const ref = useRef<HTMLImageElement>(null);

  const onFail = () => {
    if (stage === "webp") {
      setStage("png");
      return;
    }
    setStage("missing");
    if (typeof window !== "undefined") {
      window.__RUE_MIRA_MISSING_IMAGES__ ??= new Set();
      window.__RUE_MIRA_MISSING_IMAGES__.add(src);
      if (process.env.NODE_ENV !== "production") console.warn(`[RUE MIRA] Missing image asset: ${src}`);
    }
  };

  // An error can fire before hydration attaches onError, so check once after mount.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) onFail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const style = ratio ? { aspectRatio: ratio } : undefined;

  if (missing) {
    const file = src.split("/").pop();
    return (
      <div
        className={`skeleton-photo relative flex items-center justify-center overflow-hidden ${className}`}
        style={style}
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        data-missing-asset={src}
      >
        <span className="mx-3 rounded bg-paper/80 px-2 py-1 text-center text-[10px] leading-tight tracking-wide text-taupe">
          {process.env.NODE_ENV !== "production" ? `Missing: ${file}` : "RUE MIRA"}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-sand ${className}`} style={style}>
      <picture>
        {stage === "webp" && webp && <source type="image/webp" srcSet={webp} sizes={sizes ?? "100vw"} />}
        <img
          ref={ref}
          src={assetUrl(src)}
          alt={alt}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          draggable={draggable}
          onError={onFail}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      </picture>
    </div>
  );
}
