import { getSiteData } from "@/lib/notion/getSiteData";
import BlogList from "@/components/blog-list";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";

export default async function Home() {
  const { latestPosts } = await getSiteData();

  // sort by date
  latestPosts.sort((a, b) => b.date - a.date);

  return (
    <main>
      <HeroSection />
      <div className="container mx-auto px-6 py-12 md:px-8 md:py-16">
        <h2 className="text-2xl font-bold mb-6">Latest Posts</h2>
        <BlogList posts={latestPosts} />
        <div className="flex justify-end mt-8">
          <Link href="/blog/1">
            <Button variant="ghost" className="cursor-pointer">
              <CircleArrowRight className="size-4" />
              Read More
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
