import { ContactForm } from "@/components/layout/ContactForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/contact/", (t) => t.pages.contact);

export default async function ContactPage(props: PageProps<"/[locale]/contact">) {
  const { t, home } = await resolveLocale(props);
  return (
    <>
      <PageHeader title={t.pages.contact} crumbs={[home, { label: t.pages.contact }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-10 grid gap-12 lg:grid-cols-[1fr_20rem]">
        <div className="max-w-xl">
          <ContactForm />
        </div>
        <aside className="h-fit rounded-sm bg-paper p-6 text-sm">
          <p className="eyebrow">{t.footer.contactDemo}</p>
          <p className="mt-2">{t.footer.contactLine}</p>
          <p className="mt-4 text-taupe">{t.footer.disclaimer}</p>
        </aside>
      </div>
    </>
  );
}
