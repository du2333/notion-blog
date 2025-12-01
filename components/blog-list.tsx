import { Page } from "@/types/notion";
import CompactPostCard from "@/components/compact-post-card";
import { cn } from "@/lib/utils";

interface BlogListProps {
  posts: Page[];
  className?: string;
}

export default function BlogList({ posts, className }: BlogListProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {posts.map((post) => (
        <CompactPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
