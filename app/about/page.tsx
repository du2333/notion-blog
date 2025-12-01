import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import { getSiteData } from "@/lib/notion/getSiteData";
import { NotionPage } from "@/components/notion/notion-page";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { pages, config } = await getSiteData();
  const aboutPage = pages.find((page) => page.slug === "about");

  if (!aboutPage) {
    return {
      title: "About",
    };
  }

  return {
    title: aboutPage.title,
    description: aboutPage.summary || `关于 ${config.AUTHOR}`,
    openGraph: {
      title: aboutPage.title,
      description: aboutPage.summary || `关于 ${config.AUTHOR}`,
      type: "website",
      url: `${config.SITE_URL}/about`,
    },
  };
}

export default async function AboutPage() {
  const { pages } = await getSiteData();
  const aboutPage = pages.find((page) => page.slug === "about");

  if (!aboutPage) return notFound();

  // 获取页面内容
  if (!aboutPage.blockMap) {
    aboutPage.blockMap = await getPostBlocks(aboutPage.id);
  }

  return (
    <article className="min-h-[calc(100vh-10rem)] pb-12 md:pb-16 lg:pb-24">
      <div className="container pt-12 md:pt-16 lg:pt-24">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 animate-fade-in-down">
          {aboutPage.title}
        </h1>
        <div className="max-w-none prose dark:prose-invert lg:prose-xl animate-fade-in-down delay-100">
          <NotionPage post={aboutPage} />
        </div>
      </div>
    </article>
  );
}
