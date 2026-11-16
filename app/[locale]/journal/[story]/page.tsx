import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/PageHeader";
import { AssetImage } from "@/components/ui/AssetImage";
import { INTL_LOCALE, LOCALES, type Locale } from "@/lib/config";
import { getContent } from "@/lib/content";
import { getDictionary } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/paths";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((locale) => getContent(locale).journal.stories.map((s) => ({ locale, story: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/journal/[story]">): Promise<Metadata> {
  const { locale, story } = (await params) as { locale: Locale; story: string };
  const s = getContent(locale).journal.stories.find((x) => x.slug === story)!;
  return pageMetadata(locale, `/journal/${story}/`, { title: s.title, description: s.dek, image: s.image });
}

export default async function StoryPage({ params }: PageProps<"/[locale]/journal/[story]">) {
  const { locale, story } = (await params) as { locale: Locale; story: string };
  const t = getDictionary(locale);
  const c = getContent(locale).journal;
  const s = c.stories.find((x) => x.slug === story)!;
  const fmt = new Intl.DateTimeFormat(INTL_LOCALE[locale], { dateStyle: "long" });
  return (
    <article className="mt-6">
      <div className="container-rm">
        <Breadcrumbs
          label={t.product.breadcrumb}
          items={[{ href: localePath(locale, "/"), label: t.nav.home }, { href: localePath(locale, "/journal/"), label: t.pages.journal }, { label: s.title }]}
        />
        <header className="mx-auto mt-10 max-w-3xl text-center">
          <p className="eyebrow">
            <time dateTime={s.date}>{fmt.format(new Date(s.date))}</time>
          </p>
          <h1 className="display mt-4 text-5xl md:text-7xl text-balance">{s.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-ink/80">{s.dek}</p>
        </header>
      </div>
      <div className="container-rm mt-12">
        <AssetImage src={s.image} alt={s.imageAlt} ratio="16 / 9" priority sizes="100vw" className="rounded-sm" />
      </div>
      <div className="container-rm mt-12">
        <div className="prose-rm mx-auto max-w-2xl">
          {s.body.slice(0, 2).map((p) => (
            <p key={p}>{p}</p>
          ))}
          <blockquote className="display my-10 border-y border-line py-8 text-center text-3xl italic text-burgundy md:text-4xl">{s.pull}</blockquote>
          {s.body.slice(2).map((p, i, arr) => (
            <p key={p} className={i === arr.length - 1 ? "text-sm italic !text-taupe" : ""}>
              {p}
            </p>
          ))}
          <Link href={localePath(locale, "/journal/")} className="btn btn-outline mt-10">
            <ArrowLeft size={16} aria-hidden="true" /> {c.backToJournal}
          </Link>
        </div>
      </div>
    </article>
  );
}
