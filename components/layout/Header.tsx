"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Heart, Info, Menu, Search, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cartCount } from "@/lib/cart";
import { CATEGORY_IDS } from "@/lib/catalog";
import { LOCALES, LOCALE_NAMES, type Locale } from "@/lib/config";
import { useI18n } from "@/lib/i18n/client";
import { switchLocalePath } from "@/lib/i18n/paths";
import { useShop, useUI } from "@/lib/store";
import { Dialog } from "@/components/ui/Dialog";

function rememberLocale(l: Locale) {
  try {
    window.localStorage.setItem("rue-mira:locale", l);
  } catch {
    /* storage unavailable — fine */
  }
}

export function LocaleLinks({ className = "", onNavigate }: { className?: string; onNavigate?: () => void }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() ?? `/${locale}/`;
  const [search, setSearch] = useState("");
  useEffect(() => {
    // Keep shop filters etc. when switching language (read after mount; static export has no request-time query).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearch(window.location.search);
  }, [pathname]);
  return (
    <ul className={`flex items-center gap-1 ${className}`} aria-label={t.nav.language}>
      {LOCALES.map((l) => (
        <li key={l}>
          <Link
            href={switchLocalePath(pathname, l) + search}
            hrefLang={l}
            lang={l}
            aria-current={l === locale ? "true" : undefined}
            onClick={() => {
              rememberLocale(l);
              onNavigate?.();
            }}
            className={`inline-flex min-h-9 min-w-9 items-center justify-center rounded-full px-2 text-xs font-semibold uppercase tracking-wider transition ${
              l === locale ? "bg-ink text-bone" : "hover:bg-ink/5"
            }`}
          >
            <span aria-hidden="true">{l}</span>
            <span className="sr-only">{LOCALE_NAMES[l]}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function DemoNotice() {
  const { t, href } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full bg-burgundy px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white hover:bg-burgundy-deep"
        aria-haspopup="dialog"
      >
        <Info size={12} aria-hidden="true" />
        {t.common.demoBadge}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title={t.common.demoInfoTitle} closeLabel={t.common.close} variant="center" className="!max-w-lg">
        <div className="space-y-4 p-6">
          <p className="leading-relaxed">{t.common.demoInfoBody}</p>
          <Link href={href("/demo/")} className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
            {t.common.demoInfoLink}
          </Link>
        </div>
      </Dialog>
    </>
  );
}

export function Header() {
  const { t, href, locale } = useI18n();
  const shop = useShop();
  const ui = useUI();
  const pathname = usePathname() ?? "";
  const isHome = /^\/(en|nl|fr)\/?$/.test(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const collectionsRef = useRef<HTMLLIElement>(null);
  const count = cartCount(shop.cart);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Close transient menus on navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCollectionsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!collectionsOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!collectionsRef.current?.contains(e.target as Node)) setCollectionsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCollectionsOpen(false);
        collectionsRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [collectionsOpen]);

  const transparent = isHome && !scrolled && !collectionsOpen;
  const navLinks = [
    { href: "/shop/", label: t.nav.shop },
    { href: "/new/", label: t.nav.new },
    { href: "/lookbook/", label: t.nav.lookbook },
    { href: "/journal/", label: t.nav.journal },
    { href: "/about/", label: t.nav.about },
  ];
  const isActive = (p: string) => pathname.startsWith(`/${locale}${p.replace(/\/$/, "")}`);

  return (
    <>
      <div className="relative z-50 bg-ink text-bone">
        <div className="container-rm flex min-h-9 flex-wrap items-center justify-center gap-x-4 gap-y-1 py-1.5 text-center text-[11px] tracking-wide sm:justify-between">
          <p className="hidden sm:block">{t.strip.message}</p>
          <DemoNotice />
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 transition-[background-color,color,box-shadow] duration-500 ${
          transparent ? "bg-transparent text-white" : "bg-bone/95 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur"
        }`}
      >
        <div className="container-rm grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 lg:h-[4.5rem]">
          <div className="flex items-center gap-1">
            <button type="button" className="icon-btn xl:hidden" onClick={() => setMenuOpen(true)} aria-label={t.nav.openMenu} aria-haspopup="dialog">
              <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <nav aria-label={t.nav.mainNav} className="hidden xl:block">
              <ul className="flex items-center gap-6 whitespace-nowrap text-[0.8125rem] font-medium tracking-wide">
                <li>
                  <Link href={href(navLinks[0].href)} className="link-underline py-2" aria-current={isActive(navLinks[0].href) ? "page" : undefined}>
                    {navLinks[0].label}
                  </Link>
                </li>
                <li ref={collectionsRef}className="relative">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 py-2"
                    aria-expanded={collectionsOpen}
                    aria-controls="collections-menu"
                    onClick={() => setCollectionsOpen((v) => !v)}
                  >
                    {t.nav.collections}
                    <ChevronDown size={14} className={`transition-transform ${collectionsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  <AnimatePresence>
                    {collectionsOpen && (
                      <motion.div
                        id="collections-menu"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-3 w-72 rounded-xl border border-line bg-bone p-2 text-ink shadow-xl"
                      >
                        <ul>
                          {[...CATEGORY_IDS, "new-arrivals" as const].map((c) => (
                            <li key={c}>
                              <Link
                                href={href(c === "new-arrivals" ? "/new/" : `/collections/${c}/`)}
                                className="flex flex-col rounded-lg px-3 py-2 hover:bg-sand focus-visible:bg-sand"
                                onClick={() => setCollectionsOpen(false)}
                              >
                                <span className="text-sm font-semibold">{t.categories[c].label}</span>
                                <span className="text-xs text-taupe">{t.categories[c].blurb}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
                {navLinks.slice(1, 4).map((l) => (
                  <li key={l.href}>
                    <Link href={href(l.href)} className="link-underline py-2" aria-current={isActive(l.href) ? "page" : undefined}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <Link href={href("/")} className="flex flex-col items-center leading-none" aria-label={`${t.common.brand} — ${t.nav.home}`}>
            <span className="display whitespace-nowrap text-[1.4rem] tracking-[0.16em] xs:text-[1.65rem] xs:tracking-[0.22em] sm:text-[1.9rem]">RUE MIRA</span>
          </Link>

          <div className="flex items-center justify-end gap-0.5">
            <LocaleLinks className="mr-1 hidden md:flex" />
            <button type="button" className="icon-btn" onClick={() => ui.setSearchOpen(true)} aria-label={t.nav.search} aria-haspopup="dialog">
              <Search size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <Link href={href("/wishlist/")} className="icon-btn relative hidden sm:inline-flex" aria-label={`${t.nav.wishlist} (${shop.wishlist.length})`}>
              <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
              {shop.wishlist.length > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[10px] font-bold text-ink">
                  {shop.wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="icon-btn relative"
              onClick={() => ui.setBagOpen(true)}
              aria-label={`${t.nav.bag} (${count})`}
              aria-haspopup="dialog"
              data-testid="bag-button"
            >
              <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ scale: 0.4, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-burgundy px-1 text-[10px] font-bold text-white"
                    data-testid="bag-count"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      <Dialog open={menuOpen} onClose={() => setMenuOpen(false)} title={t.nav.menu} closeLabel={t.nav.closeMenu} variant="left">
        <nav aria-label={t.nav.mainNav} className="flex flex-col gap-8 p-5">
          <ul className="flex flex-col gap-1">
            {[{ href: "/", label: t.nav.home }, ...navLinks].map((l, i) => (
              <motion.li key={l.href} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 + i * 0.04 }}>
                <Link href={href(l.href)} onClick={() => setMenuOpen(false)} className="display block py-1.5 text-3xl">
                  {l.label}
                </Link>
              </motion.li>
            ))}
          </ul>
          <div>
            <p className="eyebrow mb-3">{t.nav.collections}</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
              {CATEGORY_IDS.map((c) => (
                <li key={c}>
                  <Link href={href(`/collections/${c}/`)} onClick={() => setMenuOpen(false)} className="block py-2 text-sm">
                    {t.categories[c].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ul className="flex flex-col gap-1 text-sm">
            <li>
              <Link href={href("/wishlist/")} onClick={() => setMenuOpen(false)} className="block py-2">
                {t.nav.wishlist} ({shop.wishlist.length})
              </Link>
            </li>
            <li>
              <Link href={href("/compare/")} onClick={() => setMenuOpen(false)} className="block py-2">
                {t.nav.compare} ({shop.compare.length})
              </Link>
            </li>
            <li>
              <Link href={href("/help/")} onClick={() => setMenuOpen(false)} className="block py-2">
                {t.nav.help}
              </Link>
            </li>
          </ul>
          <div>
            <p className="eyebrow mb-2">{t.nav.language}</p>
            <LocaleLinks onNavigate={() => setMenuOpen(false)} />
          </div>
        </nav>
      </Dialog>
    </>
  );
}
