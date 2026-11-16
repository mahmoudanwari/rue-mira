import { ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { getContent } from "@/lib/content";
import { localePath } from "@/lib/i18n/paths";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/help/", (t) => t.pages.help);

export default async function HelpPage(props: PageProps<"/[locale]/help">) {
  const { locale, t, home } = await resolveLocale(props);
  const c = getContent(locale).help;
  const links = [
    { href: "/delivery-returns/", label: t.pages.deliveryReturns },
    { href: "/size-guide/", label: t.pages.sizeGuide },
    { href: "/contact/", label: t.pages.contact },
    { href: "/demo/", label: t.pages.demo },
  ];
  return (
    <>
      <PageHeader title={t.pages.help} intro={c.intro} crumbs={[home, { label: t.pages.help }]} crumbLabel={t.product.breadcrumb} />
      <div className="container-rm mt-12 grid gap-12 lg:grid-cols-[1fr_18rem]">
        <div className="max-w-3xl divide-y divide-line border-y border-line">
          {c.faq.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex min-h-16 list-none items-center justify-between gap-4 py-4 text-lg font-medium [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown size={20} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <p className="pb-6 leading-relaxed text-ink/80">{f.a}</p>
            </details>
          ))}
        </div>
        <nav aria-label={t.footer.help} className="h-fit rounded-sm bg-paper p-6">
          <ul className="space-y-3 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={localePath(locale, l.href)} className="arrow-link inline-flex items-center gap-1.5 font-semibold">
                  <span className="link-underline">{l.label}</span>
                  <ArrowRight size={15} className="arrow" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
