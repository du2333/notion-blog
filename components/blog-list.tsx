"use client";

import { Page, Tag } from "@/types/notion";
import CompactPostCard from "@/components/compact-post-card";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface BlogListProps {
  posts: Page[];
  className?: string;
  tags?: Tag[]; // Optional: if provided, show filter
}

export default function BlogList({ posts, className, tags }: BlogListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return posts;
    return posts.filter(post => post.tags.includes(selectedTag));
  }, [posts, selectedTag]);

  if (tags && tags.length > 0) {
     // Tag Filter Mode
     return (
        <div className={cn("flex flex-col gap-8", className)}>
           {/* Filter Bar */}
           <div className="flex flex-wrap gap-2 pb-4 border-b">
              <Button
                 variant={selectedTag === null ? "secondary" : "ghost"}
                 size="sm"
                 onClick={() => setSelectedTag(null)}
                 className="rounded-full"
              >
                 全部文章
              </Button>
              {tags.map(tag => (
                 <Button
                    key={tag.id}
                    variant={selectedTag === tag.name ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                    className="rounded-full"
                 >
                    {tag.name}
                    <span className="ml-1.5 text-xs opacity-50">{tag.count}</span>
                 </Button>
              ))}
              {selectedTag && (
                 <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedTag(null)}
                    className="ml-auto rounded-full h-8 w-8"
                    title="Clear filter"
                 >
                    <X className="size-4" />
                 </Button>
              )}
           </div>

           {/* Post List */}
           <div className="flex flex-col gap-4 min-h-[300px]">
              {filteredPosts.length > 0 ? (
                 filteredPosts.map((post) => (
                   <CompactPostCard key={post.id} post={post} />
                 ))
              ) : (
                 <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                    没有找到相关文章
                 </div>
              )}
           </div>
        </div>
     );
  }

  // Regular Mode (no tags provided)
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {posts.map((post) => (
        <CompactPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
