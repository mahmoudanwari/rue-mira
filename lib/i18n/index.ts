import type { Locale } from "../config";
import en from "./en";
import fr from "./fr";
import nl from "./nl";
import type { Dictionary } from "./types";

export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { en, nl, fr };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** Replace {placeholders} in a translated string. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in values ? String(values[k]) : `{${k}}`));
}
