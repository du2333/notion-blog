import { blogConfig } from "@/types/config";

export default blogConfig({
  NOTION_PAGE_ID: process.env.NOTION_PAGE_ID || "1be1f833110780d98383fc637676cee8",
  NOTION_HOST: "https://www.notion.so",
  NEXT_REVALIDATE_SECONDS: 60,

  AUTHOR: "Example",
  BLOG_TITLE: "Example Blog",
  BLOG_DESCRIPTION: "Example Blog Description",
  BLOG_HOME_BANNER: "/public/banner.png",
  BLOG_ICON: "/public/avatar.png",
  EMAIL: "example@gmail.com",
  GITHUB: "https://github.com/example",

  POSTS_PER_PAGE: 10,
  POST_LIST_STYLE: "page",
  POST_PREVIEW_LINES: 10,

  IMAGE_COMPRESS_WIDTH: 800,
});
