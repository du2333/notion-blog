import Link from "next/link";

import ThemeController from "@/components/theme-controller";
import SearchModal from "@/components/search-modal";
import { getSearchResults } from "@/lib/notion/getSearchResults";
import { getSiteData } from "@/lib/notion/getSiteData";
import { Navigation, MobileNavigation } from "@/components/navigation";
import ScrollProgressBar from "@/components/scroll-progress-bar";
import HeaderBackground from "@/components/header-background";
import Image from "next/image";

export default async function Header() {
  const siteData = await getSiteData();
  const { latestPosts, publishedPosts, config: BlogConfig } = siteData;

  latestPosts.sort((a, b) => b.date - a.date);

  const searchByKeyword = getSearchResults.bind(null, publishedPosts);

  return (
    <HeaderBackground>
      <ScrollProgressBar />
      <div className="container flex h-16 items-center justify-between md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-4">
            <div className="rounded-full">
              <Image
                src={
                  BlogConfig.HEADER_ICON ||
                  BlogConfig.FAVICON ||
                  "/favicon.svg"
                }
                alt="Logo"
                width={32}
                height={32}
                className="rounded-full"
                priority
              />
            </div>
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
    </HeaderBackground>
  );
}
