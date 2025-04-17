import { getSiteData } from "@/lib/notion/getSiteData";
import BlogList from "@/components/blog-list";
import { HeroSection } from "@/components/hero-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CircleArrowRight } from "lucide-react";
import { WithContext, ItemList } from "schema-dts";

export default async function Home() {
  const { latestPosts, config: BlogConfig } = await getSiteData();

  // sort by date
  latestPosts.sort((a, b) => b.date - a.date);

  const blog: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: latestPosts.map((page, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        author: {
          "@type": "Person",
          name: BlogConfig.AUTHOR,
          url: BlogConfig.SITE_URL,
        },
        headline: page.title,
        image: page.pageCover,
        url: `${BlogConfig.SITE_URL}/post/${encodeURIComponent(page.slug)}`,
        datePublished: new Date(page.date).toISOString(),
        dateModified: new Date(page.lastEditedTime).toISOString(),
      },
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blog) }}
      />
      <HeroSection />
      <div className="container px-6 py-12 md:px-8 md:py-16">
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
