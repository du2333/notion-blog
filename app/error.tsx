"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 py-16">
      <Card className="max-w-md">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <CardDescription className="mb-4">
            We&apos;re sorry, but we encountered an unexpected error while
            processing your request.
          </CardDescription>

          {/* Error details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="my-4 rounded-md bg-muted p-4">
              <p className="font-mono text-sm">{error.message}</p>
              {error.digest && (
                <p className="mt-2 text-xs text-muted-foreground">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <p className="text-sm text-muted-foreground">
            You can try refreshing the page, or return to the homepage and try
            again later.
          </p>
        </CardContent>

        <Separator />

        <CardFooter className="flex justify-between pt-4">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
