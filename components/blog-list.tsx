import BlogPostCard from "@/components/blog-post-card";
import { getSiteData } from "@/lib/notion/getSiteData";

export default async function BlogList() {
  const siteData = await getSiteData("home");

  if (!siteData) {
    return <div>获取站点数据失败</div>;
  }

  const { publishedPosts: posts } = siteData;

  return (
    <div className="w-full my-6">
      <div className="space-y-4">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
