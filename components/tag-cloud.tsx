"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tag } from "@/types/notion";


export function TagCloud({ tags }: { tags: Tag[] }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Sort tags by count (descending)
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);

  // Calculate font size based on count (min: 1, max: 3)
  const maxCount = Math.max(...tags.map((tag) => tag.count));
  const minCount = Math.min(...tags.map((tag) => tag.count));
  const range = maxCount - minCount || 1;

  return (
    <div className="p-6 bg-muted-foreground/10 rounded-xl">
      <div className="flex flex-wrap gap-3 justify-center">
        {sortedTags.map((tag) => {
          // Calculate size between 1-3 based on count
          const size =
            minCount === maxCount
              ? 2
              : 1 + ((tag.count - minCount) / range) * 2;

          return (
            <Link
              key={tag.id}
              href={`/tag/${encodeURIComponent(tag.name)}`}
              className={cn(
                `inline-block px-3 py-1.5 rounded-full border`,
                "font-medium text-center"
              )}
              style={{
                backgroundColor: `var(--notion-item-${tag.color})`,
                color: `var(--notion-item-text-${tag.color})`,
                fontSize: `${0.875 + size * 0.125}rem`,
                opacity: 0.6 + size * 0.2,
              }}
            >
              {tag.name}
              <span className={`ml-1 text-xs text-[var(--notion-item-text-${tag.color})]`}>({tag.count})</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
