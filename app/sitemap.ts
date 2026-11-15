import type { MetadataRoute } from "next";
import { CATEGORY_IDS, SEED_PRODUCTS } from "@/lib/catalog";
import { BASE_PATH, LOCALES, SITE_URL } from "@/lib/config";
import { getContent } from "@/lib/content";
import { localePath } from "@/lib/i18n/paths";

export const dynamic = "force-static";

const STATIC_PATHS = [
  "/",
  "/shop/",
  "/new/",
  "/lookbook/",
  "/about/",
  "/journal/",
  "/contact/",
  "/help/",
  "/delivery-returns/",
  "/size-guide/",
  "/privacy/",
  "/terms/",
  "/demo/",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...STATIC_PATHS,
    ...CATEGORY_IDS.map((c) => `/collections/${c}/`),
    ...SEED_PRODUCTS.map((p) => `/products/${p.slug}/`),
    ...getContent("en").journal.stories.map((s) => `/journal/${s.slug}/`),
  ];
  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: SITE_URL + BASE_PATH + localePath(locale, path),
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [`${l}-BE`, SITE_URL + BASE_PATH + localePath(l, path)])),
      },
    })),
  );
}
