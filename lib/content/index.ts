import type { Locale } from "../config";
import en from "./en";
import fr from "./fr";
import nl from "./nl";
import type { SiteContent } from "./types";

const CONTENT: Record<Locale, SiteContent> = { en, nl, fr };
export const getContent = (locale: Locale): SiteContent => CONTENT[locale];
export type { SiteContent };
