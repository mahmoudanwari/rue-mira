import { PageHeader } from "@/components/layout/PageHeader";
import { BagView } from "@/components/shop/ListViews";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/bag/", (t) => t.bag.title, { noindex: true });

export default async function BagPage(props: PageProps<"/[locale]/bag">) {
  const { t, home } = await resolveLocale(props);
  return (
    <>
      <PageHeader title={t.bag.title} crumbs={[home, { label: t.bag.title }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-10">
        <BagView />
      </div>
    </>
  );
}
