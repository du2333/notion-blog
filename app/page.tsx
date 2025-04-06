import PostPagination from "@/components/post-pagination";
import { getSiteData } from "@/lib/notion/getSiteData";
import BlogList from "@/components/blog-list";
import { HeroSection } from "@/components/hero-section";

export default async function Home() {
  const siteData = await getSiteData();
  const { publishedPosts, config } = siteData;
  const totalPages = Math.ceil(publishedPosts.length / config.POSTS_PER_PAGE);

  // sort by date
  publishedPosts.sort((a, b) => b.date - a.date);

  const posts = publishedPosts.slice(0, config.POSTS_PER_PAGE);

  return (
    <main>
      <HeroSection />
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <BlogList posts={posts} />
        <PostPagination totalPages={totalPages} currentPage={1} />
      </div>
    </main>
  );
}
