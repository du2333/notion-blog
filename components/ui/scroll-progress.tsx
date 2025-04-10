"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ScrollProgress({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener("scroll", updateProgress);
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className={cn("fixed top-0 left-0 right-0 h-1", className)}>
      <div
        className="h-full bg-primary origin-left"
        style={{
          width: `${progress}%`,
          animation: `progress ${progress / 100}s ease-out forwards`,
        }}
      />
    </div>
  );
}
