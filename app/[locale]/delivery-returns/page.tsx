import { PageHeader } from "@/components/layout/PageHeader";
import { SectionsProse } from "@/components/layout/Prose";
import { getContent } from "@/lib/content";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/delivery-returns/", (t) => t.pages.deliveryReturns);

export default async function DeliveryReturnsPage(props: PageProps<"/[locale]/delivery-returns">) {
  const { locale, t, home } = await resolveLocale(props);
  const c = getContent(locale).delivery;
  return (
    <>
      <PageHeader title={t.pages.deliveryReturns} intro={c.intro} crumbs={[home, { label: t.pages.deliveryReturns }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-6">
        <SectionsProse sections={c.sections} />
      </div>
    </>
  );
}
