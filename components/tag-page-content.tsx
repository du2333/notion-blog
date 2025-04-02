import { getSiteData } from "@/lib/notion/getSiteData";
import { notFound } from "next/navigation";
import BlogList from "@/components/blog-list";
import PostPagination from "@/components/post-pagination";

export default async function TagPageContent({
  tag,
  pageNumber,
}: {
  tag: string;
  pageNumber: number;
}) {
  const siteData = await getSiteData();
  const { publishedPosts, config } = siteData;

  const sortedPosts = publishedPosts.sort((a, b) => b.date - a.date);
  const filteredPosts = sortedPosts.filter((post) => post.tags.includes(tag));
  const totalPages = Math.ceil(filteredPosts.length / config.POSTS_PER_PAGE);

  if (pageNumber < 1 || pageNumber > totalPages) {
    return notFound();
  }

  const posts = filteredPosts.slice(
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
