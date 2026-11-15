import type { Metadata } from "next";
import { BASE_PATH, LOCALES, SITE_URL, type Locale } from "./config";
import { getDictionary } from "./i18n";
import { localePath } from "./i18n/paths";

const OG_LOCALE: Record<Locale, string> = { en: "en_BE", nl: "nl_BE", fr: "fr_BE" };

/** Localized metadata with canonical URL and hreflang alternates for all three languages. */
export function pageMetadata(
  locale: Locale,
  path: string,
  opts: { title?: string; description?: string; image?: string; noindex?: boolean } = {},
): Metadata {
  const t = getDictionary(locale);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[`${l}-BE`] = SITE_URL + BASE_PATH + localePath(l, path);
  languages["x-default"] = SITE_URL + BASE_PATH + localePath("en", path);
  const title = opts.title ? `${opts.title} — RUE MIRA` : t.meta.siteTitle;
  const description = opts.description ?? t.meta.siteDescription;
  return {
    title,
    description,
    alternates: { canonical: SITE_URL + BASE_PATH + localePath(locale, path), languages },
    openGraph: {
      title,
      description,
      siteName: "RUE MIRA (portfolio demo)",
      locale: OG_LOCALE[locale],
      type: "website",
      images: opts.image ? [{ url: SITE_URL + BASE_PATH + encodeURI(opts.image) }] : undefined,
    },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
  };
}
