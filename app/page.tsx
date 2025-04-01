import BlogListSection from "@/components/blog-list-section";
import { Suspense } from "react";

export default async function Home() {
  return (
    <>
      <Suspense fallback={<div>加载中...</div>}>
        <BlogListSection pageNumber={1} />
      </Suspense>
    </>
  );
}
