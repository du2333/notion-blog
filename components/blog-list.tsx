import { Page } from "@/types/notion";
import BlogPostCard from "@/components/blog-post-card";

interface BlogListProps {
  posts: Page[];
}

export default function BlogList({ posts }: BlogListProps) {
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
