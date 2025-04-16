import { getSiteData } from "@/lib/notion/getSiteData";
import { Metadata } from "next";
import { TagCloud } from "@/components/tag-cloud";

export const metadata: Metadata = {
  title: "Blog Tags",
  description: "Browse all blog post tags",
};

export default async function TagPage() {
  const { tagOptions } = await getSiteData();

  return (
    <div className="container flex flex-col gap-4 py-8 justify-center min-h-[90vh]">
      <div className="text-4xl font-bold mb-8 animate-fade-in-down delay-100 duration-500">
        <TagCloud tags={tagOptions} />
      </div>
    </div>
  );
}
