import { PageHeader } from "@/components/layout/PageHeader";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/checkout/", (t) => t.checkout.title, { noindex: true });

export default async function CheckoutPage(props: PageProps<"/[locale]/checkout">) {
  const { t, home } = await resolveLocale(props);
  return (
    <>
      <PageHeader title={t.checkout.title} crumbs={[home, { label: t.checkout.title }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-8">
        <CheckoutFlow />
      </div>
    </>
  );
}
