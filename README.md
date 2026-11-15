# RUE MIRA — *Everyday, but never ordinary.*

A fictional Belgian fashion & accessories label, built as a **portfolio demo storefront**.
Three languages (English, Nederlands, Français), 32 products, 88 supplied photographs, a full
shopping flow with a **simulated** checkout — all running as a static site on GitHub Pages.

> **Portfolio demo • No real purchases.** Nothing can be bought, no payment is taken, no email is
> sent and no personal data leaves the browser.

## Stack

- Next.js 16 App Router, **static export** (`output: "export"`, `trailingSlash: true`) → `./out`
- TypeScript (strict), Tailwind CSS v4, Motion (`motion/react`), Lucide icons, Zod
- Vitest (unit) and Playwright (end-to-end)
- Fonts: Cormorant Garamond + Manrope via `next/font` — downloaded at build time and self-hosted

## Quick start (Windows PowerShell)

Requires Node.js 22 or newer (`.nvmrc` pins 24 for CI).

```powershell
cd E:\ERU-MIRA
npm ci                 # install exact versions from package-lock.json
npm run dev            # http://localhost:3000  (/ is the language gateway)
```

| Task | Command |
| --- | --- |
| Lint | `npm run lint` |
| Typecheck | `npm run typecheck` |
| Unit tests | `npm run test` |
| Verify the 88 image files (case-sensitive) | `npm run assets:check` |
| Create/refresh WebP copies (runs automatically before dev and build) | `npm run images:webp` |
| Production build → `out/` | `npm run build` |
| Serve `out/` like GitHub Pages | `npm run serve` → http://localhost:4173 |
| End-to-end tests (after a build) | `npm run test:e2e` |
| Everything, in order | `npm run test:all` |

End-to-end tests use the **Microsoft Edge** installed with Windows, so no browser download is needed.
To use Playwright's own Chromium instead: `npx playwright install chromium`, then
`$env:PW_CHANNEL = "chromium"; npm run test:e2e`.

## Project structure

```
app/
  (gateway)/          "/" — static language picker (no server redirect)
  [locale]/           root layout per language (<html lang="en-BE|nl-BE|fr-BE">)
    page.tsx          homepage
    shop/ new/ collections/[category]/ products/[slug]/ lookbook/
    wishlist/ compare/ bag/ checkout/ order-confirmation/
    about/ journal/ journal/[story]/ contact/ help/ delivery-returns/
    size-guide/ privacy/ terms/ demo/ demo-studio/
  global-not-found.tsx   404.html
  sitemap.ts robots.ts
components/
  layout/   header, footer, overlays (bag drawer, quick view, search, compare tray, size guide)
  shop/     product card & grid, shop filters, wishlist/compare/bag views
  product/  gallery + zoom, purchase panel, size tables
  lookbook/ hotspot images and lookbook page
  checkout/ bag contents, 5-step demo checkout, confirmation
  home/     hero and editorial homepage sections
  studio/   Demo Studio
  ui/       AssetImage (with missing-file fallback), Dialog (focus trap), Reveal
lib/
  catalog/  Zod-validated catalog, translations, filters/sort/search, lookbook hotspots
  i18n/     en / nl / fr dictionaries (Dutch & French are type-checked against English)
  content/  long-form page copy per language
  money.ts  integer-cent maths, VAT, promo, shipping
  cart.ts storage.ts store.tsx demo-orders.ts studio.ts seo.ts
data/
  catalog.json      the supplied 32-product catalog (canonical, unmodified)
  image-map.json    the supplied collection / campaign / lookbook map
public/images/      the 88 supplied photographs (never generated, renamed or converted)
tests/unit  tests/e2e  scripts/
```

## How the demo works

- **Catalog:** `data/catalog.json` is the single source of prices, sizes, stock and image paths.
  Dutch and French copy is kept separately in `lib/catalog/translations.ts`, keyed by product ID.
- **State:** bag (`productId + size`), wishlist, compare (max 4), promo, shipping choice, Demo Studio
  edits and demo orders are stored in `localStorage` under versioned, validated keys. If storage is
  blocked, everything still works for the current visit and a notice explains why.
- **Money:** all totals use integer euro cents. Home delivery €4.95 (free from €70 before
  discount), pickup €2.95, promo `MIRA10` = 10 %. Prices include 21 % Belgian VAT. All fictional.
- **Checkout:** bag → delivery (prefilled fictional sample, never stored) → method → simulated
  payment (labels only, no card fields) → review → `DEMO-RM-XXXXXX` confirmation. Only the order
  code, items, totals and time are stored; demo stock is reduced locally.
- **Demo Studio** (`/{locale}/demo-studio/`): a public, browser-only back-office imitation — edit
  prices, stock and visibility, view demo orders, export/import JSON (validated), reset everything.
  It is not authenticated and changes never reach other visitors.

## Images (88 supplied assets)

All photos were created with ChatGPT and supplied in `public/images/` — this project **never
generates, downloads or substitutes images**. Paths come from `data/catalog.json` and
`data/image-map.json` and must match the files **exactly, including letter case** (GitHub Pages
is case-sensitive even though Windows is not).

Verify them at any time:

```powershell
npm run assets:check   # writes docs/ASSET_STATUS.md, exits with an error if any file is missing
```

If a file is ever missing, the site shows a neutral non-photographic placeholder (with the file
name in development) instead of a broken image. Fix the file or the path — don't substitute photos.

Need a new image? Ask for a ChatGPT prompt together with the exact file name and folder.

**WebP copies (added with your permission):** `scripts/optimize-images.mjs` reads each supplied PNG
and writes resized WebP copies (480 px, 960 px and up to 1600 px wide, quality 80) to
`public/images-webp/<same folder>/<name>-<width>.webp`. The originals are never modified.

- It runs automatically before `npm run dev` and `npm run build` (also on GitHub Actions) and skips
  copies that are already up to date. The copies are gitignored; `data/image-variants.json` lists them.
- Pages use `<picture>` with a responsive WebP `srcset`; the browser picks the right width.
  If a WebP copy fails to load, the original PNG is used automatically.
- Result: 190 MB of PNGs → 9.2 MB of WebP at full size. The whole homepage on a phone downloads
  about 1.3 MB of images (it was ~100 MB with the PNGs).
- Added or replaced a PNG? Just run `npm run dev` or `npm run build` — the copies regenerate.

## Deployment

See [docs/DEPLOY_GITHUB_PAGES_CLOUDFLARE.md](docs/DEPLOY_GITHUB_PAGES_CLOUDFLARE.md).
In short: push to `main` → GitHub Actions builds `out/` and publishes it to GitHub Pages.

- The custom subdomain is served from the root, so `NEXT_PUBLIC_BASE_PATH` stays empty.
- `public/CNAME` is **intentionally not created** until the domain is confirmed.
- `NEXT_PUBLIC_SITE_URL` (default `https://rue-mira.mahmoudanwari.com`) controls canonical URLs,
  hreflang and the sitemap. Set a repository variable `SITE_URL` to change it.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Images work locally but not on GitHub Pages | Run `npm run assets:check` — a letter-case mismatch is the usual cause. |
| CSS/JS 404 on GitHub Pages | Make sure `public/.nojekyll` exists (it does) so `_next/` is served. |
| Site works at `user.github.io/repo/` only without styles | Build with `$env:NEXT_PUBLIC_BASE_PATH = "/repo"` for that preview. |
| `npm run test:e2e` cannot find a browser | Install Edge or use `npx playwright install chromium` and set `PW_CHANNEL`. |
| Bag/wishlist forget everything | Browser storage is blocked (private mode). Expected — a notice is shown. |
| Folder rename "access denied" on Windows | Close File Explorer / image viewers that have the folder open, then retry. |

## Demo limitations

- No accounts, real inventory, payments, emails or server — by design.
- Demo Studio edits live in one browser only.
- Product structured data (JSON-LD offers) is intentionally omitted so search engines don't treat
  demo products as purchasable.
- Social-media preview images (Open Graph) still point at the original PNGs.
