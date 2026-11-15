import { PageHeader } from "@/components/layout/PageHeader";
import { SectionsProse } from "@/components/layout/Prose";
import { getContent } from "@/lib/content";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/privacy/", (t) => t.pages.privacy);

export default async function PrivacyPage(props: PageProps<"/[locale]/privacy">) {
  const { locale, t, home } = await resolveLocale(props);
  const c = getContent(locale).privacy;
  return (
    <>
      <PageHeader title={t.pages.privacy} intro={c.intro} crumbs={[home, { label: t.pages.privacy }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-6">
        <SectionsProse sections={c.sections} />
      </div>
    </>
  );
}
