import type { NextConfig } from "next";

/**
 * RUE MIRA is a fully static site (GitHub Pages / any static host).
 * - output: "export" writes plain HTML/CSS/JS to ./out
 * - trailingSlash: true emits /en/shop/index.html so clean URLs refresh correctly
 * - NEXT_PUBLIC_BASE_PATH is empty for the custom subdomain. Set it (e.g. "/rue-mira")
 *   only when previewing on username.github.io/<repository>/ without a custom domain.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  experimental: { globalNotFound: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
