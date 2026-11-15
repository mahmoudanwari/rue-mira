import { PageHeader } from "@/components/layout/PageHeader";
import { SectionsProse } from "@/components/layout/Prose";
import { getContent } from "@/lib/content";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/demo/", (t) => t.pages.demo);

export default async function DemoPage(props: PageProps<"/[locale]/demo">) {
  const { locale, t, home } = await resolveLocale(props);
  const c = getContent(locale).demo;
  return (
    <>
      <PageHeader title={t.pages.demo} intro={c.intro} crumbs={[home, { label: t.pages.demo }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-6">
        <SectionsProse sections={c.sections} />
      </div>
    </>
  );
}
