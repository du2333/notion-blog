"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function GoToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <div>
      <Button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        variant="outline"
        className={cn(
          "fixed bottom-4 right-4 text-primary rounded-full cursor-pointer",
          "transition-opacity duration-500 ease-in-out",
          "opacity-0",
          isVisible && "opacity-100"
        )}
      >
        <ArrowUp className="size-5" />
        <span className="sr-only">Go to top</span>
      </Button>
    </div>
  );
}
