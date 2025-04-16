import Link from "next/link";
import { Github, Mail } from "lucide-react";
import { getSiteData } from "@/lib/notion/getSiteData";

export default async function Footer() {
  const { config: BlogConfig } = await getSiteData();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container flex flex-col items-center justify-between gap-4 px-10 py-10 md:h-24 md:flex-row md:px-0 md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} {BlogConfig.BLOG_TITLE}. All rights
            reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={BlogConfig.GITHUB} target="_blank" rel="noreferrer">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href={`mailto:${BlogConfig.EMAIL}`}
            target="_blank"
            rel="noreferrer"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
