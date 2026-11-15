import type { Metadata } from "next";
import { body, display } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "404 — RUE MIRA",
  robots: { index: false },
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <main className="container-rm flex min-h-dvh flex-col justify-center gap-8 py-16">
          <p className="display text-3xl tracking-[0.2em]">RUE MIRA</p>
          <p className="eyebrow">404</p>
          <div className="space-y-4">
            <h1 className="display max-w-3xl text-5xl sm:text-7xl">This page took a different street.</h1>
            <p lang="nl" className="display text-2xl italic text-taupe">
              Deze pagina nam een andere straat.
            </p>
            <p lang="fr" className="display text-2xl italic text-taupe">
              Cette page a pris une autre rue.
            </p>
          </div>
          <ul className="flex flex-wrap gap-3">
            <li>
              {/* Plain anchors: this page bypasses the app layouts. */}
              <a href={`${BASE}/en/`} hrefLang="en" className="btn btn-primary">
                Home
              </a>
            </li>
            <li>
              <a href={`${BASE}/nl/`} hrefLang="nl" lang="nl" className="btn btn-outline">
                Home (NL)
              </a>
            </li>
            <li>
              <a href={`${BASE}/fr/`} hrefLang="fr" lang="fr" className="btn btn-outline">
                Accueil (FR)
              </a>
            </li>
          </ul>
          <p className="text-xs text-taupe">Portfolio demo • No real purchases</p>
        </main>
      </body>
    </html>
  );
}
