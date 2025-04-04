import { blogConfig } from "@/types/config";

export default blogConfig({
  NOTION_PAGE_ID: process.env.NOTION_PAGE_ID || "1be1f833110780d98383fc637676cee8",
  NOTION_HOST: "https://www.notion.so",
  NEXT_REVALIDATE_SECONDS: 10,

  AUTHOR: "Example",
  SITE_URL: "https://example.com",
  BLOG_TITLE: "Example Blog",
  BLOG_DESCRIPTION: "Example Blog Description",
  BLOG_KEYWORDS: ["Example", "Blog", "Example Blog"],
  EMAIL: "example@gmail.com",
  GITHUB: "https://github.com/example",

  POSTS_PER_PAGE: 10,
  POST_LIST_STYLE: "page",
  POST_PREVIEW_LINES: 10,

  IMAGE_COMPRESS_WIDTH: 800,
});
