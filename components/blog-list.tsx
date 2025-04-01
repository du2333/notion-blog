import BlogPostCard from "@/components/blog-post-card";
import { Page } from "@/types/notion";

export default function BlogList({ posts }: { posts: Page[] }) {
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
