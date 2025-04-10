"use client";

import * as React from "react";
import { Moon, Sun, LaptopMinimal } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ThemeController() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Sun className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn("flex items-center gap-2", {
            "bg-muted text-foreground": theme === "light",
          })}
        >
          <Sun className="size-[1.2rem]" />
          <p>Light</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn("flex items-center gap-2", {
            "bg-muted text-foreground": theme === "dark",
          })}
        >
          <Moon className="size-[1.2rem]" />
          <p>Dark</p>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn("flex items-center gap-2", {
            "bg-muted text-foreground": theme === "system",
          })}
        >
          <LaptopMinimal className="size-[1.2rem]" />
          <p>System</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
