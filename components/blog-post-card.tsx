"use client";

import Link from "next/link";
import Image from "next/image";
import { Page } from "@/types/notion";
import { useEffect, useState } from "react";
import { Tag, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface BlogPostCardProps {
  post: Page;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const [formattedDate, setFormattedDate] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  // 防止hydration错误，导致日期不一致
  useEffect(() => {
    setFormattedDate(new Date(post.date).toLocaleDateString());
  }, [post.date]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      });
    });

    observer.observe(document.querySelector(`#blog-post-card-${post.id}`)!);

    return () => observer.disconnect();
  }, [post.id]);

  return (
    <div
      id={`blog-post-card-${post.id}`}
      className={cn(
        "flex flex-col space-y-4 group",
        isVisible ? "animate-fade-in-up delay-200 duration-500" : "opacity-0"
      )}
    >
      <Link
        href={`/post/${encodeURIComponent(post.slug)}`}
        className="overflow-hidden rounded-lg"
      >
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.pageCover || "/images/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 size-4" />
          <time dateTime={formattedDate}>{formattedDate}</time>
        </div>

        <h2 className="text-2xl font-bold tracking-tight line-clamp-1">
          <Link
            href={`/post/${encodeURIComponent(post.slug)}`}
            className="group-hover:underline"
          >
            {post.title}
          </Link>
        </h2>

        <p className="text-muted-foreground line-clamp-2">{post.summary}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
            >
              <Tag className="mr-1 h-3 w-3" />
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
