import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LookbookView } from "@/components/lookbook/LookbookView";
import { getLooks } from "@/lib/catalog/lookbook";
import type { Locale } from "@/lib/config";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/paths";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[locale]/lookbook">): Promise<Metadata> {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  return pageMetadata(locale, "/lookbook/", { title: t.lookbook.title, description: t.lookbook.intro, image: getLooks(locale)[0].image });
}

export default async function LookbookPage({ params }: PageProps<"/[locale]/lookbook">) {
  const locale = (await params).locale as Locale;
  const t = getDictionary(locale);
  return (
    <>
      <PageHeader
        eyebrow={t.common.tagline}
        title={t.lookbook.title}
        intro={t.lookbook.intro}
        crumbs={[{ href: localePath(locale, "/"), label: t.nav.home }, { label: t.lookbook.title }]}
        crumbLabel={t.product.breadcrumb}
      />
      <LookbookView looks={getLooks(locale)} />
    </>
  );
}
