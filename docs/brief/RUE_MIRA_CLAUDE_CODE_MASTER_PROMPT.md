# MASTER PROMPT FOR CLAUDE CODE — RUE MIRA

> **COPY THE ENTIRE FILE INTO CLAUDE CODE.** This is an implementation brief, not a request to create image assets. Use the attached files `RUE_MIRA_PRODUCT_CATALOG.json`, `RUE_MIRA_ASSET_MANIFEST.csv`, `RUE_MIRA_IMAGE_MAP.json`, and `RUE_MIRA_88_INDIVIDUAL_IMAGE_PROMPTS.md` as companion references. **For all filenames and paths, the updated asset manifest, updated catalog, and updated image map override the old WebP paths still printed in the image-generation prompts; that prompt file is for visual descriptions only.** If they are not visible to Claude Code, put these files in the project directory and point Claude to them.

## Your role and outcome
Act as a senior creative director, UX designer, frontend architect, accessible interaction engineer, e-commerce prototyper, and QA lead. Build a polished, original, highly interactive 3-language fashion and accessories demo storefront for my web-design portfolio. This is a working demonstration, not a live merchant. It must feel exceptionally crafted, credible, fast, accessible, and distinctive. The brand is **RUE MIRA**, fictional, with tagline **Everyday, but never ordinary.** Audience is primarily fashion-conscious shoppers, including teens, though **all photographed models must be adults**. Market is Belgium; currency EUR. Products are affordable, but art direction is premium.

### Absolute rule: CLAUDE CODE MUST NOT GENERATE IMAGES
- **Never generate, synthesize, draw, request, download, scrape, search for, or substitute AI/stock photos or background pictures.** Do not invoke image-generation tools or APIs. Do not generate placeholder pictures as SVG, CSS data URIs, canvas paintings or gradients pretending to be product images. Do not use Unsplash, Pexels, remote images, or screenshots of other brand websites.
- All 88 photo assets have already been generated **with ChatGPT**, following `RUE_MIRA_88_INDIVIDUAL_IMAGE_PROMPTS.md`, and placed in the five existing folders under `public/images/`. Their exact numbered `.png` filenames and paths are defined in the **updated** `RUE_MIRA_ASSET_MANIFEST.csv`. Verify the actual files against the manifest; do not generate more images.
- Do not rename, move, convert, or replace **supplied PNG images** without my explicit permission. If I later authorize image optimization or responsive derivatives, such processing is **not** image generation. Never fabricate missing photos.
- Use all 88 supplied images immediately from their existing folders. **Only if a listed file is genuinely missing or cannot be loaded**, create an attractive non-photographic UI skeleton placeholder with neutral blocks and a filename/asset ID label in development. Ensure missing photos never crash the site or leave broken-image icons; report any mismatch before renaming or moving files.
- HTML/CSS typography, geometric shape dividers, icons from a licensed library, and basic non-photographic decorative SVG are fine; these are not substitutes for requested photographic assets. Render the brand wordmark with HTML text/vector typography if desired, not AI-generated imagery.

## Inputs and fixed boundaries
- Use exactly 32 curated products from `RUE_MIRA_PRODUCT_CATALOG.json` as the canonical data seed. Do not silently change prices, names, sizes, colors, photographic descriptions, product IDs or image paths. Retain 64 product photos and 24 other photos = **88 assets** total (8 collections + 10 campaigns + 6 lookbook).
- Keep every pathname under `/images/` aligned with the **updated manifest**, preserving the five existing folder names (including spaces) and the numbered `.png` filenames. At runtime `/images/Product images/01-rm-001-solene-midi-dress-main.png` is a valid example.
- Use fictional product copy, no borrowed brand identities, no fabricated real customer testimonials or claims, no copyrighted template reproduction.
- The demo must be transparent. Show a tasteful persistent **“Portfolio demo • No real purchases”** notice on the site (can be a compact banner or accessible info button) and an explicit checkout disclaimer. Do not pretend transactions are live.
- The website must use the **already supplied 88 images** and remain usable if an image is unexpectedly missing.
- Technical setting: I use a **Windows laptop** with Claude Code, GitHub repository and likely **GitHub Pages**, and Cloudflare manages my domain DNS. Proposed independent demo domain is `rue-mira.mahmoudanwari.com`; make domain configurable.
- No genuine server/database required. All demo data, customer interactions and store admin state must work on **static hosting**. No authentication claims, API server, API keys, real payments, production secrets, webhooks, email sending or live inventory.

## Build technology and deployment (non-negotiable)
- Use modern **Next.js App Router, TypeScript strict mode, Tailwind CSS, Motion** (or Framer Motion's current maintained equivalent), **Lucide** icons, and accessible UI primitives where useful. Check installed versions and use supported APIs. Prefer lightweight reusable design-system components to a huge dependency graph.
- Configure `next.config.ts` or supported equivalent with `output: 'export'` and `trailingSlash: true`. Use static generation only. `next build` must output complete HTML/CSS/JS to `out/`.
- Never use SSR, Next API routes, Server Actions, Node server at runtime, middleware, unsupported redirects/rewrites, request-time cookies or server-dependent image optimizer. If using Next `<Image>`, use `unoptimized` appropriately and robust onError fallback; ordinary `<img>` with accessible alt is also acceptable when implemented carefully.
- Static-generate **all locale routes and all 32 product detail routes per language**. Use `generateStaticParams()` and `dynamicParams = false` on dynamic segments as appropriate. Do not depend on request-time dynamic route resolution.
- Support clean paths and direct refresh on GitHub Pages. Since this site uses a dedicated custom subdomain at the root, do **not** accidentally add a repository-name `basePath`. Document how previews on `username.github.io/repository/` differ and how to enable a base path only if deploying without a custom domain.
- Root `/` must have a static HTML language gateway or an accessible client-side preference navigation — never a server redirect. Routes for English `/en/`, Dutch `/nl/`, French `/fr/`.
- Write `.github/workflows/deploy.yml` using current GitHub Pages Actions steps (`checkout`, `setup-node`, `npm ci`, `next build` via `npm run build`, `configure-pages`, `upload-pages-artifact` with path `./out`, `deploy-pages`), minimum permissions `contents: read`, `pages: write`, `id-token: write`, and concurrency that avoids racing builds. Pin supported action major versions. Also create `.nojekyll` in `public` to ensure `_next` static assets work.
- The intended custom hostname can be specified in `public/CNAME` once confirmed; document **GitHub repository → Settings → Pages → Custom domain**, and **Cloudflare DNS**: `CNAME` record with name `rue-mira`, target `<ACTUAL_GITHUB_USERNAME>.github.io` (not repository URL), start **DNS only** (grey cloud) while verifying GitHub HTTPS. Do not invent my GitHub username. Never alter existing site records, never assume Cloudflare DNS itself hosts files. If this project is actually hosted on Cloudflare Pages, generate an **optional** alternative deployment guide for `out/` and Cloudflare Pages project custom-domain setup, rather than changing the default.
- Use stable and supported Node LTS and a reproducible lockfile. Provide Windows PowerShell commands for install, dev, build, test and deployment.

## Brand identity and design system
- Brand: **RUE MIRA** / tagline: **Everyday, but never ordinary.** Tone: warm, confident, understated, stylish, welcoming, affordable.
- Palette: bone cream `#F7F2EB`; dusty rose `#E3B9BA`; rich burgundy `#7E3348`; champagne tan `#B29A79`; ink `#211D1B`; secondary warm taupe `#756A63`. Keep nearly all body text sufficiently high contrast on light backgrounds.
- Typography: distinctive editorial serif heading paired with crisp contemporary sans-serif body, ideally free and properly licensed fonts locally bundled or from reliable font loading with fallbacks. Do not depend on proprietary font files. Use generous white space, subtle rules, thin editorial dividers, tasteful radial compositions and asymmetric grid rhythm.
- Aesthetic is NOT a Zara/COS/Sezane/Mango clone; create independent art direction. Avoid overusing glassmorphism, bright neon, floating blobs, generic SaaS cards, heavy parallax, or a dark luxury store. Accessibility and shopping clarity come before animation.
- Responsive design at 360, 390, 768, 1024, 1440, 1920 px; mobile navigation and filters must be touch-friendly and keyboard accessible.

## Website information architecture (all three locales)
Required static and interactive routes (slugs may be consistent untranslated slugs across locales; translate on-page copy completely):
1. `/{locale}/` homepage
2. `/{locale}/shop/` all products with live search/filter/sort and query string share links
3. `/{locale}/new/` new arrivals
4. `/{locale}/collections/{category}/` each of 7 catalog categories; use 8th image for new arrivals
5. `/{locale}/products/{slug}/` all 32 product pages, for all 3 languages
6. `/{locale}/lookbook/` 6 shoppable looks
7. `/{locale}/wishlist/`, `/{locale}/compare/`, `/{locale}/bag/`
8. `/{locale}/checkout/`, `/{locale}/order-confirmation/` (static URLs with local demo state)
9. `/{locale}/about/`, `/{locale}/journal/` (2 static editorial stories), `/{locale}/contact/` (demo-only form), `/{locale}/help/`, `/{locale}/delivery-returns/`, `/{locale}/size-guide/`, `/{locale}/privacy/`, `/{locale}/terms/`, `/{locale}/demo/`
10. `/{locale}/demo-studio/` — clearly public and local-only demo administration area, **not** an authenticated admin system.
11. Static 404, sitemap.xml, robots.txt, correct localized metadata and hreflang alternatives. No fake star ratings/structured data claiming real purchase offers. If using product structured data, explicitly account for demo status and do not imply live product availability.

## Homepage creative direction: wow factor with restraint
Top: discreet shipping/service strip + demo disclosure, floating but practical editorial navbar and animated transparent-on-hero behavior transitioning to readable fixed background. Hero image desktop `/images/Home page and campaign images/73-home-hero-desktop.png` with headline *“Made for your every day.”*, secondary line, two real shop/collection CTAs. Mobile hero uses `/images/Home page and campaign images/74-home-hero-mobile.png`; responsive picture sources. On initial visit use revealing headline and slow layered mask, not disruptive video or loading screens. Use each campaign image exactly by planned placement.
- Elegant category marquee/tile navigation using 8 collection images, hover alternate crop effects (do not zoom beyond quality), tap safe. Use IMG-072 (`/images/Category images/72-home-featured-outfit.png`) both for the New Arrivals category image and for the homepage featured-outfit placement; this is intentional reuse, not a 89th asset.
- New arrivals and best-loved products from catalog, filtered deterministically.
- Rich editorial split section using `/images/Home page and campaign images/75-home-editorial-city-style.png`.
- Interactive product spotlight using one catalog product and the proper existing image.
- Shop-by-mood/Weekend section using `/images/Home page and campaign images/76-home-weekend-edit.png`.
- Three staggered editorial accessory promotions using bag/shoes/jewellery feature campaign assets.
- 6-look shoppable collage preview linking to lookbook, with accessible HTML hotspot controls.
- About/manifesto teaser and newsletter area with `/images/About in newsletter images/82-home-newsletter.png`; newsletter is demo-only and must never transmit or pretend to subscribe email addresses.
- Footer with all languages, helpful pages, clear disclaimer, and mock contact details clearly labelled demo (no invented real business address or actual helpdesk).

## Detailed shopping interactions
- Catalog cards show consistent 3:4 images, name, localized price, color swatch, sizes available, hover/tap alternate photo, quick add (requires size where relevant), wishlist, quick view, concise accessible hover/focus treatment.
- Search overlay with typeahead suggestions; normalize diacritics and search localized names/tags/descriptions; URL-shareable keyword in shop page. Keyboard navigation, escape close, focus return.
- Shop filters: multi-select category, in-stock, color, size, minimum/maximum EUR price; sorting: featured, price ascending, descending, name A-Z, newest. Filters compose correctly with search and sort. Update clear-visible result count and a visible Clear All option. Desktop side rail and mobile drawer.
- Product detail: gallery with main/detail views, keyboard-controlled image change, accessible zoom modal with escape and focus lock, size selection, inventory availability, quantity, add-to-bag animation, wishlist, compare, related matching catalog products, functional size guide drawer. Never show a nonexistent variant photo for a different color; each item has one photographed color and multiple sizes where appropriate.
- Wishlist persists in localStorage and shows empty state, count and add-to-bag.
- Compare max 4 products with a functional comparison table containing meaningful values (category, price, fabric, color, sizes, demo stock), not just visual filler. Comparison must handle cross-category gracefully.
- Cart supports size-specific line items, quantity adjustment, removal, price updates, promo code `MIRA10` (10% demo-only discount), subtotal, shipping simulation, clearly labeled VAT-inclusive pricing. Persist non-sensitive state in localStorage; handle disabled storage gracefully. Shipping example: `€4.95` home delivery and `€2.95` pickup; optional free home delivery from `€70` pre-discount subtotal; explicitly fictional rates and estimates. Use consistent rounding with integer euro-cent arithmetic, no floating money bugs.
- Checkout steps: bag review → delivery (prefilled fictional sample identity or user may edit but do **not persist** personally identifiable fields) → demo delivery selection → **simulated payment only** (choice labels, never input or store card numbers) → review → explicitly labeled demo order confirmation. Generate a fake order code such as `DEMO-RM-XXXXXX` client-side; persist only order code, item IDs, quantities, totals and timestamps for demo history. A demo order must not send emails, charge payments, or claim real fulfillment. Treat checkout completion as local simulated state, reduce local demo inventory if desirable, and have an easy reset.
- Product state changes in public demo-studio are browser-only, clearly labeled as non-shared, not an actual admin authentication or secure CMS. Support edits to price, stock, product visible/hidden, search, reset seed data, import/export JSON with input validation, and read-only demo order dashboard. Data changing in one browser should not claim to propagate to other visitors. If local storage unavailable, fall back safely to current-session state. Provide easy “Reset demo” button with confirmation. Do not permit uploading arbitrary executable content; image assets come only from manifest/approved build.
- Transparent trust: no fake real reviews or testimonial scores. Optional editorial quotes must be marked clearly fictional. No fabricated scarcity or “Only 1 left” dark patterns based on invented claims outside demo data.

## Three-language implementation
- Full translation of navigation, cart, checkout, sorting/filter labels, demo disclaimers, footer, product names/descriptions, size guide, journal, about, and all interactive errors/empty states to fluent English, Dutch (Belgian context), and French (Belgian context). No partial English fallback in Dutch/French except proper brand/product names.
- Keep stable product IDs and path slugs; change labels, not IDs. Preserve the equivalent page when switching locale; if missing use localized homepage. Use appropriate `lang` attribute and accessible label per locale. EUR formatting: `Intl.NumberFormat` with locale `en-BE`, `nl-BE`, `fr-BE` and `currency: EUR`.
- Do not use Next runtime middleware or server locale negotiation. Build all supported locale pages upfront.

## Editorial animation requirements
Use Motion with GPU-efficient `transform` and `opacity` to implement: cinematic hero headline reveal, a delicate product-grid stagger on entry, category image pan on hover, elegant mobile menu reveal, tactile CTA press feedback, floating bag counter and add-to-bag image/position feedback if feasible without layout thrash, drawer transitions, product quick-view modal, compare panel, lookbook hotspot microinteractions, and subtle scrolling section reveals. Smooth but not excessive; no auto-scrolling, scroll-jacking or giant entrance waits. Respect `prefers-reduced-motion` globally; never animate essential content offscreen indefinitely. Keep accessible focus/keyboard behavior and 60fps goals on ordinary devices.

## Image map and graceful fallbacks
- Read the exact 88 paths from the manifest. Use the additional `RUE_MIRA_IMAGE_MAP.json` as the canonical mapping for campaign, collection, and shoppable lookbook photos + product hotspot IDs; do not invent extra required photo filenames. Create typed asset constants from this map and read catalog product image paths from the product JSON.
- Provide an accessible `AssetImage` component that attempts local image file only and shows a styled neutral non-photo placeholder when the file is missing, using layout-stable CSS aspect ratios. Track missing image list in development. Render first hero image with high priority; lazy load offscreen images. Add curated natural alt text for all imagery; for decorative marketing imagery with nearby duplicate description use alt="".
- Responsive CSS crops must not destroy product identity or crop faces in awkward ways. Test mobile/desktop crops with supplied imagery.

## Data architecture, state and quality
- Product catalog seed: use supplied JSON, add localized translations in a separate mapping keyed by product ID; do not duplicate inconsistent canonical prices/IDs. A small typed schema validated at build or runtime via Zod or equivalent is desirable.
- `lib/catalog`, `lib/i18n`, `lib/money`, `lib/storage`, `lib/demo-orders`, `components/layout`, `components/shop`, `components/product`, `components/lookbook`, `components/ui`, `app/[locale]` are recommended modules. Plan actual structure coherently and document it.
- Store cart lines by `productId + size`, wishlisted product IDs, comparison product IDs and optional local edits. Version and validate storage formats. Never write secrets or real shipping data to local storage; use user input only ephemerally for step progression.
- Ensure no broken links, console errors, hydration errors, horizontal mobile overflow, stale images, dead interactive controls, or inaccessible modals.
- Tests: unit tests for filtering, sorting, money totals, discount/shipping, wishlist/cart logic, local storage failure; Playwright or equivalent E2E for 3 locale navigation, product search/filters, add to cart, wishlist, product compare, size guide, and demo checkout with no payment inputs. Test responsive sizes. Test a clean build with the 88 supplied photos present; verify graceful fallback for any genuinely missing file without changing or deleting my originals. Run lint and typecheck.
- UX performance: aim Lighthouse 90+ performance on representative device with fully optimized local media (a target, not guaranteed), accessible contrast and semantic markup, zero cumulative layout shift from images using known aspect ratios, font-display swap, no unnecessary runtime fetches, efficiently loaded supplied PNG images (do not convert or rename without permission).

## Required written files and completion criteria
Create within the project:
- `README.md` with Windows PowerShell install, run, build, and deploy instructions, brief brand overview, 88-asset path verification procedure for the existing folders, troubleshooting, and demo limitations.
- `docs/DEPLOY_GITHUB_PAGES_CLOUDFLARE.md` with actual step-by-step and distinction between GitHub Pages and Cloudflare Pages. Require manual confirmation of real GitHub username and domain before DNS changes.
- `docs/ASSET_STATUS.md` automatically or manually maintained checklist of all manifest files missing/present, grouped by type, and instructions for resolving any genuinely missing image paths. Do not fake a completed image count.
- `docs/FEATURE_TEST_MATRIX.md` including each interactive feature and tested status.
- `.github/workflows/deploy.yml` to deploy static output as above.
- `public/.nojekyll` and optionally `public/CNAME` only if the custom domain is confirmed by me; do not silently publish a domain from a guessed setting.

## How to execute this large project
1. Inspect the current project folder before writing anything. If an existing project is present, protect it: do not delete or overwrite files without first explaining the change. If empty, scaffold the Next TypeScript site.
2. Read all companion files, especially `RUE_MIRA_IMAGE_MAP.json` for the six lookbook outfits. Outline a short architecture/route and component plan, then **start implementing**, not just discussing a mockup.
3. Build first the design system, translations, product catalog, shared layout/navigation, imagery abstraction, homepage.
4. Build shopping and product pages, filters, search, quick-view, zoom, wishlist, comparison, lookbook.
5. Build cart and transparent demo checkout, then demo-studio with local state controls.
6. Build remaining editorial/help pages, SEO, translations, animation polish, deployment workflow, tests and README.
7. Run local checks; fix errors. Summarize what really works, which tests passed, what is unfinished, and which image filenames are missing. Never claim tasks were run if they were not.
8. If context is limited, implement in working phases without abandoning requirements. Maintain `docs/PROGRESS.md` with checklist and next steps. All 88 image assets are already supplied; if any file is unexpectedly missing, report the exact filename and use a neutral non-photo fallback rather than generating it.

## Absolute acceptance checklist
[ ] 32 consistent products, 7 core categories and an 8th new-arrivals image
[ ] Exactly 88 image manifest entries; no substitutions or generated photos
[ ] Responsive visual polish, editorial homepage and impressive but restrained animation
[ ] Functional search, composable filters, sorting, quick-view, wishlist, compare max 4, zoom and size guide
[ ] Full mock cart, money and shipping math, no real card capture or payment
[ ] All 6 shoppable looks wired to actual product IDs
[ ] English/Dutch/French working on every route including checkout and demo-studio
[ ] Product pages statically generated for all 32 products × 3 languages
[ ] Local editable public demo-studio, reset, JSON import/export, sample orders
[ ] Accessible keyboard flows, responsive mobile experience and reduced-motion support
[ ] Static `out/` build succeeds and GitHub Pages GitHub Actions deployment guide exists
[ ] All product/media references follow manifest paths; missing files show non-photo placeholders
[ ] Clear portfolio demo disclosure and no fabricated reviews or business credibility claims
[ ] README, docs, quality checks and any untested limitations reported

**Now begin implementation in my Windows-compatible project. Do not generate images.**
