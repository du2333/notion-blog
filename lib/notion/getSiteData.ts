import { idToUuid } from "notion-utils";

import blogConfig from "@/blog.config";
import { BlogConfig } from "@/types/config";
import {
  ExtendedCollection,
  PageStatus,
  PageType,
  Page,
  Nav,
  Site,
  SiteInfo,
} from "@/types/notion";
import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import {
  getConfigPageId,
  getPageIdsInCollection,
} from "@/lib/notion/getPageIds";
import { getConfig } from "@/lib/notion/getConfig";
import { compressImage, mapImgUrl } from "@/utils/imgProcessing";
import { getPageProperties } from "@/lib/notion/getPagePropertie";
import { getTags } from "@/lib/notion/getTags";
import { isEmoji } from "@/utils";
import { timedCache } from "@/lib/cache";

export async function getSiteData(): Promise<Site> {
  const sitePageId = idToUuid(blogConfig.NOTION_PAGE_ID);

  const start = performance.now();
  const data = await timedCache(getWholeSiteData, {
    cacheTime: blogConfig.NEXT_REVALIDATE_SECONDS,
  })(sitePageId);
  const end = performance.now();
  console.log(`[API响应]-getSiteData`, `耗时: ${(end - start).toFixed(4)}ms`);
  return data;
}

export async function getWholeSiteData(pageId: string): Promise<Site> {
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
  const siteInfo = getSiteInfo(collection as ExtendedCollection);
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
    id: pageId,
    siteInfo,
    allPages,
    block,
    tagOptions: getTags(publishedPosts, schemaMap),
    navList: getNavList(navPageList),
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

function getSiteInfo(collection: ExtendedCollection): SiteInfo {
  const title = collection.name[0][0] || "";
  const description = collection.description
    ? Object.assign(collection).description[0][0]
    : "";
  const pageCover = collection.cover
    ? mapImgUrl(collection.cover, collection, "collection")
    : "";
  let icon = collection?.icon
    ? mapImgUrl(collection.icon, collection, "collection")
    : "";

  icon = compressImage(icon);

  if (!icon || isEmoji(icon)) {
    icon = "";
  }

  return { title, description, pageCover, icon };
}

/**
 * 根据用户自定义菜单构建导航列表
 * @param navPageList 所有关于导航的页面
 * @returns 导航列表
 */
function getNavList(navPageList: Page[]) {
  if (navPageList.length === 0) return [];
  const pageMap: Record<string, Nav> = {};
  let headerMenuId = "";

  // 遍历navPageList，构建pageMap
  navPageList.forEach((page) => {
    if (page.type === PageType.HeadMenu) {
      headerMenuId = page.id;
    }
    pageMap[page.id] = {
      id: page.id,
      show: page.status !== PageStatus.Invisible,
      icon: page.icon,
      title: page.title,
      to: page.slug,
      subMenus: [],
      type: page.type as PageType,
    };
  });

  // 遍历navPageList，构建subMenus
  navPageList.forEach((page) => {
    const navItem = pageMap[page.id];
    if (page.childrenIds) {
      navItem.subMenus = page.childrenIds
        .map((childId) => pageMap[childId])
        .filter(Boolean); // 过滤掉空值
    }
  });

  const headerMenu = pageMap[headerMenuId];
  return headerMenu.subMenus || [];
}
