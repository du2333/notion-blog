import Article from "@/components/article";
import { getSiteData } from "@/lib/notion/getSiteData";
import { Suspense } from "react";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const siteData = await getSiteData("post");
  if (!siteData?.publishedPosts) {
    return [];
  }
  return siteData.publishedPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default function PostPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Article params={params} />
    </Suspense>
  );
}
