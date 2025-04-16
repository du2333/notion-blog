import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/notion/getSiteData";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { config: BlogConfig } = await getSiteData();
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [],
      },
    ],
    sitemap: `${BlogConfig.SITE_URL}/sitemap.xml`,
  };
}
