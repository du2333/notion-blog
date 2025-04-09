"use client";

import { ScrollProgress } from "@/components/ui/scroll-progress";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // only show in article page
  if (!pathname.includes("/post")) {
    return null;
  }

  return (
    <ScrollProgress
      className={cn("top-16 opacity-0", isVisible && "opacity-100")}
    />
  );
}
