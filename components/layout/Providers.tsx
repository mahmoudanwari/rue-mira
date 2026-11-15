"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/config";
import type { SiteContent } from "@/lib/content";
import type { Dictionary } from "@/lib/i18n";
import { I18nProvider } from "@/lib/i18n/client";
import { ShopProvider, UIProvider } from "@/lib/store";
import { Header } from "./Header";
import { BagDrawer, BagToast, CompareTray, LiveRegion, QuickView, SizeGuideDrawer, StorageWarning } from "./Overlays";
import { SearchOverlay } from "./SearchOverlay";

export function SiteShell({
  locale,
  dict,
  sizeGuide,
  footer,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  sizeGuide: SiteContent["sizeGuide"];
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <I18nProvider locale={locale} dict={dict}>
        <ShopProvider locale={locale}>
          <UIProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
            >
              {dict.common.skipToContent}
            </a>
            <Header />
            <StorageWarning />
            <main id="main" tabIndex={-1} className="outline-none">
              {children}
            </main>
            {footer}
            <BagDrawer />
            <BagToast />
            <QuickView />
            <SearchOverlay />
            <CompareTray />
            <SizeGuideDrawer guide={sizeGuide} />
            <LiveRegion />
          </UIProvider>
        </ShopProvider>
      </I18nProvider>
    </MotionConfig>
  );
}
