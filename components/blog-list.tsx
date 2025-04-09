import BlogPostCard from "@/components/blog-post-card";
import { Page } from "@/types/notion";

export default function BlogList({ posts }: { posts: Page[] }) {
  return (
    <div className="w-full my-6 grid grid-cols-1 md:grid-cols-2 gap-12">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
