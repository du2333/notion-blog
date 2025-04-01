import BlogPostCard from "@/components/blog-post-card";
import { getSiteData } from "@/lib/notion/getSiteData";

export default async function BlogList({ pageNumber }: { pageNumber: number }) {
  const siteData = await getSiteData();

  const { publishedPosts, config } = siteData;

  // sort by date
  publishedPosts.sort((a, b) => b.date - a.date);

  const posts = publishedPosts.slice(
    (pageNumber - 1) * config.POSTS_PER_PAGE,
    pageNumber * config.POSTS_PER_PAGE
  );

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
