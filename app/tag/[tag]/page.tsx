import { notFound } from "next/navigation";
import * as motion from "motion/react-client";
import { getSiteData } from "@/lib/notion/getSiteData";
import PostPagination from "@/components/post-pagination";
import BlogList from "@/components/blog-list";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  return {
    title: `${tag}`,
    description: `Browse all blog posts with the tag ${tag}`,
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag } = await params;
  const { page } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  if (isNaN(pageNumber)) {
    return notFound();
  }

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
    <div className="container mx-auto flex flex-col gap-4 px-4 py-8">
      <motion.h1
        className="text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >{`#${tag}`}</motion.h1>
      <BlogList posts={posts} />
      <PostPagination totalPages={totalPages} currentPage={pageNumber} />
    </div>
  );
}
