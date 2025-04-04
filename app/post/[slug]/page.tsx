import { getPostPageInfo } from "@/lib/notion/getPostPageInfo";
import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import { getSiteData } from "@/lib/notion/getSiteData";
import { isUUID } from "@/utils";
import { getPageTableOfContents } from "@/lib/notion/getTableOfContents";
import { NotionPage } from "@/components/notion/notion-page";
import TableOfContent from "@/components/table-of-content";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogConfig from "@/blog.config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const siteData = await getSiteData();
  const post = siteData.publishedPosts.find(
    (post) => post.slug === decodedSlug
  );

  if (!post) return notFound();

  return {
    title: post.title,
    openGraph: {
      title: post.title,
      images: [
        {
          url: post.pageCover,
        },
      ],
      url: `${BlogConfig.SITE_URL}/post/${encodeURIComponent(post.slug)}`,
    },
  };
}

export async function generateStaticParams() {
  const siteData = await getSiteData();
  return siteData.publishedPosts.map((post) => ({
    slug: encodeURIComponent(post.slug),
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const siteData = await getSiteData();
  const { allPages } = siteData;

  let post = allPages.find((page) => page.slug === decodedSlug);

  // 如果post没有自定义slug，默认为notion的pageId
  if (!post && isUUID(decodedSlug)) {
    post = await getPostPageInfo(decodedSlug);
  }

  if (!post) return notFound();

  // 获取文章内容
  if (!post.blockMap) {
    post.blockMap = await getPostBlocks(post.id);
  }
  post.toc = getPageTableOfContents(post, post.blockMap);

  return (
    <div className="flex">
      <NotionPage post={post} />
      <TableOfContent toc={post.toc} />
    </div>
  );
}
