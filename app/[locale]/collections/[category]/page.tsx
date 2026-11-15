import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShopView } from "@/components/shop/ShopView";
import { CATEGORY_IDS, collectionImage, getProducts, type CategoryId } from "@/lib/catalog";
import { LOCALES, type Locale } from "@/lib/config";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/paths";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => CATEGORY_IDS.map((category) => ({ locale, category })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/collections/[category]">): Promise<Metadata> {
  const { locale, category } = (await params) as { locale: Locale; category: CategoryId };
  const t = getDictionary(locale);
  return pageMetadata(locale, `/collections/${category}/`, {
    title: t.categories[category].label,
    description: t.categories[category].blurb,
    image: collectionImage(category),
  });
}

export default async function CollectionPage({ params }: PageProps<"/[locale]/collections/[category]">) {
  const { locale, category } = (await params) as { locale: Locale; category: CategoryId };
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader
        title={t.categories[category].label}
        intro={t.categories[category].blurb}
        image={collectionImage(category)}
        crumbs={[
          { href: localePath(locale, "/"), label: t.nav.home },
          { href: localePath(locale, "/shop/"), label: t.nav.shop },
          { label: t.categories[category].label },
        ]}
        crumbLabel={t.product.breadcrumb}
      />
      <ShopView products={getProducts(locale)} lockedCategory={category} />
    </>
  );
}
