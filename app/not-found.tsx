import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center space-y-6">
        <div className="rounded-full bg-muted p-6">
          <FileQuestion
            className="h-16 w-16 text-muted-foreground"
            aria-hidden="true"
          />
        </div>

        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Page not found
        </h1>

        <p className="text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. The page
          might have been moved, deleted, or perhaps the URL was mistyped.
        </p>

        <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
          <Button asChild size="lg">
            <Link href="/">Return to home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
