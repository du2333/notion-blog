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
      { rootMargin: "-100px 0px -66% 0px" }
    );

    toc.forEach((item) => {
      const element = document.getElementById(removeHyphens(item.id));
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc, mounted]);

  // Calculate reading progress based on scroll position
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="text-sm relative pl-4 border-l border-border/50">
      {/* Progress Indicator Bar */}
      <div
        className="absolute left-[-1px] top-0 w-[2px] bg-primary transition-all duration-100 ease-out"
        style={{ height: `${readingProgress}%`, maxHeight: "100%" }}
      />

      <ul className="space-y-3">
        {toc.map((heading) => {
          const isActive = activeId === removeHyphens(heading.id);
          return (
            <li
              key={heading.id}
              style={{ paddingLeft: `${heading.indentLevel * 1}rem` }}
              className="relative"
            >
              <a
                href={`#${removeHyphens(heading.id)}`}
                className={cn(
                  "block transition-all duration-200 line-clamp-2",
                  isActive
                    ? "text-primary font-medium scale-[1.02] origin-left"
                    : "text-muted-foreground hover:text-foreground hover:translate-x-1"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  const targetElement = document.getElementById(
                    `${removeHyphens(heading.id)}`
                  );
                  if (targetElement) {
                    const headerHeight = 80;
                    const targetPosition =
                      targetElement.getBoundingClientRect().top +
                      window.scrollY -
                      headerHeight;

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
          );
        })}
      </ul>
    </nav>
  );
}

const removeHyphens = (str: string): string => {
  return str.replace(/-/g, "");
};
