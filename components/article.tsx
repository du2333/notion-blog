import { NotionPage } from "@/components/notion/notion-page";
import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import { getPostPageInfo } from "@/lib/notion/getPostPageInfo";
import { getSiteData } from "@/lib/notion/getSiteData";
import { isUUID } from "@/utils";
import { getPageTableOfContents } from "@/lib/notion/getTableOfContents";
import TableOfContent from "@/components/table-of-content";

export default async function Article({ slug }: { slug: string }) {
  const siteData = await getSiteData();
  if (!siteData) return <div>获取站点数据失败</div>;

  const { allPages } = siteData;

  let post = allPages.find((page) => page.slug === slug);

  // 如果post没有自定义slug，默认为notion的pageId
  if (!post && isUUID(slug)) {
    post = await getPostPageInfo(slug);
  }

  if (!post) return <div>页面不存在</div>;

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
