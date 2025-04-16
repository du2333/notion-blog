import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/notion/getSiteData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteData = await getSiteData();

  const { publishedPosts, config: BlogConfig } = siteData;

  const blogPostsSitemap = publishedPosts.map((post) => ({
    url: `${BlogConfig.SITE_URL}/post/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.lastEditedTime),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  return [
    {
      url: BlogConfig.SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${BlogConfig.SITE_URL}/tag`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
    ...blogPostsSitemap,
  ];
}
