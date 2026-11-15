# Deploying RUE MIRA — GitHub Pages + Cloudflare DNS

The site is a static export (`out/`). The default host is **GitHub Pages**, built by
`.github/workflows/deploy.yml`. **Cloudflare only manages DNS** — it does not host the files
(unless you deliberately choose the optional Cloudflare Pages route at the end).

> ⚠️ **Confirm before changing anything:** your real GitHub username and the final domain
> (proposed: `rue-mira.mahmoudanwari.com`). Nothing below should be applied with a guessed value.
> Do not edit or delete any other existing DNS records.

## 1. Push the project to GitHub

```powershell
cd E:\ERU-MIRA
git init
git add .
git commit -m "RUE MIRA demo storefront"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<REPOSITORY>.git
git push -u origin main
```

## 2. Enable GitHub Pages with Actions

1. Repository → **Settings → Pages**.
2. **Build and deployment → Source: GitHub Actions**.
3. (Optional) Repository → Settings → Secrets and variables → Actions → **Variables** →
   add `SITE_URL` = `https://rue-mira.mahmoudanwari.com` (used for canonical URLs and the sitemap).
4. Push to `main` (or run the workflow manually). The workflow runs lint, typecheck, unit tests,
   the 88-image check, creates the WebP copies (`prebuild`), builds `out/` and deploys it.

The workflow pins major versions of `actions/checkout`, `actions/setup-node`,
`actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages`, with minimal
permissions (`contents: read`, `pages: write`, `id-token: write`) and a `pages` concurrency group.

### Preview without a custom domain

At `https://<username>.github.io/<repository>/` the site lives in a sub-folder, so it needs a base
path. Temporarily change the build step's env in `deploy.yml`:

```yaml
NEXT_PUBLIC_BASE_PATH: /<repository>
```

Remove it again (empty string) once the custom domain is active — the subdomain serves from the root.

## 3. Add the custom domain in GitHub

1. Repository → **Settings → Pages → Custom domain** → enter `rue-mira.mahmoudanwari.com` → **Save**.
2. Once confirmed, also commit a `public/CNAME` file containing exactly:
   ```
   rue-mira.mahmoudanwari.com
   ```
   (It is intentionally not in the repo yet, so a guessed domain is never published.)

## 4. Cloudflare DNS

In the Cloudflare dashboard for `mahmoudanwari.com` → **DNS → Records → Add record**:

| Type | Name | Target | Proxy status |
| --- | --- | --- | --- |
| `CNAME` | `rue-mira` | `<YOUR_GITHUB_USERNAME>.github.io` | **DNS only** (grey cloud) |

- The target is your **user/organization Pages host**, *not* the repository URL.
- Keep it **DNS only** until GitHub shows the domain as verified and **Enforce HTTPS** can be
  ticked (Settings → Pages). After that you may switch the proxy on; if you do, set Cloudflare
  SSL/TLS mode to **Full** (not Flexible) to avoid redirect loops.
- Don't modify the apex record or any other existing records.

DNS can take a few minutes to a few hours. Check with:

```powershell
Resolve-DnsName rue-mira.mahmoudanwari.com -Type CNAME
```

## 5. Verify

- `https://rue-mira.mahmoudanwari.com/` shows the language gateway.
- `/en/`, `/nl/`, `/fr/` and a deep link like `/nl/products/elia-shirt-dress/` load on refresh.
- An unknown path shows the RUE MIRA 404 page.
- Images load (if not: `npm run assets:check` for letter-case issues).

---

## Optional alternative: Cloudflare Pages

Use this **only** if you decide to host on Cloudflare instead of GitHub Pages (don't run both for the
same hostname).

1. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** → select the repository.
2. Build settings: Framework preset **None**; Build command `npm run build`; Build output directory `out`;
   Environment variable `NODE_VERSION` = `24` (and optionally `NEXT_PUBLIC_SITE_URL`).
3. After the first deploy: project → **Custom domains → Set up a domain** → `rue-mira.mahmoudanwari.com`.
   Cloudflare creates the DNS record for you (remove the GitHub `CNAME` record first if one exists).
4. Disable the GitHub Pages workflow (or delete `deploy.yml`) to avoid two deployments.

Cloudflare Pages serves `404.html` automatically for unknown routes, and `trailingSlash: true`
output works without extra configuration.
