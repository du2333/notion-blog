import { blogConfig } from "@/types/config";

export default blogConfig({
  NOTION_PAGE_ID:
    process.env.NOTION_PAGE_ID || "1be1f833110780d98383fc637676cee8",
  NEXT_REVALIDATE_SECONDS: 10, // 缓存时间

  AUTHOR: "Zephyrrr",
  SITE_URL: "https://www.example.com",
  BLOG_TITLE: "This is a blog",
  BLOG_DESCRIPTION: "This is a blog",
  BLOG_KEYWORDS: "blog,notion",
  HERO_WORDS1: "一名人类",
  HERO_WORDS2: "也是Web开发工程师",
  EMAIL: "example@emial.com",
  GITHUB: "https://github.com/example",

  POSTS_PER_PAGE: 12,

  IMAGE_COMPRESS_WIDTH: 1000,
});
