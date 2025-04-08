import type { MetadataRoute } from "next";
import BlogConfig from "@/blog.config";

export default function robots(): MetadataRoute.Robots {
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
