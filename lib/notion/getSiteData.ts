import { idToUuid } from "notion-utils";

import blogConfig from "@/blog.config";
import { BlogConfig } from "@/types/config";
import { PageStatus, PageType, Page } from "@/types/notion";
import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import {
  getConfigPageId,
  getPageIdsInCollection,
} from "@/lib/notion/getPageIds";
import { getConfig } from "@/lib/notion/getConfig";
import { getPageProperties } from "@/lib/notion/getPagePropertie";
import { getTags } from "@/lib/notion/getTags";
import { timedCache } from "@/lib/cache";

export async function getSiteData() {
  const sitePageId = idToUuid(blogConfig.NOTION_PAGE_ID);

  const start = performance.now();
  const data = await timedCache(getWholeSiteData, {
    cacheTime: blogConfig.NEXT_REVALIDATE_SECONDS,
  })(sitePageId);
  const end = performance.now();
  console.log(`[API响应]-getSiteData`, `耗时: ${(end - start).toFixed(4)}ms`);
  return data;
}

export async function getWholeSiteData(pageId: string) {
  const pageRecordMap = await getPostBlocks(pageId);

  if (!pageRecordMap) {
    console.error("获取页面数据失败", `page_id: ${pageId}`);
    throw new Error("获取页面数据失败, page_id: " + pageId);
  }

  /**
   * BlockMap {
   *  pageId1: {role, value: Block},
   *  pageId2: {role, value: Block},
   *  ...
   * }
   */
  const blockMap = pageRecordMap.block;
  const block = blockMap[pageId].value;

  if (
    block.type !== "collection_view_page" &&
    block.type !== "collection_view"
  ) {
    console.error(`page_id: ${pageId} 不是一个数据库`);
    throw new Error("获取页面数据失败, page_id: " + pageId);
  }

  const collection = Object.values(pageRecordMap.collection)[0].value;
  // 数据库的定义了哪些属性
  const schemaMap = collection.schema;

  // 获取所有页面
  const pageIds = getPageIdsInCollection(
    block.collection_id || null,
    pageRecordMap.collection_query,
    pageRecordMap.collection_view,
    block.view_ids
  );
  // 第二个视图为配置页面
  const configId = getConfigPageId(
    block.collection_id || null,
    pageRecordMap.collection_query,
    pageRecordMap.collection_view
  );

  const publishedPosts: Page[] = [];
  const navPageList: Page[] = [];
  const allPages: Page[] = [];
  let config: BlogConfig | null = null;

  try {
    config = await getConfig(configId);
  } catch (error) {
    console.error(`获取配置页面失败 ${configId}:`, error);
  }
  if (!config) {
    console.error(`需要配置Config页面 ${configId}`);
    throw new Error("获取配置页面失败, config_id: " + configId);
  }

  await Promise.all(
    pageIds.map(async (pageId) => {
      if (configId && pageId === configId) return;

      try {
        const page = await getPageProperties(pageId, blockMap, schemaMap);

        if (!page || !page.type || !(page.status === PageStatus.Published))
          return;

        // published posts
        if (page.type === PageType.Post) {
          publishedPosts.push(page);
          allPages.push(page);
        }

        // custom nav menu
        if (page.type === PageType.Page) {
          navPageList.push(page);
          allPages.push(page);
        }

        if (
          page.type === PageType.HeadMenu ||
          page.type === PageType.Menu ||
          page.type === PageType.Link
        ) {
          navPageList.push(page);
        }
      } catch (error) {
        console.error(`获取页面属性失败，page_id: ${pageId}:`, error);
      }
    })
  );

  return {
    tagOptions: getTags(publishedPosts, schemaMap),
    publishedPosts,
    latestPosts: getLatestPosts(publishedPosts),
    config,
  };
}

function getLatestPosts(publishedPosts: Page[], latestPostCount: number = 6) {
  return publishedPosts
    .sort((a, b) => (b.lastEditedTime || b.date) - (a.lastEditedTime || a.date))
    .slice(0, latestPostCount);
}
