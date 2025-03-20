"use client";

import { NotionRenderer } from "react-notion-x";

import { Page } from "@/types/notion";

export function NotionPage({ post }: { post: Page }) {
  return post && post.blockMap && <NotionRenderer recordMap={post.blockMap} />;
}
