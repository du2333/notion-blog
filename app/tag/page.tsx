import { getSiteData } from "@/lib/notion/getSiteData";
import { Metadata } from "next";
import { TagCloud } from "@/components/tag-cloud";

export const metadata: Metadata = {
    title: "Blog Tags",
    description: "Browse all blog post tags",
}

export default async function TagPage() {
  const { tagOptions } = await getSiteData();

  return (
    <div className="flex flex-col gap-4 px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Tags</h1>
      <TagCloud tags={tagOptions} />
    </div>
  );
}
