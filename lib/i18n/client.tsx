"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "../config";
import { formatMoney, type Cents } from "../money";
import { fill, type Dictionary } from "./index";
import { localePath } from "./paths";

interface I18nValue {
  locale: Locale;
  t: Dictionary;
  fill: typeof fill;
  money: (c: Cents) => string;
  href: (path?: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  const value = useMemo<I18nValue>(
    () => ({ locale, t: dict, fill, money: (c) => formatMoney(c, locale), href: (p = "/") => localePath(locale, p) }),
    [locale, dict],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
