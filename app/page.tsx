import BlogList from "@/components/blog-list";
import { Suspense } from "react";

export default async function Home() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <BlogList pageNumber={1} />
    </Suspense>
  );
}
