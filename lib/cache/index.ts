import { unstable_cache } from "next/cache";
import { cache } from "react";

export function timedCache<T extends (...args: any[]) => Promise<any>>(
  callback: Parameters<typeof unstable_cache<T>>[0],
  { cacheTime }: { cacheTime: number }
) {
  return cache(
    unstable_cache<T>(callback, undefined, {
      revalidate: cacheTime,
    })
  );
}
