import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import { getSiteData } from "@/lib/notion/getSiteData";
import { Page } from "@/types/notion";

import BlogList from "@/components/blog-list";

export default async function Home() {
  const siteData = await getSiteData("home");

  const { publishedPosts, config } = siteData;

  const postCount = publishedPosts.length;

  let posts: Page[] = [];

  // 分页逻辑
  if (config.POST_LIST_STYLE === "page") {
    posts = publishedPosts.slice(0, config.POSTS_PER_PAGE);
  }
  if (config.POST_LIST_STYLE === "scroll") {
    posts = publishedPosts;
  }

  return (
    <div>
      <BlogList posts={posts} page={1} postCount={postCount} />
    </div>
  );
}
