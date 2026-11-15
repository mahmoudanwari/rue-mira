"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useId, useMemo, useState } from "react";
import { AssetImage } from "@/components/ui/AssetImage";
import { Dialog } from "@/components/ui/Dialog";
import { matchesQuery } from "@/lib/catalog/filter";
import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";

export function SearchOverlay() {
  const ui = useUI();
  const { t } = useI18n();
  return (
    <Dialog
      open={ui.searchOpen}
      onClose={() => ui.setSearchOpen(false)}
      title={t.search.title}
      closeLabel={t.common.close}
      variant="top"
      initialFocusSelector="input"
    >
      {ui.searchOpen && <SearchBody />}
    </Dialog>
  );
}

function SearchBody() {
  const router = useRouter();
  const ui = useUI();
  const { t, fill, money, href } = useI18n();
  const { products } = useShop();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(-1);
  const listId = useId();

  const results = useMemo(() => {
    if (!q.trim()) return [];
    return products.filter((p) => !p.hidden && matchesQuery(p, q, [t.categories[p.category].label]));
  }, [q, products, t]);
  const shown = results.slice(0, 6);

  const go = (path: string) => {
    ui.setSearchOpen(false);
    router.push(path);
  };
  const submit = () => {
    if (active >= 0 && shown[active]) go(href(`/products/${shown[active].slug}/`));
    else if (q.trim()) go(href(`/shop/?q=${encodeURIComponent(q.trim())}`));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(shown.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(-1, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="container-rm max-w-3xl py-6">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <label className="relative block">
          <span className="sr-only">{t.search.title}</span>
          <Search size={22} strokeWidth={1.5} className="absolute left-0 top-1/2 -translate-y-1/2 text-taupe" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(-1);
            }}
            onKeyDown={onKeyDown}
            placeholder={t.search.placeholder}
            role="combobox"
            aria-expanded={shown.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            autoComplete="off"
            className="display w-full border-b border-ink/30 bg-transparent py-3 pl-9 text-3xl outline-none placeholder:text-taupe/60 focus:border-ink sm:text-4xl"
          />
        </label>
      </form>
      <p className="mt-2 text-xs text-taupe">{t.search.hint}</p>

      {!q.trim() && (
        <div className="mt-6">
          <p className="eyebrow mb-3">{t.search.popular}</p>
          <ul className="flex flex-wrap gap-2">
            {t.search.popularTerms.split(",").map((term) => (
              <li key={term}>
                <button type="button" className="chip" onClick={() => setQ(term)}>
                  {term}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div aria-live="polite" className="mt-6">
        {q.trim() && shown.length === 0 && <p className="text-taupe">{fill(t.search.noMatches, { q })}</p>}
        {shown.length > 0 && <p className="eyebrow mb-3">{t.search.suggestions}</p>}
      </div>
      <ul id={listId} role="listbox" aria-label={t.search.suggestions} className="grid gap-1">
        {shown.map((p, i) => (
          <li
            key={p.id}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseEnter={() => setActive(i)}
            onClick={() => go(href(`/products/${p.slug}/`))}
            className={`flex cursor-pointer items-center gap-4 rounded-lg p-2 ${i === active ? "bg-sand" : ""}`}
          >
            <AssetImage src={p.images[0]} alt="" ratio="3 / 4" className="w-12 shrink-0 rounded-sm" sizes="48px" />
            <span className="flex-1">
              <span className="block font-medium">{p.copy.name}</span>
              <span className="block text-xs text-taupe">
                {t.categories[p.category].label} · {p.copy.color}
              </span>
            </span>
            <span className="font-semibold tabular-nums">{money(p.price)}</span>
          </li>
        ))}
      </ul>
      {results.length > 0 && (
        <button type="button" onClick={() => go(href(`/shop/?q=${encodeURIComponent(q.trim())}`))} className="btn btn-outline btn-sm mt-5">
          {fill(t.search.seeAll, { n: results.length })}
        </button>
      )}
    </div>
  );
}
