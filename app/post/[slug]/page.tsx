import { getPostPageInfo } from "@/lib/notion/getPostPageInfo";
import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import { getSiteData } from "@/lib/notion/getSiteData";
import { formatDate, isUUID } from "@/utils";
import { getPageTableOfContents } from "@/lib/notion/getTableOfContents";
import { NotionPage } from "@/components/notion/notion-page";
import TableOfContent from "@/components/table-of-content";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import BlogConfig from "@/blog.config";
import ArticleHero from "@/components/article-hero";
import * as motion from "motion/react-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const { publishedPosts } = await getSiteData();
  const post = publishedPosts.find((post) => post.slug === decodedSlug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post?.summary || "",
    openGraph: {
      title: post.title,
      description: post?.summary || "",
      type: "article",
      publishedTime: new Date(post.date).toISOString(),
      authors: [BlogConfig.AUTHOR],
      tags: post.tags,
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
    <article className="min-h-[calc(100vh-10rem)] pb-12 md:pb-16 lg:pb-24">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ArticleHero
          title={post.title}
          tags={post.tags}
          coverImage={post.pageCover}
          publishedAt={formatDate(new Date(post.date))}
          lastEditedTime={formatDate(new Date(post.lastEditedTime))}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <div className="container mx-auto mt-8 grid grid-cols-1 gap-8 md:grid-cols-[3fr_1fr]">
          <div className="max-w-none">
            <NotionPage post={post} />
          </div>
          <div className="hidden md:block">
            <div className="sticky top-20">
              <h3 className="text-lg font-medium mb-4">Table of Contents</h3>
              <TableOfContent toc={post.toc} />
            </div>
          </div>
        </div>
      </motion.div>
    </article>
  );
}
