import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { SiteShell } from "@/components/layout/Providers";
import { BASE_PATH, isLocale, LOCALES, SITE_URL } from "@/lib/config";
import { getContent } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { body, display } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    metadataBase: new URL(SITE_URL + BASE_PATH + "/"),
    ...pageMetadata(locale, "/"),
    icons: { icon: `${BASE_PATH}/favicon.svg` },
  };
}

export const viewport: Viewport = {
  themeColor: "#F7F2EB",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const content = getContent(locale);
  return (
    <html lang={`${locale}-BE`} className={`${display.variable} ${body.variable}`}>
      <body>
        <noscript>
          {/* Without JavaScript, never leave reveal-animated content invisible. */}
          <style>{`[style*="opacity:0"],[style*="transform"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <SiteShell locale={locale} dict={dict} sizeGuide={content.sizeGuide} footer={<Footer locale={locale} t={dict} />}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
