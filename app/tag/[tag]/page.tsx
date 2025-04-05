import TagPageContent from "@/components/tag-page-content";
import { notFound } from "next/navigation";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  return {
    title: `${tag}`,
    description: `Browse all blog posts with the tag ${tag}`,
  };
}

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
    <div className="flex flex-col gap-4 px-4 py-8">
      <div className="mb-8">
        <Link
          href="/tag"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to all tags
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-6">{`#${tag}`}</h1>
      <TagPageContent tag={tag} pageNumber={pageNumber} />
    </div>
  );
}
