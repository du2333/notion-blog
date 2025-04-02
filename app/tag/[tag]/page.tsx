import { Suspense } from "react";
import TagPageContent from "@/components/tag-page-content";
import { notFound } from "next/navigation";

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { tag } = await params;
  const { page } = await searchParams;
  const pageNumber = page ? parseInt(page) : 1;

  if (isNaN(pageNumber)) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<div>Loading...</div>}>
        <h1 className="text-2xl font-bold">{`#${tag}`}</h1>
        <TagPageContent tag={tag} pageNumber={pageNumber} />
      </Suspense>
    </div>
  );
}
