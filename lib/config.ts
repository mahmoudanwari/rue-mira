export const LOCALES = ["en", "nl", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-BE",
  nl: "nl-BE",
  fr: "fr-BE",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  fr: "Français",
};

/** Public origin used for canonical URLs, hreflang and the sitemap. Configurable per deploy. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rue-mira.mahmoudanwari.com").replace(/\/$/, "");

/** Empty for a custom (sub)domain; "/repo-name" only for username.github.io/repo-name previews. */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Prefix a public asset path with the base path and encode spaces safely. */
export function assetUrl(path: string): string {
  return BASE_PATH + encodeURI(path);
}
