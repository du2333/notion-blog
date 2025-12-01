import { getPostPageInfo } from "@/lib/notion/getPostPageInfo";
import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import { getSiteData } from "@/lib/notion/getSiteData";
import { formatDate, isUUID } from "@/utils";
import { getPageTableOfContents } from "@/lib/notion/getTableOfContents";
import { NotionPage } from "@/components/notion/notion-page";
import TableOfContent from "@/components/table-of-content";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ArticleHero from "@/components/article-hero";
import { WithContext, BlogPosting } from "schema-dts";

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

  const { config: BlogConfig } = await getSiteData();

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

  const { publishedPosts, config: BlogConfig } = await getSiteData();

  let post = publishedPosts.find((page) => page.slug === decodedSlug);

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

  const article: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.pageCover,
    url: `${BlogConfig.SITE_URL}/post/${encodeURIComponent(post.slug)}`,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.lastEditedTime).toISOString(),
    author: {
      "@type": "Person",
      name: BlogConfig.AUTHOR,
      url: BlogConfig.SITE_URL,
    },
  };

  return (
    <article className="min-h-[calc(100vh-10rem)] pt-24 pb-12 md:pt-32 md:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }}
      />
      
      <div className="w-full max-w-5xl mx-auto px-4">
        <ArticleHero
          title={post.title}
          tags={post.tags}
          coverImage={post.pageCover}
          publishedAt={formatDate(new Date(post.date))}
          lastEditedTime={formatDate(new Date(post.lastEditedTime))}
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_240px] mt-8">
          <div className="min-w-0 max-w-none prose dark:prose-invert lg:prose-lg prose-headings:scroll-mt-24 prose-img:rounded-xl animate-fade-in-up delay-300">
            <NotionPage post={post} />
          </div>
          
          {post.toc.length > 0 && (
            <div className="hidden lg:block">
              <aside className="sticky top-24 animate-fade-in-up delay-500">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 tracking-wider uppercase">目录</h3>
                <TableOfContent toc={post.toc} />
              </aside>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
