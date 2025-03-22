import Link from "next/link";

import { Page } from "@/types/notion";

interface BlogPostCardProps {
    post: Page;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
    return (
      <Link href={`/post/${post.slug}`}>
        <div className="mb-4 rounded px-3 py-2">
          <div className="mr-4 cursor-pointer text-lg font-medium">
            {post.title}
          </div>
          <time>{new Date(post?.date).toLocaleDateString()}</time>
        </div>
      </Link>
    );
}