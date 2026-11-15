import type { MetadataRoute } from "next";
import { BASE_PATH, SITE_URL } from "@/lib/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Personal, stateful demo pages carry no useful content for search engines.
      disallow: ["/*/bag/", "/*/checkout/", "/*/order-confirmation/", "/*/wishlist/", "/*/compare/", "/*/demo-studio/"],
    },
    sitemap: `${SITE_URL}${BASE_PATH}/sitemap.xml`,
  };
}
