import { Cormorant_Garamond, Manrope } from "next/font/google";

/** Fonts are downloaded at build time and self-hosted in the static output (no runtime requests). */
export const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const body = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});
