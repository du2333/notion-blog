import { revalidateTag, unstable_cache } from "next/cache";
import { cache } from "react";
import blogConfig from "@/blog.config";

type CACHE_TAGS = "posts";

export function getGlobalTag(tag: CACHE_TAGS) {
  return `global:${tag}` as const;
}

export function getIdTag(tag: CACHE_TAGS, id: string) {
  return `id:${tag}:${id}` as const;
}

export type ValidTags =
  | ReturnType<typeof getGlobalTag>
  | ReturnType<typeof getIdTag>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function dbCache<T extends (...args: any[]) => Promise<any>>(
  callback: Parameters<typeof unstable_cache<T>>[0],
  { tags }: { tags: ValidTags[] }
) {
  return cache(
    unstable_cache<T>(callback, undefined, {
      tags: [...tags, "*"],
      revalidate: blogConfig.NEXT_REVALIDATE_SECONDS,
    })
  );
}

export function revalidateCache({ tag, id }: { tag: CACHE_TAGS; id?: string }) {
  revalidateTag(getGlobalTag(tag));
  if (id) {
    revalidateTag(getIdTag(tag, id));
  }
}

export function clearFullCache() {
  revalidateTag("*");
}
