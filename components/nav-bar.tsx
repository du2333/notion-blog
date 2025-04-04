import ThemeController from "@/components/theme-controller";
import SearchModal from "@/components/search-modal";
import Link from "next/link";
import { House } from "lucide-react";
import { getSiteData } from "@/lib/notion/getSiteData";
import { getSearchResults } from "@/lib/notion/getSearchResults";

export default async function NavBar() {
  const siteData = await getSiteData();
  const { latestPosts, publishedPosts } = siteData;

  const searchByKeyword = getSearchResults.bind(null, publishedPosts);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <House className="size-6" />
        </Link>
        <div className="flex items-center gap-2">
          <SearchModal suggestedPosts={latestPosts} searchByKeyword={searchByKeyword}/>
          <ThemeController />
        </div>
      </div>
    </header>
  );
}
