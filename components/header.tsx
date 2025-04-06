import Link from "next/link";

import ThemeController from "@/components/theme-controller";
import BlogConfig from "@/blog.config";
import SearchModal from "@/components/search-modal";
import { getSearchResults } from "@/lib/notion/getSearchResults";
import { getSiteData } from "@/lib/notion/getSiteData";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { Navigation, MobileNavigation } from "@/components/ui/navigation";

export default async function Header() {
  const siteData = await getSiteData();
  const { latestPosts, publishedPosts } = siteData;

  const searchByKeyword = getSearchResults.bind(null, publishedPosts);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollProgress className="top-16" />
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">{BlogConfig.BLOG_TITLE}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <Navigation />
          <div className="flex items-center gap-2">
            <SearchModal
              suggestedPosts={latestPosts}
              searchByKeywordAction={searchByKeyword}
            />
            <ThemeController />
          </div>
          <MobileNavigation />
        </div>
      </div>
    </header>
  );
}
