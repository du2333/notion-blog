import { ExtendedRecordMap, Page } from "@/types/notion";
import { getPostBlocks } from "@/lib/notion/getPostBlocks";

export async function getSearchResults(posts: Page[], keyword: string) {
  "use server";
  if (!keyword) return [];

  const lowerKeyword = keyword.toLowerCase().trim();
  const filteredPosts: Page[] = [];

  for (const post of posts) {
    if (!post.blockMap) {
      post.blockMap = await getPostBlocks(post.id);
    }

    const tagContent = post?.tags?.join(" ") || "";
    const articleInfo = (post.title + tagContent).toLowerCase();

    const searchResults: string[] = [];

    let hit = articleInfo.includes(lowerKeyword);
    let hitCount = 0;

    const contentList = post.blockMap ? getPageContent(post.blockMap) : [];

    for (const text of contentList) {
      // 限制每篇文章的搜索匹配数量
      if (text.toLowerCase().includes(lowerKeyword) && hitCount < 3) {
        hit = true;
        hitCount += 1;
        searchResults.push(text);
      }
    }

    if (hit) {
      // Create a new post object with the searchResults property
      const postWithResults = {
        ...post,
        searchResults,
      };
      filteredPosts.push(postWithResults);
    }
  }

  return filteredPosts;
}

function getPageContent(blockMap: ExtendedRecordMap) {
  const contentList: string[] = [];

  if (blockMap) {
    Object.values(blockMap.block).forEach((block) => {
      const properties = block.value?.properties;
      if (properties?.title) {
        const title = extractText(properties.title);
        if (title) {
          contentList.push(title);
        }
        if (properties?.caption) {
          const caption = extractText(properties.caption);
          if (caption) {
            contentList.push(caption);
          }
        }
      }
    });
  }

  return contentList;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractText(source: any) {
  if (!source) return;

  const text = extractNestedText(source);
  if (text && text !== "Untitled") return text;
}

/**
 * 递归获取层层嵌套的数组
 * @param {*} textArray
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractNestedText(input: any): string {
  if (Array.isArray(input)) {
    return input.reduce((acc, item) => acc + extractNestedText(item), "");
  }
  return typeof input === "string" ? input : "";
}
