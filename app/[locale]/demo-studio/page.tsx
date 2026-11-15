import { PageHeader } from "@/components/layout/PageHeader";
import { DemoStudio } from "@/components/studio/DemoStudio";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/demo-studio/", (t) => t.studio.title, { noindex: true });

export default async function DemoStudioPage(props: PageProps<"/[locale]/demo-studio">) {
  const { t, home } = await resolveLocale(props);
  return (
    <>
      <PageHeader
        title={t.studio.title}
        intro={t.studio.intro}
        crumbs={[home, { label: t.studio.title }]}
        crumbLabel={t.product.breadcrumb}
      />
      <div className="container-rm mt-10">
        <DemoStudio />
      </div>
    </>
  );
}
