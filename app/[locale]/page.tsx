import type { Metadata } from "next";
import { CategoryMarquee, CategoryTiles } from "@/components/home/CategoryTiles";
import { Hero } from "@/components/home/Hero";
import {
  AccessoryPromos,
  EditorialSplit,
  LookbookPreview,
  Manifesto,
  Newsletter,
  SectionHeading,
  Spotlight,
  WeekendEdit,
} from "@/components/home/HomeSections";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { getProducts, IMAGE_MAP, SPOTLIGHT_ID, STUDIO_FAVOURITE_IDS } from "@/lib/catalog";
import { getLooks } from "@/lib/catalog/lookbook";
import type { Locale } from "@/lib/config";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/paths";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  return pageMetadata(locale, "/", { image: IMAGE_MAP.campaigns["home-hero-desktop"] });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  const products = getProducts(locale);
  const newIn = products.filter((p) => p.isNew);
  const favourites = STUDIO_FAVOURITE_IDS.map((id) => products.find((p) => p.id === id)!).filter(Boolean);
  const spotlight = products.find((p) => p.id === SPOTLIGHT_ID)!;

  return (
    <>
      <Hero />
      <CategoryMarquee />
      <CategoryTiles />

      <section aria-labelledby="new-title" className="container-rm mt-24 md:mt-36">
        <SectionHeading id="new-title" title={t.home.newTitle} sub={t.home.newSub} link={localePath(locale, "/new/")} linkLabel={t.common.viewAll} />
        <ProductGrid products={newIn} />
      </section>

      <EditorialSplit />
      <Spotlight product={spotlight} />

      <section aria-labelledby="fav-title" className="container-rm mt-24 md:mt-36">
        <SectionHeading id="fav-title" title={t.home.favouritesTitle} sub={t.home.favouritesSub} link={localePath(locale, "/shop/")} linkLabel={t.nav.shop} />
        <ProductGrid products={favourites} />
      </section>

      <WeekendEdit />
      <AccessoryPromos />
      <LookbookPreview looks={getLooks(locale)} />
      <Manifesto />
      <Newsletter />
    </>
  );
}
