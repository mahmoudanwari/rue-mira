import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionsProse } from "@/components/layout/Prose";
import { AssetImage } from "@/components/ui/AssetImage";
import { Reveal } from "@/components/ui/Reveal";
import { IMAGE_MAP } from "@/lib/catalog";
import { getContent } from "@/lib/content";
import { localePath } from "@/lib/i18n/paths";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/about/", (t) => t.pages.about);

export default async function AboutPage(props: PageProps<"/[locale]/about">) {
  const { locale, t, home } = await resolveLocale(props);
  const c = getContent(locale).about;
  return (
    <>
      <PageHeader title={t.common.tagline} intro={c.intro} crumbs={[home, { label: t.pages.about }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-14 grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="grid grid-cols-5 gap-4 self-start">
          <Reveal className="col-span-3">
            <AssetImage src={IMAGE_MAP.campaigns["our-story-portrait"]} alt={c.portraitAlt} ratio="3 / 4" priority sizes="(min-width: 1024px) 28vw, 60vw" className="rounded-sm" />
          </Reveal>
          <Reveal delay={0.15} className="col-span-2 mt-24">
            <AssetImage src={IMAGE_MAP.campaigns["our-story-studio"]} alt={c.studioAlt} ratio="4 / 5" sizes="(min-width: 1024px) 18vw, 40vw" className="rounded-sm" />
          </Reveal>
        </div>
        <div>
          <SectionsProse sections={c.sections} />
          <figure className="mt-12 border-l-2 border-burgundy pl-6">
            <blockquote className="display text-3xl italic text-burgundy">{c.quote}</blockquote>
            <figcaption className="mt-2 text-xs text-taupe">{t.common.fictionalQuote}</figcaption>
          </figure>
          <Link href={localePath(locale, "/shop/")} className="btn btn-primary mt-10">
            {t.home.heroCtaShop}
          </Link>
        </div>
      </div>
    </>
  );
}
