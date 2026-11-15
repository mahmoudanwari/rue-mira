import { PageHeader } from "@/components/layout/PageHeader";
import { CompareView } from "@/components/shop/ListViews";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/compare/", (t) => t.compare.title, { noindex: true });

export default async function ComparePage(props: PageProps<"/[locale]/compare">) {
  const { t, home } = await resolveLocale(props);
  return (
    <>
      <PageHeader title={t.compare.title} crumbs={[home, { label: t.compare.title }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-10">
        <CompareView />
      </div>
    </>
  );
}
