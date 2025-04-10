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

  const { allPages } = await getSiteData();

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

  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BlogConfig.SITE_URL}/post/${encodeURIComponent(post.slug)}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BlogConfig.SITE_URL}/post/${encodeURIComponent(post.slug)}`,
    },
    headline: post.title,
    image: post.pageCover,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.lastEditedTime).toISOString(),
    author: {
      "@type": "Person",
      name: BlogConfig.AUTHOR,
    },
  };

  return (
    <article className="min-h-[calc(100vh-10rem)] pb-12 md:pb-16 lg:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      <div className="animate-fade-in-down delay-100">
        <ArticleHero
          title={post.title}
          tags={post.tags}
          coverImage={post.pageCover}
          publishedAt={formatDate(new Date(post.date))}
          lastEditedTime={formatDate(new Date(post.lastEditedTime))}
        />
      </div>

      <div className="container mx-auto mt-8 grid grid-cols-1 gap-8 md:grid-cols-[3fr_1fr] animate-fade-in-down delay-300">
        <div className="max-w-none">
          <NotionPage post={post} />
        </div>
        {post.toc.length > 0 && (
          <div className="hidden md:block">
            <div className="sticky top-20">
              <h3 className="text-lg font-medium mb-4">Table of Contents</h3>
              <TableOfContent toc={post.toc} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
