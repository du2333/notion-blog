"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tag } from "@/types/notion";

export function TagCloud({ tags }: { tags: Tag[] }) {
  // Calculate font size based on count (min: 1, max: 2)
  const maxCount = Math.max(...tags.map((tag) => tag.count));
  const minCount = Math.min(...tags.map((tag) => tag.count));
  const range = maxCount - minCount || 1;

  return (
    <div className="flex flex-wrap gap-4 justify-center items-center p-4 max-w-4xl mx-auto">
      {tags.map((tag) => {
        const size =
          minCount === maxCount
            ? 1.2
            : 1 + ((tag.count - minCount) / range) * 1.5;

        const opacity = 0.6 + ((tag.count - minCount) / range) * 0.4;

        return (
          <Link
            key={tag.id}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className={cn(
              "inline-flex items-center justify-center transition-all duration-300 ease-out hover:-translate-y-1 group"
            )}
            style={{
              fontSize: `${Math.max(1, size)}rem`,
            }}
          >
            <span
              className={cn(
                "px-4 py-2 rounded-full bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-primary/5 hover:text-primary transition-all",
                "flex items-center gap-2"
              )}
              style={{ opacity }}
            >
              #{tag.name}
              <span className="text-xs font-normal opacity-50 bg-background/50 px-1.5 py-0.5 rounded-md">
                {tag.count}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
