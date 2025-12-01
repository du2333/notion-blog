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
      <div className="w-full max-w-5xl mx-auto px-4 py-12 md:py-24 min-h-screen space-y-12">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">文章列表</h1>
          <p className="text-muted-foreground">
            第 {pageNumber} 页，共 {totalPages} 页
          </p>
        </div>
        
        <BlogList posts={posts} />
        
        <div className="pt-8 border-t">
           <PostPagination totalPages={totalPages} currentPage={pageNumber} />
        </div>
      </div>
    </main>
  );
}
