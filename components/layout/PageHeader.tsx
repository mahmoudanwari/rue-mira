import Link from "next/link";
import { AssetImage } from "@/components/ui/AssetImage";

export interface Crumb {
  href?: string;
  label: string;
}

export function Breadcrumbs({ items, label }: { items: Crumb[]; label: string }) {
  return (
    <nav aria-label={label} className="text-xs text-taupe">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {c.href ? (
              <Link href={c.href} className="link-underline hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {c.label}
              </span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs,
  crumbLabel,
  image,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  crumbLabel?: string;
  image?: string;
}) {
  if (image) {
    return (
      <header className="container-rm mt-6">
        {crumbs && crumbLabel && <Breadcrumbs items={crumbs} label={crumbLabel} />}
        <div className="mt-4 grid items-end gap-6 overflow-hidden rounded-sm bg-sand md:grid-cols-[1fr_minmax(16rem,26rem)]">
          <div className="p-6 pb-2 md:p-12">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            <h1 className="display text-5xl md:text-7xl">{title}</h1>
            {intro && <p className="mt-4 max-w-lg leading-relaxed text-ink/80">{intro}</p>}
          </div>
          <AssetImage src={image} alt="" ratio="4 / 3" priority sizes="(min-width: 768px) 26rem, 100vw" imgClassName="object-[50%_30%]" />
        </div>
      </header>
    );
  }
  return (
    <header className="container-rm mt-6">
      {crumbs && crumbLabel && <Breadcrumbs items={crumbs} label={crumbLabel} />}
      <div className="mt-6 max-w-3xl">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="display text-5xl md:text-7xl text-balance">{title}</h1>
        {intro && <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink/80">{intro}</p>}
      </div>
    </header>
  );
}
