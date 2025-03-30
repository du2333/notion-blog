import { revalidateTag } from "next/cache";

type CACHE_TAG = "posts"

export function getGlobalTag(tag: CACHE_TAG) {
    return `global:${tag}` as const;
}

export function getIdTag(tag: CACHE_TAG, id: string) {
    return `id:${tag}:${id}` as const;
}

export function revalidatePostCache(id: string) {
    revalidateTag(getGlobalTag("posts"));
    revalidateTag(getIdTag("posts", id));
}