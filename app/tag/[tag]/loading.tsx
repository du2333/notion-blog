import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full my-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="group mx-auto max-w-md overflow-hidden rounded-xl bg-background shadow-md md:max-w-2xl"
          >
            <div className="md:flex">
              <div className="md:shrink-0">
                <Skeleton className="h-48 w-full object-cover md:h-full md:w-48" />
              </div>
              <div className="p-8">
                <div className="space-y-2">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <Skeleton key={j} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
