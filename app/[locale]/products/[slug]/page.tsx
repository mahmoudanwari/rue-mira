import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProducts, SEED_PRODUCTS } from "@/lib/catalog";
import { LOCALES, type Locale } from "@/lib/config";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/paths";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

/** 32 products × 3 languages = 96 statically generated product pages. */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) => SEED_PRODUCTS.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const product = getProducts(locale).find((p) => p.slug === slug)!;
  return pageMetadata(locale, `/products/${slug}/`, {
    title: product.copy.name,
    description: product.copy.description,
    image: product.images[0],
  });
}

export default async function ProductPage({ params }: PageProps<"/[locale]/products/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const t = getDictionary(locale);
  const all = getProducts(locale);
  const product = all.find((p) => p.slug === slug)!;
  return (
    <>
      <div className="container-rm mt-6">
        <Breadcrumbs
          label={t.product.breadcrumb}
          items={[
            { href: localePath(locale, "/"), label: t.nav.home },
            { href: localePath(locale, `/collections/${product.category}/`), label: t.categories[product.category].label },
            { label: product.copy.name },
          ]}
        />
      </div>
      <ProductDetail product={product} all={all} />
    </>
  );
}
