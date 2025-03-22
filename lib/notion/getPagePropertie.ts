import { BlogConfig } from "@/types/config";
import {
  BlockMap,
  CollectionPropertySchemaMap,
  Decoration,
  Page,
  PageType,
} from "@/types/notion";
import { getDateValue, getTextContent } from "notion-utils";
import { getParentId, getChildrenIds } from "@/lib/notion/getTree";
import { mapImgUrl } from "@/utils/imgProcessing";

export async function getPageProperties(
  id: string,
  blockMap: BlockMap,
  schemaMap: CollectionPropertySchemaMap
) {
  const pageInfo: Partial<Page> & { [key: string]: any } = {};
  const block = blockMap[id].value;

  // 处理不同类型的属性
  const schemaActions: Record<
    string,
    (value: Decoration[], name: string) => void
  > = {
    date: (value, name) => {
      const formatDate = getDateValue(value);
      if (formatDate?.type === "datetime") {
        pageInfo[name] = new Date(
          `${formatDate.start_date} ${formatDate.start_time}`
        ).getTime();
      } else if (formatDate?.type === "date") {
        pageInfo[name] = new Date(formatDate.start_date).getTime();
      }
    },

    // 处理Tag等属性
    multi_select: (value, name) => {
      pageInfo[name] = getTextContent(value).split(",");
    },

    default: (value, name) => {
      pageInfo[name] = getTextContent(value);
    },
  };

  Object.entries<Decoration[]>(block.properties).forEach(
    async ([key, value]) => {
      if (!schemaMap[key]) {
        console.warn(`Schema not found for key: ${key} : ${value}`); // 可选：记录这个情况
        return; // 跳过这个属性
      }
      const { name, type } = schemaMap[key];
      // 处理自定义菜单
      if (name === "Parent item") {
        pageInfo["parentId"] = getParentId(value);
      } else if (name === "Sub-item") {
        pageInfo["childrenIds"] = getChildrenIds(value);
      }
      // 处理其他属性
      else {
        const action = schemaActions[type] || schemaActions.default;
        action(value, name);
      }
    }
  );

  pageInfo.id = id;
  pageInfo.type = pageInfo?.type || null;
  pageInfo.title = pageInfo?.title || "";
  pageInfo.status = pageInfo?.status || null;
  pageInfo.date = pageInfo?.date || new Date(block.created_time).getTime();
  pageInfo.lastEditedTime =
    pageInfo?.lastEditedTime || new Date(block.last_edited_time).getTime();
  pageInfo.pageCover = mapImgUrl(block?.format?.page_cover, block);
  pageInfo.pageCoverThumbnail = mapImgUrl(
    block?.format?.page_cover_thumbnail,
    block
  );
  pageInfo.tags = pageInfo?.tags || [];

  // 处理slug
  if (pageInfo.type === PageType.Post) {
    pageInfo.slug = pageInfo?.slug || pageInfo.id;
  } else if (pageInfo.type === PageType.Page) {
    pageInfo.slug = pageInfo.slug ?? pageInfo.id;
    if (pageInfo.childrenIds && pageInfo.childrenIds.length > 0) {
      pageInfo.slug = "#";
    }
  }
  if (
    pageInfo.childrenIds &&
    pageInfo.childrenIds.length > 0 &&
    pageInfo.type !== PageType.HeadMenu
  ) {
    pageInfo.type = PageType.Menu;
    pageInfo.slug = "#";
  }

  return pageInfo as Page;
}
