import { defaultMapImageUrl } from "notion-utils";

import { getPostBlocks } from "@/lib/notion/getPostBlocks";
import { Block, PageStatus, PageType, Page } from "@/types/notion";
import { NOTION_HOST } from "@/utils/imgProcessing";

export async function getPostPageInfo(pageId: string) {
  const blockMap = await getPostBlocks(pageId);

  if (!blockMap) return;

  const postPage = blockMap?.block?.[pageId].value;

  return {
    id: pageId,
    type: PageType.Post,
    tags: [],
    title: postPage?.properties?.title?.[0] || "",
    status: PageStatus.Published,
    pageCover: getPageCover(postPage) || "",
    blockMap,
    date: new Date(postPage.created_time).getTime(),
    lastEditedTime: new Date(postPage.last_edited_time).getTime(),
    pageCoverThumbnail: "",
    content: [],
    icon: "",
    slug: "",
  } as Page;
}

function getPageCover(postPage: Block) {
  const pageCover = postPage.format?.page_cover;
  if (pageCover) {
    if (pageCover.startWith("/")) return NOTION_HOST + pageCover;
    if (pageCover.startsWith("http")) {
      return defaultMapImageUrl(pageCover, postPage);
    }
  }
}
