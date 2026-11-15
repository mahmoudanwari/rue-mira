# RUE MIRA — project notes for Claude

Fictional Belgian fashion & accessories **portfolio demo** storefront by **Mahmoud Anwari**.
Live: https://rue-mira.mahmoudanwari.com · Repo: https://github.com/mahmoudanwari/rue-mira (public) · Local: `E:\RUE-MIRA`

@AGENTS.md

## How the owner works

- Do every step yourself: edit, test, build, commit, push, deploy and verify on the live site.
  Ask the owner only for things you can't do (signing in, one-time codes, approvals).
- Explain results in plain language; the owner is not a developer.

## Hard rules

- **Never generate, download or substitute images.** All 88 photos in `public/images/` were made by the owner in ChatGPT.
  If a new image is needed: give one ChatGPT prompt per image + the exact filename (`NN-name.png`, numbering after 88)
  + the folder under `public/images/`. Then run `npm run assets:check`.
- Don't rename/move/convert the PNG originals. WebP copies are generated automatically into `public/images-webp/` (gitignored).
- Keep the "Portfolio demo • No real purchases" disclosure and the simulated, no-payment checkout. No fake reviews or claims.
- Keep the footer credit "Designed & developed by Mahmoud Anwari" (EN/NL/FR, links to https://mahmoudanwari.com).
- All UI text exists in English, Dutch and French: `lib/i18n/{en,nl,fr}.ts` (NL/FR are type-checked against EN),
  long-form copy in `lib/content/`, product copy in `lib/catalog/translations.ts`. Change all three languages together.
- Canonical product data is `data/catalog.json` (32 products); image map is `data/image-map.json`.

## Stack & commands (Windows; Bash tool works too)

Next.js 16 App Router static export (`output: "export"`, `trailingSlash: true`) → `out/`, TypeScript strict,
Tailwind v4, Motion, Lucide, Zod. Read `node_modules/next/dist/docs/` before using unfamiliar Next APIs.

| Task | Command |
|---|---|
| Install | `npm ci` |
| Dev server | `npm run dev` (port 3000; `.claude/launch.json` = `rue-mira-dev`) |
| Lint / types / unit | `npm run lint` · `npm run typecheck` · `npm run test` |
| Images present (case-sensitive) | `npm run assets:check` |
| Build | `npm run build` (runs the WebP step first) |
| Serve build | `npm run serve` → http://localhost:4173 |
| E2E (Edge) | `npm run test:e2e` (after build) |
| E2E on live site | `E2E_BASE_URL=https://rue-mira.mahmoudanwari.com npx playwright test` |

## Deploying

Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to GitHub Pages (~2 min).
Custom domain is set in repo Settings → Pages (no CNAME file — same as the owner's other demos).
Cloudflare DNS (zone mahmoudanwari.com): `CNAME rue-mira → mahmoudanwari.github.io`, DNS only. HTTPS enforced.
`gh` CLI is logged in as `mahmoudanwari` with the `workflow` scope. Commit trailer:
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>` (or the current model).

After every deploy: run the E2E suite against the live URL and confirm it passes.

## Design language (keep it consistent)

Palette tokens in `app/globals.css` (bone, burgundy, dusty rose, champagne, ink, taupe). Cormorant Garamond display +
Manrope body. Editorial headings end on an italic burgundy word via `components/ui/Accent.tsx` (rose on dark
surfaces, `.on-dark`). No small "eyebrow" labels above headings. Product names are set in the serif. Photos must keep
their own aspect ratio (3:4 products/collections, 4:5 lookbook/promos, 16:9 campaigns) — don't crop them into other shapes.

More detail: `README.md`, `docs/` (deployment guide, asset status, feature test matrix, progress).
