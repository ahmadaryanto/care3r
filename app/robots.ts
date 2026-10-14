import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private pool, personal results, and APIs stay out of search. /card/ stays crawlable
      // so social link previews work (card pages are noindex via metadata).
      disallow: ["/admin", "/talent", "/analysis/", "/api/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
