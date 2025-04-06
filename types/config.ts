export type BlogConfig = {
  NOTION_PAGE_ID: string;
  NEXT_REVALIDATE_SECONDS: number;

  AUTHOR: string;
  SITE_URL: string;
  BLOG_TITLE: string;
  BLOG_DESCRIPTION: string;
  BLOG_KEYWORDS: string[];
  EMAIL: string;
  GITHUB: string;
  POSTS_PER_PAGE: number;

  IMAGE_COMPRESS_WIDTH: number;
};

export function blogConfig(config: BlogConfig): BlogConfig {
    return config;
}