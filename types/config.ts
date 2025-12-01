export type BlogConfig = {
  NOTION_PAGE_ID: string;
  NEXT_REVALIDATE_SECONDS: number;

  AUTHOR: string;
  SITE_URL: string;
  BLOG_TITLE: string;
  BLOG_DESCRIPTION: string;
  BLOG_KEYWORDS: string;
  HERO_WORDS1: string;
  HERO_WORDS2: string;
  EMAIL: string;
  GITHUB: string;
  POSTS_PER_PAGE: number;

  IMAGE_COMPRESS_WIDTH: number;
  HERO_IMAGE?: string; // 可选，Hero 区域图片 URL
  FAVICON?: string; // 可选，网站 favicon URL
  HEADER_ICON?: string; // 可选，Header 导航栏图标 URL
};

export function blogConfig(config: BlogConfig): BlogConfig {
  return config;
}
