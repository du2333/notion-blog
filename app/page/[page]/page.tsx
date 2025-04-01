import { getSiteData } from "@/lib/notion/getSiteData";
import BlogList from "@/components/blog-list-section";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const siteData = await getSiteData();
  const { publishedPosts, config } = siteData;

  const totalPages = Math.ceil(publishedPosts.length / config.POSTS_PER_PAGE);

  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  const pageNumber = parseInt(page);

  if (isNaN(pageNumber)) {
    return notFound();
  }

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <BlogList pageNumber={pageNumber} />
    </Suspense>
  );
}
