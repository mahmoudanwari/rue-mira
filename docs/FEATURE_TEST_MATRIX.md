# Feature test matrix

Status as of 2026-11-15. "Unit" = Vitest (`tests/unit`), "E2E" = Playwright against the built
`out/` folder in Microsoft Edge (`tests/e2e`), "Manual" = looked at by hand in the browser pane during development (homepage desktop + mobile, a mobile product page, lookbook hotspots at 360 px, the Dutch shop toolbar).

| Feature | Unit | E2E | Manual | Notes |
| --- | --- | --- | --- | --- |
| Language gateway at `/` + remembered choice | – | ✅ | – | Static page + tiny inline script, no server redirect |
| Switch language keeps the same page | – | ✅ | – | Product page EN → FR |
| `<html lang>` per locale (`en-BE`, `nl-BE`, `fr-BE`) | – | ✅ | – | |
| All UI keys translated, placeholders consistent | ✅ | – | – | Fails if NL/FR has English leftovers |
| Checkout + Demo Studio render in all 3 languages | – | ✅ | – | |
| Catalog integrity (32 products, 7 categories, 88 images) | ✅ | – | – | Seed equals supplied JSON exactly |
| Image files present with exact letter case | `assets:check` | – | – | 88 / 88 present |
| Missing image → neutral placeholder | – | ✅ | – | Simulated 404 for one file (WebP + PNG) |
| Images served as WebP, PNG fallback if a copy fails | – | ✅ | ✅ | Homepage at 360 px: 50 images, 1.32 MB, all WebP |
| Search overlay typeahead, keyboard, diacritics | ✅ | ✅ | – | "celeste" finds Céleste |
| Shop filters compose (category, colour, size, stock, price) | ✅ | ✅ | – | |
| Sorting (featured, price ↑↓, name, newest) | ✅ | ✅ | – | |
| Filters in shareable URL, restored on reload | ✅ | ✅ | – | |
| Clear-all + result count | – | ✅ | – | |
| Mobile filter drawer | – | ✅ | – | |
| Product gallery (main/detail, arrow keys) | – | ✅ | – | |
| Zoom modal (Escape closes) | – | ✅ | – | Focus trap implemented in `Dialog`; Tab cycling not automated |
| Size required, sold-out sizes disabled | – | ✅ | – | |
| Size guide drawer, Escape, focus return | – | ✅ | – | |
| Quick add (one size + size picker) / quick view from cards | – | ✅ | – | |
| Wishlist persistence | ✅ | ✅ | – | |
| Compare max 4 + comparison table | ✅ | ✅ | – | Cross-category notice |
| Cart lines per product + size, stock caps | ✅ | ✅ | – | |
| Money maths in integer cents, VAT, shipping, free from €70 | ✅ | ✅ | – | |
| Promo `MIRA10` | ✅ | ✅ | – | |
| Storage blocked / corrupted → graceful fallback | ✅ | – | – | |
| Demo checkout 5 steps, validation, no payment inputs | – | ✅ | – | |
| Personal fields never stored | – | ✅ | – | localStorage inspected after order |
| `DEMO-RM-XXXXXX` confirmation + order history | ✅ | ✅ | – | |
| Demo stock reduced after an order | – | ✅ | – | 12 → 11 |
| Demo Studio visibility toggle + reset | – | ✅ | – | |
| Demo Studio price edit reflected in shop | – | ✅ | – | Stock inputs not automated |
| Studio JSON export / import validation | ✅ | – | – | Rejects unknown fields, products, sizes |
| Lookbook hotspots wired to real products | ✅ | – | ✅ | Popover anchoring checked at 360 px |
| No horizontal overflow at 360/390/768/1024/1440/1920 | – | ✅ | ✅ | 6 key pages |
| Mobile menu | – | ✅ | – | |
| 404 page | – | ✅ | – | Status 404 from `404.html` |
| Reduced motion | – | – | partial | `MotionConfig reducedMotion="user"` + CSS override; not automated |
| Designer credit (EN/NL/FR) linking to mahmoudanwari.com | – | ✅ | ✅ | Footer, gateway, 404 |
| Banner, weekend and newsletter photos cropped ≤ 10 % (390 + 1440 px) | – | ✅ | ✅ | |
| Whole suite against the live site (`E2E_BASE_URL`) | – | ✅ | – | 26 tests, run twice: 52 / 52 |
| Lighthouse ≥ 90 | – | – | not run | WebP copies remove the main risk (image weight); not measured yet |
