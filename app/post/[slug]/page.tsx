import Article from "@/components/article";
import { getSiteData } from "@/lib/notion/getSiteData";
import { Suspense } from "react";

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

  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Article slug={decodedSlug} />
    </Suspense>
  );
}
