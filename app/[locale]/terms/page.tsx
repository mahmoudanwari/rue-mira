import { PageHeader } from "@/components/layout/PageHeader";
import { SectionsProse } from "@/components/layout/Prose";
import { getContent } from "@/lib/content";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/terms/", (t) => t.pages.terms);

export default async function TermsPage(props: PageProps<"/[locale]/terms">) {
  const { locale, t, home } = await resolveLocale(props);
  const c = getContent(locale).terms;
  return (
    <>
      <PageHeader title={t.pages.terms} intro={c.intro} crumbs={[home, { label: t.pages.terms }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-6">
        <SectionsProse sections={c.sections} />
      </div>
    </>
  );
}
