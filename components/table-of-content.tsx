"use client";

import { TableOfContentsEntry } from "@/types/notion";
import Link from "next/link";

export default function TableOfContent({
  toc,
}: {
  toc: TableOfContentsEntry[];
}) {
  if (!toc) return null;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(removeHyphens(id));
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.history.pushState({}, "", `#${removeHyphens(id)}`);
    }
  };

  return (
    <div className="hidden lg:block lg:w-64 ml-4">
      <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
        <div className="space-y-1">
          {toc.map((item) => (
            <Link
              href={`#${removeHyphens(item.id)}`}
              onClick={(e) => handleClick(e, item.id)}
              className="block text-sm text-muted-foreground hover:text-foreground transition-colors hover:bg-muted rounded-md px-2 py-1"
              style={{
                paddingLeft: `${2 * item.indentLevel}rem`,
              }}
              key={item.id}
            >
              <span className="line-clamp-2">{item.text}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const removeHyphens = (str: string): string => {
  return str.replace(/-/g, "");
};
