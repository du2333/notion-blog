"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function HeaderBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isTop ? "bg-transparent" : "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
    >
      {children}
    </header>
  );
}
