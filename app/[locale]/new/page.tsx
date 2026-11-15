import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShopView } from "@/components/shop/ShopView";
import { collectionImage, getProducts } from "@/lib/catalog";
import type { Locale } from "@/lib/config";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/paths";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/new">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  return pageMetadata(locale, "/new/", { title: t.pages.new, description: t.categories["new-arrivals"].blurb, image: collectionImage("new-arrivals") });
}

export default async function NewPage({ params }: PageProps<"/[locale]/new">) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader
        title={t.categories["new-arrivals"].label}
        intro={t.categories["new-arrivals"].blurb}
        image={collectionImage("new-arrivals")}
        crumbs={[{ href: localePath(locale, "/"), label: t.nav.home }, { label: t.categories["new-arrivals"].label }]}
        crumbLabel={t.product.breadcrumb}
      />
      <ShopView products={getProducts(locale)} newOnly />
    </>
  );
}
