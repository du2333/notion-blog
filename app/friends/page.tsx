import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import { getSiteData } from "@/lib/notion/getSiteData";
import { getFriendLinks } from "@/lib/notion/getFriendLinks";
import { NotionPage } from "@/components/notion/notion-page";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const { pages, config } = await getSiteData();
  const friendsPage = pages.find((page) => page.slug === "friends");

  if (!friendsPage) {
    return {
      title: "友链",
    };
  }

  return {
    title: friendsPage.title,
    description: friendsPage.summary || "友情链接",
    openGraph: {
      title: friendsPage.title,
      description: friendsPage.summary || "友情链接",
      type: "website",
      url: `${config.SITE_URL}/friends`,
    },
  };
}

export default async function FriendsPage() {
  const { pages } = await getSiteData();
  const friendsPage = pages.find((page) => page.slug === "friends");

  if (!friendsPage) return notFound();

  // 获取页面内容
  if (!friendsPage.blockMap) {
    friendsPage.blockMap = await getPostBlocks(friendsPage.id);
  }

  // 从 blockMap 中提取友链数据
  const { friendLinks, collectionBlockIds } = getFriendLinks(
    friendsPage.blockMap
  );

  // 过滤掉 collection blocks，避免重复渲染
  const filteredBlockMap = { ...friendsPage.blockMap };
  if (collectionBlockIds.length > 0) {
    filteredBlockMap.block = { ...friendsPage.blockMap.block };
    for (const blockId of collectionBlockIds) {
      delete filteredBlockMap.block[blockId];
    }
    // 同时从页面的 content 中移除这些 block
    const pageBlock = Object.values(filteredBlockMap.block).find(
      (block) => block.value?.type === "page"
    );
    if (pageBlock?.value?.content) {
      pageBlock.value.content = pageBlock.value.content.filter(
        (id: string) => !collectionBlockIds.includes(id)
      );
    }
  }

  // 创建一个过滤后的 post 对象
  const filteredPost = {
    ...friendsPage,
    blockMap: filteredBlockMap,
  };

  return (
    <article className="min-h-[calc(100vh-10rem)] pb-12 md:pb-16 lg:pb-24">
      <div className="container pt-12 md:pt-16 lg:pt-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in-down">
          {friendsPage.title}
        </h1>

        {/* 友链卡片区域 */}
        {friendLinks.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 animate-fade-in-down delay-100">
            {friendLinks.map((friend) => (
              <Link
                key={friend.id}
                href={friend.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                {friend.avatar ? (
                  <Image
                    src={friend.avatar}
                    alt={friend.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-primary">
                      {friend.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {friend.name}
                  </h3>
                  {friend.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {friend.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Notion 页面内容（如果有其他内容） */}
        <div className="max-w-none prose dark:prose-invert lg:prose-xl animate-fade-in-down delay-200">
          <NotionPage post={filteredPost} />
        </div>
      </div>
    </article>
  );
}
