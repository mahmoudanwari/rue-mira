import type { Metadata } from "next";
import { BASE_PATH, SITE_URL } from "@/lib/config";
import { body, display } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL + BASE_PATH + "/"),
  title: "RUE MIRA — Everyday, but never ordinary. (Portfolio demo)",
  description: "RUE MIRA — a fictional Belgian fashion demo storefront in English, Nederlands and Français. No real purchases.",
  alternates: {
    canonical: SITE_URL + BASE_PATH + "/",
    languages: {
      "en-BE": SITE_URL + BASE_PATH + "/en/",
      "nl-BE": SITE_URL + BASE_PATH + "/nl/",
      "fr-BE": SITE_URL + BASE_PATH + "/fr/",
      "x-default": SITE_URL + BASE_PATH + "/",
    },
  },
  icons: { icon: `${BASE_PATH}/favicon.svg` },
};

export default function GatewayLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
