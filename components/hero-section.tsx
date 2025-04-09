import * as motion from "motion/react-client";
import BlogConfig from "@/blog.config";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

export function HeroSection() {
  const row1 = `Hi, I'm `;
  const row2 = "A Web Developer";
  const row3 = "擅长使用 React, Next.js, Tailwind CSS";

  const delay1 = row1.split("").length * 0.1; // 第一行延迟(不包括作者名字)
  const delay2 = BlogConfig.AUTHOR.split("").length * 0.1; // 作者名字的延迟
  const delay3 = row2.split("").length * 0.1 + delay1 + delay2; // 第一行+第二行延迟

  return (
    <div className="relative container mx-auto px-4 flex flex-col md:flex-row justify-evenly items-center min-h-[90vh]">
      <div className="space-y-4">
        <div>
          {row1.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: "easeInOut",
              }}
              className="text-4xl"
            >
              {char}
            </motion.span>
          ))}
          {BlogConfig.AUTHOR.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + delay1,
                ease: "easeInOut",
              }}
              className="text-5xl font-semibold text-primary"
            >
              {char}
            </motion.span>
          ))}
        </div>
        <div>
          {row2.split("").map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1 + delay1 + delay2,
                ease: "easeInOut",
              }}
              className="text-4xl"
            >
              {char}
            </motion.span>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.3,
            delay: delay3,
          }}
          className="text-xl mt-4 text-muted-foreground"
        >
          {row3}
        </motion.div>
      </div>
      <div className="rounded-full border-1 p-2">
        <Image
          src="/images/hero.png"
          alt="Hero"
          width={200}
          height={200}
          className="rounded-full md:w-[300px] md:h-[300px]"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center animate-bounce">
        <ChevronDown className="size-6" />
      </div>
    </div>
  );
}
