"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { CATEGORY_IDS, COLOR_FAMILIES, type CategoryId, type ColorFamily, type Product } from "@/lib/catalog";
import {
  activeFilterCount,
  applyFilters,
  EMPTY_FILTERS,
  parseFilters,
  serializeFilters,
  sizeGroups,
  SORT_KEYS,
  type FilterState,
} from "@/lib/catalog/filter";
import { useI18n } from "@/lib/i18n/client";
import { useShop } from "@/lib/store";
import { ProductGrid } from "./ProductGrid";

interface ShopViewProps {
  products: Product[];
  /** Locks the category (collection pages) — the category filter is hidden. */
  lockedCategory?: CategoryId;
  /** Restricts to new arrivals. */
  newOnly?: boolean;
}

export function ShopView({ products: seedProducts, lockedCategory, newOnly }: ShopViewProps) {
  const { t, fill } = useI18n();
  const shop = useShop();
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [drawer, setDrawer] = useState(false);
  const ready = useRef(false);

  // Live products (Demo Studio overrides) restricted to this view's scope.
  const scoped = useMemo(() => {
    const base = shop.hydrated ? shop.products : seedProducts;
    return base.filter((p) => (!lockedCategory || p.category === lockedCategory) && (!newOnly || p.isNew));
  }, [shop.hydrated, shop.products, seedProducts, lockedCategory, newOnly]);

  // Read filters from the URL once on mount (static export: no request-time query).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters(parseFilters(window.location.search, { categories: CATEGORY_IDS, colors: Object.keys(COLOR_FAMILIES) }));
    ready.current = true;
  }, []);

  // Keep the URL shareable without adding history entries.
  useEffect(() => {
    if (!ready.current) return;
    const url = window.location.pathname + serializeFilters(filters) + window.location.hash;
    window.history.replaceState(window.history.state, "", url);
  }, [filters]);

  const categoryLabels = useMemo(
    () => Object.fromEntries(CATEGORY_IDS.map((c) => [c, t.categories[c].label])) as Record<CategoryId, string>,
    [t],
  );
  const results = useMemo(() => applyFilters(scoped, filters, categoryLabels), [scoped, filters, categoryLabels]);
  const count = activeFilterCount(filters);
  const update = (patch: Partial<FilterState>) => setFilters((f) => ({ ...f, ...patch }));
  const toggle = <K extends "categories" | "colors" | "sizes">(key: K, value: FilterState[K][number]) =>
    setFilters((f) => {
      const list = f[key] as string[];
      return { ...f, [key]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value] };
    });
  const clearAll = () => setFilters({ ...EMPTY_FILTERS, sort: filters.sort });
  const resultLabel = results.length === 1 ? t.filters.result : fill(t.filters.results, { n: results.length });

  const chips: { label: string; remove: () => void }[] = [
    ...(filters.q ? [{ label: `“${filters.q}”`, remove: () => update({ q: "" }) }] : []),
    ...filters.categories.map((c) => ({ label: t.categories[c].label, remove: () => toggle("categories", c) })),
    ...filters.colors.map((c) => ({ label: t.colors[c], remove: () => toggle("colors", c) })),
    ...filters.sizes.map((s) => ({ label: s === "One Size" ? t.common.oneSize : s, remove: () => toggle("sizes", s) })),
    ...(filters.inStock ? [{ label: t.common.inStock, remove: () => update({ inStock: false }) }] : []),
    ...(filters.min != null ? [{ label: `≥ €${filters.min}`, remove: () => update({ min: null }) }] : []),
    ...(filters.max != null ? [{ label: `≤ €${filters.max}`, remove: () => update({ max: null }) }] : []),
  ];

  const panel = (idPrefix: string) => (
    <FilterPanel
      idPrefix={idPrefix}
      filters={filters}
      update={update}
      toggle={toggle}
      scoped={scoped}
      showCategories={!lockedCategory}
    />
  );

  return (
    <div className="container-rm mt-8">
      <div className="flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-sm">
          <span className="sr-only">{t.filters.searchWithin}</span>
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe" aria-hidden="true" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder={t.filters.searchWithin}
            className="field !rounded-full !pl-10"
            data-testid="shop-search"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-taupe" aria-live="polite" data-testid="result-count">
            {resultLabel}
          </p>
          <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
            <button type="button" className="btn btn-outline btn-sm !px-3 lg:hidden" onClick={() => setDrawer(true)} aria-haspopup="dialog">
              <SlidersHorizontal size={15} aria-hidden="true" />
              {t.filters.open}
              {count > 0 && <span className="rounded-full bg-burgundy px-1.5 text-[10px] text-white">{count}</span>}
            </button>
            <label className="flex min-w-0 items-center gap-2 text-sm">
              <span className="hidden sm:inline">{t.sort.label}</span>
              <span className="sr-only sm:hidden">{t.sort.label}</span>
              <select
                value={filters.sort}
                onChange={(e) => update({ sort: e.target.value as FilterState["sort"] })}
                className="field !min-h-10 !w-auto min-w-0 max-w-[11rem] !rounded-full !py-1.5 !pl-3 !pr-7 text-sm sm:max-w-none"
                data-testid="sort"
              >
                {SORT_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {t.sort[k]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2" aria-label={t.filters.activeFilters} role="group">
          {chips.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={c.remove}
              className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-xs font-medium hover:bg-line"
              aria-label={fill(t.filters.removeFilter, { label: c.label })}
            >
              {c.label} <X size={12} aria-hidden="true" />
            </button>
          ))}
          <button type="button" onClick={clearAll} className="link-underline ml-1 text-xs font-semibold" data-testid="clear-all">
            {t.filters.clearAll}
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr] xl:gap-14">
        <aside className="hidden lg:block" aria-label={t.filters.title}>
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pb-10 pr-2">
            {panel("desk")}
            {count > 0 && (
              <button type="button" onClick={clearAll} className="btn btn-outline btn-sm mt-6 w-full">
                {t.filters.clearAll}
              </button>
            )}
          </div>
        </aside>
        <div>
          {results.length === 0 ? (
            <div className="rounded-sm bg-paper px-6 py-16 text-center">
              <p className="display text-3xl">{t.filters.noResults}</p>
              <p className="mt-2 text-sm text-taupe">{t.filters.noResultsHint}</p>
              <button type="button" onClick={clearAll} className="btn btn-primary mt-6">
                {t.filters.clearAll}
              </button>
            </div>
          ) : (
            <ProductGrid products={results} columns="grid-cols-2 md:grid-cols-3" priorityCount={4} />
          )}
        </div>
      </div>

      <Dialog
        open={drawer}
        onClose={() => setDrawer(false)}
        title={t.filters.title}
        closeLabel={t.common.close}
        variant="left"
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={clearAll} className="btn btn-outline flex-1" disabled={count === 0}>
              {t.filters.clearAll}
            </button>
            <button type="button" onClick={() => setDrawer(false)} className="btn btn-primary flex-[1.4]">
              {fill(t.filters.showResults, { n: results.length })}
            </button>
          </div>
        }
      >
        <div className="p-5">{panel("mob")}</div>
      </Dialog>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0">
      <legend className="eyebrow mb-3 !text-ink">{title}</legend>
      {children}
    </fieldset>
  );
}

function FilterPanel({
  idPrefix,
  filters,
  update,
  toggle,
  scoped,
  showCategories,
}: {
  idPrefix: string;
  filters: FilterState;
  update: (p: Partial<FilterState>) => void;
  toggle: <K extends "categories" | "colors" | "sizes">(key: K, value: FilterState[K][number]) => void;
  scoped: Product[];
  showCategories: boolean;
}) {
  const { t } = useI18n();
  const colorsPresent = new Set(scoped.map((p) => p.colorFamily));
  const groups = sizeGroups(scoped);
  return (
    <div>
      {showCategories && (
        <FilterGroup title={t.filters.categories}>
          <ul className="space-y-1">
            {CATEGORY_IDS.map((c) => {
              const n = scoped.filter((p) => p.category === c && !p.hidden).length;
              return (
                <li key={c}>
                  <label className="flex min-h-9 items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(c)}
                      onChange={() => toggle("categories", c)}
                      className="h-4 w-4 accent-burgundy"
                      data-testid={`${idPrefix}-cat-${c}`}
                    />
                    <span className="flex-1">{t.categories[c].label}</span>
                    <span className="text-xs text-taupe">{n}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      )}
      <FilterGroup title={t.filters.colors}>
        <ul className="grid grid-cols-1 gap-1">
          {(Object.keys(COLOR_FAMILIES) as ColorFamily[])
            .filter((c) => colorsPresent.has(c))
            .map((c) => (
              <li key={c}>
                <label className="flex min-h-9 items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(c)}
                    onChange={() => toggle("colors", c)}
                    className="peer sr-only"
                  />
                  <span
                    className="h-5 w-5 rounded-full ring-1 ring-ink/15 ring-offset-2 ring-offset-bone peer-checked:ring-2 peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-burgundy"
                    style={{ background: c === "metallic" ? "linear-gradient(135deg,#d4af69,#b4bcc3)" : COLOR_FAMILIES[c] }}
                    aria-hidden="true"
                  />
                  <span className="peer-checked:font-semibold">{t.colors[c]}</span>
                </label>
              </li>
            ))}
        </ul>
      </FilterGroup>
      <FilterGroup title={t.filters.sizes}>
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.join()} className="flex flex-wrap gap-1.5">
              {g.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={filters.sizes.includes(s)}
                  onClick={() => toggle("sizes", s)}
                  className="chip !min-h-9 !min-w-11 !px-2.5 text-xs"
                >
                  {s === "One Size" ? t.common.oneSize : s}
                </button>
              ))}
            </div>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title={t.filters.price}>
        <div className="grid grid-cols-2 gap-3">
          {(["min", "max"] as const).map((k) => (
            <label key={k} className="text-xs font-semibold">
              {t.filters[k]}
              <input
                type="number"
                inputMode="numeric"
                min={0}
                max={999}
                value={filters[k] ?? ""}
                onChange={(e) => {
                  const v = e.target.value === "" ? null : Math.max(0, Number(e.target.value));
                  update({ [k]: Number.isFinite(v) ? v : null } as Partial<FilterState>);
                }}
                placeholder={k === "min" ? "0" : "100"}
                className="field mt-1 !min-h-10 text-sm"
                data-testid={`${idPrefix}-price-${k}`}
              />
            </label>
          ))}
        </div>
      </FilterGroup>
      <div className="py-5">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={filters.inStock} onChange={(e) => update({ inStock: e.target.checked })} className="mt-0.5 h-4 w-4 accent-burgundy" />
          {t.filters.inStock}
        </label>
      </div>
    </div>
  );
}
