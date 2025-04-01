import { getSiteData } from "@/lib/notion/getSiteData";
import BlogList from "@/components/blog-list";
import PostPagination from "@/components/post-pagination";
import { notFound } from "next/navigation";

export default async function BlogListSection({
  pageNumber,
}: {
  pageNumber: number;
}) {
  const siteData = await getSiteData();
  const { publishedPosts, config } = siteData;
  const totalPages = Math.ceil(publishedPosts.length / config.POSTS_PER_PAGE);

  // sort by date
  publishedPosts.sort((a, b) => b.date - a.date);

  if (pageNumber < 1 || pageNumber > totalPages) {
    return notFound();
  }

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
