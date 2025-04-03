import { getSiteData } from "@/lib/notion/getSiteData";
import BlogList from "@/components/blog-list";
import { notFound } from "next/navigation";
import PostPagination from "@/components/post-pagination";

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

  const siteData = await getSiteData();
  const { publishedPosts, config } = siteData;
  const totalPages = Math.ceil(publishedPosts.length / config.POSTS_PER_PAGE);

  // sort by date
  publishedPosts.sort((a, b) => b.date - a.date);

  const posts = publishedPosts.slice(
    (pageNumber - 1) * config.POSTS_PER_PAGE,
    pageNumber * config.POSTS_PER_PAGE
  );

  return (
    <>
      <BlogList posts={posts} />
      <PostPagination totalPages={totalPages} currentPage={pageNumber} />
    </>
  );
}
