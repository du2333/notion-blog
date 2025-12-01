import { Page } from "@/types/notion";
import FeaturePost from "@/components/feature-post";
import { cn } from "@/lib/utils";

interface FeaturePostListProps {
  posts: Page[];
  className?: string;
}

export default function FeaturePostList({ posts, className }: FeaturePostListProps) {
  return (
    <div className={cn("flex flex-col gap-20 md:gap-32", className)}>
      {posts.map((post, index) => (
        <FeaturePost key={post.id} post={post} index={index} />
      ))}
    </div>
  );
}

