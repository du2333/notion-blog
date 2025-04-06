"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 md:py-24 lg:py-32">
      <div className="mx-auto flex max-w-[600px] flex-col items-center justify-center text-center">
        <div className="mb-4 text-7xl font-bold">404</div>
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">
          Page not found
        </h1>
        <p className="mb-8 text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        {/* Navigation options */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
