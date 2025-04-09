import Image from "next/image";
import { CalendarIcon, Tag } from "lucide-react";
import Link from "next/link";

type ArticleHeroProps = {
  title: string;
  tags: string[];
  coverImage: string;
  publishedAt: string;
  lastEditedTime: string;
};

export default function ArticleHero({
  title,
  tags,
  coverImage,
  publishedAt,
  lastEditedTime,
}: ArticleHeroProps) {
  return (
    <div className="relative">
      {/* Full-width background image with overlay */}
      <div className="relative h-[50vh] min-h-[400px] max-h-[600px] w-full">
        <Image
          src={coverImage || "/images/placeholder.svg"}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      </div>

      {/* Content positioned over the image */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              {title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4 mr-1" />
                <time dateTime={publishedAt}>{publishedAt}</time>
              </div>
              <time dateTime={lastEditedTime}>
                Last updated on {lastEditedTime}
              </time>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors hover:bg-secondary"
                >
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
