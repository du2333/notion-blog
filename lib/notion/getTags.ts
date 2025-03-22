import {
  CollectionPropertySchemaMap,
  Page,
  PagePropertyName,
  Tag,
} from "@/types/notion";
import { isIterable } from "@/utils";

export function getTags(
  publishedPosts: Page[],
  schemaMap: CollectionPropertySchemaMap,
  sliceCount: number = 0
) {
  if (!schemaMap) return [];

  const tagSchema = Object.values(schemaMap).find(
    (e) => e.name === PagePropertyName.Tags
  );

  // tagOptions包含tag的id, name, color
  const tagOptions = tagSchema?.options || [];

  // 获取所有文章的tags
  const tags = publishedPosts.map((post) => post.tags).flat();

  // 统计每个tag的count
  const countMap: { [key: string]: number } = {};
  tags.forEach((tag) => {
    countMap[tag] = (countMap[tag] || 0) + 1;
  });

  const tagList: Tag[] = [];
  if (isIterable(tagOptions)) {
    for (const tag of tagOptions) {
      const count = countMap[tag.value];
      if (count) {
        tagList.push({ id: tag.id, name: tag.value, color: tag.color, count });
      }
    }
  }

  // 如果sliceCount大于0，则只返回sliceCount个tag
  if (sliceCount && sliceCount > 0) {
    return tagList.slice(0, sliceCount);
  }

  return tagList;
}
