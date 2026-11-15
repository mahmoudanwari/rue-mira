import Link from "next/link";
import { CATEGORY_IDS } from "@/lib/catalog";
import { DESIGNER, LOCALES, LOCALE_NAMES, type Locale } from "@/lib/config";
import type { Dictionary } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/paths";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const href = (p: string) => localePath(locale, p);
  const cols: { title: string; links: { href: string; label: string }[] }[] = [
    {
      title: t.footer.shop,
      links: [
        { href: "/shop/", label: t.nav.shop },
        { href: "/new/", label: t.nav.new },
        ...CATEGORY_IDS.map((c) => ({ href: `/collections/${c}/`, label: t.categories[c].label })),
        { href: "/lookbook/", label: t.nav.lookbook },
      ],
    },
    {
      title: t.footer.help,
      links: [
        { href: "/help/", label: t.pages.help },
        { href: "/delivery-returns/", label: t.pages.deliveryReturns },
        { href: "/size-guide/", label: t.pages.sizeGuide },
        { href: "/contact/", label: t.pages.contact },
        { href: "/privacy/", label: t.pages.privacy },
        { href: "/terms/", label: t.pages.terms },
      ],
    },
    {
      title: t.footer.about,
      links: [
        { href: "/about/", label: t.pages.about },
        { href: "/journal/", label: t.pages.journal },
        { href: "/demo/", label: t.pages.demo },
        { href: "/demo-studio/", label: t.pages.demoStudio },
        { href: "/wishlist/", label: t.nav.wishlist },
        { href: "/compare/", label: t.nav.compare },
      ],
    },
  ];

  return (
    <footer className="mt-24 bg-ink text-bone">
      <div className="container-rm grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr]">
        <div className="flex flex-col gap-5">
          <p className="display text-4xl tracking-[0.18em]">RUE MIRA</p>
          <p className="display text-2xl italic text-rose">{t.common.tagline}</p>
          <p className="max-w-md text-sm leading-relaxed text-bone/70">{t.footer.disclaimer}</p>
          <div className="text-sm">
            <p className="eyebrow !text-bone/50">{t.footer.contactDemo}</p>
            <p className="mt-1 text-bone/80">{t.footer.contactLine}</p>
          </div>
          <div className="border-t border-bone/15 pt-5" data-testid="designer-credit">
            <p className="eyebrow !text-champagne">{t.footer.creditLabel}</p>
            <p className="display mt-2 text-2xl text-bone">
              {t.footer.creditLine}{" "}
              <a
                href={DESIGNER.url}
                target="_blank"
                rel="noopener"
                className="underline decoration-rose/60 underline-offset-4 transition-colors hover:text-rose"
                aria-label={`${DESIGNER.name} — ${t.footer.creditLink}`}
              >
                {DESIGNER.name}
              </a>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {cols.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow mb-4 !text-bone/50">{col.title}</p>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={href(l.href)} className="link-underline text-bone/85 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="border-t border-bone/15">
        <div className="container-rm flex flex-col gap-4 py-6 text-xs text-bone/60 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>
              {t.footer.rights} · {t.common.demoBadge} · {t.footer.creditLine}{" "}
              <a href={DESIGNER.url} target="_blank" rel="noopener" className="underline underline-offset-2 hover:text-white">
                {DESIGNER.name}
              </a>
            </p>
            <p>{t.footer.imagesNote}</p>
          </div>
          <nav aria-label={t.footer.languages}>
            <ul className="flex gap-4">
              {LOCALES.map((l) => (
                <li key={l}>
                  <Link
                    href={`/${l}/`}
                    hrefLang={l}
                    lang={l}
                    aria-current={l === locale ? "true" : undefined}
                    className={l === locale ? "text-white underline underline-offset-4" : "hover:text-white"}
                  >
                    {LOCALE_NAMES[l]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
