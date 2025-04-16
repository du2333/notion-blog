"use client";

import { cn } from "@/lib/utils";
import { TableOfContentsEntry } from "@/types/notion";
import { useEffect, useState } from "react";
import useMount from "@/hooks/useMount";

export default function TableOfContent({
  toc,
}: {
  toc: TableOfContentsEntry[];
}) {
  const [activeId, setActiveId] = useState("");
  const mounted = useMount();

  useEffect(() => {
    if (!mounted) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(removeHyphens(entry.target.id));
          }
        });
      },
      // 考虑头部导航栏高度，调整标题元素被视为可见的区域
      { rootMargin: "-64px 0px -80% 0px" }
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
                const targetElement = document.getElementById(
                  `${removeHyphens(heading.id)}`
                );
                if (targetElement) {
                  const headerHeight = 64; // 头部导航栏高度
                  const targetPosition =
                    targetElement.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    16; // 额外添加一些间距

                  window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth",
                  });
                }
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
