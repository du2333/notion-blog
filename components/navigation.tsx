"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navigationItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Blog",
    href: "/blog/1",
  },
  {
    label: "Tags",
    href: "/tag",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {navigationItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-foreground text-muted-foreground",
            pathname === item.href && "text-foreground"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function MobileNavigation() {
  const [mobileMenuState, setMobileMenuState] = useState<
    "open" | "closed" | "default"
  >("default");
  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50"
        onClick={() =>
          setMobileMenuState(
            mobileMenuState === "closed" || mobileMenuState === "default"
              ? "open"
              : "closed"
          )
        }
      >
        {mobileMenuState === "open" ? (
          <X className="size-[1.2rem] animate-in fade-in ease-out fill-mode-both duration-500" />
        ) : (
          <Menu className="size-[1.2rem] animate-in fade-in ease-out fill-mode-both duration-500" />
        )}
      </Button>
      <div
        data-state={mobileMenuState}
        className="flex flex-col gap-4 p-4 top-16 container mx-auto absolute left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 data-[state=default]:hidden data-[state=open]:animate-fade-in-down data-[state=closed]:animate-fade-out-up data-[state=closed]:invisible duration-500"
      >
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground text-muted-foreground",
              pathname === item.href && "text-foreground"
            )}
            onClick={() => setMobileMenuState("closed")}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
