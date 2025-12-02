"use client";

import Link from "next/link";
import { Page } from "@/types/notion";
import { Calendar, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

export default function FeaturePost({
  post,
  index,
}: {
  post: Page;
  index: number;
}) {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    setFormattedDate(new Date(post.date).toLocaleDateString());
  }, [post.date]);

  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-8 md:gap-12 items-center group",
        isEven ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      {/* Image Side */}
      <Link
        href={`/post/${encodeURIComponent(post.slug)}`}
        className="w-full md:w-3/5 overflow-hidden rounded-2xl shadow-lg transition-transform duration-500 hover:shadow-2xl"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={post.pageCover || "/images/placeholder.svg"}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300" />
        </div>
      </Link>

      {/* Content Side */}
      <div className="w-full md:w-2/5 flex flex-col space-y-6">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <time dateTime={formattedDate}>{formattedDate}</time>
          </div>
          {post.tags.length > 0 && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              <span className="text-primary font-medium">{post.tags[0]}</span>
            </>
          )}
        </div>

        <Link
          href={`/post/${encodeURIComponent(post.slug)}`}
          className="group/title"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight transition-colors group-hover/title:text-primary">
            {post.title}
          </h2>
        </Link>

        <p className="text-muted-foreground text-lg line-clamp-3 leading-relaxed">
          {post.summary}
        </p>

        <div className="pt-2">
          <Link
            href={`/post/${encodeURIComponent(post.slug)}`}
            className="inline-flex items-center text-base font-medium text-foreground transition-colors hover:text-primary"
          >
            阅读全文
            <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
