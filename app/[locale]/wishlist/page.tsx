import { PageHeader } from "@/components/layout/PageHeader";
import { WishlistView } from "@/components/shop/ListViews";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/wishlist/", (t) => t.wishlist.title, { noindex: true });

export default async function WishlistPage(props: PageProps<"/[locale]/wishlist">) {
  const { t, home } = await resolveLocale(props);
  return (
    <>
      <PageHeader title={t.wishlist.title} crumbs={[home, { label: t.wishlist.title }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-10">
        <WishlistView />
      </div>
    </>
  );
}
