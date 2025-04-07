import { getSiteData } from "@/lib/notion/getSiteData";
import { Metadata } from "next";
import { TagCloud } from "@/components/tag-cloud";
import * as motion from "motion/react-client";

export const metadata: Metadata = {
  title: "Blog Tags",
  description: "Browse all blog post tags",
};

export default async function TagPage() {
  const { tagOptions } = await getSiteData();

  return (
    <div className="container mx-auto flex flex-col gap-4 px-4 py-8 justify-center min-h-[70vh]">
      <motion.div
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <TagCloud tags={tagOptions} />
      </motion.div>
    </div>
  );
}
