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
        {/* Collection photos are portrait (3:4), so the frame is portrait too: nothing is cropped. */}
        <div className="mt-4 grid grid-cols-[1fr_7.5rem] items-center gap-4 overflow-hidden rounded-sm bg-sand p-4 xs:grid-cols-[1fr_9rem] sm:grid-cols-[1fr_12rem] md:grid-cols-[1fr_15rem] md:gap-10 md:p-6 lg:grid-cols-[1fr_17rem]">
          <div className="min-w-0 md:px-6">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            <h1 className="display text-4xl xs:text-5xl md:text-7xl">{title}</h1>
            {intro && <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/80 md:mt-4 md:text-base">{intro}</p>}
          </div>
          <AssetImage src={image} alt="" ratio="3 / 4" priority sizes="(min-width: 1024px) 17rem, (min-width: 768px) 15rem, 9rem" className="rounded-sm" />
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
