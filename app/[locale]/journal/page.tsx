import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssetImage } from "@/components/ui/AssetImage";
import { INTL_LOCALE } from "@/lib/config";
import { getContent } from "@/lib/content";
import { localePath } from "@/lib/i18n/paths";
import { resolveLocale, simpleMeta } from "@/lib/page-helpers";

export const generateMetadata = simpleMeta("/journal/", (t) => t.pages.journal);

export default async function JournalPage(props: PageProps<"/[locale]/journal">) {
  const { locale, t, home } = await resolveLocale(props);
  const c = getContent(locale).journal;
  const fmt = new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long" });
  return (
    <>
      <PageHeader title={t.pages.journal} intro={c.intro} crumbs={[home, { label: t.pages.journal }]} crumbLabel={t.product.breadcrumb} />
      <ul className="container-rm mt-14 grid gap-14 md:grid-cols-2 md:gap-8">
        {c.stories.map((s, i) => (
          <li key={s.slug}>
            <article className="group">
              <Link href={localePath(locale, `/journal/${s.slug}/`)} className="block overflow-hidden rounded-sm" tabIndex={-1} aria-hidden="true">
                <AssetImage
                  src={s.image}
                  alt=""
                  ratio="16 / 10"
                  priority={i === 0}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  imgClassName="transition-transform duration-[1.4s] group-hover:scale-[1.03]"
                />
              </Link>
              <p className="eyebrow mt-5">
                <time dateTime={s.date}>{fmt.format(new Date(s.date))}</time>
              </p>
              <h2 className="display mt-2 text-4xl">
                <Link href={localePath(locale, `/journal/${s.slug}/`)} className="link-underline">
                  {s.title}
                </Link>
              </h2>
              <p className="mt-3 max-w-lg leading-relaxed text-ink/80">{s.dek}</p>
              <Link href={localePath(locale, `/journal/${s.slug}/`)} className="link-underline mt-4 inline-block text-sm font-semibold">
                {c.readMore} →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
