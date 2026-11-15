import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShopView } from "@/components/shop/ShopView";
import { getProducts } from "@/lib/catalog";
import type { Locale } from "@/lib/config";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/paths";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/shop">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/shop/", { title: getDictionary(locale).pages.shop });
}

export default async function ShopPage({ params }: PageProps<"/[locale]/shop">) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader
        title={t.pages.shop}
        intro={t.common.tagline}
        crumbs={[{ href: localePath(locale, "/"), label: t.nav.home }, { label: t.pages.shop }]}
        crumbLabel={t.product.breadcrumb}
      />
      <ShopView products={getProducts(locale)} />
    </>
  );
}
