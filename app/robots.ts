import type { MetadataRoute } from "next";
import { allowIndexing, siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
