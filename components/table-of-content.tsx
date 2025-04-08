"use client";

import { cn } from "@/lib/utils";
import { TableOfContentsEntry } from "@/types/notion";
import { useEffect, useState } from "react";

export default function TableOfContent({
  toc,
}: {
  toc: TableOfContentsEntry[];
}) {
  const [activeId, setActiveId] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(removeHyphens(entry.target.id));
            console.log(entry);
          }
        });
      },
      // 标题元素只需进入视口顶部 ​​20% 的区域​​ 即被视为可见
      { rootMargin: "0px 0px -80% 0px" }
    );

    toc.forEach((item) => {
      const element = document.getElementById(removeHyphens(item.id));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
    // 在组件加载完毕的时候进行observe
  }, [toc, mounted]);

  return (
    <nav className="text-sm">
      <ul className="space-y-2">
        {toc.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${heading.indentLevel * 2}rem` }}
          >
            <a
              href={`#${removeHyphens(heading.id)}`}
              className={cn(
                "inline-block transition-colors hover:text-foreground",
                activeId === removeHyphens(heading.id)
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(`${removeHyphens(heading.id)}`)
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

const removeHyphens = (str: string): string => {
  return str.replace(/-/g, "");
};
