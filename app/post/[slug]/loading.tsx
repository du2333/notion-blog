import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex p-4">
      <div className="mx-auto overflow-x-hidden w-full max-w-3xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
