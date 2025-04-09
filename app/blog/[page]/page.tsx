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

  if (isNaN(Number(page))) {
    return notFound();
  }

  const pageNumber = parseInt(page, 10);

  const { publishedPosts, config } = await getSiteData();
  const totalPages = Math.ceil(publishedPosts.length / config.POSTS_PER_PAGE);

  if (pageNumber > totalPages || pageNumber < 1) {
    return notFound();
  }

  // sort by date
  publishedPosts.sort((a, b) => b.date - a.date);

  const posts = publishedPosts.slice(
    (pageNumber - 1) * config.POSTS_PER_PAGE,
    pageNumber * config.POSTS_PER_PAGE
  );

  return (
    <main>
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 min-h-screen">
        <BlogList posts={posts} />
        <PostPagination totalPages={totalPages} currentPage={pageNumber} />
      </div>
    </main>
  );
}
