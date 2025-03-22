export type BlogConfig = {
  NOTION_PAGE_ID: string;
  NOTION_HOST: string;
  NEXT_REVALIDATE_SECONDS: number;

  AUTHOR: string;
  BLOG_TITLE: string;
  BLOG_DESCRIPTION: string;
  BLOG_HOME_BANNER: string;
  BLOG_ICON: string;
  EMAIL: string;
  GITHUB: string;

  POSTS_PER_PAGE: number;
  POST_LIST_STYLE: "page" | "scroll";
  POST_PREVIEW_LINES: number;

  IMAGE_COMPRESS_WIDTH: number;
};

export function blogConfig(config: BlogConfig): BlogConfig {
    return config;
}