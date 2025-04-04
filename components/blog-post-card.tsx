import Link from "next/link";
import Image from "next/image";

import { Page } from "@/types/notion";
import Tag from "@/components/tag";

interface BlogPostCardProps {
  post: Page;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <div className="group mx-auto max-w-md overflow-hidden rounded-xl bg-background shadow-md md:max-w-2xl">
      <div className="md:flex">
        <Link
          href={`/post/${encodeURIComponent(post.slug)}`}
          className="md:shrink-0"
        >
          <Image
            className="h-48 w-full object-cover md:h-full md:w-48"
            src={post.pageCover}
            alt={post.title}
            width={800}
            height={400}
          />
        </Link>
        <div className="p-8">
          <Link href={`/post/${encodeURIComponent(post.slug)}`}>
            <h2 className="mt-1 font-extrabold line-clamp-2 text-xl leading-tight group-hover:underline">
              {post.title}
            </h2>
          </Link>
          <p className="mt-2 text-muted-foreground">
            {new Date(post.date).toLocaleDateString()}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} tag={tag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
