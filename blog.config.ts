import { blogConfig } from "@/types/config";

export default blogConfig({
  NOTION_PAGE_ID: "1be1f833110780ba87acfa2cf9a6a8c4",
  NOTION_HOST: "https://www.notion.so",
  NEXT_REVALIDATE_SECONDS: 60,

  AUTHOR: "KD",
  BLOG_TITLE: "Blog",
  BLOG_DESCRIPTION: "Blog Description",
  BLOG_HOME_BANNER: "/public/banner.png",
  BLOG_ICON: "/public/avatar.png",
  EMAIL: "kuangdadu@gmail.com",
  GITHUB: "https://github.com/du2333",

  POSTS_PER_PAGE: 10,
  POST_LIST_STYLE: "page",
  POST_PREVIEW_LINES: 10,

  IMAGE_COMPRESS_WIDTH: 800,
});
