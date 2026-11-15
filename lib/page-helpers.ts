import type { Metadata } from "next";
import type { Locale } from "./config";
import { getDictionary, type Dictionary } from "./i18n";
import { localePath } from "./i18n/paths";
import { pageMetadata } from "./seo";

type Params = { params: Promise<{ locale: string }> };

/** Shorthand for simple locale pages: metadata factory + locale/dictionary resolution. */
export function simpleMeta(path: string, title: (t: Dictionary) => string, opts: { noindex?: boolean; description?: (t: Dictionary) => string } = {}) {
  return async ({ params }: Params): Promise<Metadata> => {
    const locale = (await params).locale as Locale;
    const t = getDictionary(locale);
    return pageMetadata(locale, path, { title: title(t), description: opts.description?.(t), noindex: opts.noindex });
  };
}

export async function resolveLocale({ params }: Params) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  const home = { href: localePath(locale, "/"), label: t.nav.home };
  return { locale, t, home };
}
