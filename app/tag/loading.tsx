import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header skeletons */}
      <Skeleton className="h-10 w-48 mb-8" />

      {/* Tag cloud skeleton */}
      <div className="p-6 bg-gray-50 rounded-xl mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-8 w-24 rounded-full"
              style={{
                width: `${Math.floor(Math.random() * 60) + 60}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
