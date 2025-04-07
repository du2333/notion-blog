"use client";

import { ScrollProgress } from "@/components/ui/scroll-progress";
import { usePathname } from "next/navigation";

export default function ScrollProgressBar() {
  const pathname = usePathname();

  // only show in article page
  if (!pathname.includes("/post")) {
    return null;
  }

  return <ScrollProgress className="top-16" />;
}
