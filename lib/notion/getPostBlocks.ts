import { type ExtendedRecordMap } from "@/types/notion";
import { wait } from "@/utils";
import { notionAPI } from "@/lib/notion/notionAPI";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getIdTag } from "@/lib/cacheManagement";
import { cacheLife } from "next/dist/server/use-cache/cache-life";

/**
 * 获取文章内容
 * get the content of line Block which type is 'Post'
 * @param id
 * @param from  debug用
 * @param slice 获取的block数量
 * @returns
 */
export async function getPostBlocks(id: string, from: string, slice?: number) {
  "use cache";
  cacheTag(getIdTag("posts", id));
  cacheLife("custom");
  
  const start = performance.now();
  const pageData = await getPageWithRetry(id, from);
  const end = performance.now();
  console.log(`[API响应]-getPostBlocks`, `耗时: ${end - start}ms`);
  if (!pageData) {
    console.error("获取文章内容失败", `page_id: ${id}`);
    return;
  }
  return filterPostBlockMap(id, pageData, slice);
}

/**
 * 调用接口，失败会重试
 * @param id
 * @param from
 * @param retryAttempts
 * @returns
 */
export async function getPageWithRetry(
  id: string,
  from: string,
  retryAttempts: number = 3
) {
  if (retryAttempts && retryAttempts > 0) {
    console.log(
      "[API请求]",
      `from: ${from}`,
      `page_id: ${id}`,
      retryAttempts < 3 ? `剩余重试次数: ${retryAttempts}` : ""
    );

    try {
      const pageData = await notionAPI.getPage(id);
      return pageData;
    } catch (err) {
      console.warn("[API响应异常]", err);
      await wait(1000);
      return getPageWithRetry(id, from, retryAttempts - 1);
    }
  }

  console.error("[API请求失败]", `page_id: ${id}`);
}

/**
 * 获取到的blockMap删除不需要的字段
 * @param id 页面ID
 * @param blockMap 页面元素
 * @param slice 截取数量
 * @returns
 */
function filterPostBlockMap(
  id: string,
  blockMap: ExtendedRecordMap,
  slice?: number
) {
  const clonedBlockMap = structuredClone(blockMap);
  let count = 0;

  for (const [key, block] of Object.entries(clonedBlockMap.block)) {
    if (slice && slice > 0 && count > slice) {
      delete clonedBlockMap.block[key];
      continue;
    }

    // 当BlockId等于id时移除
    if (block.value?.id === id) {
      // 此block含有敏感信息
      delete block.value?.properties;
      continue;
    }

    count++;

    // 处理 c++、c#、汇编等语言名字映射
    if (block.value?.type === "code") {
      if (block.value?.properties?.language?.[0][0] === "C++") {
        block.value.properties.language[0][0] = "cpp";
      }
      if (block.value?.properties?.language?.[0][0] === "C#") {
        block.value.properties.language[0][0] = "csharp";
      }
      if (block.value?.properties?.language?.[0][0] === "Assembly") {
        block.value.properties.language[0][0] = "asm6502";
      }
    }

    // 处理文件，嵌入式PDF
    if (
      (block?.value?.type === "file" ||
        block?.value?.type === "pdf" ||
        block?.value?.type === "video" ||
        block?.value?.type === "audio") &&
      block?.value?.properties?.source?.[0][0] &&
      block?.value?.properties?.source?.[0][0].indexOf("amazonaws.com") > 0
    ) {
      const oldURL = block?.value?.properties?.source?.[0][0];
      const newURL = `https://notion.so/signed/${encodeURIComponent(
        oldURL
      )}?table=block&id=${block?.value?.id}`;
      block.value.properties.source[0][0] = newURL;
    }
  }

  return clonedBlockMap;
}
