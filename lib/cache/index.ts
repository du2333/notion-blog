import { unstable_cache } from "next/cache";
import { cache } from "react";

// 内存缓存 - 作为备用方案
const memoryCache = new Map<string, { data: unknown; expires: number }>();
// 进行中的请求 - 防止重复请求
const pendingRequests = new Map<string, Promise<unknown>>();

// 检测是否在 Cloudflare Workers 环境
const isCloudflareWorkers = () => {
  return typeof caches !== "undefined" && "default" in caches;
};

// Cloudflare Cache API 操作
const cfCache = {
  async get<T>(key: string): Promise<T | null> {
    if (!isCloudflareWorkers()) return null;
    try {
      const cache = (caches as unknown as { default: Cache }).default;
      const url = new URL(`https://cache.internal/${encodeURIComponent(key)}`);
      const response = await cache.match(url.toString());
      if (!response) return null;
      const data = await response.json();
      return data as T;
    } catch {
      return null;
    }
  },

  async set(key: string, data: unknown, ttl: number): Promise<void> {
    if (!isCloudflareWorkers()) return;
    try {
      const cache = (caches as unknown as { default: Cache }).default;
      const url = new URL(`https://cache.internal/${encodeURIComponent(key)}`);
      const response = new Response(JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": `public, max-age=${ttl}`,
        },
      });
      await cache.put(url.toString(), response);
    } catch {
      // 静默失败，降级到内存缓存
    }
  },
};

export function timedCache<T extends (...args: any[]) => Promise<any>>(
  callback: T,
  { cacheTime }: { cacheTime: number }
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  const fnName = callback.name || "anonymous";

  // 多层缓存包装
  const withCache = async (
    ...args: Parameters<T>
  ): Promise<Awaited<ReturnType<T>>> => {
    const cacheKey = `${fnName}:${JSON.stringify(args)}`;
    const now = Date.now();

    // 1. 检查内存缓存（最快）
    const memoryCached = memoryCache.get(cacheKey);
    if (memoryCached && memoryCached.expires > now) {
      return memoryCached.data as Awaited<ReturnType<T>>;
    }

    // 2. 检查 Cloudflare Cache API（Workers 环境）
    const cfCached = await cfCache.get<Awaited<ReturnType<T>>>(cacheKey);
    if (cfCached) {
      // 回填内存缓存
      memoryCache.set(cacheKey, {
        data: cfCached,
        expires: now + cacheTime * 1000,
      });
      return cfCached;
    }

    // 3. 检查是否有进行中的请求（请求合并）
    const pending = pendingRequests.get(cacheKey);
    if (pending) {
      return pending as Promise<Awaited<ReturnType<T>>>;
    }

    // 4. 创建新请求
    const request = (async () => {
      try {
        const result = await callback(...args);

        // 存入内存缓存
        memoryCache.set(cacheKey, {
          data: result,
          expires: now + cacheTime * 1000,
        });

        // 存入 Cloudflare Cache API
        await cfCache.set(cacheKey, result, cacheTime);

        return result;
      } finally {
        pendingRequests.delete(cacheKey);
      }
    })();

    pendingRequests.set(cacheKey, request);
    return request;
  };

  // 用 Next.js unstable_cache 包装（在 Vercel 上提供持久化缓存）
  const withNextCache = unstable_cache(withCache, [fnName], {
    revalidate: cacheTime,
  });

  // 用 React cache 包装（单请求内去重）
  return cache(withNextCache);
}
