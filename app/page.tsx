import { getSiteData } from "@/lib/notion/getSiteData";
import BlogList from "@/components/blog-list";

export const revalidate = 3600;

export default async function Home() {
  const siteData = await getSiteData("home");

  if (!siteData) {
    return <div>获取站点数据失败</div>;
  }

  const { publishedPosts } = siteData;

  // TODO: 分页逻辑

  return (
    <div>
      <BlogList posts={publishedPosts} />
    </div>
  );
}
