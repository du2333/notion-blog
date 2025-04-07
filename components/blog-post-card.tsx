"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Page } from "@/types/notion";
import { useEffect, useState } from "react";
import { Tag } from "lucide-react";

interface BlogPostCardProps {
  post: Page;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const [formattedDate, setFormattedDate] = useState("");
  const [mounted, setMounted] = useState(false);

  // 防止hydration错误
  useEffect(() => {
    setFormattedDate(new Date(post.date).toLocaleDateString());
  }, [post.date]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // mount后才渲染Motion组件
  if (!mounted) return null;

  return (
    <motion.div
      className="group mx-auto overflow-hidden rounded-xl bg-background w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
    >
      <div className="flex flex-col space-y-4">
        <Link
          href={`/post/${encodeURIComponent(post.slug)}`}
          className="overflow-hidden rounded-lg"
        >
          <div className="relative aspect-video overflow-hidden rounded-lg">
            <Image
              src={post.pageCover || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
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
                href={`/tag/${tag}`}
                className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
