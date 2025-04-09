import Link from "next/link";
import { cn } from "@/lib/utils";
import { Tag } from "@/types/notion";

export function TagCloud({ tags }: { tags: Tag[] }) {
  // Calculate font size based on count (min: 1, max: 3)
  const maxCount = Math.max(...tags.map((tag) => tag.count));
  const minCount = Math.min(...tags.map((tag) => tag.count));
  const range = maxCount - minCount || 1;

  return (
    <div className="flex flex-wrap gap-3 justify-center items-center p-8">
      {tags.map((tag) => {
        // Calculate size between 1-3 based on count
        const size =
          minCount === maxCount ? 2 : 1 + ((tag.count - minCount) / range) * 2;

        return (
          <Link
            key={tag.id}
            href={`/tag/${encodeURIComponent(tag.name)}`}
            className={cn(
              `inline-block px-6 py-3 rounded-full border`,
              "font-medium text-center hover:scale-105 transition-transform duration-300"
            )}
            style={{
              fontSize: `${size * 2}rem`,
              opacity: 0.6 + size * 0.2,
            }}
          >
            {tag.name}
            <span className="ml-1 text-lg">({tag.count})</span>
          </Link>
        );
      })}
    </div>
  );
}
