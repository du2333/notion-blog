"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function HeaderBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <header
        className={cn(
          "w-full max-w-5xl transition-all duration-500 ease-in-out",
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border shadow-sm rounded-full px-4 py-2"
            : "bg-transparent border-transparent px-0 py-4"
        )}
      >
        {children}
      </header>
    </div>
  );
}
