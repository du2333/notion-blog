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
    <div className="relative container mx-auto px-4 flex flex-col md:flex-row justify-evenly items-center min-h-screen">
      <div className="space-y-4">
        <div>
          {row1.split("").map((char, index) => (
            <span
              key={index}
              className="text-4xl animate-text-blur-in"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {char}
            </span>
          ))}
          {BlogConfig.AUTHOR.split("").map((char, index) => (
            <span
              key={index}
              className="text-5xl font-semibold text-primary animate-text-blur-in"
              style={{
                animationDelay: `${index * 0.1 + delay1}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div>
          {row2.split("").map((char, index) => (
            <span
              key={index}
              className="text-4xl animate-text-blur-in"
              style={{
                animationDelay: `${index * 0.1 + delay1 + delay2}s`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
        <div
          className="text-xl mt-4 text-muted-foreground animate-text-blur-in"
          style={{
            animationDelay: `${delay3}s`,
          }}
        >
          {row3}
        </div>
      </div>
      <div className="rounded-full border-1 p-2">
        <Image
          src="/images/hero.png"
          alt="Hero"
          width={200}
          height={200}
          className="rounded-full md:w-[300px] md:h-[300px]"
          priority
        />
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center animate-bounce">
        <ChevronDown className="size-6" />
      </div>
    </div>
  );
}
