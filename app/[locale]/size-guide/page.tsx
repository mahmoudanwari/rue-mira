import { PageHeader } from "@/components/layout/PageHeader";
import { SizeGuideTables } from "@/components/product/SizeGuideTables";
import { getContent } from "@/lib/content";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/size-guide/", (t) => t.pages.sizeGuide);

export default async function SizeGuidePage(props: PageProps<"/[locale]/size-guide">) {
  const { locale, t, home } = await resolveLocale(props);
  const c = getContent(locale).sizeGuide;
  return (
    <>
      <PageHeader title={t.pages.sizeGuide} intro={c.intro} crumbs={[home, { label: t.pages.sizeGuide }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-12 max-w-3xl">
        <SizeGuideTables guide={c} />
      </div>
    </>
  );
}
