"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Page } from "@/types/notion";
import { Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

export default function SearchModal({
  suggestedPosts,
  searchByKeyword,
}: {
  suggestedPosts: Page[];
  searchByKeyword: (keyword: string) => Promise<Page[]>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 防抖
  const fetcher = (keyword: string) =>
    Promise.all([
      searchByKeyword(keyword),
      new Promise((res) => setTimeout(res, 600)),
    ]).then(([result]) => result);

  const { data: results, isLoading } = useSWR(keyword, fetcher, {
    fallbackData: [],
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);

    // 如果关闭，则清空输入框和搜索结果
    if (!open) {
      setTimeout(() => {
        setKeyword("");
      }, 300);
    }
  };

  const highlightText = (text: string, keyword: string) => {
    if (!keyword) return text;

    // gi 表示全局搜索，不区分大小写
    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          aria-label="Search"
        >
          <Search className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 max-h-[80vh] overflow-hidden [&>button]:hidden">
        <DialogTitle className="sr-only">Search</DialogTitle>
        <div className="flex items-center border-b p-4 w-full">
          <Search className="size-5 mr-2 flex-shrink-0 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            placeholder="Search blog posts..."
            className="border-0 focus-visible:ring-0 text-base font-medium"
          />
        </div>

        <div className="overflow-y-auto p-4 max-h-[calc(80vh-70px)]">
          {/* 搜索结果为空时 */}
          {!keyword && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Suggested Posts
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {suggestedPosts.length > 0 ? (
                  suggestedPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/post/${encodeURIComponent(post.slug)}`}
                      className="group flex gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Image
                        src={post.pageCover}
                        alt={post.title}
                        width={80}
                        height={60}
                        className="rounded object-cover aspect-[4/3] flex-shrink-0"
                      />
                      <div className="flex flex-col justify-center overflow-hidden">
                        <h4 className="text-sm font-semibold group-hover:underline line-clamp-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(post.date).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No posts found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 搜索结果不为空时 */}
          {keyword && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                {isLoading
                  ? "Searching..."
                  : results.length > 0
                  ? `Found ${results.length} result${
                      results.length === 1 ? "" : "s"
                    }`
                  : "No results found"}
              </h3>

              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-pulse text-muted-foreground">
                    Searching...
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((post) => (
                    <Link
                      key={post.id}
                      href={`/post/${encodeURIComponent(post.slug)}`}
                      className="group flex gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <Image
                        src={post.pageCover}
                        alt={post.title}
                        width={80}
                        height={60}
                        className="rounded object-cover aspect-[4/3] flex-shrink-0"
                      />
                      <div className="flex flex-col justify-center">
                        <h4 className="text-sm font-semibold group-hover:underline line-clamp-1">
                          {highlightText(post.title, keyword)}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {post.searchResults?.map((result) => (
                            <span key={result}>
                              {highlightText(result, keyword)}
                            </span>
                          ))}
                        </p>
                        <p className="text-xs text-muted-foreground space-x-2 mt-2">
                          {post.tags?.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs text-muted-foreground"
                            >
                              {highlightText(`#${tag}`, keyword)}
                            </span>
                          ))}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-muted-foreground mb-2">
                    No results found for &quot;{keyword}&quot;
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Try searching with different keywords
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
