import { Page } from "@/types/notion";
import BlogPostCard from "@/components/blog-post-card";

interface BlogListProps {
  posts: Page[];
  page: number;
  postCount: number;
}

export default function BlogList({ posts, page, postCount }: BlogListProps) {
  return (
    <div className="w-full my-6">
      <div id="posts-wrapper">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
