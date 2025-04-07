import { blogConfig } from "@/types/config";

export default blogConfig({
  NOTION_PAGE_ID:
    process.env.NOTION_PAGE_ID || "1be1f833110780d98383fc637676cee8",
  NEXT_REVALIDATE_SECONDS: 10, // 缓存时间

  AUTHOR: "Kuangda",
  SITE_URL: process.env.SITE_URL || "https://www.example.com",
  BLOG_TITLE: "DKD Blog",
  BLOG_DESCRIPTION: "Record some technical sharing.",
  BLOG_KEYWORDS: [
    "DKD",
    "Blog",
    "Kuangda",
    "DKD Blog",
    "Kuangda Blog",
    "Tech Blog",
    "博客",
    "旷达",
    "编程",
    "技术分享",
  ],
  EMAIL: "kuangdadu@gmail.com",
  GITHUB: "https://github.com/du2333",

  POSTS_PER_PAGE: 12,

  IMAGE_COMPRESS_WIDTH: 1000,
});
