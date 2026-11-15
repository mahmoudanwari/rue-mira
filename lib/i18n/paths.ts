import { LOCALES, type Locale } from "../config";

/** Build a locale-prefixed path with a trailing slash, preserving ?query and #hash. */
export function localePath(locale: Locale, path = "/"): string {
  const [pathAndQuery, hash] = path.split("#");
  const [p, query] = pathAndQuery.split("?");
  let clean = p.startsWith("/") ? p : `/${p}`;
  if (!clean.endsWith("/")) clean += "/";
  const base = clean === "/" ? `/${locale}/` : `/${locale}${clean}`;
  return base + (query ? `?${query}` : "") + (hash ? `#${hash}` : "");
}

/** Swap the locale segment of a pathname (keeps the equivalent page). */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/");
  // parts[0] is "" (leading slash); find the locale segment, which may follow a base path.
  const idx = parts.findIndex((seg) => (LOCALES as readonly string[]).includes(seg));
  if (idx === -1) return `/${to}/`;
  parts[idx] = to;
  const out = parts.join("/");
  return out.endsWith("/") ? out : `${out}/`;
}
