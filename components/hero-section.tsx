"use client";
import ColourfulText from "@/components/ui/colourful-text";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import BlogConfig from "@/blog.config";

export function HeroSection() {
  return (
    <div className="px-4 py-2">
      <HeroHighlight>
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.8,
          }}
          className="text-center"
        >
          <motion.h1
            className={cn(
              "relative mb-6 max-w-2xl mx-auto text-4xl leading-normal font-bold tracking-tight text-zinc-700 md:text-7xl dark:text-zinc-100"
            )}
            layout
          >
            <div className="inline-block">
              <ColourfulText text={BlogConfig.AUTHOR} />
              &apos;s blog
            </div>
          </motion.h1>
        </motion.div>
      </HeroHighlight>
    </div>
  );
}
