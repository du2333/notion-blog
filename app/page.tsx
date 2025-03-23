import { getSiteData } from "@/lib/notion/getSiteData";
import { Page } from "@/types/notion";
import BlogList from "@/components/blog-list";
import RevalidateButton from "./revalidate_button";

export const revalidate = 3600;

export default async function Home() {
  const siteData = await getSiteData("home");

  if (!siteData) {
    return <div>获取站点数据失败</div>;
  }

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
      <RevalidateButton path="/" />
      <BlogList posts={posts} page={1} postCount={postCount} />
    </div>
  );
}
